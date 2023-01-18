import { z } from 'zod';

import { router, publicProcedure, protectedProcedure } from '../trpc';

export const tradeRouter = router({
  uploadTrades: protectedProcedure
    .input(z.array(z.object({ symbol: z.string(), price: z.number(), commission: z.number(), quantity: z.number(), return: z.number().nullish(), dateTime: z.date(), side: z.string(), platform: z.string(), user_id: z.string() })))
    .mutation(async ({ctx, input}) => {
      const trades = await ctx.prisma.trade.createMany({
        data: input ?? [],
        skipDuplicates: true,
      });
      return trades;
    }
  ),
  getTrades: protectedProcedure
    .query(async ({ctx}) => {
      const trades = await ctx.prisma.trade.findMany();
      // get only the users trades
      const userTrades = trades.filter(trade => trade.user_id === ctx.session.user.id);
      return userTrades;

    }
  ),
  getTrade: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ctx, input}) => {
      const trade = await ctx.prisma.trade.findUnique({
        where: { id: input.id },
      });
      return trade;
    }
  ),


})