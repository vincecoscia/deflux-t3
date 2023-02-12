import { router } from "../trpc";
import { authRouter } from "./auth";
import { executionRouter } from "./executionRouter";
import { tagRouter } from "./tagRouter";
import { tradeRouter } from "./tradeRouter";

export const appRouter = router({
  auth: authRouter,
  tradeRouter: tradeRouter,
  executionRouter: executionRouter,
  tagRouter: tagRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
