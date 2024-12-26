"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    LogOut,
    Hash,
    Copy,
    Check,
    Menu,
    Eraser,
    Clock,
    Plus,
    Minus,
} from "lucide-react";
import MembersList from "@/app/chat/MemberList";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({
    members,
    roomCode,
    roomData,
    setShowExitDialog,
    setExpirationDuration,
    expirationDuration,
}) {
    const [copied, setCopied] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const copyRoomCode = () => {
        navigator.clipboard.writeText(roomCode).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const changeExpiration = (change) => {
        const newExpiration = Math.max(
            5,
            Math.min(60, expirationDuration + change)
        );
        setExpirationDuration(newExpiration);
    };

    return (
        <header className="bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-500 text-white p-2 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                    <div className="flex items-center w-full lg:w-auto justify-between">
                        <div className="flex items-center space-x-4">
                            <motion.div
                                className="bg-white/20 rounded-full p-3 shadow-lg"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Hash className="h-6 w-6" />
                            </motion.div>
                            <div>
                                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                                    Chat Room
                                </h1>
                                <div className="flex items-center space-x-2 mt-1">
                                    <p className="text-sm text-purple-200">
                                        Room Code: {roomCode}
                                    </p>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <motion.button
                                                    onClick={copyRoomCode}
                                                    className="p-1 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    {copied ? (
                                                        <Check className="h-4 w-4 text-green-400" />
                                                    ) : (
                                                        <Copy className="h-4 w-4" />
                                                    )}
                                                </motion.button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    {copied
                                                        ? "Copied!"
                                                        : "Copy room code"}
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="lg:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                    </div>
                    <AnimatePresence>
                        {(mobileMenuOpen || window.innerWidth > 1024) && (
                            <motion.div
                                className="flex flex-col lg:flex-row items-stretch lg:items-center space-y-2 lg:space-y-0 lg:space-x-4 w-full lg:w-auto"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-center justify-center lg:justify-start space-x-2 bg-white/10 rounded-full p-1 pr-3 shadow-lg backdrop-blur-sm">
                                    <div className="bg-white/20 rounded-full p-1.5">
                                        <Clock className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-medium hidden sm:inline">
                                        Expiration:
                                    </span>
                                    <div className="flex items-center bg-white/10 rounded-full">
                                        {/* <motion.button
                                                onClick={() =>
                                                    changeExpiration(-5)
                                                }
                                                className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                aria-label="Decrease expiration time"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </motion.button> */}
                                        <motion.span
                                            className="w-16 text-center font-bold text-lg"
                                            key={expirationDuration}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                        >
                                            {expirationDuration} m
                                        </motion.span>
                                        {/* <motion.button
                                                onClick={() =>
                                                    changeExpiration(5)
                                                }
                                                className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                aria-label="Increase expiration time"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </motion.button> */}
                                    </div>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <motion.button
                                            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-full w-full lg:w-auto transition-colors flex items-center justify-center space-x-2 shadow-lg backdrop-blur-sm"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Users className="h-4 w-4" />
                                            <span>Members</span>
                                            <Badge
                                                variant="secondary"
                                                className="bg-white/20 text-white hover:bg-white/30 rounded-full"
                                            >
                                                {Object.keys(members).length}/10
                                            </Badge>
                                        </motion.button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                Chat Room Members (
                                                {Object.keys(members).length})
                                            </DialogTitle>
                                        </DialogHeader>
                                        <MembersList members={members} />
                                    </DialogContent>
                                </Dialog>
                                <motion.button
                                    onClick={() => {
                                        setShowExitDialog(true);
                                    }}
                                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-full w-full lg:w-auto transition-colors flex items-center justify-center space-x-2 shadow-lg backdrop-blur-sm"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {roomData?.role === "host" ? (
                                        <>
                                            <Eraser className="h-5 w-5" />
                                            <span>Dismiss Room</span>
                                        </>
                                    ) : (
                                        <>
                                            <LogOut className="h-5 w-5" />
                                            <span>Leave Room</span>
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
