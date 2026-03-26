import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listProjects = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
    return projects.sort((a, b) => {
      const pa = priorityOrder[a.priority] ?? 3;
      const pb = priorityOrder[b.priority] ?? 3;
      if (pa !== pb) return pa - pb;
      if (a.deadline && b.deadline) return a.deadline.localeCompare(b.deadline);
      if (a.deadline) return -1;
      if (b.deadline) return 1;
      return 0;
    });
  },
});

export const getProject = query({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const createProject = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    progress: v.number(),
    deadline: v.optional(v.string()),
    color: v.string(),
    priority: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("projects", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateProject = mutation({
  args: {
    id: v.id("projects"),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    progress: v.optional(v.number()),
    deadline: v.optional(v.string()),
    color: v.optional(v.string()),
    priority: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
  },
});

export const deleteProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
