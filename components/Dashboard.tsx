"use client";
import { useGame } from "@/lib/GameContext";
import { LogOut, Trophy, User, Gamepad2, ShoppingBag, Package, Shield, Coins, Gem, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GameCard from "./GameCard";
import { Shop } from "./Shop";
import { Inventory } from "./Inventory";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
    const { signOut, profile } = useGame();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"games" | "shop" | "inventory">("games");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (!profile) return (
        <div className="flex flex-col items-center gap-6 p-20">
            <div className="w-16 h-16 border-4 border-t-cyan-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
            <div className="text-cyan-500 font-mono animate-pulse tracking-[0.3em] font-black text-xs">SYNCHRONIZING PROFILE...</div>
        </div>
    );

    const tabs = [
        { id: "games", label: "GAMES", icon: Gamepad2 },
        { id: "shop", label: "SHOP", icon: ShoppingBag },
        { id: "inventory", label: "COLLECTION", icon: Package },
    ];

    return (
        <div className="w-full max-w-7xl flex flex-col min-h-screen">
            {/* Top Navigation Bar */}
            <nav className="p-4 md:p-6 flex justify-between items-center bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50 border-b border-zinc-900">
                <div className="flex items-center gap-8">
                    <div className="flex flex-col">
                        <span className="font-display text-xl leading-none italic font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">ARCADE NEXUS</span>
                        <span className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase">System v2.0.1</span>
                    </div>

                    <div className="hidden md:flex gap-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-6 py-2 rounded-xl text-xs font-black tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id
                                    ? "bg-zinc-900 text-cyan-400 border border-zinc-800"
                                    : "text-zinc-600 hover:text-zinc-300"}`}
                            >
                                <tab.icon size={14} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <Gem size={14} className="text-cyan-400" />
                        <span className="text-xs font-black">{profile.gems}</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <Coins size={14} className="text-yellow-500" />
                        <span className="text-xs font-black">{profile.coins}</span>
                    </div>

                    <button
                        onClick={() => signOut()}
                        className="p-2.5 bg-zinc-900 border border-zinc-800 hover:border-red-500/50 hover:text-red-400 rounded-xl transition-all"
                    >
                        <LogOut size={18} />
                    </button>

                    <button className="md:hidden p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <Menu size={18} />
                    </button>
                </div>
            </nav>

            {/* Main View Area */}
            <main className="flex-1 overflow-x-hidden pt-4">
                <AnimatePresence mode="wait">
                    {activeTab === "games" && (
                        <motion.div
                            key="games"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="p-4 md:p-8 space-y-12"
                        >
                            <section className="space-y-6">
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                                    <div className="w-1 h-8 bg-cyan-500"></div>
                                    Battle Ground
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                            </section>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <section className="lg:col-span-2 bg-zinc-900/40 border border-zinc-900 rounded-3xl p-8 space-y-6">
                                    <h3 className="text-xl font-black italic tracking-tight flex items-center gap-2">
                                        <Trophy className="text-yellow-500" /> WORLD RANKINGS
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { rank: 1, name: "NeonMaster", xp: 12900, skin: "Diamond" },
                                            { rank: 2, name: "CyberWolf", xp: 9750, skin: "Gold" },
                                            { rank: 3, name: profile.name, xp: profile.xp, skin: "Current" },
                                        ].map((player, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-900 rounded-2xl">
                                                <div className="flex items-center gap-4">
                                                    <span className={`text-xl font-black italic ${idx === 0 ? 'text-yellow-500' : 'text-zinc-600'}`}>#0{player.rank}</span>
                                                    <div>
                                                        <p className="font-bold text-sm uppercase">{player.name}</p>
                                                        <p className="text-[10px] font-black text-zinc-600 tracking-widest">{player.xp} XP / {player.skin} SKIN</p>
                                                    </div>
                                                </div>
                                                <button className="text-[10px] font-black text-cyan-500 border border-cyan-500/30 px-3 py-1 rounded-lg hover:bg-cyan-500 hover:text-black transition-all">VIEW</button>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/20 rounded-3xl p-8 flex flex-col justify-between items-center text-center space-y-4">
                                    <Shield className="w-16 h-16 text-purple-400" />
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black italic">ELITE ACCESS</h3>
                                        <p className="text-xs text-zinc-400 font-bold leading-relaxed px-4">Unlock exclusive skins, monthly gem drops, and a special profile badge.</p>
                                    </div>
                                    <button className="w-full bg-white text-black font-black py-4 rounded-2xl text-xs tracking-widest hover:scale-105 transition-all">CONNECT NITRO</button>
                                </section>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "shop" && (
                        <motion.div
                            key="shop"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <Shop />
                        </motion.div>
                    )}

                    {activeTab === "inventory" && (
                        <motion.div
                            key="inventory"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="p-4 md:p-8"
                        >
                            <Inventory />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
