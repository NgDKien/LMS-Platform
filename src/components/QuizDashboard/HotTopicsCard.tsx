import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import WordCloudCustom from "../WordCloudCustom";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const HotTopicsCard = async () => {
    const { data: topics, error } = await supabase
        .from("topic_count")
        .select("topic, count");

    if (error || !topics) {
        return (
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Hot Topics</CardTitle>
                    <CardDescription>Failed to load topics.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const formattedTopics = topics.map((topic) => ({
        text: topic.topic,
        value: topic.count,
    }));

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Hot Topics</CardTitle>
                <CardDescription>
                    Click on a topic to start a quiz on it.
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <WordCloudCustom formattedTopics={formattedTopics} />
            </CardContent>
        </Card>
    );
};

export default HotTopicsCard;
