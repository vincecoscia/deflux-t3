import { z } from 'zod';

import { router, publicProcedure, protectedProcedure } from '../trpc';

export const tradeRouter = router({
  addTrades: protectedProcedure
    .input(z.array(z.object({ id: z.string(), userId: z.string() })))
    .mutation(async ({ctx, input}) => {
      const trades = await ctx.prisma.trade.createMany({
        data: input ?? [],
        skipDuplicates: true,
      });
      // Add relevant trades to a Trade

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


})