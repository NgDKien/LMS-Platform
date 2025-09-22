import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";

export default async function Home() {
    const { userId } = await auth();

    if (userId) {
        redirect("/quiz-dashboard");
    }

    return (
        <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <Card className="w-[300px]">
                <CardHeader>
                    <CardTitle>Welcome to Quizzzy 🔥!</CardTitle>
                    <CardDescription>
                        Quizzzy is a platform for creating quizzes using AI! Get started by
                        logging in below!
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <SignInButton mode="redirect">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
                            Sign In with Google
                        </button>
                    </SignInButton>
                </CardContent>
            </Card>
        </div>
    );
}
