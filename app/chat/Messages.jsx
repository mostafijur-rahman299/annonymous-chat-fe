"use client";

import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Messages({
    messages,
    setMessages,
    nickname,
    roomCode,
}) {
    const scrollAreaRef = useRef(null);

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

    const fetchMessages = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/chat-api/room-messages/${roomCode}/`
        );
        const data = await response.json();
        setMessages(data);
    };

    // Fetch messages
    useEffect(() => {
        fetchMessages();
    }, []);

    return (
        <ScrollArea
            className="flex-grow px-8 py-1 bg-transparent"
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
                        message.sender_nickname === nickname
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white ml-auto"
                            : "bg-white/80 dark:bg-gray-700/80 shadow-md backdrop-blur-sm"
                    } max-w-[80%] break-words`}
                >
                    <div className="flex items-start">
                        <Avatar className="h-8 w-8 mr-2 ring-2 ring-white dark:ring-gray-800">
                            <AvatarImage
                                src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.sender_nickname}`}
                            />
                            <AvatarFallback>
                                {message.sender_nickname.slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p
                                className={`font-bold ${
                                    message.sender_nickname === nickname
                                        ? "text-white"
                                        : "text-purple-600 dark:text-purple-400"
                                }`}
                            >
                                {message.sender_nickname}
                            </p>
                            <p
                                className={
                                    message.sender_nickname === nickname
                                        ? "text-white"
                                        : "text-gray-800 dark:text-gray-200"
                                }
                            >
                                {message.message_text}
                            </p>
                            <p
                                className={`text-xs ${
                                    message.sender_nickname === nickname
                                        ? "text-white/80"
                                        : "text-gray-500 dark:text-gray-400"
                                } mt-1`}
                            >
                                {new Date(
                                    message.created_at
                                ).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </ScrollArea>
    );
}
