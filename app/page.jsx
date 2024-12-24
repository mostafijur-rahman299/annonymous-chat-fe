"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    ArrowRight,
    Lock,
    Users,
    MessageSquare,
    Shield,
    Zap,
    Globe,
    ChevronDown,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const AnimatedBackground = () => <div className="absolute inset-0 -z-10"></div>;

const ScrollIndicator = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-yellow-400 origin-left z-50"
            style={{ scaleX }}
        />
    );
};

export default function Home() {
    const [isScrolled, setIsScrolled] = useState(false);
    const featuresRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-800 to-green-900 text-white overflow-hidden">
            <ScrollIndicator />
            <AnimatedBackground />

            {/* Navbar */}
            <nav
                className={`fixed w-full z-50 transition-all duration-300 ${
                    isScrolled ? "bg-white/10 backdrop-blur-md shadow-lg" : ""
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0">
                            <span className="text-2xl font-bold">
                                AnonymousChat
                            </span>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <a
                                    href="#features"
                                    className="hover:bg-white/20 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Features
                                </a>
                                <a
                                    href="#how-it-works"
                                    className="hover:bg-white/20 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    How It Works
                                </a>
                                <a
                                    href="#testimonials"
                                    className="hover:bg-white/20 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Testimonials
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative overflow-hidden pt-32 pb-64 flex items-center min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                            Welcome to{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse">
                                Anonymous Chat
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl leading-relaxed mb-12 max-w-3xl mx-auto">
                            Experience the future of private communication.
                            Create or join secure rooms instantly, chat
                            anonymously, and connect without compromising your
                            identity.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/generate">
                                <Button
                                    variant="default"
                                    className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-300 hover:to-orange-400 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:rotate-1"
                                >
                                    Get Started
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/join">
                                <Button
                                    variant="outline"
                                    className="px-8 py-4 text-lg font-semibold rounded-full border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300 ease-in-out transform hover:scale-105 hover:-rotate-1"
                                >
                                    Join Room
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                >
                    <ChevronDown className="h-8 w-8 text-white opacity-70" />
                </motion.div>
            </header>

            {/* Features Section */}
            <section
                id="features"
                ref={featuresRef}
                className="py-24 bg-white/5 backdrop-blur-lg"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                        Why Choose Anonymous Chat?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: Lock,
                                title: "Complete Privacy",
                                description:
                                    "Your identity remains hidden. Chat freely without privacy concerns.",
                            },
                            {
                                icon: Zap,
                                title: "Instant Rooms",
                                description:
                                    "Create or join rooms with a single click. No registration required.",
                            },
                            {
                                icon: Shield,
                                title: "End-to-End Encryption",
                                description:
                                    "All messages are encrypted, ensuring maximum security.",
                            },
                            {
                                icon: Globe,
                                title: "Global Accessibility",
                                description:
                                    "Connect with anyone, anywhere in the world, anytime.",
                            },
                            {
                                icon: Users,
                                title: "Group Chats",
                                description:
                                    "Create rooms for multiple users. Perfect for team discussions or friend groups.",
                            },
                            {
                                icon: MessageSquare,
                                title: "Rich Text Support",
                                description:
                                    "Express yourself with emojis, attachments, and formatted text.",
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            >
                                <div className="bg-gradient-to-br from-blue-500 to-teal-500 p-4 rounded-full mb-6 w-16 h-16 flex items-center justify-center mx-auto">
                                    <feature.icon className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-4 text-center">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-300 text-center">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section
                id="how-it-works"
                className="py-24 bg-gradient-to-br from-blue-900 via-teal-800 to-green-900"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                        How It Works
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: 1,
                                title: "Generate Room Code",
                                description:
                                    "Click 'Get Started' and create a unique room code.",
                            },
                            {
                                step: 2,
                                title: "Share the Code",
                                description:
                                    "Send the code to friends you want to chat with.",
                            },
                            {
                                step: 3,
                                title: "Start Chatting",
                                description:
                                    "Enter the room and enjoy anonymous conversations!",
                            },
                        ].map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.2,
                                }}
                                className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-8 text-center relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
                                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                                    {step.step}
                                </div>
                                <h3 className="text-xl font-semibold mb-4">
                                    {step.title}
                                </h3>
                                <p className="text-gray-300">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section
                id="testimonials"
                className="py-24 bg-white/5 backdrop-blur-lg"
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                        What Our Users Say
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                quote: "Anonymous Chat has revolutionized how I connect with friends online. It's secure, easy to use, and incredibly fun!",
                                author: "Happy User",
                            },
                            {
                                quote: "I love the instant room creation feature. It's perfect for quick, private discussions with my team.",
                                author: "Busy Professional",
                            },
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg"
                            >
                                <blockquote className="text-lg italic mb-4">
                                    {testimonial.quote}
                                </blockquote>
                                <p className="text-sm font-semibold text-gray-300">
                                    - {testimonial.author}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-24 bg-gradient-to-br from-blue-900 via-teal-800 to-green-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                        Ready to Start Chatting?
                    </h2>
                    <p className="text-xl text-gray-300 mb-12">
                        Join thousands of users enjoying anonymous, secure
                        conversations. It's free and takes just seconds to
                        start!
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Input
                            type="text"
                            placeholder="Enter room code"
                            className="max-w-xs bg-white/10 backdrop-blur-md border-white/20 text-white placeholder-gray-400"
                        />
                        <Link href="/join">
                            <Button
                                variant="default"
                                className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-300 hover:to-orange-400 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                            >
                                Join Room
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="bg-black/30 backdrop-blur-lg text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">
                                AnonymousChat
                            </h3>
                            <p className="text-gray-400">
                                Secure, private, and instant communication for
                                everyone.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">
                                Quick Links
                            </h4>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#features"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#how-it-works"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        How It Works
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#testimonials"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Testimonials
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">
                                Connect With Us
                            </h4>
                            <div className="flex space-x-4">
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-800 text-center">
                        <p className="text-gray-400">
                            &copy; 2023 AnonymousChat. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
