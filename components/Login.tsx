"use client";
import { useGame } from "@/lib/GameContext";
import { useState } from "react";
import { Mail, Github, Chrome, Phone, ArrowRight, Loader2 } from "lucide-react";

export default function Login() {
    const { signIn } = useGame();
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [showEmailInput, setShowEmailInput] = useState(false);

    const handleOAuth = async (provider: string) => {
        setIsLoading(provider);
        try {
            await signIn(provider);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(null);
        }
    };

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading("email");
        try {
            // Using password provider as simple email logic for now
            await signIn("password", { email, flow: "signIn" });
        } catch (e) {
            // If doesn't exist, try signUp
            try {
                await signIn("password", { email, flow: "signUp", password: "dummy-password-for-otp-logic" });
            } catch (err) {
                console.error(err);
            }
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="glass-panel p-8 max-w-md w-full border-t-4 border-t-cyan-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" />

            <div className="text-center mb-8">
                <h1 className="text-5xl font-display mb-1 neon-text-primary tracking-tighter italic">ARCADE</h1>
                <h2 className="text-xl font-display text-zinc-500 tracking-[0.4em]">NEXUS</h2>
            </div>

            <div className="space-y-4">
                {/* OAuth Methods */}
                <button
                    onClick={() => handleOAuth("google")}
                    disabled={!!isLoading}
                    className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all group disabled:opacity-50"
                >
                    {isLoading === "google" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Chrome className="w-5 h-5" />}
                    CONTINUE WITH GOOGLE
                </button>

                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#050510] px-2 text-zinc-600 font-mono tracking-widest">or initialize via</span></div>
                </div>

                {/* Email Section */}
                {!showEmailInput ? (
                    <button
                        onClick={() => setShowEmailInput(true)}
                        className="w-full bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-black tracking-widest text-xs"
                    >
                        <Mail className="w-4 h-4 text-cyan-400" /> EMAIL & PASSWORD
                    </button>
                ) : (
                    <form onSubmit={handleEmailSignIn} className="space-y-3 animate-in fade-in slide-in-from-top-2">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="neural_link@email.com"
                            className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none focus:border-cyan-500 transition-all font-mono text-sm"
                        />
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setShowEmailInput(false)}
                                className="bg-zinc-900 px-4 rounded-xl border border-zinc-800"
                            >
                                ←
                            </button>
                            <button
                                type="submit"
                                disabled={!!isLoading}
                                className="flex-1 bg-cyan-500 text-black font-black py-4 rounded-xl hover:bg-cyan-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading === "email" ? <Loader2 className="w-4 h-4 animate-spin" /> : "CONNECT"}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                )}

                <button
                    className="w-full bg-zinc-900/50 border border-zinc-900 text-zinc-600 py-4 rounded-2xl flex items-center justify-center gap-3 grayscale opacity-50 cursor-not-allowed text-xs font-black tracking-widest"
                >
                    <Phone className="w-4 h-4" /> PHONE (COMING SOON)
                </button>
            </div>

            <p className="mt-8 text-[10px] text-zinc-600 font-mono uppercase text-center leading-relaxed">
                By connecting, you agree to the <span className="text-zinc-500">Neural Terms of Service</span> and <span className="text-zinc-500">Data Privacy Protocol</span>.
            </p>
        </div>
    );
}
