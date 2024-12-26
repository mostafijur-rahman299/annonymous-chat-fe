"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/app/chat/Header";
import Messages from "@/app/chat/Messages";
import InputArea from "@/app/chat/InputArea";
import ExitRoom from "@/app/chat/ExitRoom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function ChatRoom() {
    const [messages, setMessages] = useState([]);
    const [showExitDialog, setShowExitDialog] = useState(false);
    const [members, setMembers] = useState({});
    const [socket, setSocket] = useState(null);
    const [roomData, setRoomData] = useState({});
    const [isDisconnected, setIsDisconnected] = useState(false);
    const [expirationDuration, setExpirationDuration] = useState(5);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [warningCountdown, setWarningCountdown] = useState(60);
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
        const fetchRoomInfo = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat-api/room-info/${params.roomCode}/`);
            const data = await response.json();
            setExpirationDuration(data.expiration_duration);
        };
        fetchRoomInfo();
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

    useEffect(() => {
        const interval = setInterval(() => {
            setExpirationDuration((prevDuration) => {
                const newDuration = prevDuration - 1;
                if (newDuration <= 1) {
                    setShowWarningModal(true);
                }
                return newDuration;
            });
        }, 1 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let countdownInterval;
        if (showWarningModal) {
            countdownInterval = setInterval(() => {
                setWarningCountdown((prevCountdown) => {
                    if (prevCountdown <= 1) {
                        clearInterval(countdownInterval);
                        handleRoomExpiration();
                        return 0;
                    }
                    return prevCountdown - 1;
                });
            }, 1000);
        }

        return () => {
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
        };
    }, [showWarningModal]);

    const handleRoomExpiration = async () => {
      // Close the warning modal
      setShowWarningModal(false);

      // Send leave room command
      if (socket) {
        socket.send(JSON.stringify({
          command: "leave_room",
          room_code: roomData.room_code,
        }));
      }

      // Clear local storage
      localStorage.removeItem(params.roomCode);

      // Redirect to home
      router.push("/");
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 overflow-hidden">
            <div className="flex-1 flex flex-col px-2 py-2 sm:px-2 sm:py-2">
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
                                <p>Socket is disconnected. Reconnecting...</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}

                <Header
                    members={members}
                    roomCode={params.roomCode}
                    roomData={roomData}
                    setShowExitDialog={setShowExitDialog}
                    setExpirationDuration={setExpirationDuration}
                    expirationDuration={expirationDuration}
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

                <WarningModal
                    isOpen={showWarningModal}
                    onClose={handleRoomExpiration}
                    countdown={warningCountdown}
                />
            </div>
        </div>
    );
}


function WarningModal({ isOpen, onClose, countdown }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Warning: Chat Room Expiring Soon</DialogTitle>
          <DialogDescription>
            This chat room will expire in {countdown} seconds. You will be redirected to the home page when the room expires.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

