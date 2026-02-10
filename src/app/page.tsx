"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import FloatingHearts from "@/components/FloatingHearts";

export default function Home() {
  return (
    <main className="min-h-screen bg-romantic-gradient relative overflow-hidden">
      <FloatingHearts />

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20 text-center">
        {/* Decorative elements */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1.5 }}
          className="mb-8"
        >
          <div className="relative">
            <Heart className="w-24 h-24 text-romantic-500 fill-romantic-500" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0"
            >
              <Sparkles className="w-24 h-24 text-romantic-300" />
            </motion.div>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold font-[family-name:var(--font-playfair)] text-romantic-800 mb-6 leading-tight"
        >
          Create a Magical
          <br />
          <span className="text-gradient">Valentine Proposal</span>
          <br />
          in 2 Minutes 💖
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg md:text-xl text-romantic-600 max-w-2xl mb-10 font-[family-name:var(--font-outfit)]"
        >
          Surprise your special someone with a personalized, interactive proposal website.
          Make them smile, laugh, and say <span className="font-bold text-romantic-500">YES!</span>
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Link href="/create">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-romantic-gradient-dark text-white px-10 py-5 rounded-full text-xl font-semibold shadow-2xl animate-pulse-glow flex items-center gap-3 hover:shadow-romantic-500/50 transition-all duration-300"
            >
              Create My Proposal
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <ArrowRight className="w-6 h-6" />
              </motion.span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Price tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 glass-card px-6 py-3"
        >
          <p className="text-romantic-600 text-sm">
            Only <span className="font-bold text-romantic-500">₹10</span> per proposal •
            Unlimited views • Forever yours
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full px-2"
        >
          {[
            { emoji: "✨", title: "Personalized", desc: "Add your names, photos & love story" },
            { emoji: "🎉", title: "Interactive", desc: "Playful YES/NO buttons with confetti" },
            { emoji: "💌", title: "Shareable", desc: "Send via WhatsApp or any messenger" },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.1 }}
              className="glass-card p-6 text-center"
            >
              <span className="text-4xl mb-3 block">{feature.emoji}</span>
              <h3 className="font-semibold text-romantic-700 mb-2">{feature.title}</h3>
              <p className="text-sm text-romantic-500">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-romantic-400 text-sm">
        Made with 💖 by OnlyYes
      </footer>
    </main>
  );
}
