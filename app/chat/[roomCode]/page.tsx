'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useParams } from 'next/navigation'

type Message = {
  id: string
  sender: string
  content: string
}

export default function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [nickname, setNickname] = useState('')
  const [showExitDialog, setShowExitDialog] = useState(false)
  const router = useRouter()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const params = useParams()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    setNickname(urlParams.get('nickname') || `Anonymous${Math.floor(Math.random() * 1000)}`)
  }, [])

  const sendMessage = () => {
    if (input.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: nickname,
        content: input.trim(),
      }
      setMessages([...messages, newMessage])
      setInput('')
    }
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-slate-300 text-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Room: {params.roomCode}</h1>
        <Button variant="outline" onClick={() => setShowExitDialog(true)}>
          Exit Room
        </Button>
      </header>
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        {messages.map((message) => (
          <div key={message.id} className="mb-4">
            <span className="font-bold">{message.sender}: </span>
            <span>{message.content}</span>
          </div>
        ))}
      </ScrollArea>
      <div className="p-4 bg-slate-200 dark:bg-slate-700">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to exit?</AlertDialogTitle>
            <AlertDialogDescription>
              You will leave the chat room and lose all conversation history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/')}>Exit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
