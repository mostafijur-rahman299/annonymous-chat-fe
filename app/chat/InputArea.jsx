"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export default function InputArea({ setMessages, nickname }) {
    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (input.trim()) {
            const newMessage = {
                id: Date.now().toString(),
                sender_nickname: nickname,
                message_text: input.trim(),
                created_at: new Date().toISOString(),
            };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setInput("");
        }
    };

    return (
        <div className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <div className="flex space-x-2">
                <Input
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                    }}
                    placeholder="Type a message..."
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
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
    );
}
