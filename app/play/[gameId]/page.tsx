"use client";
import TicTacToe from "@/components/games/TicTacToe";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Wifi } from "lucide-react";
import { Suspense } from "react";

function GameContent({ gameId }: { gameId: string }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const mode = (searchParams.get("mode") as 'local' | 'ai' | 'online') || 'ai';

    const renderGame = () => {
        switch (gameId) {
            case 'tictactoe':
                return <TicTacToe mode={mode} onExit={() => router.push('/')} />;
            case 'pong':
            case 'memory':
                return (
                    <div className="text-center p-10 glass-panel max-w-md mx-auto">
                        <div className="text-6xl mb-6">🚧</div>
                        <h1 className="text-2xl text-[var(--primary)] font-display mb-4">COMING SOON</h1>
                        <p className="text-gray-400 mb-6">This game module is currently under development.</p>
                        <button onClick={() => router.push('/')} className="btn-primary">
                            Return to Hub
                        </button>
                    </div>
                );
            default:
                return (
                    <div className="text-center p-10 glass-panel max-w-md mx-auto">
                        <div className="text-6xl mb-6">❓</div>
                        <h1 className="text-2xl text-[var(--primary)] font-display mb-4">MODULE NOT FOUND</h1>
                        <p className="text-gray-400 mb-6">Game cartridge not found or corrupted.</p>
                        <button onClick={() => router.push('/')} className="btn-primary">
                            Return to Hub
                        </button>
                    </div>
                );
        }
    };

    return (
        <>
            {/* Top bar */}
            <div className="relative z-10 p-4 flex items-center justify-between border-b border-white/5">
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                >
                    <ArrowLeft size={20} />
                    <span className="font-mono text-sm">ARCADE_HUB</span>
                </button>

                <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-gray-500">MODE:</span>
                    <span className={`px-2 py-1 rounded ${mode === 'online' ? 'bg-green-500/20 text-green-400' :
                            mode === 'ai' ? 'bg-purple-500/20 text-purple-400' :
                                'bg-blue-500/20 text-blue-400'
                        }`}>
                        {mode === 'online' && <Wifi size={12} className="inline mr-1" />}
                        {mode === 'ai' && '🤖 '}
                        {mode === 'local' && '👥 '}
                        {mode.toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Game area */}
            <div className="relative z-10 flex-1 flex items-center justify-center p-4">
                {renderGame()}
            </div>
        </>
    );
}

export default function PlayPage({ params }: { params: { gameId: string } }) {
    return (
        <main className="min-h-screen relative overflow-hidden flex flex-col" style={{ background: 'linear-gradient(180deg, #050510 0%, #0a0a20 100%)' }}>
            {/* Grid background */}
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(0, 243, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 243, 255, 0.05) 1px, transparent 1px)
          `,
                    backgroundSize: '40px 40px',
                }}
            />

            <Suspense fallback={
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-t-[var(--primary)] border-r-transparent border-b-[var(--secondary)] border-l-transparent rounded-full animate-spin"></div>
                </div>
            }>
                <GameContent gameId={params.gameId} />
            </Suspense>
        </main>
    );
}
