import React from "react";
import keyword_extractor from "keyword-extractor";

type Props = {
    answer: string;
    setBlankAnswer: React.Dispatch<React.SetStateAction<string>>;
};

const blank = "_____";

const BlankAnswerInput = ({ answer, setBlankAnswer }: Props) => {
    const [keywords, setKeywords] = React.useState<string[]>([]);
    const [answerWithBlanks, setAnswerWithBlanks] = React.useState("");

    React.useEffect(() => {
        const words = keyword_extractor.extract(answer, {
            language: "english",
            remove_digits: true,
            return_changed_case: false,
            remove_duplicates: false,
        });

        const shuffled = words.sort(() => 0.5 - Math.random());
        const selectedKeywords = shuffled.slice(0, 2);

        setKeywords(selectedKeywords);

        const newAnswerWithBlanks = selectedKeywords.reduce((acc, curr) => {
            return acc.replaceAll(curr, blank);
        }, answer);

        setAnswerWithBlanks(newAnswerWithBlanks);
        setBlankAnswer(newAnswerWithBlanks);
    }, [answer, setBlankAnswer]);

    if (!keywords.length) {
        return (
            <div className="flex justify-start w-full mt-4">
                <h1 className="text-xl font-semibold">{answer}</h1>
            </div>
        );
    }

    return (
        <div className="flex justify-center w-full mt-6 text-center">
            <h1 className="text-xl font-semibold text-white leading-relaxed">
                {answerWithBlanks.split(blank).map((part, index) => (
                    <React.Fragment key={index}>
                        {part}
                        {index !== answerWithBlanks.split(blank).length - 1 && (
                            <input
                                id="user-blank-input"
                                type="text"
                                className="mx-2 w-32 px-3 py-1 bg-slate-900/60 border border-slate-700 rounded-md text-center text-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200"
                            />
                        )}
                    </React.Fragment>
                ))}
            </h1>
        </div>
    );
};

export default BlankAnswerInput;
