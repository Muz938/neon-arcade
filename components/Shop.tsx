"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { motion } from "framer-motion";
import { Gem, Coins, ShieldCheck, Gift, ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is used or I'll provide a fallback

export function Shop() {
    const shopItems = useQuery(api.shop.getShopItems);
    const profile = useQuery(api.users.getProfile);
    const buyItem = useMutation(api.shop.buyItem);
    const giftItem = useMutation(api.shop.giftItem);

    const [isGifting, setIsGifting] = useState(false);
    const [recipient, setRecipient] = useState("");
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [loading, setLoading] = useState<string | null>(null);

    if (!shopItems || !profile) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            </div>
        );
    }

    const handlePurchase = async (itemId: any) => {
        setLoading(itemId);
        try {
            await buyItem({ itemId });
            toast.success("Purchase successful!");
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setLoading(null);
        }
    };

    const handleGift = async () => {
        if (!recipient || !selectedItem) return;
        setLoading(selectedItem._id);
        try {
            await giftItem({ itemId: selectedItem._id, recipientUsername: recipient });
            toast.success(`Gift sent to ${recipient}!`);
            setIsGifting(false);
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Economy Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-500/10 rounded-xl">
                            <Coins className="text-yellow-500 w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-zinc-400 text-sm">Coins</p>
                            <h3 className="text-2xl font-bold">{profile.coins}</h3>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-cyan-500/10 rounded-xl">
                            <Gem className="text-cyan-500 w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-zinc-400 text-sm">Gems</p>
                            <h3 className="text-2xl font-bold">{profile.gems}</h3>
                        </div>
                    </div>
                    <button className="bg-cyan-500 hover:bg-cyan-400 text-black px-3 py-1 rounded-lg text-xs font-bold transition-colors">
                        BUY GEMS
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-zinc-900/50 border border-cyan-500/30 p-6 rounded-2xl flex items-center justify-between group"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl">
                            <ShieldCheck className="text-purple-500 w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-zinc-400 text-sm">Subscription</p>
                            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                {profile.isPremium ? "PREMIUM ACTIVE" : "GET PREMIUM"}
                            </h3>
                        </div>
                    </div>
                    <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl text-xs font-black tracking-widest hover:scale-105 transition-transform">
                        NITRO
                    </button>
                </motion.div>
            </div>

            {/* Shop Grid */}
            <div className="space-y-6">
                <h2 className="text-3xl font-black italic tracking-tighter flex items-center gap-2">
                    <ShoppingBag className="w-8 h-8 text-cyan-400" />
                    ITEM SHOP
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {shopItems.map((item: any, idx) => (
                        <motion.div
                            layout
                            key={item._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 p-4 rounded-2xl space-y-4 group transition-all"
                        >
                            <div className="aspect-square bg-zinc-800 rounded-xl overflow-hidden relative">
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-gradient-to-br from-zinc-800 to-zinc-950">
                                        <ShoppingBag className="w-12 h-12" />
                                    </div>
                                )}
                                {item.isPremiumOnly && (
                                    <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-[10px] font-black px-2 py-0.5 rounded-full text-white shadow-lg">
                                        PREMIUM
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className={`text-[10px] font-black uppercase ${item.rarity === 'legendary' ? 'text-amber-400' :
                                            item.rarity === 'epic' ? 'text-purple-400' :
                                                item.rarity === 'rare' ? 'text-cyan-400' : 'text-zinc-500'
                                        }`}>
                                        {item.rarity}
                                    </span>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase">{item.type}</span>
                                </div>
                                <h4 className="font-bold text-lg leading-tight uppercase tracking-tight">{item.name}</h4>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button
                                    disabled={loading === item._id}
                                    onClick={() => handlePurchase(item._id)}
                                    className="w-full bg-zinc-800 hover:bg-cyan-500 hover:text-black py-2 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                >
                                    {loading === item._id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            {item.currency === 'coins' ? <Coins className="w-4 h-4" /> : <Gem className="w-4 h-4" />}
                                            {item.price}
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedItem(item);
                                        setIsGifting(true);
                                    }}
                                    className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 py-1.5 rounded-xl text-[10px] font-black tracking-widest text-zinc-400 flex items-center justify-center gap-2 transition-all"
                                >
                                    <Gift className="w-3 h-3" /> GIFT
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Gifting Modal */}
            {isGifting && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl w-full max-w-md space-y-6 shadow-2xl">
                        <div className="text-center">
                            <Gift className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-black uppercase italic">Gift {selectedItem?.name}</h2>
                            <p className="text-zinc-400 text-sm">Enter the exact username of the recipient</p>
                        </div>

                        <input
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder="Username..."
                            className="w-full bg-zinc-800 border-2 border-zinc-700 focus:border-cyan-500 p-4 rounded-2xl outline-none transition-all placeholder:text-zinc-600 font-bold"
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsGifting(false)}
                                className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-4 rounded-2xl font-black"
                            >
                                CANCEL
                            </button>
                            <button
                                disabled={loading === selectedItem?._id || !recipient}
                                onClick={handleGift}
                                className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black py-4 rounded-2xl font-black flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading === selectedItem?._id ? <Loader2 className="w-5 h-5 animate-spin" /> : "SEND GIFT"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
