/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as checkins from "../checkins.js";
import type * as cubesat from "../cubesat.js";
import type * as goals from "../goals.js";
import type * as projectNotes from "../projectNotes.js";
import type * as projects from "../projects.js";
import type * as seed from "../seed.js";
import type * as stats from "../stats.js";
import type * as tasks from "../tasks.js";
import type * as timelogs from "../timelogs.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  checkins: typeof checkins;
  cubesat: typeof cubesat;
  goals: typeof goals;
  projectNotes: typeof projectNotes;
  projects: typeof projects;
  seed: typeof seed;
  stats: typeof stats;
  tasks: typeof tasks;
  timelogs: typeof timelogs;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
