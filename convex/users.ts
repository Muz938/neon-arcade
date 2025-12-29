import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getProfile = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (!profile) return null;

        // Get basic user info (name/image) from users table
        const user = await ctx.db.get(userId);

        return {
            ...profile,
            name: user?.name,
            image: user?.image,
        };
    },
});

export const createOrGetProfile = mutation({
    args: { name: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const existing = await ctx.db
            .query("profiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (existing) return existing;

        const newProfileId = await ctx.db.insert("profiles", {
            userId,
            xp: 0,
            coins: 500, // Starting coins
            gems: 50,   // Starting gems
            level: 1,
            wins: 0,
            losses: 0,
            rank: "Rookie",
            isPremium: false,
        });

        if (args.name) {
            await ctx.db.patch(userId, { name: args.name });
        }

        return await ctx.db.get(newProfileId);
    },
});
