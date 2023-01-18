import { z } from 'zod';

import { router, publicProcedure, protectedProcedure } from '../trpc';

export const tradeRouter = router({
  uploadTrades: protectedProcedure
    .input(z.array(z.object({ symbol: z.string(), price: z.number(), quantity: z.number(), amount: z.number().nullish(), date: z.string(), time: z.string(), side: z.string(), platform: z.string(), user_id: z.string() })))
    .mutation(async ({ctx, input}) => {
      const trades = await ctx.prisma.trade.createMany({
        data: input ?? [],
        skipDuplicates: true,
      });
      return trades;
    }
  ),
})