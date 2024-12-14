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
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">Join Room</h1>
      <div className="space-y-4 w-full max-w-xs">
        <div className="space-y-2">
          <Label htmlFor="roomCode">Room Code</Label>
          <Input
            id="roomCode"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="Enter room code"
            maxLength={6}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nickname">Nickname (optional)</Label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter a nickname"
          />
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button onClick={joinChat} disabled={!roomCode || loading} className="w-full">
          {loading ? 'Joining...' : 'Join Chat'}
        </Button>
      </div>
    </div>
  )
}
