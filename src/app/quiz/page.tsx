import { redirect } from "next/navigation";
import QuizCreation from "@/components/QuizCreation";
import { auth } from "@clerk/nextjs/server";

export const metadata = {
    title: "Quiz | Quizzzy",
    description: "Quiz yourself on anything!",
};

const Quiz = async (props: { searchParams: Promise<{ topic?: string }> }) => {
    const { userId } = await auth();
    if (!userId) {
        redirect("/");
    }

    const searchParams = await props.searchParams;
    return <QuizCreation topic={searchParams.topic ?? ""} />;
};

export default Quiz;