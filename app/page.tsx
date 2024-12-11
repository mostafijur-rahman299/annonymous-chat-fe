import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-2">Anonymous Chat</h1>
      <p className="text-xl mb-8">Chat Anonymously, Anytime</p>
      <div className="space-y-4 w-full max-w-xs">
        <Link href="/generate" className="w-full">
          <Button variant="default" className="w-full">Generate Room Code</Button>
        </Link>
        <Link href="/join" className="w-full">
          <Button variant="outline" className="w-full">Enter Room Code</Button>
        </Link>
      </div>
    </div>
  )
}

