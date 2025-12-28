import { ArrowRight } from "lucide-react";

interface GameCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: "primary" | "secondary" | "accent";
    players: string;
    onClick: () => void;
}

export default function GameCard({ title, description, icon, color, players, onClick }: GameCardProps) {
    const colorClasses = {
        primary: "border-primary/20 hover:border-primary hover:shadow-[0_0_20px_rgba(0,243,255,0.3)]",
        secondary: "border-secondary/20 hover:border-secondary hover:shadow-[0_0_20px_rgba(255,0,255,0.3)]",
        accent: "border-accent/20 hover:border-accent hover:shadow-[0_0_20px_rgba(57,255,20,0.3)]",
    };

    const textClasses = {
        primary: "text-primary",
        secondary: "text-secondary",
        accent: "text-accent",
    };

    return (
        <div
            onClick={onClick}
            className={`glass-panel p-6 border transition-all duration-300 cursor-pointer group relative overflow-hidden ${colorClasses[color]}`}
        >
            <div className="absolute top-0 right-0 p-2 opacity-50">
                <span className="text-xs font-mono border border-white/20 rounded px-2 py-1 bg-black/20">{players}</span>
            </div>

            <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300 origin-left">
                {icon}
            </div>

            <h3 className={`font-display text-xl mb-2 ${textClasses[color]}`}>{title}</h3>
            <p className="text-sm text-gray-400 mb-4 h-10">{description}</p>

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/50 group-hover:text-white transition-colors">
                Initialize <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    );
}
