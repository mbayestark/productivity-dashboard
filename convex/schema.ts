import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  projects: defineTable({
    name: v.string(),
    role: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    progress: v.number(),
    deadline: v.optional(v.string()),
    color: v.string(),
    priority: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  tasks: defineTable({
    projectId: v.id("projects"),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    priority: v.string(),
    deadline: v.optional(v.string()),
    estimatedMinutes: v.optional(v.number()),
    actualMinutes: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
  }),

  goals: defineTable({
    title: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
    progress: v.number(),
    status: v.string(),
    targetDate: v.optional(v.string()),
    milestones: v.optional(v.array(v.object({
      title: v.string(),
      done: v.boolean(),
    }))),
    createdAt: v.number(),
  }),

  checkins: defineTable({
    date: v.string(),
    completedTaskIds: v.array(v.id("tasks")),
    energyLevel: v.optional(v.number()),
    focusScore: v.optional(v.number()),
    wins: v.optional(v.string()),
    blockers: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }),

  timelogs: defineTable({
    projectId: v.id("projects"),
    taskId: v.optional(v.id("tasks")),
    date: v.string(),
    minutes: v.number(),
    note: v.optional(v.string()),
    createdAt: v.number(),
  }),

});
