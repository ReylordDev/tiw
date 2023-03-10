import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/user";
import { practiceRouter } from "./routers/practice";
import { wordRouter } from "./routers/words";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  practice: practiceRouter,
  word: wordRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
