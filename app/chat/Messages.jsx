"use client";

import { useRef, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Clock } from "lucide-react";
import DOMPurify from "dompurify";

export default function Messages({
    messages,
    setMessages,
    nickname,
    roomCode,
}) {
    const scrollAreaRef = useRef(null);
    const [roomLocalData, setRoomLocalData] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const roomData = JSON.parse(localStorage.getItem(`${roomCode}`));
            setRoomLocalData(roomData);
        }
    }, [roomCode]);

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
        scrollToBottom();
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/chat-api/room-messages/${roomCode}/`
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

    return (
        <ScrollArea
            className="flex-grow px-8 py-1 bg-transparent h-[calc(100vh-200px)]"
            ref={scrollAreaRef}
        >
            {messages.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
                    No messages yet
                </p>
            )}
            {messages?.map((message) => (
                <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-3 p-3 rounded-lg ${
                        message.sender.id === roomLocalData?.participant_id
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white ml-auto"
                            : "bg-white/80 dark:bg-gray-700/80 shadow-md backdrop-blur-sm"
                    } max-w-[80%] break-words`}
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
                                    {message.sender.nickname}{" "}
                                    {message.sender.role === "host" ? (
                                        <span className="text-xs text-gray-200 dark:text-gray-400">
                                            (Host)
                                        </span>
                                    ) : (
                                        ""
                                    )}
                                </p>
                                {message.sender.id ===
                                    roomLocalData?.participant_id && (
                                    <span className="text-xs">
                                        {message.status === "delivered" ? (
                                            <Check className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <Clock className="w-4 h-4 text-yellow-500" />
                                        )}
                                    </span>
                                )}
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
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </ScrollArea>
    );
}
