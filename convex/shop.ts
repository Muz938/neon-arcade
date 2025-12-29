import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

// --- Queries ---

export const getShopItems = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("shopItems").collect();
    },
});

export const getUserInventory = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return [];

        const inventory = await ctx.db
            .query("userInventory")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        // Join with shop items
        const items = await Promise.all(
            inventory.map(async (inv) => {
                const item = await ctx.db.get(inv.itemId);
                return { ...inv, item };
            })
        );

        return items;
    },
});

export const getUserProfile = query({
    args: { userId: v.optional(v.id("users")) },
    handler: async (ctx, args) => {
        const userId = args.userId ?? (await auth.getUserId(ctx));
        if (!userId) return null;

        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .unique();

        return profile;
    },
});

// --- Mutations ---

export const buyItem = mutation({
    args: { itemId: v.id("shopItems") },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const item = await ctx.db.get(args.itemId);
        if (!item) throw new Error("Item not found");

        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .unique();

        if (!profile) throw new Error("Profile not found");

        // Check if already owned
        const existing = await ctx.db
            .query("userInventory")
            .withIndex("by_user_and_item", (q) => q.eq("userId", userId).eq("itemId", args.itemId))
            .unique();

        if (existing) throw new Error("Already owned");

        // Check balance
        if (item.currency === "coins") {
            if (profile.coins < item.price) throw new Error("Insufficient coins");
            await ctx.db.patch(profile._id, { coins: profile.coins - item.price });
        } else {
            if (profile.gems < item.price) throw new Error("Insufficient gems");
            await ctx.db.patch(profile._id, { gems: profile.gems - item.price });
        }

        // Add to inventory
        const inventoryId = await ctx.db.insert("userInventory", {
            userId,
            itemId: args.itemId,
            acquiredAt: Date.now(),
            isEquipped: false,
        });

        // Log transaction
        await ctx.db.insert("transactions", {
            userId,
            amount: item.price,
            currency: item.currency,
            type: "purchase",
            itemId: args.itemId,
            status: "completed",
            createdAt: Date.now(),
        });

        return inventoryId;
    },
});

export const equipItem = mutation({
    args: { inventoryId: v.id("userInventory") },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const itemInInv = await ctx.db.get(args.inventoryId);
        if (!itemInInv || itemInInv.userId !== userId) throw new Error("Item not found in inventory");

        const item = await ctx.db.get(itemInInv.itemId);
        if (!item) throw new Error("Item details not found");

        // Un-equip other items of same type if needed (e.g. only one skin at a time)
        // For simplicity, we just set the activeSkinId in profile
        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .unique();

        if (!profile) throw new Error("Profile not found");

        if (item.type === "skin") {
            await ctx.db.patch(profile._id, { activeSkinId: item._id });
        }

        // Set toggle in inventory
        // (In a real app, you'd un-equip others first)
        await ctx.db.patch(args.inventoryId, { isEquipped: true });

        return true;
    },
});

export const giftItem = mutation({
    args: {
        itemId: v.id("shopItems"),
        recipientUsername: v.string(), // We use username for social gifting
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        // Find recipient
        const recipient = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("name"), args.recipientUsername))
            .unique();

        if (!recipient) throw new Error("User not found");
        if (recipient._id === userId) throw new Error("Cannot gift to yourself");

        const item = await ctx.db.get(args.itemId);
        if (!item) throw new Error("Item not found");

        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .unique();

        if (!profile) throw new Error("Profile not found");

        // Check balance
        if (item.currency === "coins") {
            if (profile.coins < item.price) throw new Error("Insufficient coins");
            await ctx.db.patch(profile._id, { coins: profile.coins - item.price });
        } else {
            if (profile.gems < item.price) throw new Error("Insufficient gems");
            await ctx.db.patch(profile._id, { gems: profile.gems - item.price });
        }

        // Add to recipient's inventory
        await ctx.db.insert("userInventory", {
            userId: recipient._id,
            itemId: args.itemId,
            acquiredAt: Date.now(),
            isEquipped: false,
            giftedBy: userId,
        });

        // Log transaction for sender
        await ctx.db.insert("transactions", {
            userId,
            amount: item.price,
            currency: item.currency,
            type: "gift_sent",
            itemId: args.itemId,
            recipientId: recipient._id,
            status: "completed",
            createdAt: Date.now(),
        });

        return true;
    },
});
