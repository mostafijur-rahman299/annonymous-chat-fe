'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const joinChat = () => {
    setLoading(true)
    setError('')
    // Simulate API call to check room code
    setTimeout(() => {
      if (roomCode.length !== 6) {
        setError('Invalid room code. Please try again.')
        setLoading(false)
      } else {
        router.push(`/chat/${roomCode}?nickname=${encodeURIComponent(nickname)}`)
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br  from-blue-500 via-teal-500 to-green-400 p-6">
      <h1 className="text-4xl font-extrabold text-white mb-8 drop-shadow-lg">Join Room</h1>
      <div className="space-y-6 w-full max-w-xs bg-white shadow-lg rounded-xl p-6">
        <div className="space-y-4">
          <Label htmlFor="roomCode" className="text-lg font-medium text-gray-700">Room Code</Label>
          <Input
            id="roomCode"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="Enter room code"
            maxLength={6}
            className="border-2 border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="space-y-4">
          <Label htmlFor="nickname" className="text-lg font-medium text-gray-700">Nickname (optional)</Label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter a nickname"
            className="border-2 border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-500"
          />
        </div>
        {error && (
          <Alert variant="destructive" className="bg-red-600 text-white p-4 rounded-md">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button 
          onClick={joinChat} 
          disabled={!roomCode || loading} 
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gradient-to-l focus:outline-none focus:ring-4 focus:ring-purple-500"
        >
          {loading ? 'Joining...' : 'Join Chat'}
        </Button>
      </div>
    </div>
  )
}
