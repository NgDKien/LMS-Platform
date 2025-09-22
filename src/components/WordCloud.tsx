"use client";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React from "react";
import D3WordCloud from "react-d3-cloud";

// type Props = {
//     formattedTopics: { text: string; value: number }[];
// };

type Props = {}

const data = [
    {
        text: 'Hey',
        value: 3
    },
    {
        text: 'abc',
        value: 5
    },
    {
        text: 'frc',
        value: 2
    },
    {
        text: 'asldfa',
        value: 6
    },
    {
        text: 'sfwqer',
        value: 7
    },
    {
        text: 'asdM',
        value: 9
    },
    {
        text: 'mlcas',
        value: 5
    },
    {
        text: 'asncls',
        value: 1
    },
]

const fontSizeMapper = (word: { value: number }) =>
    Math.log2(word.value) * 5 + 16;

// const WordCloud = ({ formattedTopics }: Props) => {
const WordCloud = (props: Props) => {
    const theme = useTheme();
    const router = useRouter();
    return (
        <>
            <D3WordCloud
                // data={formattedTopics}
                data={data}
                height={550}
                font="Times"
                fontSize={fontSizeMapper}
                rotate={0}
                padding={10}
                fill={theme.theme === "dark" ? "white" : "black"}
            // onWordClick={(e, d) => {
            //     router.push("/quiz?topic=" + d.text);
            // }}
            />
        </>
    );
};

export default WordCloud;