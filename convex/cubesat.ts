import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ── Queries ──────────────────────────────────────────────

export const getSubsystems = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("cubesat_subsystems").collect();
    return rows.sort((a, b) => a.name.localeCompare(b.name));
  },
});

export const getLog = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("cubesat_log").collect();
    return rows.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 50);
  },
});

export const getMilestones = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("cubesat_milestones").collect();
    return rows.sort((a, b) => a.targetDate.localeCompare(b.targetDate));
  },
});

export const getOverallProgress = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("cubesat_subsystems").collect();
    if (rows.length === 0) return 0;
    const total = rows.reduce((sum, r) => sum + r.progress, 0);
    return Math.round(total / rows.length);
  },
});

// ── Mutations ────────────────────────────────────────────

export const updateSubsystem = mutation({
  args: {
    id: v.id("cubesat_subsystems"),
    progress: v.optional(v.number()),
    status: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
  },
});

export const addLogEntry = mutation({
  args: {
    date: v.string(),
    type: v.string(),
    subsystem: v.optional(v.string()),
    title: v.string(),
    body: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("cubesat_log", args);
  },
});

export const updateMilestone = mutation({
  args: {
    id: v.id("cubesat_milestones"),
    status: v.optional(v.string()),
    completedDate: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, fields);
  },
});

export const seedInitialData = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("cubesat_subsystems").collect();
    if (existing.length > 0) return;

    const now = Date.now();

    const subsystems = [
      { name: "OBC (On-Board Computer)", progress: 15, status: "in_progress" },
      { name: "EPS (Power System)", progress: 5, status: "in_progress" },
      { name: "ADCS (Attitude Control)", progress: 0, status: "not_started" },
      { name: "COMM (Communications)", progress: 10, status: "in_progress" },
      { name: "CAM (Camera/Payload)", progress: 0, status: "not_started" },
      { name: "Structure / Chassis", progress: 20, status: "in_progress" },
    ];

    for (const s of subsystems) {
      await ctx.db.insert("cubesat_subsystems", { ...s, updatedAt: now });
    }

    const milestones = [
      { title: "MCU & Component Selection", targetDate: "2026-05-01", status: "in_progress" },
      { title: "Schematic & PCB Design", targetDate: "2026-06-15", status: "upcoming" },
      { title: "PCB Fabrication & Assembly", targetDate: "2026-08-01", status: "upcoming" },
      { title: "Firmware Alpha (OBC + EPS)", targetDate: "2026-09-01", status: "upcoming" },
      { title: "Critical Design Review (CDR)", targetDate: "2026-10-15", status: "upcoming" },
      { title: "Integration & Full Assembly", targetDate: "2026-11-30", status: "upcoming" },
      { title: "DITL Testing", targetDate: "2026-12-20", status: "upcoming" },
      { title: "Launch Ready", targetDate: "2027-03-01", status: "upcoming" },
    ];

    for (const m of milestones) {
      await ctx.db.insert("cubesat_milestones", m);
    }
  },
});
