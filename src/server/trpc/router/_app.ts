import { router } from "../trpc";
import { authRouter } from "./auth";
import { tradeRouter } from "./tradeRouter";

export const appRouter = router({
  auth: authRouter,
  tradeRouter: tradeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
