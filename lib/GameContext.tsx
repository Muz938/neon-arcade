"use client";
import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";

// Types matching Schema
export interface UserProfile {
    _id: string;
    userId: string;
    name?: string;
    image?: string | null;
    xp: number;
    coins: number;
    gems: number;
    level: number;
    wins: number;
    losses: number;
    rank: string;
    isPremium: boolean;
}

interface GameContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    signIn: (provider: string, args?: any) => Promise<void>;
    signOut: () => Promise<void>;
    profile: any;
    // Helper to ensure profile exists
    createProfile: () => Promise<void>;
    updateStats: (args: { xp?: number; coins?: number; win?: boolean }) => Promise<void>;
    guestLogin: () => Promise<void>;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const { signIn, signOut } = useAuthActions();

    // Convex data
    const profile = useQuery(api.users.getProfile);
    const createProfileMutation = useMutation(api.users.createOrGetProfile);

    // Auto-create profile on login if it doesn't exist
    useEffect(() => {
        if (isAuthenticated && !profile && !isLoading) {
            createProfileMutation({});
        }
    }, [isAuthenticated, profile, isLoading, createProfileMutation]);

    const updateStatsMutation = useMutation(api.users.updateStats);

    const handleSignIn = async (provider: string, args: any = {}) => {
        try {
            await signIn(provider, args);
        } catch (error) {
            console.error("Sign in failed", error);
            throw error;
        }
    };

    const handleSignOut = async () => {
        await signOut();
    };

    const createProfile = async () => {
        await createProfileMutation({});
    };

    const updateStats = async (args: { xp?: number; coins?: number; win?: boolean }) => {
        if (updateStatsMutation) {
            await updateStatsMutation(args).catch(() => { });
        }
    };

    const [isDemoMode, setIsDemoMode] = useState(false);

    const guestLogin = async () => {
        try {
            const guestId = Math.random().toString(36).substring(2, 10);
            const email = `guest_${guestId}@arcadenexus.ai`;
            await signIn("password", { email, password: "guest-password-internal-v2", flow: "signUp" });
        } catch (e) {
            console.error("Auth failed, falling back to Demo Mode", e);
            setIsDemoMode(true);
        }
    };

    // Simulated profile for demo mode
    const demoProfile = isDemoMode ? {
        _id: "demo",
        userId: "demo",
        name: "CyberDemo",
        xp: 120,
        coins: 1000,
        gems: 100,
        level: 1,
        wins: 5,
        losses: 2,
        rank: "Guest",
        isPremium: false,
    } : null;

    return (
        <GameContext.Provider value={{
            isAuthenticated: isAuthenticated || isDemoMode,
            isLoading: isLoading && !isDemoMode,
            signIn: handleSignIn,
            signOut: handleSignOut,
            profile: profile || demoProfile,
            createProfile,
            updateStats,
            guestLogin,
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
