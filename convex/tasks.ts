import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listTasks = query({
  args: {
    projectId: v.optional(v.id("projects")),
    status: v.optional(v.string()),
  },
  handler: async (ctx, { projectId, status }) => {
    let tasks = await ctx.db.query("tasks").collect();
    if (projectId) tasks = tasks.filter((t) => t.projectId === projectId);
    if (status) tasks = tasks.filter((t) => t.status === status);
    return tasks.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const createTask = mutation({
  args: {
    projectId: v.id("projects"),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    priority: v.string(),
    deadline: v.optional(v.string()),
    estimatedMinutes: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const updateTask = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    deadline: v.optional(v.string()),
    estimatedMinutes: v.optional(v.number()),
    actualMinutes: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, fields);
  },
});

export const completeTask = mutation({
  args: {
    id: v.id("tasks"),
    actualMinutes: v.optional(v.number()),
  },
  handler: async (ctx, { id, actualMinutes }) => {
    await ctx.db.patch(id, {
      status: "done",
      completedAt: Date.now(),
      ...(actualMinutes !== undefined ? { actualMinutes } : {}),
    });
  },
});

export const deleteTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
