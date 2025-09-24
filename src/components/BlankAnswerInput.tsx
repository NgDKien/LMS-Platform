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

        // Shuffle và pick 2 keywords chỉ chạy trên client
        const shuffled = words.sort(() => 0.5 - Math.random());
        const selectedKeywords = shuffled.slice(0, 2);

        setKeywords(selectedKeywords);

        // Tạo answer với blanks
        const newAnswerWithBlanks = selectedKeywords.reduce((acc, curr) => {
            return acc.replaceAll(curr, blank);
        }, answer);

        setAnswerWithBlanks(newAnswerWithBlanks);
        setBlankAnswer(newAnswerWithBlanks);
    }, [answer, setBlankAnswer]);

    if (!keywords.length) {
        return (
            <div className="flex justify-start w-full mt-4">
                <h1 className="text-xl font-semibold">
                    {answer}
                </h1>
            </div>
        );
    }

    return (
        <div className="flex justify-start w-full mt-4">
            <h1 className="text-xl font-semibold">
                {answerWithBlanks.split(blank).map((part, index) => {
                    return (
                        <React.Fragment key={index}>
                            {part}
                            {index === answerWithBlanks.split(blank).length - 1 ? (
                                ""
                            ) : (
                                <input
                                    id="user-blank-input"
                                    className="text-center border-b-2 border-black dark:border-white w-28 focus:border-2 focus:border-b-4 focus:outline-none"
                                    type="text"
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </h1>
        </div>
    );
};

export default BlankAnswerInput;