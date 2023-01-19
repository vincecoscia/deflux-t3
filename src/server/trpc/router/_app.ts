import { router } from "../trpc";
import { authRouter } from "./auth";
import { executionRouter } from "./executionRouter";
import { tradeRouter } from "./tradeRouter";

export const appRouter = router({
  auth: authRouter,
  tradeRouter: tradeRouter,
  executionRouter: executionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
