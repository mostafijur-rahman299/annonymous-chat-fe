import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 via-teal-600 to-green-500 text-white p-8">
      {/* Header Section */}
      <header className="text-center max-w-4xl mx-auto mb-12">
        <h1 className="text-6xl font-bold mb-6">Welcome to Anonymous Chat</h1>
        <p className="text-lg leading-relaxed">
          Discover a secure and anonymous way to chat. Whether you want to create private rooms or join existing ones, our platform makes it easy to connect with anyone, anywhere, anytime—no strings attached.
        </p>
      </header>

      {/* Feature Section */}
      <section className="max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-semibold text-center mb-8">Features That Make Us Unique</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg text-gray-900 p-6">
            <h3 className="text-xl font-medium mb-4">Create Private Rooms</h3>
            <p className="text-sm">
              Generate unique room codes with a single click and share them with friends to start a conversation.
            </p>
            {/* Placeholder for GIF: Replace src with your actual GIF */}
            <img 
              src="/images/generate-room-demo.gif" 
              alt="Create Room Demo" 
              className="rounded-lg mt-4 w-full" 
            />
          </div>
          <div className="bg-white rounded-lg shadow-lg text-gray-900 p-6">
            <h3 className="text-xl font-medium mb-4">Join Existing Rooms</h3>
            <p className="text-sm">
              Have a room code? Join instantly and dive into the conversation without sharing any personal details.
            </p>
            {/* Placeholder for GIF: Replace src with your actual GIF */}
            <img 
              src="/images/join-room-demo.gif" 
              alt="Join Room Demo" 
              className="rounded-lg mt-4 w-full" 
            />
          </div>
          <div className="bg-white rounded-lg shadow-lg text-gray-900 p-6">
            <h3 className="text-xl font-medium mb-4">Completely Anonymous</h3>
            <p className="text-sm">
              Your identity is never disclosed. Chat freely without worrying about privacy concerns.
            </p>
            {/* Placeholder for Static Image: Replace src with your actual image */}
            <img 
              src="/images/anonymous-chat.png" 
              alt="Anonymous Chat Illustration" 
              className="rounded-lg mt-4 w-full" 
            />
          </div>
          <div className="bg-white rounded-lg shadow-lg text-gray-900 p-6">
            <h3 className="text-xl font-medium mb-4">Cross-Platform Support</h3>
            <p className="text-sm">
              Our app is accessible on desktop, tablet, and mobile devices for a seamless experience.
            </p>
            {/* Placeholder for Static Image: Replace src with your actual image */}
            <img 
              src="/images/cross-platform-support.png" 
              alt="Cross-Platform Support Illustration" 
              className="rounded-lg mt-4 w-full" 
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-teal-700 py-12 text-center text-white">
        <h2 className="text-3xl font-semibold mb-8">How It Works</h2>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-8">
            {/* Placeholder for GIF */}
            <img 
              src="/images/create-room-step.gif" 
              alt="Create Room Step" 
              className="rounded-lg w-48 h-48 md:w-64 md:h-64 mb-4 md:mb-0" 
            />
            <div className="text-left">
              <h3 className="text-xl font-medium">Step 1: Generate Room Code</h3>
              <p className="text-sm">
                Click on the <strong>"Generate Room Code"</strong> button and share the unique code with others.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-8">
            {/* Placeholder for GIF */}
            <img 
              src="/images/join-room-step.gif" 
              alt="Join Room Step" 
              className="rounded-lg w-48 h-48 md:w-64 md:h-64 mb-4 md:mb-0" 
            />
            <div className="text-left">
              <h3 className="text-xl font-medium">Step 2: Join the Room</h3>
              <p className="text-sm">
                Enter the room code to join a private conversation with the group.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="text-center mt-16">
        <h2 className="text-4xl font-bold mb-4">Ready to Start Chatting?</h2>
        <p className="text-lg mb-8">
          Create or join a room and start your anonymous chat journey today!
        </p>
        <div className="space-x-4">
          <Link href="/generate">
            <Button 
              variant="default" 
              className="px-6 py-3 text-lg font-medium rounded-lg bg-teal-600 text-white shadow-md">
              Generate Room Code
            </Button>
          </Link>
          <Link href="/join">
            <Button 
              variant="outline" 
              className="px-6 py-3 text-lg font-medium rounded-lg border-2 border-white text-white">
              Enter Room Code
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="text-center mt-16 py-8 text-sm text-gray-300">
        Built with ❤️ to enable seamless, private communication. Enjoy chatting anonymously!
      </footer>
    </div>
  )
}
