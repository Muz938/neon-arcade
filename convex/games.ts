import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createMatch = mutation({
    args: {
        gameType: v.string(),
        isRanked: v.boolean(),
        initialState: v.any()
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const code = Math.random().toString(36).substring(2, 6).toUpperCase();

        const matchId = await ctx.db.insert("matches", {
            gameType: args.gameType,
            player1Id: userId,
            status: "waiting",
            gameState: args.initialState,
            isRanked: args.isRanked,
            roomCode: code,
            createdAt: Date.now(),
            lastUpdated: Date.now(),
        });

        return { matchId, code };
    },
});

export const joinMatch = mutation({
    args: { roomCode: v.string() },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const match = await ctx.db
            .query("matches")
            .withIndex("by_code", (q) => q.eq("roomCode", args.roomCode))
            .first();

        if (!match) throw new Error("Match not found");
        if (match.status !== "waiting") throw new Error("Match not available");
        if (match.player1Id === userId) return match._id;

        await ctx.db.patch(match._id, {
            player2Id: userId,
            status: "active",
            lastUpdated: Date.now(),
        });

        return match._id;
    },
});

export const getMatch = query({
    args: { matchId: v.id("matches") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.matchId);
    },
});

export const updateState = mutation({
    args: {
        matchId: v.id("matches"),
        newState: v.any(),
        isFinished: v.optional(v.boolean()),
        winnerId: v.optional(v.id("users"))
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const match = await ctx.db.get(args.matchId);
        if (!match) throw new Error("Match not found");

        if (match.player1Id !== userId && match.player2Id !== userId) {
            throw new Error("Not a player");
        }

        const updates: any = {
            gameState: args.newState,
            lastUpdated: Date.now(),
        };

        if (args.isFinished) {
            updates.status = "finished";
            updates.endedAt = Date.now();
            if (args.winnerId) updates.winnerId = args.winnerId;
        }

        await ctx.db.patch(args.matchId, updates);
    },
});
