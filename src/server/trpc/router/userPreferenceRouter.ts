import { z } from 'zod';

import { router, protectedProcedure } from '../trpc';

export const userPreferenceRouter = router({
  updateUserPreference: protectedProcedure
    .input(z.object({ id: z.string().nullish(), key: z.string(), value: z.any() }))
    .mutation(async ({ctx, input}) => {
      const userPreference = await ctx.prisma.userPreference.upsert({
        where: {
          userPreferenceIdentifier: {
            key: input.key,
            userId: ctx.session.user.id,
          },
        },
        update: {
          key: input.key,
          value: input.value,
        },
        create: {
          key: input.key,
          value: input.value,
          userId: ctx.session.user.id,
        },
      });
      return userPreference;
    }
  ),
  getUserPreference: protectedProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ctx, input}) => {
      const userPreference = await ctx.prisma.userPreference.findUnique({
        where: {
          userPreferenceIdentifier: {
            key: input.key,
            userId: ctx.session.user.id,
          },
        },
      });
      return userPreference;
    }
  ),
  getUserPreferences: protectedProcedure
    .query(async ({ctx}) => {
      const userPreferences = await ctx.prisma.userPreference.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });
      return userPreferences;
    }
  ),
});