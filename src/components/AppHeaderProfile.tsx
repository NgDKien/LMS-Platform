"use client";
import LoginButton from "@/components/LoginButton";
import { SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { User } from "lucide-react";

function AppHeaderProfile() {
    return (
        <>
            <UserButton>
                <UserButton.MenuItems>
                    <UserButton.Link
                        label="Profile"
                        labelIcon={<User className="size-4" />}
                        href="/profile"
                    />
                </UserButton.MenuItems>
            </UserButton>

            <SignedOut>
                <LoginButton />
                {/* <SignInButton /> */}
            </SignedOut>
        </>
    );
}

export default AppHeaderProfile;