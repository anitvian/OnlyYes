"use client";

import { motion } from "framer-motion";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, CreditCard, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import FloatingHearts from "@/components/FloatingHearts";
import { createPaymentOrder, verifyPayment } from "@/lib/api";
import {
    loadRazorpayScript,
    openRazorpayCheckout,
    createRazorpayOptions,
} from "@/lib/razorpay";

function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const proposalId = searchParams.get("id");

    const [status, setStatus] = useState<"loading" | "ready" | "processing" | "success" | "error">("loading");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!proposalId) {
            router.push("/create");
            return;
        }

        // Load Razorpay script
        loadRazorpayScript().then((loaded) => {
            if (loaded) {
                setStatus("ready");
            } else {
                setError("Failed to load payment gateway. Please refresh the page.");
                setStatus("error");
            }
        });
    }, [proposalId, router]);

    const handlePayment = async () => {
        if (!proposalId) return;

        setStatus("processing");
        setError("");

        try {
            // Create Razorpay order
            const order = await createPaymentOrder(proposalId);

            // Open Razorpay checkout
            const options = createRazorpayOptions(
                order.orderId,
                order.amount,
                proposalId,
                async (response) => {
                    // Verify payment on success
                    try {
                        const result = await verifyPayment({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            proposalId,
                        });

                        setStatus("success");

                        // Redirect to status page so creator can track acceptance
                        setTimeout(() => {
                            router.push(`/status/${proposalId}`);
                        }, 2000);
                    } catch (err) {
                        console.error(err);
                        setError("Payment verification failed. Please contact support.");
                        setStatus("error");
                    }
                },
                () => {
                    // On dismiss
                    setStatus("ready");
                }
            );

            openRazorpayCheckout(options);
        } catch (err: any) {
            console.error('Payment Error:', err);
            // Show the actual error message if available
            setError(err.message || "Failed to initiate payment. Please try again.");
            setStatus("error");
        }
    };

    return (
        <main className="min-h-screen bg-romantic-gradient relative overflow-hidden flex items-center justify-center">
            <FloatingHearts />

            <div className="relative z-10 px-4 w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 text-center"
                >
                    {/* Success State */}
                    {status === "success" && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="py-8"
                        >
                            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-romantic-800 mb-2">
                                Payment Successful! 🎉
                            </h2>
                            <p className="text-romantic-600 mb-2">
                                Your proposal is ready!
                            </p>
                            <p className="text-romantic-500 text-sm mb-4">
                                Redirecting to your status page where you can track when they respond...
                            </p>
                            <Loader2 className="w-6 h-6 animate-spin mx-auto text-romantic-500" />
                        </motion.div>
                    )}

                    {/* Error State */}
                    {status === "error" && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="py-8"
                        >
                            <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-romantic-800 mb-2">
                                Oops! Something went wrong
                            </h2>
                            <p className="text-red-600 mb-6">{error}</p>
                            <button
                                onClick={() => setStatus("ready")}
                                className="px-6 py-3 bg-romantic-500 text-white rounded-xl font-semibold hover:bg-romantic-600 transition-colors"
                            >
                                Try Again
                            </button>
                        </motion.div>
                    )}

                    {/* Ready/Loading/Processing State */}
                    {(status === "loading" || status === "ready" || status === "processing") && (
                        <>
                            <Heart className="w-16 h-16 text-romantic-500 fill-romantic-500 mx-auto mb-6" />

                            <h2 className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-romantic-800 mb-2">
                                Complete Your Payment
                            </h2>

                            <p className="text-romantic-600 mb-8">
                                Just one more step to create your magical proposal! 💕
                            </p>

                            {/* Price Card */}
                            <div className="bg-gradient-to-r from-romantic-500 to-pink-500 text-white rounded-2xl p-6 mb-8">
                                <div className="text-4xl font-bold mb-1">₹10</div>
                                <div className="text-romantic-100 text-sm">One-time payment</div>
                            </div>

                            {/* What you get */}
                            <div className="text-left mb-8 space-y-3">
                                <div className="flex items-center gap-3 text-romantic-600">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span>Personalized proposal page</span>
                                </div>
                                <div className="flex items-center gap-3 text-romantic-600">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span>Unlimited views forever</span>
                                </div>
                                <div className="flex items-center gap-3 text-romantic-600">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span>Share via WhatsApp & more</span>
                                </div>
                                <div className="flex items-center gap-3 text-romantic-600">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span>Confetti & animations included</span>
                                </div>
                            </div>

                            {/* Pay Button */}
                            <motion.button
                                onClick={handlePayment}
                                disabled={status !== "ready"}
                                whileHover={{ scale: status === "ready" ? 1.02 : 1 }}
                                whileTap={{ scale: status === "ready" ? 0.98 : 1 }}
                                className="w-full bg-romantic-gradient-dark text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-romantic-500/30 transition-all disabled:opacity-70 flex items-center justify-center gap-3"
                            >
                                {status === "loading" || status === "processing" ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {status === "loading" ? "Loading..." : "Processing..."}
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        Pay ₹10 with Razorpay
                                    </>
                                )}
                            </motion.button>

                            <p className="mt-4 text-romantic-400 text-xs">
                                Secure payment powered by Razorpay
                            </p>
                        </>
                    )}
                </motion.div>
            </div>
        </main>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-romantic-gradient flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-romantic-500" />
            </div>
        }>
            <PaymentContent />
        </Suspense>
    );
}
