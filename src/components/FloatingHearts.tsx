"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Heart {
    id: number;
    left: number;
    size: number;
    duration: number;
    delay: number;
    opacity: number;
}

export default function FloatingHearts() {
    const [hearts, setHearts] = useState<Heart[]>([]);

    useEffect(() => {
        // Generate initial hearts
        const initialHearts: Heart[] = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            size: Math.random() * 20 + 15,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5,
            opacity: Math.random() * 0.5 + 0.3,
        }));
        setHearts(initialHearts);

        // Continuously add new hearts
        const interval = setInterval(() => {
            setHearts((prev) => [
                ...prev.slice(-20),
                {
                    id: Date.now(),
                    left: Math.random() * 100,
                    size: Math.random() * 20 + 15,
                    duration: Math.random() * 10 + 10,
                    delay: 0,
                    opacity: Math.random() * 0.5 + 0.3,
                },
            ]);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {hearts.map((heart) => (
                <motion.div
                    key={heart.id}
                    className="absolute text-romantic-400"
                    style={{
                        left: `${heart.left}%`,
                        fontSize: `${heart.size}px`,
                        opacity: heart.opacity,
                    }}
                    initial={{ y: "100vh", rotate: 0, scale: 0 }}
                    animate={{
                        y: "-20vh",
                        rotate: [0, 15, -15, 0],
                        scale: [0, 1, 1, 0.5],
                    }}
                    transition={{
                        duration: heart.duration,
                        delay: heart.delay,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                >
                    💕
                </motion.div>
            ))}
        </div>
    );
}
