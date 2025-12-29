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
        userId: v.id("users"),
        xp: v.number(),
        coins: v.number(), // Basic currency
        gems: v.number(),  // Premium currency
        level: v.number(),
        wins: v.number(),
        losses: v.number(),
        rank: v.string(),
        activeSkinId: v.optional(v.string()), // ID of the equipped skin
        isPremium: v.boolean(),
        premiumUntil: v.optional(v.number()), // Timestamp for subscription expiry
        settings: v.optional(v.object({
            theme: v.string(),
            soundEnabled: v.boolean(),
        })),
    }).index("by_user", ["userId"]),

    shopItems: defineTable({
        name: v.string(),
        description: v.string(),
        type: v.union(v.literal("skin"), v.literal("frame"), v.literal("badge"), v.literal("pack")),
        price: v.number(),
        currency: v.union(v.literal("coins"), v.literal("gems")),
        rarity: v.union(v.literal("common"), v.literal("rare"), v.literal("epic"), v.literal("legendary")),
        imageUrl: v.optional(v.string()),
        isPremiumOnly: v.boolean(),
    }),

    userInventory: defineTable({
        userId: v.id("users"),
        itemId: v.id("shopItems"),
        acquiredAt: v.number(),
        isEquipped: v.boolean(),
        giftedBy: v.optional(v.id("users")),
    }).index("by_user", ["userId"])
        .index("by_user_and_item", ["userId", "itemId"]),

    transactions: defineTable({
        userId: v.id("users"),
        amount: v.number(),
        currency: v.union(v.literal("coins"), v.literal("gems"), v.literal("USD")),
        type: v.union(v.literal("purchase"), v.literal("gift_received"), v.literal("gift_sent"), v.literal("reward")),
        itemId: v.optional(v.id("shopItems")),
        recipientId: v.optional(v.id("users")), // For gifting
        status: v.union(v.literal("completed"), v.literal("pending"), v.literal("failed")),
        provider: v.optional(v.string()), // Google, Apple, etc.
        receiptId: v.optional(v.string()),
        createdAt: v.number(),
    }).index("by_user", ["userId"]),

    matches: defineTable({
        gameType: v.string(),
        player1Id: v.id("users"),
        player2Id: v.optional(v.id("users")),
        winnerId: v.optional(v.id("users")),
        status: v.union(v.literal("waiting"), v.literal("active"), v.literal("finished"), v.literal("aborted")),
        gameState: v.any(),
        isRanked: v.boolean(),
        roomCode: v.optional(v.string()),
        createdAt: v.number(),
        lastUpdated: v.optional(v.number()),
        endedAt: v.optional(v.number()),
    })
        .index("by_status", ["status"])
        .index("by_code", ["roomCode"]),
});
