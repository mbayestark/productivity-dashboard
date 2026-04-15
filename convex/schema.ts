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

  projectNotes: defineTable({
    projectId: v.id("projects"),
    content: v.string(),
    date: v.string(),        // "YYYY-MM-DD" for day-based queries
    createdAt: v.number(),
  }).index("by_project", ["projectId"])
    .index("by_date", ["date"]),

  timelogs: defineTable({
    projectId: v.id("projects"),
    taskId: v.optional(v.id("tasks")),
    date: v.string(),
    minutes: v.number(),
    note: v.optional(v.string()),
    createdAt: v.number(),
  }),

  cubesat_subsystems: defineTable({
    name: v.string(),
    progress: v.number(),
    status: v.string(),
    notes: v.optional(v.string()),
    updatedAt: v.number(),
  }),

  cubesat_log: defineTable({
    date: v.string(),
    type: v.string(),
    subsystem: v.optional(v.string()),
    title: v.string(),
    body: v.optional(v.string()),
    author: v.optional(v.string()),
  }),

  cubesat_milestones: defineTable({
    title: v.string(),
    targetDate: v.string(),
    completedDate: v.optional(v.string()),
    status: v.string(),
    description: v.optional(v.string()),
  }),

});
