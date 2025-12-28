"use client";
import { useGame } from "@/lib/GameContext";
import { LogOut, Trophy, User, Gamepad2, Globe, Star, Coins, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import GameCard from "./GameCard";

export default function Dashboard() {
    const { signOut, profile, addXP, addCoins } = useGame();
    const router = useRouter();

    if (!profile) return (
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-t-[var(--primary)] border-r-transparent border-b-[var(--secondary)] border-l-transparent rounded-full animate-spin"></div>
            <div className="text-[var(--primary)] font-mono animate-pulse tracking-widest">LOADING PROFILE...</div>
        </div>
    );

    return (
        <div className="w-full max-w-6xl glass-panel min-h-[80vh] flex flex-col overflow-hidden">

            {/* HUD Header */}
            <header className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center bg-black/40 gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-16 h-16 rounded-lg border-2 border-[var(--primary)] bg-slate-800 overflow-hidden relative group shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                        <img
                            src={profile.image || `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${profile._id}`}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-[var(--primary)]/20 hidden group-hover:flex items-center justify-center cursor-pointer">
                            <User size={20} />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-display text-2xl text-white uppercase tracking-wider">{profile.name}</h3>
                        <div className="flex gap-2 text-xs font-mono mt-2 flex-wrap">
                            <span className="px-2 py-1 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded text-[var(--primary)] flex items-center gap-1">
                                <Star size={12} /> LVL {profile.level}
                            </span>
                            <span className="px-2 py-1 bg-[var(--secondary)]/10 border border-[var(--secondary)]/30 rounded text-[var(--secondary)]">
                                {profile.xp} XP
                            </span>
                            <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-gray-400">
                                {profile.rank}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
                        <Coins size={16} className="text-yellow-400" />
                        <span className="text-yellow-400 font-mono font-bold">{profile.coins}</span>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="p-3 hover:bg-red-500/20 border border-transparent hover:border-red-500/50 rounded-lg text-red-400 transition-all"
                        title="Disconnect"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="p-8 flex-1 overflow-y-auto">
                <div className="mb-8">
                    <h2 className="text-xl font-display text-white mb-6 flex items-center gap-2">
                        <Gamepad2 className="text-[var(--primary)]" />
                        <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">Game Center</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <GameCard
                            title="Neon TicTacToe"
                            description="Classic strategy evolved. Beat the AI or a friend."
                            icon={<div className="text-4xl">❌⭕</div>}
                            color="primary"
                            players="2P"
                            onClick={() => router.push('/play/tictactoe?mode=ai')}
                        />
                        <GameCard
                            title="Cyber Pong"
                            description="High speed physics duel."
                            icon={<div className="text-4xl">🏓</div>}
                            color="secondary"
                            players="2P"
                            onClick={() => router.push('/play/pong?mode=ai')}
                        />
                        <GameCard
                            title="Mind Memory"
                            description="Test your cognitive retention."
                            icon={<div className="text-4xl">🧠</div>}
                            color="accent"
                            players="1P/2P"
                            onClick={() => router.push('/play/memory?mode=ai')}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-panel p-6 bg-black/20">
                        <h3 className="font-display text-lg mb-4 text-gray-300 flex items-center gap-2">
                            <Globe size={18} /> Online Matchmaking
                        </h3>
                        <div
                            onClick={() => router.push('/play/tictactoe?mode=local')}
                            className="p-8 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-4 hover:border-[var(--primary)]/50 transition-colors cursor-pointer group"
                        >
                            <div className="text-4xl group-hover:scale-110 transition-transform">⚔️</div>
                            <div className="text-center">
                                <div className="font-bold text-white">Local Multiplayer</div>
                                <div className="text-xs text-gray-500">Play on same device</div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 bg-black/20">
                        <h3 className="font-display text-lg mb-4 text-gray-300 flex items-center gap-2">
                            <Trophy size={18} /> Leaderboards
                        </h3>
                        <div className="space-y-2">
                            {[
                                { rank: 1, name: "NeonMaster", xp: 2900 },
                                { rank: 2, name: "CyberWolf", xp: 2750 },
                                { rank: 3, name: profile.name, xp: profile.xp },
                            ].sort((a, b) => b.xp - a.xp).map((player, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center justify-between p-3 rounded border transition-colors ${player.name === profile.name
                                            ? 'bg-[var(--primary)]/10 border-[var(--primary)]/30'
                                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    <span className={`font-mono font-bold ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : 'text-amber-600'}`}>
                                        #{idx + 1}
                                    </span>
                                    <span className={player.name === profile.name ? 'text-[var(--primary)]' : 'text-white'}>
                                        {player.name} {player.name === profile.name && '(You)'}
                                    </span>
                                    <span className="text-[var(--primary)] text-sm">{player.xp} XP</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
