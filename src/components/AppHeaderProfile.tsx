"use client";
import LoginButton from "@/components/LoginButton";
import { SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { User } from "lucide-react";

function AppHeaderProfile() {
    return (
        <>
            <UserButton
                appearance={{
                    elements: {
                        userButtonPopoverActionButton__manageAccount: "hidden"
                    }
                }}
            />

            <SignedOut>
                <LoginButton />
                {/* <SignInButton /> */}
            </SignedOut>
        </>
    );
}

export default AppHeaderProfile;