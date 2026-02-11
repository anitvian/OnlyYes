"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    Heart,
    User,
    Calendar,
    MessageCircle,
    Image as ImageIcon,
    Music,
    Sparkles,
    Upload,
    X,
    Loader2,
} from "lucide-react";
import FloatingHearts from "@/components/FloatingHearts";
import { createProposal, uploadPhotos } from "@/lib/api";

export default function CreatePage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        yourName: "",
        partnerName: "",
        specialDate: "",
        loveMessage: "",
        favoriteMemory: "",
        futureDreams: "",
        musicUrl: "",
    });

    const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // YES/NO preview state
    const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
    const [previewYesClicked, setPreviewYesClicked] = useState(false);
    const [noMoveCount, setNoMoveCount] = useState(0);

    const moveNoButton = () => {
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 100;
        setNoButtonPosition({ x, y });
        setNoMoveCount((c) => c + 1);
    };

    const handlePreviewYes = () => {
        setPreviewYesClicked(true);
        setTimeout(() => setPreviewYesClicked(false), 2000);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newPhotos = Array.from(files).map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setPhotos((prev) => [...prev, ...newPhotos].slice(0, 10)); // Max 10 photos
    };

    const removePhoto = (index: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.yourName.trim() || !formData.partnerName.trim()) {
            setError("Please fill in your name and your partner's name");
            return;
        }

        if (!formData.loveMessage.trim()) {
            setError("Please write a love message");
            return;
        }

        setIsSubmitting(true);

        try {
            // Upload photos and convert to base64
            const photoUrls = photos.length > 0
                ? await uploadPhotos(photos.map((p) => p.file))
                : [];

            // Create proposal
            const result = await createProposal({
                ...formData,
                photos: photoUrls,
            });

            // Redirect to payment page with proposal ID
            router.push(`/payment?id=${result.id}`);
        } catch (err) {
            console.error(err);
            setError("Failed to create proposal. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-romantic-gradient relative overflow-hidden">
            <FloatingHearts />

            <div className="relative z-10 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-10"
                    >
                        <Heart className="w-12 h-12 text-romantic-500 fill-romantic-500 mx-auto mb-4" />
                        <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-playfair)] text-romantic-800 mb-2">
                            Create Your Proposal
                        </h1>
                        <p className="text-romantic-600">
                            Fill in the details to create a magical surprise 💕
                        </p>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        onSubmit={handleSubmit}
                        className="glass-card p-8 space-y-6"
                    >
                        {/* Names Row */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-2 text-romantic-700 font-medium mb-2">
                                    <User className="w-4 h-4" />
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    name="yourName"
                                    value={formData.yourName}
                                    onChange={handleInputChange}
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-3 rounded-xl border border-romantic-200 focus:border-romantic-400 focus:ring-2 focus:ring-romantic-200 outline-none transition-all bg-white/50"
                                    required
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-romantic-700 font-medium mb-2">
                                    <Heart className="w-4 h-4" />
                                    Partner&apos;s Name
                                </label>
                                <input
                                    type="text"
                                    name="partnerName"
                                    value={formData.partnerName}
                                    onChange={handleInputChange}
                                    placeholder="Your special someone's name"
                                    className="w-full px-4 py-3 rounded-xl border border-romantic-200 focus:border-romantic-400 focus:ring-2 focus:ring-romantic-200 outline-none transition-all bg-white/50"
                                    required
                                />
                            </div>
                        </div>

                        {/* Special Date */}
                        <div>
                            <label className="flex items-center gap-2 text-romantic-700 font-medium mb-2">
                                <Calendar className="w-4 h-4" />
                                Special Date (optional)
                            </label>
                            <input
                                type="date"
                                name="specialDate"
                                value={formData.specialDate}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl border border-romantic-200 focus:border-romantic-400 focus:ring-2 focus:ring-romantic-200 outline-none transition-all bg-white/50"
                            />
                        </div>

                        {/* Love Message */}
                        <div>
                            <label className="flex items-center gap-2 text-romantic-700 font-medium mb-2">
                                <MessageCircle className="w-4 h-4" />
                                Your Love Message 💌
                            </label>
                            <textarea
                                name="loveMessage"
                                value={formData.loveMessage}
                                onChange={handleInputChange}
                                placeholder="Write a heartfelt message to your partner..."
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-romantic-200 focus:border-romantic-400 focus:ring-2 focus:ring-romantic-200 outline-none transition-all bg-white/50 resize-none"
                                required
                            />
                        </div>

                        {/* Favorite Memory */}
                        <div>
                            <label className="flex items-center gap-2 text-romantic-700 font-medium mb-2">
                                <Sparkles className="w-4 h-4" />
                                Favorite Memory Together
                            </label>
                            <textarea
                                name="favoriteMemory"
                                value={formData.favoriteMemory}
                                onChange={handleInputChange}
                                placeholder="Share your favorite memory together..."
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-romantic-200 focus:border-romantic-400 focus:ring-2 focus:ring-romantic-200 outline-none transition-all bg-white/50 resize-none"
                            />
                        </div>

                        {/* Future Dreams */}
                        <div>
                            <label className="flex items-center gap-2 text-romantic-700 font-medium mb-2">
                                <Sparkles className="w-4 h-4" />
                                Dreams for the Future
                            </label>
                            <textarea
                                name="futureDreams"
                                value={formData.futureDreams}
                                onChange={handleInputChange}
                                placeholder="What do you dream of for your future together?"
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-romantic-200 focus:border-romantic-400 focus:ring-2 focus:ring-romantic-200 outline-none transition-all bg-white/50 resize-none"
                            />
                        </div>

                        {/* Photo Upload */}
                        <div>
                            <label className="flex items-center gap-2 text-romantic-700 font-medium mb-2">
                                <ImageIcon className="w-4 h-4" />
                                Upload Photos (optional, max 10)
                            </label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handlePhotoUpload}
                                accept="image/*"
                                multiple
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full p-6 border-2 border-dashed border-romantic-300 rounded-xl hover:border-romantic-400 transition-colors flex flex-col items-center justify-center gap-2 text-romantic-500 hover:text-romantic-600 bg-white/30"
                            >
                                <Upload className="w-8 h-8" />
                                <span>Click to upload photos</span>
                            </button>

                            {/* Photo Previews */}
                            {photos.length > 0 && (
                                <div className="mt-4 grid grid-cols-4 md:grid-cols-5 gap-3">
                                    {photos.map((photo, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={photo.preview}
                                                alt={`Upload ${index + 1}`}
                                                className="w-full aspect-square object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removePhoto(index)}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-romantic-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Music URL */}
                        <div>
                            <label className="flex items-center gap-2 text-romantic-700 font-medium mb-2">
                                <Music className="w-4 h-4" />
                                Background Music URL (optional)
                            </label>
                            <input
                                type="url"
                                name="musicUrl"
                                value={formData.musicUrl}
                                onChange={handleInputChange}
                                placeholder="Paste a music URL (YouTube, SoundCloud, etc.)"
                                className="w-full px-4 py-3 rounded-xl border border-romantic-200 focus:border-romantic-400 focus:ring-2 focus:ring-romantic-200 outline-none transition-all bg-white/50"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* YES/NO Button Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-6 text-center"
                        >
                            <h3 className="text-romantic-500 font-semibold mb-2 flex items-center justify-center gap-2">
                                🎮 Preview: How your proposal will look
                            </h3>
                            <p className="text-romantic-400 text-sm mb-6">Try clicking the buttons!</p>

                            {previewYesClicked ? (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="py-4"
                                >
                                    <p className="text-3xl mb-2">🎉</p>
                                    <p className="text-romantic-700 font-bold text-lg">
                                        {formData.partnerName || "Your Partner"} said YES!
                                    </p>
                                </motion.div>
                            ) : (
                                <div className="flex gap-6 items-center justify-center relative min-h-[80px]">
                                    <motion.button
                                        type="button"
                                        onClick={handlePreviewYes}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-10 py-4 bg-romantic-gradient-dark text-white text-xl font-bold rounded-full shadow-2xl animate-pulse-glow"
                                    >
                                        YES 💖
                                    </motion.button>

                                    {noMoveCount < 5 && (
                                        <motion.button
                                            type="button"
                                            animate={{ x: noButtonPosition.x, y: noButtonPosition.y }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            onMouseEnter={moveNoButton}
                                            onClick={moveNoButton}
                                            className="px-10 py-4 bg-gray-200 text-gray-600 text-xl font-bold rounded-full shadow-lg hover:bg-gray-300 transition-colors"
                                        >
                                            NO 😢
                                        </motion.button>
                                    )}
                                </div>
                            )}

                            {noMoveCount >= 5 && !previewYesClicked && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-2 text-romantic-600 text-sm"
                                >
                                    The NO button ran away! 😅 Just click YES already!
                                </motion.p>
                            )}
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                            className="w-full bg-romantic-gradient-dark text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-romantic-500/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating your proposal...
                                </>
                            ) : (
                                <>
                                    Continue to Payment
                                    <Heart className="w-5 h-5 fill-white" />
                                </>
                            )}
                        </motion.button>

                        <p className="text-center text-romantic-400 text-sm">
                            Only ₹10 • Secure payment via Razorpay 🔒
                        </p>
                    </motion.form>
                </div>
            </div>
        </main>
    );
}
