import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listCheckins = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 30 }) => {
    const all = await ctx.db.query("checkins").collect();
    return all.sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
  },
});

export const createCheckin = mutation({
  args: {
    date: v.string(),
    completedTaskIds: v.array(v.id("tasks")),
    energyLevel: v.optional(v.number()),
    focusScore: v.optional(v.number()),
    wins: v.optional(v.string()),
    blockers: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("checkins", { ...args, createdAt: Date.now() });
  },
});
