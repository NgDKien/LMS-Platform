"use client";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamic import D3WordCloud to avoid SSR issues
const D3WordCloud = dynamic(() => import("react-d3-cloud"), {
    ssr: false,
});

type Props = {};

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
];

const fontSizeMapper = (word: { value: number }) =>
    Math.log2(word.value) * 5 + 16;

const WordCloud = (props: Props) => {
    const { theme } = useTheme();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // Đảm bảo component chỉ render sau khi mounted trên client
    useEffect(() => {
        setMounted(true);
    }, []);

    // Hiển thị loading state trong khi chờ component mount
    if (!mounted) {
        return (
            <div className="flex justify-center items-center h-[550px]">
                <div className="text-muted-foreground">Loading word cloud...</div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <D3WordCloud
                data={data}
                height={550}
                font="Times"
                fontSize={fontSizeMapper}
                rotate={0}
                padding={10}
                fill={theme === "dark" ? "white" : "black"}
                onWordClick={(e, d) => {
                    router.push("/quiz?topic=" + d.text);
                }}
            />
        </div>
    );
};

export default WordCloud;