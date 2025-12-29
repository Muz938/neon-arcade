"use client";
import { createContext, useContext, ReactNode, useEffect } from "react";
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

    return (
        <GameContext.Provider value={{
            isAuthenticated,
            isLoading,
            signIn: handleSignIn,
            signOut: handleSignOut,
            profile,
            createProfile,
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
