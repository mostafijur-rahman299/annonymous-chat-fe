"use client";

import { useRef, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Check,
    Clock,
    Copy
} from "lucide-react";
import DOMPurify from "dompurify";
import { useRouter } from "next/navigation";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Messages({
    messages,
    setMessages,
    roomCode,
    socket,
    setMembers,
}) {
    const router = useRouter();
    const scrollAreaRef = useRef(null);
    const [roomLocalData, setRoomLocalData] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [copiedMessageId, setCopiedMessageId] = useState(null);
    const [hoveredMessageId, setHoveredMessageId] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const roomData = JSON.parse(
                localStorage.getItem(`${roomCode}`) || "{}"
            );
            setRoomLocalData(roomData);
        }
    }, [roomCode]);

    const isAtBottom = () => {
        if (!scrollAreaRef.current) return false;
        const scrollContainer = scrollAreaRef.current.querySelector(
            "[data-radix-scroll-area-viewport]"
        );
        if (!scrollContainer) return false;

        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        return Math.abs(scrollTop + clientHeight - scrollHeight) < 312;
    };

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log(data);
                if (data.response_type === "host_dismiss_room") {
                    router.push("/");
                } else if (data.response_type === "join_participant") {
                    setMembers((prevMembers) => ({
                        ...prevMembers,
                        [data.participant.participant_id]: data.participant,
                    }));
                } else if (data.response_type === "leave_participant") {
                    setMembers((prevMembers) => {
                        const {
                            [data.participant.participant_id]: _,
                            ...rest
                        } = prevMembers;
                        return rest;
                    });
                } else if (data.response_type === "new_message") {
                    if (data.sender.id !== roomLocalData?.participant_id) {
                        setMessages((prevMessages) => [...prevMessages, {
                            ...data,
                            created_at: new Date(data.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                        }]);
                        if (isAtBottom()) {
                            setTimeout(scrollToBottom, 10);
                        }
                    } else {
                        setMessages((prevMessages) =>
                            prevMessages.map((message) =>
                                message.id === data.message_tmp_id
                                    ? {
                                          ...message,
                                          id: data.id,
                                          status: data.status,
                                      }
                                    : message
                            )
                        );
                        setTimeout(scrollToBottom, 30);
                    }
                }
            };
        }
    }, [socket, roomLocalData, router, setMembers, setMessages]);

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector(
                "[data-radix-scroll-area-viewport]"
            );
            if (scrollContainer) {
                scrollContainer.scrollTo({
                    top: scrollContainer.scrollHeight,
                    behavior: "smooth",
                });
            }
        }
    };

    useEffect(() => {
        if (messages.length > 0 && isInitialLoad) {
            scrollToBottom();
            setIsInitialLoad(false);
        }
    }, [messages, isInitialLoad]);

    const fetchMessages = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/chat-api/room-messages/${roomCode}/?timezone=${Intl.DateTimeFormat().resolvedOptions().timeZone}`
            );
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [roomCode]);

    const copyMessageToClipboard = (messageId, messageText) => {
        navigator.clipboard.writeText(messageText).then(() => {
            setCopiedMessageId(messageId);
            setTimeout(() => setCopiedMessageId(null), 2000);
        });
    };

    return (
        <ScrollArea
            className="flex-grow px-8 py-1 bg-gradient-to-b from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 h-[calc(100vh-200px)]"
            ref={scrollAreaRef}
        >
            {messages.length === 0 && (
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-gray-500 dark:text-gray-400 mt-10"
                >
                    No messages yet. Start the conversation!
                </motion.p>
            )}
            <AnimatePresence>
                {messages?.map((message) => (
                    <div
                        key={message.id}
                        className={`mb-3 p-3 rounded-lg ${
                            message.sender.id === roomLocalData?.participant_id
                                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white ml-auto"
                                : "bg-white dark:bg-gray-700 shadow-md"
                        } max-w-[80%] break-words relative`}
                        onMouseEnter={() => setHoveredMessageId(message.id)}
                        onMouseLeave={() => setHoveredMessageId(null)}
                    >
                        <div className="flex items-start">
                            <Avatar className="h-8 w-8 mr-2 ring-2 ring-white dark:ring-gray-800">
                                <AvatarImage
                                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.sender.nickname}`}
                                />
                                <AvatarFallback>
                                    {message.sender.nickname.slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-grow">
                                <div className="flex justify-between items-center">
                                    <p
                                        className={`font-bold ${
                                            message.sender.id ===
                                            roomLocalData?.participant_id
                                                ? "text-white"
                                                : "text-purple-600 dark:text-purple-400"
                                        }`}
                                    >
                                        {message.sender.nickname}
                                        {message.sender.role === "host" && (
                                            <span className="ml-1 text-xs bg-yellow-400 text-gray-800 px-1 rounded">
                                                Host
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <p
                                    className={
                                        message.sender.id ===
                                        roomLocalData?.participant_id
                                            ? "text-white"
                                            : "text-gray-800 dark:text-gray-200"
                                    }
                                >
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                                (
                                                    message?.message_text || ""
                                                ).replace(/\n/g, "<br>")
                                            ),
                                        }}
                                    />
                                </p>
                                <div className="flex justify-between items-center mt-1">
                                    <div className="flex items-center space-x-2">
                                        <p
                                            className={`text-xs ${
                                                message.sender.id ===
                                                roomLocalData?.participant_id
                                                    ? "text-white/80"
                                                    : "text-gray-500 dark:text-gray-400"
                                            }`}
                                        >
                                            {message?.created_at}
                                        </p>
                                        {message.sender.id ===
                                            roomLocalData?.participant_id && (
                                            <span className="text-xs">
                                                {message.status ===
                                                "delivered" ? (
                                                    <Check className="w-4 h-4 text-green-200" />
                                                ) : (
                                                    <Clock className="w-4 h-4 text-yellow-200" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {hoveredMessageId === message.id && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="absolute bottom-2 right-2 flex space-x-1"
                            >
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    copyMessageToClipboard(
                                                        message.id,
                                                        message.message_text
                                                    )
                                                }
                                                className={`p-1 ${
                                                    message.sender.id ===
                                                    roomLocalData?.participant_id
                                                        ? "hover:bg-white/10 text-white"
                                                        : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                                                }`}
                                            >
                                                {copiedMessageId ===
                                                message.id ? (
                                                    <Check className="h-4 w-4" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                {copiedMessageId === message.id
                                                    ? "Copied!"
                                                    : "Copy message"}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </motion.div>
                        )}
                        
                    </div>
                ))}
            </AnimatePresence>
        </ScrollArea>
    );
}
