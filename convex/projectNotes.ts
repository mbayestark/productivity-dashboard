import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    return await ctx.db
      .query("projectNotes")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .order("desc")
      .collect();
  },
});

export const listByDate = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    return await ctx.db
      .query("projectNotes")
      .withIndex("by_date", (q) => q.eq("date", date))
      .order("asc")
      .collect();
  },
});

export const addNote = mutation({
  args: {
    projectId: v.id("projects"),
    content: v.string(),
  },
  handler: async (ctx, { projectId, content }) => {
    const now = Date.now();
    const date = new Date().toISOString().split("T")[0];
    return await ctx.db.insert("projectNotes", {
      projectId,
      content,
      date,
      createdAt: now,
    });
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("projectNotes")
      .order("desc")
      .take(200);
  },
});

export const deleteNote = mutation({
  args: { id: v.id("projectNotes") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
