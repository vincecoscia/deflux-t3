import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { tradeRouter } from "./tradeRouter";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  tradeRouter: tradeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
