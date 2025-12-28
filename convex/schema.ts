import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
    ...authTables,
    // Custom User Profile Extension (linked to auth by ID usually, but convex auth stores user data in 'users' table by default)
    // We will extend the default users schema or just use a separate 'profiles' table if authTables locks 'users'.
    // @convex-dev/auth usually uses a 'users' table. We can add fields to it in newer versions, or use a separate table.
    // For safety and standard patterns, we'll create a 'profiles' table linked to 'users', 
    // OR we assume we can customize the 'users' table passed to authTables (advanced).
    // The simplest reliable way with convex-auth is to let it own 'users' and we own 'profiles'.

    profiles: defineTable({
        userId: v.id("users"), // Link to auth user
        xp: v.number(),
        coins: v.number(),
        level: v.number(),
        wins: v.number(),
        losses: v.number(),
        rank: v.string(),
        inventory: v.array(v.string()),
        isPremium: v.boolean(),
        settings: v.optional(v.object({
            theme: v.string(),
            soundEnabled: v.boolean(),
        })),
    }).index("by_user", ["userId"]),

    matches: defineTable({
        gameType: v.string(),
        player1Id: v.id("users"),
        player2Id: v.optional(v.id("users")),
        winnerId: v.optional(v.id("users")),
        status: v.union(v.literal("waiting"), v.literal("active"), v.literal("finished"), v.literal("aborted")),
        gameState: v.any(), // JSON object for specific game state
        isRanked: v.boolean(),
        roomCode: v.optional(v.string()),
        createdAt: v.number(),
        lastUpdated: v.optional(v.number()),
        endedAt: v.optional(v.number()),
    })
        .index("by_status", ["status"])
        .index("by_code", ["roomCode"]),
});
