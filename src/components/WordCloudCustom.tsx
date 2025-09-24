"use client";

import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React from "react";
import { WordCloud } from "@isoterik/react-word-cloud";

type Props = {
  formattedTopics: { text: string; value: number }[];
};

const WordCloudCustom = ({ formattedTopics }: Props) => {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <WordCloud
      words={formattedTopics}
      width={550}
      height={550}
      font="Times"
      fontSize={(word) => Math.log2(word.value) * 5 + 16}
      rotate={() => 0}
      padding={10}
      enableTooltip={true}
      onWordClick={(word) => {
        router.push("/quiz?topic=" + word.text);
      }}
    />
  );
};

export default WordCloudCustom;
