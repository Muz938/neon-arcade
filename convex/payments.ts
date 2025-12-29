import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { auth } from "./auth";

/**
 * Handle virtual currency purchases (Gems).
 * In a production app, the 'receipt' would be sent to Google/Apple/Stripe servers for validation.
 */
export const purchaseGems = mutation({
    args: {
        gemAmount: v.number(),
        pricePaid: v.number(),
        provider: v.string(), // "google_play", "apple_app_store", "stripe"
        receipt: v.string(),  // The raw receipt or token from the store
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        // SERVER-SIDE VALIDATION (Mocked)
        // Here you would call fetch() to Apple/Google/Stripe API to verify the receipt.
        const isValid = await mockVerifyReceipt(args.receipt, args.provider);
        if (!isValid) throw new Error("Invalid receipt");

        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .unique();

        if (!profile) throw new Error("Profile not found");

        // Update gems
        await ctx.db.patch(profile._id, {
            gems: profile.gems + args.gemAmount,
        });

        // Log transaction
        await ctx.db.insert("transactions", {
            userId,
            amount: args.pricePaid,
            currency: "USD", // Actual money spent
            type: "purchase",
            status: "completed",
            provider: args.provider,
            receiptId: args.receipt,
            createdAt: Date.now(),
        });

        return true;
    },
});

/**
 * Handle Premium Subscription (Nitro-style).
 */
export const subscribePremium = mutation({
    args: {
        planId: v.string(), // "monthly", "yearly"
        receipt: v.string(),
        provider: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const isValid = await mockVerifyReceipt(args.receipt, args.provider);
        if (!isValid) throw new Error("Invalid receipt");

        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .unique();

        if (!profile) throw new Error("Profile not found");

        const duration = args.planId === "yearly" ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
        const currentExpiry = profile.premiumUntil ?? Date.now();
        const newExpiry = currentExpiry + duration;

        await ctx.db.patch(profile._id, {
            isPremium: true,
            premiumUntil: newExpiry,
        });

        // Grant one-time rewards for subscribing
        await ctx.db.patch(profile._id, {
            gems: profile.gems + (args.planId === "yearly" ? 2000 : 150),
        });

        return true;
    },
});

// Helper Mock
async function mockVerifyReceipt(receipt: string, provider: string) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Real logic would be:
    // if (provider === "google") { ... check google play api ... }
    // if (provider === "apple") { ... check app store connect ... }

    return receipt.length > 10; // Simple dummy check
}
