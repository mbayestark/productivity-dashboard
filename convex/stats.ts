import { query } from "./_generated/server";

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const today = new Date().toISOString().split("T")[0];

    // Start of current week (Monday)
    const d = new Date();
    const day = d.getDay();
    const diff = (day === 0 ? -6 : 1 - day);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() + diff);
    weekStart.setHours(0, 0, 0, 0);
    const weekStartMs = weekStart.getTime();

    const [tasks, projects, timelogs, checkins] = await Promise.all([
      ctx.db.query("tasks").collect(),
      ctx.db.query("projects").collect(),
      ctx.db.query("timelogs").collect(),
      ctx.db.query("checkins").collect(),
    ]);

    const completedTasks = tasks.filter((t) => t.status === "done");
    const completedThisWeek = completedTasks.filter(
      (t) => t.completedAt && t.completedAt >= weekStartMs
    );
    const overdueTasks = tasks.filter(
      (t) => t.status !== "done" && t.status !== "cancelled" && t.deadline && t.deadline < today
    );

    const totalMinutes = timelogs.reduce((sum, l) => sum + l.minutes, 0);

    // Minutes by role
    const minutesByRole: Record<string, number> = {};
    for (const log of timelogs) {
      const project = projects.find((p) => p._id === log.projectId);
      if (project) {
        minutesByRole[project.role] = (minutesByRole[project.role] ?? 0) + log.minutes;
      }
    }

    const checkinEnergy = checkins.filter((c) => c.energyLevel != null);
    const checkinFocus = checkins.filter((c) => c.focusScore != null);
    const avgEnergy = checkinEnergy.length
      ? checkinEnergy.reduce((s, c) => s + (c.energyLevel ?? 0), 0) / checkinEnergy.length
      : 0;
    const avgFocus = checkinFocus.length
      ? checkinFocus.reduce((s, c) => s + (c.focusScore ?? 0), 0) / checkinFocus.length
      : 0;

    return {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      completedThisWeek: completedThisWeek.length,
      completionRate: tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0,
      overdueCount: overdueTasks.length,
      overdueTasks: overdueTasks.slice(0, 5),
      totalMinutesLogged: totalMinutes,
      minutesByRole,
      avgEnergyLevel: Math.round(avgEnergy * 10) / 10,
      avgFocusScore: Math.round(avgFocus * 10) / 10,
      activeProjects: projects.filter((p) => p.status === "active").length,
      blockedProjects: projects.filter((p) => p.status === "blocked").length,
    };
  },
});

export const getWeeklyCompletions = query({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").collect();
    const done = tasks.filter((t) => t.status === "done" && t.completedAt);

    // Last 8 weeks
    const weeks: { label: string; count: number }[] = [];
    for (let i = 7; i >= 0; i--) {
      const end = new Date();
      end.setDate(end.getDate() - i * 7);
      end.setHours(23, 59, 59, 999);
      const start = new Date(end);
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);

      const count = done.filter(
        (t) => t.completedAt! >= start.getTime() && t.completedAt! <= end.getTime()
      ).length;

      weeks.push({
        label: `W${8 - i}`,
        count,
      });
    }
    return weeks;
  },
});

export const getEnergyTrend = query({
  args: {},
  handler: async (ctx) => {
    const checkins = await ctx.db.query("checkins").collect();
    return checkins
      .filter((c) => c.energyLevel != null)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30)
      .map((c) => ({ date: c.date, energy: c.energyLevel ?? 0, focus: c.focusScore ?? 0 }));
  },
});
