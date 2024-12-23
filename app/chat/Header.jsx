'use client'

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, LogOut, Hash, Copy, Check, Menu } from 'lucide-react';
import MembersList from "@/app/chat/MemberList";

export default function Header({ members, roomCode, setShowExitDialog }) {
    const [copied, setCopied] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const copyRoomCode = () => {
        navigator.clipboard.writeText(roomCode).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="flex items-center w-full sm:w-auto justify-between">
                    <div className="flex items-center">
                        <div className="bg-white/20 rounded-full p-2 mr-3">
                            <Hash className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold">Chat Room</h1>
                            <div className="flex items-center space-x-2">
                                <p className="text-sm text-purple-200">
                                    Room Code: {roomCode}
                                </p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={copyRoomCode}
                                    className="p-1 hover:bg-white/10"
                                    aria-label={copied ? "Room code copied" : "Copy room code"}
                                >
                                    {copied ? (
                                        <Check className="h-4 w-4 text-green-400" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="sm:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>
                <div className={`flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0 w-full sm:w-auto ${mobileMenuOpen ? 'block' : 'hidden sm:flex'}`}>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-white/10 hover:bg-white/20 text-white border-white/20 w-full sm:w-auto"
                            >
                                <Users className="h-4 w-4 mr-2" />
                                Members
                                <Badge
                                    variant="secondary"
                                    className="ml-2 bg-white/20 text-white hover:bg-white/30"
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
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20 w-full sm:w-auto"
                    >
                        <LogOut className="h-5 w-5 mr-2" />
                        Exit Room
                    </Button>
                </div>
            </div>
        </header>
    );
}

