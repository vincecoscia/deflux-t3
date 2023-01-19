import { z } from 'zod';

import { router, publicProcedure, protectedProcedure } from '../trpc';

export const tradeRouter = router({
  uploadTrades: protectedProcedure
    .input(z.array(z.object({ id: z.string(), symbol: z.string(), price: z.number(), commission: z.number(), quantity: z.number(), return: z.number().nullish(), dateTime: z.date(), side: z.string(), platform: z.string(), userId: z.string(), percentClosed: z.number() })))
    .mutation(async ({ctx, input}) => {
      const trades = await ctx.prisma.trade.createMany({
        data: input ?? [],
        skipDuplicates: true,
      });
      // Add relevant trades to a TradeGroup

      return trades;
    }
  ),
  getTrades: protectedProcedure
    .query(async ({ctx}) => {
      const trades = await ctx.prisma.trade.findMany();
      // get only the users trades
      const userTrades = trades.filter(trade => trade.userId === ctx.session.user.id);
      return userTrades;

    }
  ),
  getTrade: protectedProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
    .query(async ({ctx, input}) => {
      // make sure the user is the owner of the trade
      const trade = await ctx.prisma.trade.findUnique({
        where: {
          id: input.id,
        },
      });
      if (trade?.userId !== ctx.session.user.id) {
        throw new Error('Unauthorized');
      }
      return trade;
    }
  ),


})