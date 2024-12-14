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

export default function ChatRoom() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [nickname, setNickname] = useState('')
  const [showExitDialog, setShowExitDialog] = useState(false)
  const router = useRouter()
  const scrollAreaRef = useRef(null)
  const params = useParams()

  useEffect(() => {
    console.log('Component mounted')
    const urlParams = new URLSearchParams(window.location.search)
    const nick = urlParams.get('nickname') || `Anonymous${Math.floor(Math.random() * 1000)}`
    console.log('Nickname set to:', nick)
    setNickname(nick)
  }, [])

  const sendMessage = () => {
    console.log('Send message triggered with input:', input)
    if (input.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        sender: nickname,
        content: input.trim(),
      }
      console.log('New message created:', newMessage)
      setMessages([...messages, newMessage])
      setInput('')
    } else {
      console.log('Input is empty or only whitespace, message not sent')
    }
  }

  useEffect(() => {
    console.log('Messages updated:', messages)
    if (scrollAreaRef.current) {
      console.log('Scrolling to the bottom of the messages')
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-slate-300 text-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Room: {params.roomCode}</h1>
        <Button variant="outline" onClick={() => {
          console.log('Exit button clicked')
          setShowExitDialog(true)
        }}>
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
            onChange={(e) => {
              console.log('Input changed:', e.target.value)
              setInput(e.target.value)
            }}
            placeholder="Type a message..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                console.log('Enter key pressed')
                sendMessage()
              }
            }}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
      <AlertDialog open={showExitDialog} onOpenChange={(open) => {
        console.log('AlertDialog state changed:', open)
        setShowExitDialog(open)
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to exit?</AlertDialogTitle>
            <AlertDialogDescription>
              You will leave the chat room and lose all conversation history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              console.log('Exiting room and navigating to home page')
              router.push('/')
            }}>Exit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
