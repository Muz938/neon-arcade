import { mutation } from "./_generated/server";

export const seedShop = mutation({
    args: {},
    handler: async (ctx) => {
        const items = [
            {
                name: "Neon Ghost",
                description: "Translucent cyan skin with digital trails.",
                type: "skin",
                price: 500,
                currency: "coins",
                rarity: "rare",
                isPremiumOnly: false,
            },
            {
                name: "Void Walker",
                description: "Deep purple skin that absorbs light.",
                type: "skin",
                price: 200,
                currency: "gems",
                rarity: "epic",
                isPremiumOnly: false,
            },
            {
                name: "Arcade Master Frame",
                description: "An animated frame featuring pixelated trophies.",
                type: "frame",
                price: 1500,
                currency: "coins",
                rarity: "common",
                isPremiumOnly: false,
            },
            {
                name: "Nitro Overdrive",
                description: "A premium skin only available to Elite members.",
                type: "skin",
                price: 0,
                currency: "gems",
                rarity: "legendary",
                isPremiumOnly: true,
            },
            {
                name: "Glitch Badge",
                description: "A badge that appears to flicker in and out of existence.",
                type: "badge",
                price: 50,
                currency: "gems",
                rarity: "epic",
                isPremiumOnly: false,
            },
        ];

        for (const item of items) {
            const existing = await ctx.db
                .query("shopItems")
                .filter((q) => q.eq(q.field("name"), item.name))
                .unique();

            if (!existing) {
                await ctx.db.insert("shopItems", item as any);
            }
        }

        return "Shop seeded!";
    },
});
