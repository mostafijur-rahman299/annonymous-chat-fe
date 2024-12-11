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
    // Simulate API call to generate room code
    setTimeout(() => {
      setRoomCode(Math.random().toString(36).substring(2, 8).toUpperCase())
      setLoading(false)
    }, 1000)
  }

  const startChat = () => {
    router.push(`/chat/${roomCode}?nickname=${encodeURIComponent(nickname)}`)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">Generate Room</h1>
      <div className="space-y-4 w-full max-w-xs">
        <Button onClick={generateCode} disabled={loading} className="w-full">
          {loading ? 'Generating...' : 'Generate Room Code'}
        </Button>
        {roomCode && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md text-center">
            <p className="text-2xl font-bold mb-2">{roomCode}</p>
            <Button onClick={() => navigator.clipboard.writeText(roomCode)} variant="outline" className="w-full">
              Copy Code
            </Button>
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="nickname">Nickname (optional)</Label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter a nickname"
          />
        </div>
        <Button onClick={startChat} disabled={!roomCode} className="w-full">
          Start Chat
        </Button>
      </div>
    </div>
  )
}

