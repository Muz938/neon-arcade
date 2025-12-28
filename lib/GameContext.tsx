"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Types
export interface UserProfile {
    _id: string;
    userId: string;
    name: string;
    image: string | null;
    xp: number;
    coins: number;
    level: number;
    wins: number;
    losses: number;
    rank: string;
    inventory: string[];
    isPremium: boolean;
}

export interface Match {
    _id: string;
    gameType: string;
    player1Id: string;
    player2Id?: string;
    status: "waiting" | "active" | "finished" | "aborted";
    gameState: any;
    isRanked: boolean;
    roomCode?: string;
    createdAt: number;
}

interface GameContextType {
    // Auth
    isAuthenticated: boolean;
    isLoading: boolean;
    signIn: () => Promise<void>;
    signOut: () => void;

    // Profile
    profile: UserProfile | null;
    updateProfile: (updates: Partial<UserProfile>) => void;
    addXP: (amount: number) => void;
    addCoins: (amount: number) => void;

    // Matches
    createMatch: (gameType: string, isRanked: boolean) => Match;
    joinMatch: (code: string) => Match | null;
    activeMatches: Match[];
}

const GameContext = createContext<GameContextType | null>(null);

const STORAGE_KEY = "neon_arcade_data";

const defaultProfile: UserProfile = {
    _id: "user_" + Math.random().toString(36).substr(2, 9),
    userId: "user_" + Math.random().toString(36).substr(2, 9),
    name: "Pilot",
    image: null,
    xp: 0,
    coins: 100,
    level: 1,
    wins: 0,
    losses: 0,
    rank: "Rookie",
    inventory: ["default"],
    isPremium: false,
};

function calculateLevel(xp: number): { level: number; rank: string } {
    const levels = [
        { min: 0, level: 1, rank: "Rookie" },
        { min: 100, level: 2, rank: "Rookie" },
        { min: 250, level: 3, rank: "Bronze" },
        { min: 500, level: 4, rank: "Bronze" },
        { min: 1000, level: 5, rank: "Silver" },
        { min: 2000, level: 6, rank: "Silver" },
        { min: 3500, level: 7, rank: "Gold" },
        { min: 5000, level: 8, rank: "Gold" },
        { min: 7500, level: 9, rank: "Platinum" },
        { min: 10000, level: 10, rank: "Diamond" },
    ];

    for (let i = levels.length - 1; i >= 0; i--) {
        if (xp >= levels[i].min) return levels[i];
    }
    return levels[0];
}

export function GameProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [activeMatches, setActiveMatches] = useState<Match[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.isAuthenticated && data.profile) {
                    setIsAuthenticated(true);
                    setProfile(data.profile);
                }
            } catch (e) {
                console.error("Failed to load saved data");
            }
        }
        setIsLoading(false);
    }, []);

    // Save to localStorage on changes
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                isAuthenticated,
                profile,
            }));
        }
    }, [isAuthenticated, profile, isLoading]);

    const signIn = async () => {
        setIsLoading(true);
        // Simulate auth delay
        await new Promise(r => setTimeout(r, 1000));
        setProfile(defaultProfile);
        setIsAuthenticated(true);
        setIsLoading(false);
    };

    const signOut = () => {
        setIsAuthenticated(false);
        setProfile(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    const updateProfile = (updates: Partial<UserProfile>) => {
        if (profile) {
            setProfile({ ...profile, ...updates });
        }
    };

    const addXP = (amount: number) => {
        if (profile) {
            const newXP = profile.xp + amount;
            const { level, rank } = calculateLevel(newXP);
            setProfile({ ...profile, xp: newXP, level, rank });
        }
    };

    const addCoins = (amount: number) => {
        if (profile) {
            setProfile({ ...profile, coins: profile.coins + amount });
        }
    };

    const createMatch = (gameType: string, isRanked: boolean): Match => {
        const match: Match = {
            _id: "match_" + Math.random().toString(36).substr(2, 9),
            gameType,
            player1Id: profile?._id || "",
            status: "waiting",
            gameState: {},
            isRanked,
            roomCode: Math.random().toString(36).substring(2, 6).toUpperCase(),
            createdAt: Date.now(),
        };
        setActiveMatches([...activeMatches, match]);
        return match;
    };

    const joinMatch = (code: string): Match | null => {
        const match = activeMatches.find(m => m.roomCode === code && m.status === "waiting");
        if (match) {
            const updated = { ...match, player2Id: profile?._id, status: "active" as const };
            setActiveMatches(activeMatches.map(m => m._id === match._id ? updated : m));
            return updated;
        }
        return null;
    };

    return (
        <GameContext.Provider value={{
            isAuthenticated,
            isLoading,
            signIn,
            signOut,
            profile,
            updateProfile,
            addXP,
            addCoins,
            createMatch,
            joinMatch,
            activeMatches,
        }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (!context) throw new Error("useGame must be used within GameProvider");
    return context;
}
