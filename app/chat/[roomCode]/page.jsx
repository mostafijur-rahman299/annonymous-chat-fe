"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/app/chat/Header";
import Messages from "@/app/chat/Messages";
import InputArea from "@/app/chat/InputArea";
import ExitRoom from "@/app/chat/ExitRoom";

export default function ChatRoom() {
    const [messages, setMessages] = useState([]);
    const [showExitDialog, setShowExitDialog] = useState(false);
    const [members, setMembers] = useState({});
    const [socket, setSocket] = useState(null);
    const [roomData, setRoomData] = useState({});
    const [isDisconnected, setIsDisconnected] = useState(false);

    const params = useParams();

    useEffect(() => {
        const participant = JSON.parse(localStorage.getItem(params.roomCode));
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
    }, [params.roomCode, roomData.participant_id]);
    

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-indigo-900 overflow-hidden px-4 py-2 sm:px-6 sm:py-4">
            <div className="flex-1 flex flex-col">
                {isDisconnected && (
                    <div className="bg-red-500 text-white text-center py-2 text-sm sm:text-base">
                        WebSocket is disconnected. Reconnecting...
                    </div>
                )}

                <Header
                    members={members}
                    roomCode={params.roomCode}
                    setShowExitDialog={setShowExitDialog}
                />

                <Messages
                    messages={messages}
                    setMessages={setMessages}
                    roomCode={params.roomCode}
                    socket={socket}
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
                />
            </div>
        </div>
    );
}
