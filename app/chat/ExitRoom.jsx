"use client";

import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

function ExitRoom({ showExitDialog, setShowExitDialog }) {
    const router = useRouter();

    return (
        <AlertDialog
            open={showExitDialog}
            onOpenChange={(open) => {
                console.log("AlertDialog state changed:", open);
                setShowExitDialog(open);
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to exit?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        You will leave the chat room and lose all conversation
                        history.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            console.log(
                                "Exiting room and navigating to home page"
                            );
                            router.push("/");
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white"
                    >
                        Exit
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default ExitRoom;
