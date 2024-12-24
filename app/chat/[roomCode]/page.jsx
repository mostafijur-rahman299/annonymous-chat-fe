"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/app/chat/Header";
import Messages from "@/app/chat/Messages";
import InputArea from "@/app/chat/InputArea";
import ExitRoom from "@/app/chat/ExitRoom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle } from 'lucide-react';

export default function ChatRoom() {
    const [messages, setMessages] = useState([]);
    const [showExitDialog, setShowExitDialog] = useState(false);
    const [members, setMembers] = useState({});
    const [socket, setSocket] = useState(null);
    const [roomData, setRoomData] = useState({});
    const [isDisconnected, setIsDisconnected] = useState(false);
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const participant = JSON.parse(localStorage.getItem(params.roomCode));
        if (!participant?.participant_id) {
            router.push("/");
        }
        setRoomData(participant);
    }, []);

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/chat-api/room-participants/${params.roomCode}/`
                );
                const data = await response.json();
                setMembers(data);
            } catch (error) {
                console.log("Error fetching participants:", error);
            }
        };
        fetchParticipants();
    }, [params.roomCode]);

    useEffect(() => {
        let retryCount = 0;
        let reconnectTimeout;

        const connectWebSocket = () => {
            if (roomData.participant_id) {
                const chatSocket = new WebSocket(
                    `${process.env.NEXT_PUBLIC_WS_URL}/ws/chat/${params.roomCode}/?participant_id=${roomData.participant_id}`
                );

                setSocket(chatSocket);

                chatSocket.onopen = () => {
                    console.log("WebSocket connected");
                    setIsDisconnected(false);
                    retryCount = 0;
                };

                chatSocket.onclose = () => {
                    console.log("WebSocket disconnected");
                    setIsDisconnected(true);

                    retryCount++;
                    const delay = Math.min(1000 * 2 ** retryCount, 30000);
                    reconnectTimeout = setTimeout(connectWebSocket, delay);
                };

                return () => {
                    chatSocket.close();
                    clearTimeout(reconnectTimeout);
                };
            }
        };

        connectWebSocket();
    }, [params.roomCode, roomData?.participant_id]);

    console.log(members);

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 overflow-hidden">
            <div className="flex-1 flex flex-col px-4 py-2 sm:px-6 sm:py-4">
                {isDisconnected && (
                    <TooltipProvider>
                        <Tooltip open={isDisconnected}>
                            <TooltipTrigger asChild>
                                <div className="absolute top-2 right-2 z-50">
                                <AlertCircle className="h-6 w-6 text-red-500" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent 
                            side="left"
                            className="bg-red-500 bg-opacity-80 text-white border-none shadow-lg"
                        >
                            <p>WebSocket is disconnected. Reconnecting...</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                )}

                <Header
                    members={members}
                    roomCode={params.roomCode}
                    roomData={roomData}
                    setShowExitDialog={setShowExitDialog}
                />

                <Messages
                    messages={messages}
                    setMessages={setMessages}
                    roomCode={params.roomCode}
                    socket={socket}
                    setMembers={setMembers}
                />

                <div className="sticky bottom-0">
                    <InputArea
                        setMessages={setMessages}
                        roomCode={params.roomCode}
                        socket={socket}
                    />
                </div>

                <ExitRoom
                    showExitDialog={showExitDialog}
                    setShowExitDialog={setShowExitDialog}
                    roomData={roomData}
                    socket={socket}
                />
            </div>
        </div>
    );
}

