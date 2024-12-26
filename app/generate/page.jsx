'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Clock } from 'lucide-react'

export default function GenerateRoom() {
  const [roomCode, setRoomCode] = useState('')
  const [nickname, setNickname] = useState('')
  const [expirationTime, setExpirationTime] = useState('10')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const router = useRouter()

  const startChat = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('API URL is not configured. Please check your environment variables.')
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/chat-api/create-room/`

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          room_code: roomCode,
          nickname: nickname,
          expiration_duration: parseInt(expirationTime)
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData?.error)
        setLoading(false)
        return
      }

      let data = await response.json()
      data = data?.data
      localStorage.setItem(`${data?.room_code}`, JSON.stringify({
        nickname: data?.nickname,
        participant_id: `${data?.participant_id}`,
        role: data?.role,
      }))

      router.push(`/chat/${data?.room_code}`)

    } catch (err) {
      setError({
        general: "Something went wrong. Please try again later.",
      })
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 1000);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-teal-800 to-green-900 text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
          Create Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse">Chat Room</span>
        </h1>
        <p className="text-sm md:text-lg leading-relaxed max-w-3xl mx-auto mb-8 text-white/80 font-bold">
          Create a unique room code and invite your friends to join the chat. It's free and end to end encrypted.
          You can chat anonymously, without revealing your personal details. Rest assured, your privacy is our top priority, and all conversations are securely encrypted.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md space-y-8 bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-lg"
      >
        {error?.general && (
          <Alert variant="destructive" className="bg-red-600 text-white p-4 rounded-md">
            <AlertDescription>{error?.general}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-4">
          <Label htmlFor="nickname" className="text-lg font-medium text-gray-200">
            Enter Your Nickname (Optional)
          </Label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Type your nickname here..."
            className="w-full py-3 px-4 rounded-md border bg-white/5 text-white placeholder-gray-400 border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
        </div>
        <div className="space-y-4">
          <Label htmlFor="roomCode" className="text-lg font-medium text-gray-200">
            Enter Your Room Code (Optional)
          </Label>
          <Input
            id="roomCode"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value?.toUpperCase())}
            placeholder="Type your room code here..."
            className="w-full py-3 px-4 rounded-md border bg-white/5 text-white placeholder-gray-400 border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
          {error?.room_code && <p className="text-red-500">{error?.room_code}</p>}
        </div>
        <div className="space-y-4">
          <Label htmlFor="expirationTime" className="text-lg font-medium text-gray-200">
            Select Room Expiration Time
          </Label>
          <Select value={expirationTime} onValueChange={setExpirationTime}>
            <SelectTrigger className="w-full py-3 px-4 rounded-md border bg-white/5 text-white placeholder-gray-400 border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:outline-none">
              <SelectValue placeholder="Select expiration time" />
            </SelectTrigger>
            <SelectContent className="bg-white/10 backdrop-blur-md rounded-md">
              <SelectItem value="5" className="cursor-pointer">5 minutes</SelectItem>
              <SelectItem value="10" className="cursor-pointer">10 minutes</SelectItem>
              <SelectItem value="15" className="cursor-pointer">15 minutes</SelectItem>
              <SelectItem value="30" className="cursor-pointer">30 minutes</SelectItem>
              <SelectItem value="60" className="cursor-pointer">1 hour</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={startChat}
          disabled={loading}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold py-3 px-4 rounded-full hover:from-yellow-300 hover:to-orange-400 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          {loading ? 'Creating Room...' : 'Create Room'}
          <ArrowRight className="ml-2 h-5 w-5 inline" />
        </Button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Link href="/" className="block text-center mt-4 text-sm text-gray-300 hover:text-white transition-colors">
          Back to Home
        </Link>
      </motion.div>
    </div>
  )
}

