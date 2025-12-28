"use client";
import { useGame } from "@/lib/GameContext";
import { useState } from "react";

export default function Login() {
    const { signIn } = useGame();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        await signIn();
        setIsLoading(false);
    };

    return (
        <div className="glass-panel p-8 max-w-md w-full text-center border-t-4 border-t-[var(--primary)] relative overflow-hidden">
            {/* Animated top line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent animate-pulse"></div>

            {/* Glowing orb */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-[var(--primary)]/20 blur-[60px] rounded-full"></div>

            <h1 className="text-4xl md:text-6xl font-display mb-2 neon-text-primary tracking-wider">ARCADE</h1>
            <h2 className="text-2xl font-display mb-8 text-[var(--secondary)] tracking-[0.3em]">NEXUS</h2>

            <p className="text-gray-400 mb-8 font-mono text-sm tracking-wide">
        // Authenticate to synchronize neural link...
            </p>

            <div className="flex flex-col gap-4">
                <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="btn-primary w-full group relative disabled:opacity-50"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-t-transparent border-[var(--primary)] rounded-full animate-spin"></span>
                            CONNECTING...
                        </span>
                    ) : (
                        "INITIALIZE LINK"
                    )}
                </button>

                <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="btn-primary w-full border-[var(--secondary)] text-[var(--secondary)] hover:bg-[var(--secondary)] hover:text-black hover:shadow-[0_0_20px_rgba(255,0,255,0.5)] disabled:opacity-50"
                >
                    GUEST ACCESS
                </button>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10">
                <div className="text-xs text-gray-600 uppercase tracking-widest font-mono">
                    System v1.0.4 // Status: <span className="text-[var(--accent)]">OPERATIONAL</span>
                </div>
            </div>
        </div>
    );
}
