import { router } from "../trpc";
import { authRouter } from "./auth";
import { executionRouter } from "./executionRouter";
import { tagRouter } from "./tagRouter";
import { tradeRouter } from "./tradeRouter";
import { imageRouter } from "./imageRouter";
import { userPreferenceRouter } from "./userPreferenceRouter";

export const appRouter = router({
  auth: authRouter,
  tradeRouter: tradeRouter,
  executionRouter: executionRouter,
  tagRouter: tagRouter,
  imageRouter: imageRouter,
  userPreferenceRouter: userPreferenceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
