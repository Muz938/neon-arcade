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
export const updateStats = mutation({
    args: {
        xp: v.optional(v.number()),
        coins: v.optional(v.number()),
        win: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (!profile) throw new Error("Profile not found");

        const updates: any = {};
        if (args.xp) {
            const newXp = profile.xp + args.xp;
            updates.xp = newXp;
            updates.level = Math.floor(newXp / 500) + 1;
        }
        if (args.coins) {
            updates.coins = profile.coins + args.coins;
        }
        if (args.win !== undefined) {
            if (args.win) {
                updates.wins = (profile.wins || 0) + 1;
            } else {
                updates.losses = (profile.losses || 0) + 1;
            }
        }

        await ctx.db.patch(profile._id, updates);
        return updates;
    },
});

export const getLeaderboard = query({
    args: {},
    handler: async (ctx) => {
        const topProfiles = await ctx.db
            .query("profiles")
            .order("desc")
            .take(10);

        const results = [];
        for (const profile of topProfiles) {
            const user = await ctx.db.get(profile.userId);
            results.push({
                ...profile,
                name: user?.name || "CyberGhost",
                image: user?.image,
            });
        }
        return results;
    },
});
