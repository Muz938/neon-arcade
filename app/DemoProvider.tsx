"use client";
import { ReactNode, createContext, useContext, useState } from "react";

// Mock profile for demo mode
const mockProfile = {
    _id: "demo_user_123",
    userId: "demo_user_123",
    name: "Pilot",
    image: null,
    xp: 1500,
    coins: 500,
    level: 5,
    wins: 23,
    losses: 12,
    rank: "Gold",
    inventory: ["default", "neon_blue"],
    isPremium: false,
};

// Demo context
const DemoContext = createContext<{
    isDemo: boolean;
    profile: typeof mockProfile | null;
    isAuthenticated: boolean;
    signIn: () => void;
    signOut: () => void;
}>({
    isDemo: true,
    profile: null,
    isAuthenticated: false,
    signIn: () => { },
    signOut: () => { },
});

export function useDemoAuth() {
    return useContext(DemoContext);
}

export function DemoProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const signIn = () => setIsAuthenticated(true);
    const signOut = () => setIsAuthenticated(false);

    return (
        <DemoContext.Provider
            value={{
                isDemo: true,
                profile: isAuthenticated ? mockProfile : null,
                isAuthenticated,
                signIn,
                signOut,
            }}
        >
            {children}
        </DemoContext.Provider>
    );
}
