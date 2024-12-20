"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send } from 'lucide-react';

export default function InputArea({ setMessages, nickname, roomCode, socket }) {
    const [input, setInput] = useState("");
    const [roomLocalData, setRoomLocalData] = useState(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const roomLocalData = JSON.parse(localStorage.getItem(`${roomCode}`));
            setRoomLocalData(roomLocalData);
        }
    }, [roomCode]);

    const adjustTextareaHeight = (element) => {
        element.style.height = 'auto';
        element.style.height = Math.min(element.scrollHeight, 5 * 24) + 'px';
    };

    const resetTextareaHeight = (element) => {
        element.style.height = 'auto';
    };

    const sendMessage = () => {
        if (input.trim()) {
            if (socket && socket.readyState === WebSocket.OPEN) {
                const messageData = {
                    message: input.trim(),
                };

                const newMessage = {
                    id: "new-msg-" + Date.now().toString(),
                    message_text: input.trim(),
                    created_at: new Date().toLocaleTimeString(),
                    sender: {
                        id: roomLocalData.participant_id,
                        nickname: nickname,
                        role: roomLocalData.role,
                    }
                };
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                setInput("");
                socket.send(JSON.stringify(messageData));
                
                // Reset textarea height
                if (textareaRef.current) {
                    resetTextareaHeight(textareaRef.current);
                }
            } else {
                console.error("WebSocket is not open. Unable to send message.");
            }
        }
    };

    return (
        <div className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <div className="flex items-end space-x-2">
                <div className="flex-grow">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            adjustTextareaHeight(textareaRef.current);
                        }}
                        placeholder="Type a message..."
                        onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        className="w-full bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 transition-shadow duration-200 rounded-md p-2 resize-none overflow-hidden"
                        rows={1}
                    />
                </div>
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

