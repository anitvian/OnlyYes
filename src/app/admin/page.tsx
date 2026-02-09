"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Heart, Users, Eye, IndianRupee, RefreshCw } from "lucide-react";
import { getAdminStats, getAdminProposals, AdminStats, Proposal } from "@/lib/api";

export default function AdminPage() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsData, proposalsData] = await Promise.all([
                getAdminStats(),
                getAdminProposals(),
            ]);
            setStats(statsData);
            setProposals(proposalsData);
        } catch (err) {
            console.error(err);
            setError("Failed to load admin data. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                    <RefreshCw className="w-8 h-8 text-romantic-500" />
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
                    <div className="text-5xl mb-4">⚠️</div>
                    <h1 className="text-xl font-bold text-gray-800 mb-2">Connection Error</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchData}
                        className="px-4 py-2 bg-romantic-500 text-white rounded-lg hover:bg-romantic-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Heart className="w-8 h-8 text-romantic-500 fill-romantic-500" />
                        <h1 className="text-xl font-bold text-gray-800">OnlyYes Admin</h1>
                    </div>
                    <button
                        onClick={fetchData}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-romantic-500 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-romantic-100 rounded-xl">
                                <Users className="w-6 h-6 text-romantic-500" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Total Proposals</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {stats?.totalProposals || 0}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <Heart className="w-6 h-6 text-green-500 fill-green-500" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Paid Proposals</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {stats?.paidProposals || 0}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <Eye className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Total Views</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {stats?.totalViews || 0}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 rounded-xl">
                                <IndianRupee className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    ₹{stats?.totalRevenue || 0}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Proposals Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                    <div className="px-6 py-4 border-b">
                        <h2 className="text-lg font-semibold text-gray-800">Recent Proposals</h2>
                    </div>

                    {proposals.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>No proposals yet. Share your link to get started!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Proposal
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Views
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Link
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {proposals.map((proposal) => (
                                        <tr key={proposal.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {proposal.yourName} → {proposal.partnerName}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate max-w-xs">
                                                        {proposal.loveMessage.substring(0, 50)}...
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-3 py-1 text-xs font-medium rounded-full ${proposal.isPaid
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                >
                                                    {proposal.isPaid ? "Paid" : "Draft"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                {proposal.viewsCount}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                                                {new Date(proposal.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {proposal.slug ? (
                                                    <a
                                                        href={`/p/${proposal.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-romantic-500 hover:text-romantic-600 text-sm"
                                                    >
                                                        View →
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
