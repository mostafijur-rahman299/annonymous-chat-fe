"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/app/chat/Header";
import Messages from "@/app/chat/Messages";
import InputArea from "@/app/chat/InputArea";
import ExitRoom from "@/app/chat/ExitRoom";

export default function ChatRoom() {
    const [messages, setMessages] = useState([]);
    const [nickname, setNickname] = useState("");
    const [showExitDialog, setShowExitDialog] = useState(false);
    const [members, setMembers] = useState({});

    const params = useParams();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const nick = urlParams.get("nickname");
        setNickname(nick);
    }, []);

    // Fetch participants
    useEffect(() => {
        const fetchParticipants = async () => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/chat-api/room-participants/${params.roomCode}/`
            );
            const data = await response.json();
            setMembers(data);
        };
        fetchParticipants();
    }, [params.roomCode]);

    return (
        <div className="flex h-screen bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-indigo-900 overflow-hidden px-6 py-4">
            <div className="flex-1 flex flex-col">
                <Header
                    members={members}
                    roomCode={params.roomCode}
                    setShowExitDialog={setShowExitDialog}
                />

                <Messages
                    messages={messages}
                    setMessages={setMessages}
                    nickname={nickname}
                    roomCode={params.roomCode}
                />

                <InputArea setMessages={setMessages} nickname={nickname} />

                <ExitRoom
                    showExitDialog={showExitDialog}
                    setShowExitDialog={setShowExitDialog}
                />
            </div>
        </div>
    );
}
