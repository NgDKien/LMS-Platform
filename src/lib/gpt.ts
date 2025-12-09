import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

interface OutputFormat {
    [key: string]: string | string[] | OutputFormat;
}

export async function strict_output(
    system_prompt: string,
    user_prompt: string | string[],
    output_format: OutputFormat,
    default_category: string = "",
    output_value_only: boolean = false,
    model: string = "llama-3.3-70b-versatile",
    temperature: number = 0.5,
    num_tries: number = 3,
    verbose: boolean = false
): Promise<
    {
        question: string;
        answer: string;
    }[]
> {
    const list_input: boolean = Array.isArray(user_prompt);
    const dynamic_elements: boolean = /<.*?>/.test(JSON.stringify(output_format));
    const list_output: boolean = /\[.*?\]/.test(JSON.stringify(output_format));

    let error_msg: string = "";

    for (let i = 0; i < num_tries; i++) {
        let output_format_prompt: string = `\n\nYou are a JSON generator. You MUST respond with ONLY valid JSON, nothing else.`;

        output_format_prompt += `\n\nOUTPUT FORMAT (strict JSON):`;
        output_format_prompt += `\n${JSON.stringify(output_format, null, 2)}`;

        if (list_input) {
            output_format_prompt += `\n\nYou MUST return a JSON array with exactly ${Array.isArray(user_prompt) ? user_prompt.length : 1} objects.`;
            output_format_prompt += `\nExample: [${JSON.stringify(output_format)}, ${JSON.stringify(output_format)}]`;
        }

        output_format_prompt += `\n\nCRITICAL RULES:
            1. Use double quotes (") for ALL strings, keys, and values
            2. NO single quotes (')
            3. NO trailing commas
            4. NO comments in JSON
            5. NO extra text before or after JSON
            6. ALL keys must be in double quotes
            7. Ensure all brackets and braces are properly closed
            8. Each answer and option must be maximum 15 words`;

        if (dynamic_elements) {
            output_format_prompt += `\n9. Replace any text in < > with actual content.`;
        }

        try {
            const response = await groq.chat.completions.create({
                temperature,
                model,
                messages: [
                    {
                        role: "system",
                        content: system_prompt + output_format_prompt + error_msg,
                    },
                    {
                        role: "user",
                        content: Array.isArray(user_prompt) ? user_prompt.join("\n") : user_prompt.toString()
                    },
                ],
            });

            let res: string = response.choices[0]?.message?.content?.trim() ?? "";

            if (verbose) {
                console.log("System prompt:", system_prompt + output_format_prompt + error_msg);
                console.log("\nUser prompt:", user_prompt);
                console.log("\nGroq raw response:", res);
            }

            res = res.replace(/```json\s*/g, '');
            res = res.replace(/```\s*/g, '');
            res = res.trim();

            // Remove any text before first [ or {
            const jsonStart = Math.min(
                res.indexOf('[') !== -1 ? res.indexOf('[') : Infinity,
                res.indexOf('{') !== -1 ? res.indexOf('{') : Infinity
            );
            if (jsonStart !== Infinity && jsonStart > 0) {
                res = res.substring(jsonStart);
            }

            // Remove any text after last ] or }
            const jsonEnd = Math.max(
                res.lastIndexOf(']'),
                res.lastIndexOf('}')
            );
            if (jsonEnd !== -1 && jsonEnd < res.length - 1) {
                res = res.substring(0, jsonEnd + 1);
            }

            // Replace single quotes with double quotes
            res = res.replace(/'/g, '"');

            // Fix missing commas between objects
            res = res.replace(/}\s*{/g, '},{');

            // Remove trailing commas before } or ]
            res = res.replace(/,(\s*[}\]])/g, '$1');

            if (verbose) {
                console.log("\nCleaned response:", res);
            }

            // Ensure it's wrapped in array brackets if list_input
            if (list_input && !res.startsWith('[')) {
                res = '[' + res + ']';
            }

            let output: any;

            try {
                output = JSON.parse(res);
            } catch (parseError) {
                console.log(`JSON parse failed, attempting repair...`);

                // Try to extract JSON objects manually
                const objectMatches = res.match(/\{[^{}]*\}/g);
                if (objectMatches && objectMatches.length > 0) {
                    // Try parsing each object individually
                    const validObjects = [];
                    for (const match of objectMatches) {
                        try {
                            const obj = JSON.parse(match);
                            validObjects.push(obj);
                        } catch (e) {
                            console.log(`Failed to parse object: ${match}`);
                        }
                    }
                    if (validObjects.length > 0) {
                        output = validObjects;
                    } else {
                        throw parseError;
                    }
                } else {
                    throw parseError;
                }
            }

            if (list_input) {
                if (!Array.isArray(output)) {
                    throw new Error("Output should be an array");
                }
            } else {
                output = [output];
            }

            // Validate output format
            for (let index = 0; index < output.length; index++) {
                for (const key in output_format) {
                    if (/<.*?>/.test(key)) continue;

                    if (!(key in output[index])) {
                        throw new Error(`Missing key: ${key} in object ${index}`);
                    }

                    // Handle array choices
                    if (Array.isArray(output_format[key])) {
                        const choices = output_format[key] as string[];
                        if (Array.isArray(output[index][key])) {
                            output[index][key] = output[index][key][0];
                        }
                        if (!choices.includes(output[index][key]) && default_category) {
                            output[index][key] = default_category;
                        }
                        if (output[index][key].includes(":")) {
                            output[index][key] = output[index][key].split(":")[0];
                        }
                    }
                }

                if (output_value_only) {
                    output[index] = Object.values(output[index]);
                    if (output[index].length === 1) {
                        output[index] = output[index][0];
                    }
                }
            }

            console.log(`Successfully parsed ${output.length} questions`);
            return list_input ? output : output[0];

        } catch (e) {
            error_msg = `\n\nPrevious attempt ${i + 1} failed with error: ${e}
                Please ensure you return ONLY valid JSON with:
                - Double quotes for all strings
                - No trailing commas
                - Properly closed brackets
                - No extra text outside JSON`;

            console.log(`Attempt ${i + 1} failed:`, e);

            if (i === num_tries - 1) {
                console.error("All attempts failed. Returning empty array.");
            }
        }
    }

    return [];
}