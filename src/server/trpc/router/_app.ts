import { router } from "../trpc";
import { authRouter } from "./auth";
import { tradeRouter } from "./tradeRouter";
import { tradeGroupRouter } from "./tradeGroupRouter";

export const appRouter = router({
  auth: authRouter,
  tradeRouter: tradeRouter,
  tradeGroupRouter: tradeGroupRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
