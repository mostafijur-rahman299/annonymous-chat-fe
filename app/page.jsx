import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import image1 from '@/public/image1.webp';
import image2 from '@/public/image2.webp';
import image3 from '@/public/image3.webp';
import image4 from '@/public/image-generate.jpeg';
import image5 from '@/public/join-room.jpeg';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-teal-500 to-green-400 text-white p-6">
      {/* Header Section */}
      <header className="text-center max-w-4xl mx-auto py-12">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
          Welcome to <span className="text-yellow-300">Anonymous Chat</span>
        </h1>
        <p className="text-lg md:text-xl leading-relaxed">
          A secure and anonymous way to connect. Create private rooms or join existing ones with just a few clicks. No identity. No worries.
        </p>
      </header>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto my-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg text-gray-900 p-6">
          <h3 className="text-lg font-semibold mb-3">Create Private Rooms</h3>
          <p className="text-sm leading-relaxed">
            Generate unique room codes with a single click and share them with friends to start a conversation.
          </p>
          <Image src={image3} alt="Create Room Demo" className="rounded-lg mt-4 w-full" width={400} height={300} />
        </div>
        <div className="bg-white rounded-lg shadow-lg text-gray-900 p-6">
          <h3 className="text-lg font-semibold mb-3">Join Existing Rooms</h3>
          <p className="text-sm leading-relaxed">
            Have a room code? Join instantly and dive into conversations without sharing personal details.
          </p>
          <Image src={image2} alt="Join Room Demo" className="rounded-lg mt-4 w-full" width={400} height={300} />
        </div>
        <div className="bg-white rounded-lg shadow-lg text-gray-900 p-6">
          <h3 className="text-lg font-semibold mb-3">Completely Anonymous</h3>
          <p className="text-sm leading-relaxed">
            Your identity is never disclosed. Chat freely without worrying about privacy concerns.
          </p>
          <Image src={image1} alt="Anonymous Chat Demo" className="rounded-lg mt-4 w-full" width={400} height={300} />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-teal-700 py-12 text-center text-white">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">How It Works</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center text-center">
            <Image src={image4} alt="Generate Room Code" className="rounded-lg mb-4 w-48 h-48" width={200} height={200} />
            <h3 className="text-lg font-medium mb-2">Step 1: Generate Room Code</h3>
            <p className="text-sm">
              Click the <strong>"Generate Room Code"</strong> button and share the code with others.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Image src={image5} alt="Join Room" className="rounded-lg mb-4 w-48 h-48" width={200} height={200} />
            <h3 className="text-lg font-medium mb-2">Step 2: Join the Room</h3>
            <p className="text-sm">
              Enter the code to join the conversation instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="text-center mt-16">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to Start Chatting?</h2>
        <p className="text-lg md:text-xl mb-6">
          Create or join a room and start your anonymous chat journey today!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/generate">
            <Button
              variant="default"
              className="px-6 py-3 text-lg font-medium rounded-lg bg-yellow-400 text-gray-900 hover:bg-yellow-300 shadow-md">
              Generate Room Code
            </Button>
          </Link>
          <Link href="/join">
            <Button
              variant="outline"
              className="px-6 py-3 text-lg font-medium rounded-lg border-2 border-whit text-teal-700">
              Enter Room Code
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="text-center mt-16 py-8 text-sm text-gray-200">
        Built with ❤️ to enable seamless, private communication. Enjoy chatting anonymously!
      </footer>
    </div>
  );
}
