'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const joinChat = async () => {
      try {
        setLoading(true)
        setError(null)
  
        // Ensure the environment variable is set and log it for debugging
        if (!process.env.NEXT_PUBLIC_API_URL) {
          throw new Error('API URL is not configured. Please check your environment variables.')
        }
  
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/chat-api/join-room/`
        console.log('API URL:', apiUrl) // Log the URL to verify it's correct
  
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            room_code: roomCode,
            nickname: nickname,
          }),
        })
  
        if (!response.ok) {
          // If the response is not okay, parse and display the error message if available
          const errorData = await response.json()
          setError(errorData?.error)
          return
        }
  
        const data = await response.json()
        router.push(`/chat/${data?.data?.room_code}?nickname=${encodeURIComponent(data?.data?.nickname)}`)
      } catch (err) {
        setError({
          "general": "Something went wrong. Please try again later.",
        })
      } finally {
        setLoading(false)
      }
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
            className={cn("border-2", error?.room_code ? 'border-red-500' : 'border-gray-300', "rounded-md p-2 focus:ring-2 focus:ring-purple-500")}
          />
          {error?.room_code && (
              <p className="text-red-500">{error?.room_code}</p>
          )}
        </div>
        <div className="space-y-4">
          <Label htmlFor="nickname" className="text-lg font-medium text-gray-700">Nickname (optional)</Label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter a nickname"
            className={cn("border-2", error?.nickname ? 'border-red-500' : 'border-gray-300', "rounded-md p-2 focus:ring-2 focus:ring-purple-500")}
          />
          {error?.nickname && (
            <p className="text-red-500">{error?.nickname}</p>
          )}
        </div>
        {error?.general && (
          <Alert variant="destructive" className="bg-red-600 text-white p-4 rounded-md">
            <AlertDescription>{error?.general}</AlertDescription>
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
