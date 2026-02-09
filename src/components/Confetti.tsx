"use client";

import confetti from "canvas-confetti";
import { useCallback } from "react";

export function useConfetti() {
    const fireConfetti = useCallback(() => {
        // Fire confetti from multiple points
        const count = 200;
        const defaults = {
            origin: { y: 0.7 },
            colors: ["#f43f5e", "#ec4899", "#f97316", "#fb7185", "#fda4af", "#ff6b81"],
        };

        function fire(particleRatio: number, opts: confetti.Options) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio),
            });
        }

        // Burst from left
        fire(0.25, {
            spread: 26,
            startVelocity: 55,
            origin: { x: 0.2, y: 0.7 },
        });

        // Burst from center
        fire(0.35, {
            spread: 60,
            origin: { x: 0.5, y: 0.7 },
        });

        // Burst from right
        fire(0.25, {
            spread: 26,
            startVelocity: 55,
            origin: { x: 0.8, y: 0.7 },
        });

        // Delayed second wave
        setTimeout(() => {
            fire(0.2, {
                spread: 100,
                decay: 0.91,
                scalar: 0.8,
                origin: { x: 0.5, y: 0.5 },
            });
        }, 250);

        // Heart-shaped confetti
        setTimeout(() => {
            confetti({
                particleCount: 50,
                spread: 360,
                origin: { x: 0.5, y: 0.5 },
                shapes: ["circle"],
                colors: ["#f43f5e", "#ec4899"],
                scalar: 2,
            });
        }, 500);
    }, []);

    return { fireConfetti };
}

// Simple component wrapper if needed
export default function Confetti({ trigger }: { trigger: boolean }) {
    const { fireConfetti } = useConfetti();

    if (trigger) {
        fireConfetti();
    }

    return null;
}
