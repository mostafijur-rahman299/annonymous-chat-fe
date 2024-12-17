"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Send, LogOut, Hash, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ChatRoom() {
    const [messages, setMessages] = useState([
        {
            id: "1",
            sender: "Alice",
            content: "1",
            timestamp: "2023-05-01T10:00:00Z",
        },
        {
            id: "2",
            sender: "Bob",
            content: "2",
            timestamp: "2023-05-01T10:02:00Z",
        },
        {
            id: "3",
            sender: "Charlie",
            content: "3",
            timestamp: "2023-05-01T10:05:00Z",
        },
        {
            id: "4",
            sender: "Alice",
            content: "4",
            timestamp: "2023-05-01T10:06:00Z",
        },
        {
            id: "5",
            sender: "Bob",
            content: "5",
            timestamp: "2023-05-01T10:08:00Z",
        },
    ]);
    const [input, setInput] = useState("");
    const [nickname, setNickname] = useState("");
    const [showExitDialog, setShowExitDialog] = useState(false);
    const [members, setMembers] = useState([
        "Alice",
        "Bob",
        "Charlie",
        "David",
        "Eva",
    ]);
    const [showMembersMobile, setShowMembersMobile] = useState(false);
    const router = useRouter();
    const scrollAreaRef = useRef(null);
    const params = useParams();
    const sidebarRef = useRef(null);

    useEffect(() => {
        console.log("Component mounted");
        const urlParams = new URLSearchParams(window.location.search);
        const nick =
            urlParams.get("nickname") ||
            `Anonymous${Math.floor(Math.random() * 1000)}`;
        console.log("Nickname set to:", nick);
        setNickname(nick);
        setMembers((prevMembers) => [...prevMembers, nick]);

        const handleClickOutside = (event) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                showMembersMobile
            ) {
                setShowMembersMobile(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMembersMobile]);

    const sendMessage = () => {
        console.log("Send message triggered with input:", input);
        if (input.trim()) {
            const newMessage = {
                id: Date.now().toString(),
                sender: nickname,
                content: input.trim(),
                timestamp: new Date().toISOString(),
            };
            console.log("New message created:", newMessage);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setInput("");
        } else {
            console.log("Input is empty or only whitespace, message not sent");
        }
    };

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector(
                "[data-radix-scroll-area-viewport]"
            );
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleMemberClick = (member) => {
        console.log(`Clicked on member: ${member}`);
        // You can add functionality here, like opening a private chat or showing user info
    };

    const sidebarVariants = {
        open: {
            x: 0,
            transition: { type: "spring", stiffness: 300, damping: 30 },
        },
        closed: {
            x: "-100%",
            transition: { type: "spring", stiffness: 300, damping: 30 },
        },
    };

    const MembersList = () => (
        <div className="h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    Members ({members.length})
                </h2>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowMembersMobile(false)}
                    className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close members list</span>
                </Button>
            </div>
            <ScrollArea className="h-[calc(100%-2rem)]">
                <ul>
                    {members.map((member, index) => (
                        <li
                            key={index}
                            className="mb-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md cursor-pointer transition-colors duration-200 flex items-center"
                            onClick={() => handleMemberClick(member)}
                        >
                            <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage
                                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${member}`}
                                />
                                <AvatarFallback>{member[0]}</AvatarFallback>
                            </Avatar>
                            {member}
                        </li>
                    ))}
                </ul>
            </ScrollArea>
        </div>
    );

    return (
        <div className="flex h-screen bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-indigo-900 overflow-hidden p-8">
            <AnimatePresence>
                {showMembersMobile && (
                    <motion.div
                        ref={sidebarRef}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={sidebarVariants}
                        className="md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg"
                    >
                        <div className="p-4 h-full">
                            <MembersList />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col">
                <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 shadow-md">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="bg-white/20 rounded-full p-2 mr-3">
                                <Hash className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">
                                    Chat Room
                                </h1>
                                <p className="text-sm text-purple-200">
                                    Room Code: {params.roomCode}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                setShowMembersMobile(
                                                    !showMembersMobile
                                                )
                                            }
                                            className="md:hidden text-white hover:bg-white/20"
                                        >
                                            <Users className="h-5 w-5" />
                                            <span className="sr-only">
                                                Toggle Members List
                                            </span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Show Members</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
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

                <ScrollArea
                    className="flex-grow p-4 bg-transparent"
                    ref={scrollAreaRef}
                >
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-4 p-3 rounded-lg ${
                                message.sender === nickname
                                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white ml-auto"
                                    : "bg-white/80 dark:bg-gray-700/80 shadow-md backdrop-blur-sm"
                            } max-w-[80%] break-words`}
                        >
                            <div className="flex items-start">
                                <Avatar className="h-8 w-8 mr-2 ring-2 ring-white dark:ring-gray-800">
                                    <AvatarImage
                                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.sender}`}
                                    />
                                    <AvatarFallback>
                                        {message.sender[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p
                                        className={`font-bold ${
                                            message.sender === nickname
                                                ? "text-white"
                                                : "text-purple-600 dark:text-purple-400"
                                        }`}
                                    >
                                        {message.sender}
                                    </p>
                                    <p
                                        className={
                                            message.sender === nickname
                                                ? "text-white"
                                                : "text-gray-800 dark:text-gray-200"
                                        }
                                    >
                                        {message.content}
                                    </p>
                                    <p
                                        className={`text-xs ${
                                            message.sender === nickname
                                                ? "text-white/80"
                                                : "text-gray-500 dark:text-gray-400"
                                        } mt-1`}
                                    >
                                        {new Date(
                                            message.timestamp
                                        ).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </ScrollArea>
                <div className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                    <div className="flex space-x-2">
                        <Input
                            value={input}
                            onChange={(e) => {
                                console.log("Input changed:", e.target.value);
                                setInput(e.target.value);
                            }}
                            placeholder="Type a message..."
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    console.log("Enter key pressed");
                                    sendMessage();
                                }
                            }}
                            className="bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 transition-shadow duration-200"
                        />
                        <Button
                            onClick={sendMessage}
                            className="bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200"
                        >
                            <Send className="h-5 w-5 mr-2" />
                            Send
                        </Button>
                    </div>
                </div>
            </div>

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
                            You will leave the chat room and lose all
                            conversation history.
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
        </div>
    );
}
