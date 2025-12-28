"use client";
import { useGame } from "@/lib/GameContext";
import Login from "@/components/Login";
import Dashboard from "@/components/Dashboard";

export default function Home() {
    const { isAuthenticated, isLoading } = useGame();

    return (
        <main className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #050510 0%, #0a0a20 50%, #050510 100%)' }}>
            {/* Animated grid background */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(0, 243, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 243, 255, 0.03) 1px, transparent 1px)
          `,
                    backgroundSize: '50px 50px',
                }}
            />

            {/* Top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--primary)]/5 blur-[100px] rounded-full" />

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
                {isLoading ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-t-[var(--primary)] border-r-transparent border-b-[var(--secondary)] border-l-transparent rounded-full animate-spin"></div>
                        <div className="text-xl font-display text-[var(--primary)] tracking-widest animate-pulse">INITIALIZING...</div>
                    </div>
                ) : !isAuthenticated ? (
                    <Login />
                ) : (
                    <Dashboard />
                )}
            </div>
        </main>
    );
}
