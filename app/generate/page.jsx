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
  const [error, setError] = useState(null)

  const router = useRouter()

  const startChat = async () => {
    try {
      setLoading(true)
      setError(null)

      // Ensure the environment variable is set and log it for debugging
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('API URL is not configured. Please check your environment variables.')
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/chat-api/create-room/`
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
        setLoading(false)
        return
      }

      let data = await response.json()
      data = data?.data
      // add data to local storage
      localStorage.setItem(`${data?.room_code}`, JSON.stringify({
        nickname: data?.nickname,
        participant_id: `${data?.participant_id}`,
        role: data?.role,
      }))

      router.push(`/chat/${data?.room_code}?nickname=${encodeURIComponent(data?.nickname)}`)

    } catch (err) {
      setError({
        general: "Something went wrong. Please try again later.",
      })
      setLoading(false)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 1000);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-500 via-teal-500 to-green-400">
      <h1 className="text-5xl font-extrabold mb-10 text-center">Create Your Chat Room</h1>
      <div className="space-y-8 w-full max-w-lg bg-white p-8 rounded-lg shadow-xl">
        {error?.general && <p className="text-red-500 text-center">{error?.general}</p>} {/* Show error message */}

        <div className="space-y-4">
          <Label htmlFor="nickname" className="text-lg font-medium text-gray-700">
            Enter Your Nickname (Optional)
          </Label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Type your nickname here..."
            className={`w-full py-3 px-4 rounded-md border ${
              error?.nickname ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="roomCode" className="text-lg font-medium text-gray-700">
            Enter Your Room Code (Optional)
          </Label>
          <Input
            id="roomCode"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value?.toUpperCase())}
            placeholder="Type your room code here..."
            className={`w-full py-3 px-4 rounded-md border ${
              error?.room_code ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
          />
          {error?.room_code && <p className="text-red-500">{error?.room_code}</p>}
        </div>
        <Button
          onClick={startChat}
          className={`w-full py-4 text-lg font-semibold rounded-md text-white bg-gradient-to-r from-green-500 to-blue-500`}
        >
          {loading ? 'Loading...' : 'Start Chat'}
        </Button>
      </div>

      <footer className="mt-10 text-sm text-gray-200">Built with ❤️ for seamless chatting experiences</footer>
    </div>
  )
}
