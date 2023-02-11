import { z } from 'zod';
import Trades from '../../../pages/dashboard/trades';

import { router, publicProcedure, protectedProcedure } from '../trpc';

export const tradeRouter = router({
  addTrades: protectedProcedure
    .input(z.array(z.object({ id: z.string(), userId: z.string(), balance: z.number(), platform: z.string(), side: z.string(), grossProfit: z.number(), netProfit: z.number(), totalCommission: z.number(), winLoss: z.string(), symbol: z.string(),openPrice: z.number(), closePrice: z.number(), dateOpened: z.date(), dateClosed: z.date() })))
    .mutation(async ({ctx, input}) => {
      const trades = await ctx.prisma.trade.createMany({
        data: input ?? [],
        skipDuplicates: true,
      });
      // Add relevant trades to a Trade
      // Return the trades and a success message
      return { trades, message: `${input.length} trades added successfully!` };
      
    }
  ),
  addTagsToTrade: protectedProcedure
    .input(z.object({ tradeId: z.string(), tags: z.array(z.object({ name: z.string(), userId: z.string() })) }))
    .mutation(async ({ctx, input}) => {
      // get the trade
      const trade = await ctx.prisma.trade.findUnique({
        where: {
          id: input.tradeId,
        },
      });
      // make sure the trade belongs to the user
      if (trade?.userId !== ctx.session.user.id) {
        throw new Error('Trade does not belong to user');
      }

      // add the tags to the trade and if tags don't exist, create them
      const tags = await ctx.prisma.trade.update({
        where: {
          id: input.tradeId,
        },
        data: {
          tags: {
            connectOrCreate: input.tags.map(tag => ({
              where: {
                name_userId: {
                  name: tag.name,
                  userId: tag.userId,
                },
              },
              create: {
                name: tag.name,
                userId: tag.userId,
              },
            })),
          },
        },
        include: {
          tags: true,
        },
      });

      return tags;

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
  getUserPlatforms: protectedProcedure
    .query(async ({ctx}) => {
      const trades = await ctx.prisma.trade.findMany();
      // get only the users trades
      const userTrades = trades.filter(trade => trade.userId === ctx.session.user.id);
      // get all unique platforms
      const platforms = [...new Set(userTrades.map(trade => trade.platform))];
      return platforms;
    }
  ),
  getTradeById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ctx, input}) => {
      // include tags and executions
      const trade = await ctx.prisma.trade.findUnique({
        where: {
          id: input.id,
        },
        include: {
          tags: true,
          executions: true,
        },
      });
      // make sure the trade belongs to the user
      if (trade?.userId !== ctx.session.user.id) {
        throw new Error('Trade does not belong to user');
      }

      return trade;
    }
  ),
})