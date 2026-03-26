import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listTimelogs = query({
  args: {
    projectId: v.optional(v.id("projects")),
    date: v.optional(v.string()),
  },
  handler: async (ctx, { projectId, date }) => {
    let logs = await ctx.db.query("timelogs").collect();
    if (projectId) logs = logs.filter((l) => l.projectId === projectId);
    if (date) logs = logs.filter((l) => l.date === date);
    return logs.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const createTimelog = mutation({
  args: {
    projectId: v.id("projects"),
    taskId: v.optional(v.id("tasks")),
    date: v.string(),
    minutes: v.number(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("timelogs", { ...args, createdAt: Date.now() });
  },
});
