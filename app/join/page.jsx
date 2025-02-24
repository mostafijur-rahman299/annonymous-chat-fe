"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { generateRSAKeyPair, exportPublicKey, exportPrivateKey } from "@/utils/crypto";

export default function JoinRoom() {
    const [roomCode, setRoomCode] = useState("");
    const [nickname, setNickname] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const joinChat = async () => {
        try {
            setLoading(true);
            setError(null);

            // add data to local storage
            const keyPair = await generateRSAKeyPair(); // User can use this to decrypt the group key

            // Export keys to Base64
            const exportedPrivateKey = await exportPrivateKey(
                keyPair.privateKey
            );
            const exportedPublicKey = await exportPublicKey(keyPair.publicKey);

            // Ensure the environment variable is set and log it for debugging
            if (!process.env.NEXT_PUBLIC_API_URL) {
                throw new Error(
                    "API URL is not configured. Please check your environment variables."
                );
            }

            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/chat-api/join-room/`;

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    room_code: roomCode,
                    nickname: nickname,
                    rsa_public_key: exportedPublicKey,
                }),
            });

            if (!response.ok) {
                // If the response is not okay, parse and display the error message if available
                const errorData = await response.json();
                setError(errorData?.error);
                setLoading(false);
                return;
            }

            let data = await response.json();
            data = data?.data;

            localStorage.setItem(
                `${data?.room_code}`,
                JSON.stringify({
                    nickname: data?.nickname,
                    participant_id: `${data?.participant_id}`,
                    role: data?.role,
                    rsa_key_pair: {
                        publicKey: exportedPublicKey,
                        privateKey: exportedPrivateKey,
                    },
                })
            );

            router.push(`/chat/${data?.room_code}`);
        } catch (err) {
            setError({
                general: "Something went wrong. Please try again later.",
            });
            setLoading(false);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-teal-800 to-green-900 text-white p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
            >
                <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-center leading-tight">
                    Join{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse">
                        Anonymous Chat
                    </span>
                </h1>
                <p className="text-sm md:text-lg leading-relaxed max-w-3xl mx-auto mb-8 text-white/80 font-bold">
                    Enter the room code to join the chat, interact with participants, and enjoy secure, anonymous conversations with end-to-end encryption to protect your privacy.
                </p>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full max-w-md space-y-8 bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-lg"
            >
                <div className="space-y-4">
                    <Label
                        htmlFor="roomCode"
                        className="text-lg font-medium text-gray-200"
                    >
                        Room Code
                    </Label>
                    <Input
                        id="roomCode"
                        value={roomCode}
                        onChange={(e) =>
                            setRoomCode(e.target.value.toUpperCase())
                        }
                        placeholder="Enter room code"
                        className={cn(
                            "border-2 bg-white/5 text-white placeholder-gray-400",
                            error?.room_code
                                ? "border-red-500"
                                : "border-gray-300",
                            "rounded-md p-2 focus:ring-2 focus:ring-yellow-400"
                        )}
                    />
                    {error?.room_code && (
                        <p className="text-red-500">{error?.room_code}</p>
                    )}
                </div>
                <div className="space-y-4">
                    <Label
                        htmlFor="nickname"
                        className="text-lg font-medium text-gray-200"
                    >
                        Nickname (optional)
                    </Label>
                    <Input
                        id="nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="Enter a nickname"
                        className={cn(
                            "border-2 bg-white/5 text-white placeholder-gray-400",
                            error?.nickname
                                ? "border-red-500"
                                : "border-gray-300",
                            "rounded-md p-2 focus:ring-2 focus:ring-yellow-400"
                        )}
                    />
                    {error?.nickname && (
                        <p className="text-red-500">{error?.nickname}</p>
                    )}
                </div>
                {error?.general && (
                    <Alert
                        variant="destructive"
                        className="bg-red-600 text-white p-4 rounded-md"
                    >
                        <AlertDescription>{error?.general}</AlertDescription>
                    </Alert>
                )}
                <Button
                    onClick={joinChat}
                    disabled={!roomCode || loading}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold py-3 px-4 rounded-full hover:from-yellow-300 hover:to-orange-400 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                    {loading ? "Joining..." : "Join Chat"}
                    <ArrowRight className="ml-2 h-5 w-5 inline" />
                </Button>
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <Link
                    href="/"
                    className="block text-center mt-4 text-sm text-gray-300 hover:text-white transition-colors"
                >
                    Back to Home
                </Link>
            </motion.div>
        </div>
    );
}
