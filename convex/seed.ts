import { mutation } from "./_generated/server";

export const seedProjects = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("projects").collect();
    if (existing.length > 0) return { message: "Already seeded" };

    const now = Date.now();
    const projects = [
      { name: "Finance Tracker App",        role: "IT Committee", status: "active",    progress: 0,  priority: "high",   color: "blue"   },
      { name: "DaBus Platform",             role: "IT Committee", status: "active",    progress: 40, priority: "medium", color: "blue"   },
      { name: "Life at DAUST Store",        role: "Personal",     status: "active",    progress: 60, priority: "high",   color: "gray"   },
      { name: "React Native Task Manager",  role: "Academic",     status: "active",    progress: 30, priority: "high",   color: "green"  },
      { name: "DP World Zodiac Application",role: "Career",       status: "active",    progress: 50, priority: "high",   color: "purple" },
      { name: "Bilingual Salah Guide PDF",  role: "Personal",     status: "paused",    progress: 20, priority: "low",    color: "gray"   },
      { name: "Tournament Organization",    role: "Student Gov",  status: "active",    progress: 10, priority: "medium", color: "orange" },
    ];

    for (const p of projects) {
      await ctx.db.insert("projects", { ...p, createdAt: now, updatedAt: now });
    }

    return { message: `Seeded ${projects.length} projects` };
  },
});
