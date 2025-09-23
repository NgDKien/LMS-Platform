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
    temperature: number = 0.7, // Giảm temperature để output ổn định hơn
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
        let output_format_prompt: string = `\nYou MUST output in valid JSON format: ${JSON.stringify(output_format)}`;

        if (list_input) {
            output_format_prompt += `\nReturn a JSON array with ${Array.isArray(user_prompt) ? user_prompt.length : 1} objects.`;
            output_format_prompt += `\nExample format: [${JSON.stringify(output_format)}, ${JSON.stringify(output_format)}]`;
        }

        output_format_prompt += `\nIMPORTANT: 
- Use double quotes for all strings
- Ensure proper JSON syntax
- No trailing commas
- Return ONLY valid JSON, no extra text`;

        if (dynamic_elements) {
            output_format_prompt += `\nReplace any text in < > with actual content.`;
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
                        content: Array.isArray(user_prompt) ? user_prompt.join(", ") : user_prompt.toString()
                    },
                ],
            });

            let res: string = response.choices[0]?.message?.content?.trim() ?? "";

            if (verbose) {
                console.log("System prompt:", system_prompt + output_format_prompt + error_msg);
                console.log("\nUser prompt:", user_prompt);
                console.log("\nGroq response:", res);
            }

            // Làm sạch response
            res = res.replace(/```json|```/g, ''); // Loại bỏ markdown code blocks
            res = res.trim();

            // Fix common JSON issues
            res = res.replace(/(\w)"/g, '$1"'); // Fix quotes
            res = res.replace(/"(\w)/g, '"$1'); // Fix quotes
            res = res.replace(/'/g, '"'); // Replace single quotes with double quotes

            // Ensure it's wrapped in array brackets if list_input
            if (list_input && !res.startsWith('[')) {
                // Split individual objects and wrap in array
                const objects = res.split('\n\n').filter(obj => obj.trim());
                const jsonObjects = objects.map(obj => {
                    obj = obj.trim();
                    if (!obj.startsWith('{')) obj = '{' + obj;
                    if (!obj.endsWith('}')) obj = obj + '}';
                    return obj;
                });
                res = '[' + jsonObjects.join(',') + ']';
            }

            let output: any = JSON.parse(res);

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
                        throw new Error(`Missing key: ${key}`);
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

            return list_input ? output : output[0];

        } catch (e) {
            error_msg = `\n\nPrevious attempt failed with: ${e}\nPlease fix the JSON format.`;
            console.log(`Attempt ${i + 1} failed:`, e);
            // console.log("Invalid response:", res);

            if (i === num_tries - 1) {
                console.error("All attempts failed. Returning empty array.");
            }
        }
    }

    return [];
}