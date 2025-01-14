"use client";

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

function ExitRoom({ socket, roomCode, showExitDialog, setShowExitDialog }) {
    const router = useRouter();

    const handleExit = () => {
        socket.send(JSON.stringify({
            command: "leave_room",
            room_code: roomCode,
        }));

        // Clear local storage
        console.log("Clearing local storage for room code:", roomCode);
        localStorage.removeItem(roomCode);

        router.push("/");
    };

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
                        onClick={handleExit}
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
