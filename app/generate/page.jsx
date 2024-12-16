'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function GenerateRoom() {
  const [roomCode, setRoomCode] = useState('')
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const generateCode = () => {
    setLoading(true)
    setTimeout(() => {
      setRoomCode(Math.random().toString(36).substring(2, 8).toUpperCase())
      setLoading(false)
    }, 1000)
  }

  const startChat = () => {
    if (roomCode) {
      router.push(`/chat/${roomCode}?nickname=${encodeURIComponent(nickname)}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-500 via-teal-500 to-green-400">
      <h1 className="text-5xl font-extrabold mb-10 text-center">Create Your Chat Room</h1>
      <div className="space-y-8 w-full max-w-lg bg-white p-8 rounded-lg shadow-xl">
        <Button 
          onClick={generateCode} 
          disabled={loading} 
          className="w-full py-4 text-lg font-semibold rounded-md bg-gradient-to-r from-blue-500 to-green-500 text-white">
          {loading ? 'Generating Room Code...' : 'Generate Room Code'}
        </Button>

        {roomCode && (
          <div className="bg-gray-100 p-6 rounded-lg text-center shadow-md">
            <p className="text-4xl font-extrabold text-gray-900 mb-4">{roomCode}</p>
            <Button 
              onClick={() => navigator.clipboard.writeText(roomCode)} 
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-medium rounded-md">
              Copy Room Code
            </Button>
          </div>
        )}

        <div className="space-y-4">
          <Label htmlFor="nickname" className="text-lg font-medium text-gray-700">Enter Your Nickname (Optional)</Label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Type your nickname here..."
            className="w-full py-3 px-4 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <Button 
          onClick={startChat} 
          disabled={!roomCode} 
          className={`w-full py-4 text-lg font-semibold rounded-md text-white ${
            roomCode
              ? 'bg-gradient-to-r from-green-500 to-blue-500'
              : 'bg-gray-400 cursor-not-allowed'
          }`}>
          Start Chat
        </Button>
      </div>

      <footer className="mt-10 text-sm text-gray-200">
        Built with ❤️ for seamless chatting experiences
      </footer>
    </div>
  )
}
