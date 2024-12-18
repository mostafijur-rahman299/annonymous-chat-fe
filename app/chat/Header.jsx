import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";   
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, LogOut, Hash } from "lucide-react";
import MembersList from "@/app/chat/MemberList";

export default function Header({ members, roomCode, setShowExitDialog }) {
    return (
        <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 shadow-md">
            <div className="flex justify-between items-center">
        <div className="flex items-center">
            <div className="bg-white/20 rounded-full p-2 mr-3">
                <Hash className="h-6 w-6" />
            </div>
            <div>
                <h1 className="text-2xl font-bold">Chat Room</h1>
                <p className="text-sm text-purple-200">
                    Room Code: {roomCode}
                </p>
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                    >
                        <Users className="h-4 w-4 mr-2" />
                        Members
                        <Badge
                            variant="secondary"
                            className="bg-white/20 text-white hover:bg-white/30"
                        >
                            {Object.keys(members).length}
                        </Badge>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Chat Room Members ({Object.keys(members).length})
                        </DialogTitle>
                    </DialogHeader>
                    <MembersList members={members} />
                </DialogContent>
            </Dialog>
            <Button
                variant="outline"
                onClick={() => {
                    console.log("Exit button clicked");
                    setShowExitDialog(true);
                }}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
                <LogOut className="h-5 w-5 mr-2" />
                Exit Room
            </Button>
        </div>
            </div>
        </header>
    );
}
