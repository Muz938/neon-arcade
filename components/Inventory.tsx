"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Check, Shield, User, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function Inventory() {
    const inventory = useQuery(api.shop.getUserInventory);
    const profile = useQuery(api.users.getProfile);
    const equipItem = useMutation(api.shop.equipItem);

    const [loading, setLoading] = useState<string | null>(null);

    if (!inventory || !profile) {
        return <Loader2 className="w-8 h-8 animate-spin mx-auto mt-20 text-cyan-400" />;
    }

    const handleEquip = async (inventoryId: any) => {
        setLoading(inventoryId);
        try {
            await equipItem({ inventoryId });
            toast.success("Item equipped!");
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setLoading(null);
        }
    };

    const equippedSkin = inventory.find(i => i.isEquipped && i.item?.type === 'skin');

    return (
        <div className="space-y-8">
            {/* Profile Card with Active Skin */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-50" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-zinc-800 bg-zinc-800">
                            {profile.image ? (
                                <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-700">
                                    <User className="w-16 h-16" />
                                </div>
                            )}
                        </div>
                        {profile.isPremium && (
                            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl border-4 border-zinc-900">
                                <Shield className="w-4 h-4 text-white" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-2">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <h2 className="text-4xl font-black tracking-tighter uppercase italic">{profile.name}</h2>
                            {profile.isPremium && (
                                <span className="bg-purple-500/20 text-purple-400 text-[10px] font-black px-2 py-0.5 rounded border border-purple-500/50">PREMIUM</span>
                            )}
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-6 text-zinc-500 font-bold uppercase tracking-widest text-xs">
                            <div className="flex items-center gap-2">
                                <span className="text-cyan-400 italic">Level</span> {profile.level}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-cyan-400 italic">XP</span> {profile.xp}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-cyan-400 italic">Skin</span> {equippedSkin?.item?.name || "None"}
                            </div>
                        </div>
                    </div>

                    <button className="bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 p-4 rounded-2xl flex flex-col items-center gap-1 transition-colors">
                        <span className="text-[10px] font-black text-zinc-500">EXPERIENCE</span>
                        <div className="w-32 h-2 bg-zinc-900 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 w-[60%]" />
                        </div>
                    </button>
                </div>
            </div>

            {/* Inventory Grid */}
            <div className="space-y-6">
                <h3 className="text-xl font-black italic tracking-tight flex items-center gap-2">
                    <Package className="w-6 h-6 text-cyan-400" />
                    YOUR COLLECTION
                </h3>

                {inventory.length === 0 ? (
                    <div className="p-12 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
                        <p className="text-zinc-500 font-bold">Your collection is empty. Visit the shop!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {inventory.map((inv: any) => (
                            <motion.div
                                key={inv._id}
                                whileHover={{ y: -5 }}
                                className={`bg-zinc-900 border ${inv.isEquipped ? 'border-cyan-500' : 'border-zinc-800'} p-4 rounded-2xl relative group overflow-hidden`}
                            >
                                {inv.isEquipped && (
                                    <div className="absolute top-2 right-2 z-10">
                                        <div className="bg-cyan-500 p-1 rounded-lg">
                                            <Check className="w-3 h-3 text-black font-black" />
                                        </div>
                                    </div>
                                )}

                                <div className="aspect-square bg-zinc-800 rounded-xl mb-3 flex items-center justify-center relative">
                                    {inv.giftedBy && (
                                        <div className="absolute top-1 left-1">
                                            <Sparkles className="w-4 h-4 text-amber-400 drop-shadow" />
                                        </div>
                                    )}
                                    <img src={inv.item?.imageUrl || "/placeholder-skin.png"} className="w-12 h-12 opacity-50 grayscale" />
                                </div>

                                <div className="text-center space-y-2">
                                    <p className="text-xs font-black uppercase truncate">{inv.item?.name}</p>
                                    <button
                                        disabled={inv.isEquipped || loading === inv._id}
                                        onClick={() => handleEquip(inv._id)}
                                        className={`w-full py-1.5 rounded-lg text-[10px] font-black transition-all ${inv.isEquipped
                                                ? 'bg-zinc-800 text-zinc-500 cursor-default'
                                                : 'bg-cyan-500 text-black hover:bg-cyan-400'
                                            }`}
                                    >
                                        {loading === inv._id ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : (inv.isEquipped ? "EQUIPPED" : "EQUIP")}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
