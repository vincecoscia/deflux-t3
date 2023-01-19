import { z } from 'zod';

import { router, publicProcedure, protectedProcedure } from '../trpc';

export const tradeGroupRouter = router({
  addTradeGroup: protectedProcedure
    .input(z.array(z.object({ id: z.string(), userId: z.string(), trades: z.array(z.string()), name: z.string().nullish(), description: z.string().nullish() })))
    .mutation(async ({ctx, input}) => {
      const tradeGroups = await ctx.prisma.tradeGroup.createMany({
        data: input ?? [],
        skipDuplicates: true,
      });
      // Add relevant trades to a TradeGroup

      return tradeGroups;
    }
  ),


})