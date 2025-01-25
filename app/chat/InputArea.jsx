"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Smile } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import EmojiPicker from 'emoji-picker-react';
import { encryptMessage, importGroupKey } from "@/utils/crypto";

export default function InputArea({
    setMessages,
    roomCode,
    socket,
}) {
    const [input, setInput] = useState("");
    const [roomLocalData, setRoomLocalData] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const roomLocalData = JSON.parse(
                localStorage.getItem(`${roomCode}`) || '{}'
            );
            setRoomLocalData(roomLocalData);
        }
    }, [roomCode]);

    const adjustTextareaHeight = (element) => {
        element.style.height = "auto";
        element.style.height = `${Math.min(element.scrollHeight, 5 * 24)}px`;
    };

    const resetTextareaHeight = (element) => {
        element.style.height = "auto";
    };

    const sendMessage = async () => {
        if (input.trim()) {
            if (socket && socket.readyState === WebSocket.OPEN) {

                // Encrypt the message
                const groupKey = await importGroupKey(roomLocalData?.group_key);
                const encryptedMessage = await encryptMessage(input.trim(), groupKey);
                
                const message_tmp_id = "new-msg-" + Date.now().toString();
                const messageData = {
                    command: "send_message",
                    message: encryptedMessage,
                    message_tmp_id: message_tmp_id,
                };

                const newMessage = {
                    id: message_tmp_id,
                    message_text: input.trim(),
                    created_at: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    status: "pending",
                    sender: {
                        id: roomLocalData?.participant_id,
                        nickname: roomLocalData?.nickname,
                        role: roomLocalData?.role,
                    }
                };
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                setInput("");
                socket.send(JSON.stringify(messageData));

                if (textareaRef.current) {
                    resetTextareaHeight(textareaRef.current);
                }
            } else {
                console.error("WebSocket is not open. Unable to send message.");
            }
        }
    };

    const handleEmojiClick = (emojiObject) => {
        setInput((prevInput) => prevInput + emojiObject.emoji);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700 backdrop-blur-lg shadow-lg rounded-t-xl"
        >
            <div className="flex items-end space-x-2">
                <div className="flex-grow relative">
                    <Textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            adjustTextareaHeight(e.target);
                            setIsTyping(e.target.value.length > 0);
                        }}
                        placeholder="Type a message..."
                        onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        className="w-full bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 transition-all duration-200 rounded-md p-2 pr-24 resize-none overflow-hidden min-h-[40px]"
                        rows={1}
                    />
                    <div className="absolute right-2 bottom-2 flex space-x-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                    <Smile className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                            </PopoverContent>
                        </Popover>
                        {/* <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <Paperclip className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <Mic className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        </Button> */}
                    </div>
                </div>
                <AnimatePresence>
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Button
                                onClick={sendMessage}
                                className="bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 rounded-md p-4 py-5"
                            >
                                Send <Send className="h-5 w-5" />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
    