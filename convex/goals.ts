import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listGoals = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("goals").collect();
  },
});

export const createGoal = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
    progress: v.number(),
    status: v.string(),
    targetDate: v.optional(v.string()),
    milestones: v.optional(v.array(v.object({ title: v.string(), done: v.boolean() }))),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("goals", { ...args, createdAt: Date.now() });
  },
});

export const updateGoal = mutation({
  args: {
    id: v.id("goals"),
    progress: v.optional(v.number()),
    status: v.optional(v.string()),
    milestones: v.optional(v.array(v.object({ title: v.string(), done: v.boolean() }))),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    targetDate: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, fields);
  },
});
