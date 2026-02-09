"use client";

import { motion } from "framer-motion";
import { useState, useEffect, use } from "react";
import { Heart, Check, Clock, Eye, Share2, Copy, RefreshCw } from "lucide-react";
import { getProposalStatus, ProposalStatus } from "@/lib/api";
import FloatingHearts from "@/components/FloatingHearts";

interface PageParams {
    params: Promise<{ id: string }>;
}

export default function StatusPage({ params }: PageParams) {
    const { id } = use(params);
    const [status, setStatus] = useState<ProposalStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const fetchStatus = async () => {
        try {
            const data = await getProposalStatus(id);
            setStatus(data);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Could not find this proposal.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        // Poll every 10 seconds for updates
        const interval = setInterval(fetchStatus, 10000);
        return () => clearInterval(interval);
    }, [id]);

    const handleCopyLink = () => {
        if (status?.slug) {
            const url = `${window.location.origin}/p/${status.slug}`;
            navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShare = () => {
        if (status?.slug) {
            const url = `${window.location.origin}/p/${status.slug}`;
            const text = `${status.partnerName}, someone has a special message for you! 💕`;
            window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
        }
    };

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

    if (error || !status) {
        return (
            <div className="min-h-screen bg-romantic-gradient flex items-center justify-center px-4">
                <div className="glass-card p-8 text-center max-w-md">
                    <div className="text-6xl mb-4">🔍</div>
                    <h1 className="text-2xl font-bold text-romantic-800 mb-2">
                        Proposal Not Found
                    </h1>
                    <p className="text-romantic-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-romantic-gradient relative overflow-hidden">
            <FloatingHearts />

            <div className="relative z-10 py-12 px-4">
                <div className="max-w-lg mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <Heart className="w-12 h-12 text-romantic-500 fill-romantic-500 mx-auto mb-4" />
                        <h1 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-playfair)] text-romantic-800 mb-2">
                            Proposal Status
                        </h1>
                        <p className="text-romantic-600">
                            For {status.partnerName}
                        </p>
                    </motion.div>

                    {/* Status Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-8 text-center mb-6"
                    >
                        {status.isAccepted ? (
                            // ACCEPTED!
                            <>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", duration: 0.8 }}
                                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <Check className="w-12 h-12 text-green-500" />
                                </motion.div>
                                <h2 className="text-3xl font-bold text-green-600 mb-2">
                                    🎉 THEY SAID YES! 🎉
                                </h2>
                                <p className="text-romantic-600 mb-4">
                                    {status.partnerName} accepted your proposal!
                                </p>
                                {status.acceptedAt && (
                                    <p className="text-sm text-romantic-400">
                                        Accepted on {new Date(status.acceptedAt).toLocaleString()}
                                    </p>
                                )}
                            </>
                        ) : status.isPaid ? (
                            // Waiting for response
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                    className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <Clock className="w-12 h-12 text-yellow-500" />
                                </motion.div>
                                <h2 className="text-2xl font-bold text-yellow-600 mb-2">
                                    Waiting for Response...
                                </h2>
                                <p className="text-romantic-600 mb-4">
                                    Your proposal is live! Share it with {status.partnerName}.
                                </p>
                                <p className="text-sm text-romantic-400">
                                    This page auto-refreshes every 10 seconds
                                </p>
                            </>
                        ) : (
                            // Not paid yet
                            <>
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Heart className="w-12 h-12 text-gray-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-600 mb-2">
                                    Payment Pending
                                </h2>
                                <p className="text-romantic-600">
                                    Complete the payment to activate your proposal.
                                </p>
                            </>
                        )}
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card p-6 mb-6"
                    >
                        <div className="flex items-center justify-center gap-2 text-romantic-600">
                            <Eye className="w-5 h-5" />
                            <span className="text-lg font-semibold">{status.viewsCount} views</span>
                        </div>
                    </motion.div>

                    {/* Share Buttons (only if paid) */}
                    {status.isPaid && status.slug && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex gap-4 justify-center"
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
                    )}

                    {/* Refresh Button */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-center mt-8"
                    >
                        <button
                            onClick={() => { setLoading(true); fetchStatus(); }}
                            className="flex items-center gap-2 mx-auto text-romantic-500 hover:text-romantic-600 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh Status
                        </button>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
