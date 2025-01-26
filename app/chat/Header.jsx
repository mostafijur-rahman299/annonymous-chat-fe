"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, LogOut, Hash, Copy, Check, Menu, Eraser, Clock } from "lucide-react"
import MembersList from "@/app/chat/MemberList"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"
import { useMediaQuery } from "@/hooks/useMediaQuery"

export default function Header({ members, roomCode, roomData, setShowExitDialog, expirationDuration }) {
  const [copied, setCopied] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 639px)")

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <header className="bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-500 text-white p-2 sm:p-4 shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center w-full sm:w-auto justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <motion.div
                className="bg-white/20 rounded-full p-2 sm:p-3 shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Hash className="h-4 w-4 sm:h-6 sm:w-6" />
              </motion.div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                  Chat Room
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-xs sm:text-sm text-purple-200">Room Code: {roomCode}</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.button
                          onClick={copyRoomCode}
                          className="p-1 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                        </motion.button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{copied ? "Copied!" : "Copy room code"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="sm:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <AnimatePresence>
            {(mobileMenuOpen || !isMobile) && (
              <motion.div
                className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-4 w-full sm:w-auto mt-4 sm:mt-0"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center sm:justify-start space-x-2 bg-white/10 rounded-full p-2 shadow-lg backdrop-blur-sm text-xs sm:text-sm">
                  <div className="bg-white/20 rounded-full p-1 sm:p-1.5">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <span className="font-medium">
                    Expiration: <span className="font-bold">{expirationDuration}m</span>
                  </span>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <motion.button
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-2 rounded-full w-full sm:w-auto transition-colors flex items-center justify-center space-x-2 shadow-lg backdrop-blur-sm text-xs sm:text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Members</span>
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white hover:bg-white/30 rounded-full text-xs"
                      >
                        {Object.keys(members).length}/10
                      </Badge>
                    </motion.button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Chat Room Members ({Object.keys(members).length})</DialogTitle>
                    </DialogHeader>
                    <MembersList members={members} />
                  </DialogContent>
                </Dialog>
                <motion.button
                  onClick={() => {
                    setShowExitDialog(true)
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-2 rounded-full w-full sm:w-auto transition-colors flex items-center justify-center space-x-2 shadow-lg backdrop-blur-sm text-xs sm:text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {roomData?.role === "host" ? (
                    <>
                      <Eraser className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Dismiss Room</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
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
  )
}

