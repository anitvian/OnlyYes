"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect, use } from "react";
import { Heart, Calendar, Share2, Copy, Check, Music, Pause, Play } from "lucide-react";
import { useConfetti } from "@/components/Confetti";
import FloatingHearts from "@/components/FloatingHearts";
import { getProposal, incrementViewCount, Proposal } from "@/lib/api";

interface PageParams {
    params: Promise<{ slug: string }>;
}

function TypewriterText({ text, className }: { text: string; className?: string }) {
    const [displayText, setDisplayText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText((prev) => prev + text[currentIndex]);
                setCurrentIndex((prev) => prev + 1);
            }, 50);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, text]);

    return <span className={className}>{displayText}</span>;
}

function ProposalContent({ proposal }: { proposal: Proposal }) {
    const { fireConfetti } = useConfetti();
    const [hasClickedYes, setHasClickedYes] = useState(false);
    const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
    const [noMoveCount, setNoMoveCount] = useState(0);
    const [showFinalMessage, setShowFinalMessage] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const maxNoMoves = 5;

    // Move NO button to random position
    const moveNoButton = useCallback(() => {
        if (noMoveCount >= maxNoMoves) {
            setShowFinalMessage(true);
            return;
        }

        // Get viewport dimensions
        const maxX = window.innerWidth - 200;
        const maxY = window.innerHeight - 100;

        const newX = Math.random() * maxX - maxX / 2;
        const newY = Math.random() * maxY - maxY / 2;

        setNoButtonPosition({ x: newX, y: newY });
        setNoMoveCount((prev) => prev + 1);
    }, [noMoveCount]);

    const handleYesClick = () => {
        setHasClickedYes(true);
        fireConfetti();

        // Fire more confetti after delays
        setTimeout(() => fireConfetti(), 500);
        setTimeout(() => fireConfetti(), 1000);
    };

    const handleShare = async () => {
        const url = window.location.href;
        const text = `${proposal.partnerName}, someone has a special message for you! 💕`;

        if (navigator.share) {
            try {
                await navigator.share({ title: "A Valentine Proposal 💖", text, url });
            } catch (e) {
                console.log("Share cancelled", e);
            }
        } else {
            // Fallback to WhatsApp
            window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <main className="min-h-screen bg-romantic-gradient relative overflow-hidden">
            <FloatingHearts />

            <AnimatePresence mode="wait">
                {!hasClickedYes ? (
                    // Question View
                    <motion.div
                        key="question"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center"
                    >
                        {/* Main Question */}
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", duration: 0.8 }}
                            className="mb-12"
                        >
                            <Heart className="w-20 h-20 text-romantic-500 fill-romantic-500 mx-auto mb-6 animate-pulse" />

                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-[family-name:var(--font-playfair)] text-romantic-800 leading-tight">
                                <span className="font-[family-name:var(--font-dancing)] text-romantic-500">
                                    {proposal.partnerName}
                                </span>
                                ,
                                <br />
                                Will You Be My Valentine?
                            </h1>
                            <p className="mt-4 text-2xl">💕</p>
                        </motion.div>

                        {/* Buttons */}
                        <div className="flex gap-6 relative">
                            {/* YES Button */}
                            <motion.button
                                onClick={handleYesClick}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-12 py-5 bg-romantic-gradient-dark text-white text-2xl font-bold rounded-full shadow-2xl animate-pulse-glow"
                            >
                                YES 💖
                            </motion.button>

                            {/* NO Button - Moves away! */}
                            <motion.button
                                animate={{ x: noButtonPosition.x, y: noButtonPosition.y }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                onMouseEnter={moveNoButton}
                                onClick={moveNoButton}
                                className="px-12 py-5 bg-gray-200 text-gray-600 text-2xl font-bold rounded-full shadow-lg hover:bg-gray-300 transition-colors"
                            >
                                NO 😢
                            </motion.button>
                        </div>

                        {/* Final message after too many NO attempts */}
                        <AnimatePresence>
                            {showFinalMessage && (
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-8 text-romantic-600 text-lg"
                                >
                                    Are you really sure? 😅 Just click YES already!
                                </motion.p>
                            )}
                        </AnimatePresence>

                        {/* From signature */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="mt-12 text-romantic-500 font-[family-name:var(--font-dancing)] text-2xl"
                        >
                            – With all my love, {proposal.yourName} ❤️
                        </motion.p>
                    </motion.div>
                ) : (
                    // Content Reveal View
                    <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative z-10 min-h-screen py-12 px-4"
                    >
                        <div className="max-w-3xl mx-auto">
                            {/* Success Header */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", duration: 1 }}
                                className="text-center mb-12"
                            >
                                <div className="text-8xl mb-4">🎉</div>
                                <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] text-romantic-800">
                                    <TypewriterText text={`YES! ${proposal.partnerName} said YES!`} />
                                </h1>
                            </motion.div>

                            {/* Content Cards */}
                            <div className="space-y-6">
                                {/* Love Message */}
                                {proposal.loveMessage && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="glass-card p-8"
                                    >
                                        <h3 className="text-romantic-500 font-semibold mb-3 flex items-center gap-2">
                                            💌 A Message For You
                                        </h3>
                                        <p className="text-romantic-700 text-lg leading-relaxed whitespace-pre-wrap">
                                            {proposal.loveMessage}
                                        </p>
                                    </motion.div>
                                )}

                                {/* Favorite Memory */}
                                {proposal.favoriteMemory && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.7 }}
                                        className="glass-card p-8"
                                    >
                                        <h3 className="text-romantic-500 font-semibold mb-3 flex items-center gap-2">
                                            ✨ Our Favorite Memory
                                        </h3>
                                        <p className="text-romantic-700 text-lg leading-relaxed whitespace-pre-wrap">
                                            {proposal.favoriteMemory}
                                        </p>
                                    </motion.div>
                                )}

                                {/* Future Dreams */}
                                {proposal.futureDreams && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.9 }}
                                        className="glass-card p-8"
                                    >
                                        <h3 className="text-romantic-500 font-semibold mb-3 flex items-center gap-2">
                                            🌟 My Dreams For Us
                                        </h3>
                                        <p className="text-romantic-700 text-lg leading-relaxed whitespace-pre-wrap">
                                            {proposal.futureDreams}
                                        </p>
                                    </motion.div>
                                )}

                                {/* Special Date */}
                                {proposal.specialDate && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.1 }}
                                        className="glass-card p-6 text-center"
                                    >
                                        <Calendar className="w-8 h-8 text-romantic-500 mx-auto mb-2" />
                                        <p className="text-romantic-600">Our Special Date</p>
                                        <p className="text-2xl font-bold text-romantic-800">
                                            {new Date(proposal.specialDate).toLocaleDateString("en-US", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </motion.div>
                                )}

                                {/* Photo Gallery */}
                                {proposal.photos && proposal.photos.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.3 }}
                                        className="glass-card p-6"
                                    >
                                        <h3 className="text-romantic-500 font-semibold mb-4 flex items-center gap-2">
                                            📸 Our Memories Together
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {proposal.photos.map((photo, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 1.3 + index * 0.1 }}
                                                    className="aspect-square rounded-xl overflow-hidden shadow-lg"
                                                >
                                                    <img
                                                        src={photo}
                                                        alt={`Memory ${index + 1}`}
                                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Music Player */}
                                {proposal.musicUrl && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.5 }}
                                        className="glass-card p-6 text-center"
                                    >
                                        <button
                                            onClick={() => setIsPlaying(!isPlaying)}
                                            className="flex items-center gap-3 mx-auto px-6 py-3 bg-romantic-100 rounded-full text-romantic-600 hover:bg-romantic-200 transition-colors"
                                        >
                                            {isPlaying ? (
                                                <Pause className="w-5 h-5" />
                                            ) : (
                                                <Play className="w-5 h-5" />
                                            )}
                                            <Music className="w-5 h-5" />
                                            <span>Our Song</span>
                                        </button>
                                        {isPlaying && (
                                            <p className="mt-2 text-sm text-romantic-400">
                                                🎵 Playing: <a href={proposal.musicUrl} target="_blank" rel="noopener noreferrer" className="underline">Listen on external player</a>
                                            </p>
                                        )}
                                    </motion.div>
                                )}

                                {/* Share Buttons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.7 }}
                                    className="flex justify-center gap-4 pt-6"
                                >
                                    <button
                                        onClick={handleShare}
                                        className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors"
                                    >
                                        <Share2 className="w-5 h-5" />
                                        Share on WhatsApp
                                    </button>
                                    <button
                                        onClick={handleCopyLink}
                                        className="flex items-center gap-2 px-6 py-3 bg-romantic-500 text-white rounded-full font-semibold hover:bg-romantic-600 transition-colors"
                                    >
                                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                        {copied ? "Copied!" : "Copy Link"}
                                    </button>
                                </motion.div>

                                {/* Footer */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 2 }}
                                    className="text-center pt-12 pb-6"
                                >
                                    <p className="text-romantic-500 font-[family-name:var(--font-dancing)] text-3xl">
                                        Forever yours, {proposal.yourName} ❤️
                                    </p>
                                    <p className="mt-4 text-romantic-400 text-sm">
                                        Made with 💖 on OnlyYes
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

export default function ProposalPage({ params }: PageParams) {
    const { slug } = use(params);
    const [proposal, setProposal] = useState<Proposal | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProposal() {
            try {
                const data = await getProposal(slug);
                setProposal(data);

                // Increment view count
                incrementViewCount(slug).catch(console.error);
            } catch (err) {
                console.error(err);
                setError("This proposal doesn't exist or hasn't been paid for yet.");
            } finally {
                setLoading(false);
            }
        }

        fetchProposal();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-romantic-gradient flex items-center justify-center">
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                >
                    <Heart className="w-16 h-16 text-romantic-500 fill-romantic-500" />
                </motion.div>
            </div>
        );
    }

    if (error || !proposal) {
        return (
            <div className="min-h-screen bg-romantic-gradient flex items-center justify-center px-4">
                <div className="glass-card p-8 text-center max-w-md">
                    <div className="text-6xl mb-4">💔</div>
                    <h1 className="text-2xl font-bold text-romantic-800 mb-2">
                        Proposal Not Found
                    </h1>
                    <p className="text-romantic-600">{error}</p>
                </div>
            </div>
        );
    }

    return <ProposalContent proposal={proposal} />;
}
