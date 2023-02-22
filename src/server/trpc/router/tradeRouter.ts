import { z } from 'zod';

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
  addTagToTrade: protectedProcedure
    .input(z.object({ tradeId: z.string(), tagId: z.string(), tagName: z.string() }))
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

      // let tagsToSubmit = [];

      // // Check if the tags exist by name and userId
      // const existingUserTags = await ctx.prisma.tag.findMany({
      //   where: {
      //     name: {
      //       in: input.tags.map(tag => tag.name),
      //     },
      //     userId: ctx.session.user.id,
      //   },
      // });

      // // check if the tag exists on the trade
      // const existingTradeTags = await ctx.prisma.tradeTag.findMany({
      //   where: {
      //     tradeId: input.tradeId,
      //     tagId: {
      //       in: existingUserTags.map(tag => tag.id),
      //     },
      //   },
      // });

      

      

      // add the tags to the trade using tradeId, if the tag does not exist, create it
      const tradeTags = await ctx.prisma.trade.update({
        where: {
          id: input.tradeId,
        },
        data: {
          tradeTags: {
            // For a single tag, 
            create: {
              tag: {
                connectOrCreate: {
                  where: {
                    tagIdentifier: {
                      name: input.tagName,
                      userId: ctx.session.user.id,
                    },
                  },
                  create: {
                    id: input.tagId,
                    name: input.tagName,
                    userId: ctx.session.user.id,
                  },
                },
              },
            },
          },
        },
        include: {
          tradeTags: true,
        },
      });

      // Return the trade and a success message
      return tradeTags


    }

  ),
  getTrades: protectedProcedure
    .query(async ({ctx}) => {
      const trades = await ctx.prisma.trade.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        orderBy: {
          dateClosed: 'desc',
        },
      });

      return trades;
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
  updateTradeWithNotes: protectedProcedure
    .input(z.object({ id: z.string(), notes: z.string() }))
    .mutation(async ({ctx, input}) => {
      // include tags and executions
      const trade = await ctx.prisma.trade.update({
        where: {
          id: input.id,
        },
        data: {
          notes: input.notes,
        },
      });
      // make sure the trade belongs to the user
      if (trade?.userId !== ctx.session.user.id) {
        throw new Error('Trade does not belong to user');
      }

      return trade;
    }
  ),
  getTradeAnalytics: protectedProcedure
    .query(async ({ctx}) => {
      const trades = await ctx.prisma.trade.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });

      // get overall win rate
      const totalTrades = trades.length;
      const totalWins = trades.filter(trade => trade.winLoss === 'WIN').length;
      const totalLosses = trades.filter(trade => trade.winLoss === 'LOSS').length;
      const winRate = (totalWins / totalTrades) * 100;
      // get overall average profit
      const totalProfit = trades.reduce((acc, trade) => acc + trade.netProfit, 0);
      const averageProfit = totalProfit / totalTrades;
      // get average profit per trade by win/loss
      const totalWinProfit = trades.filter(trade => trade.winLoss === 'WIN').reduce((acc, trade) => acc + trade.netProfit, 0);
      const totalLossProfit = trades.filter(trade => trade.winLoss === 'LOSS').reduce((acc, trade) => acc + trade.netProfit, 0);
      const averageWinProfit = totalWinProfit / totalWins;
      const averageLossProfit = totalLossProfit / totalLosses;
      // get risk/reward ratio
      const riskRewardRatio = Number(Math.abs(averageWinProfit / averageLossProfit).toFixed(2));

      return [
        { name: 'Total Trades', value: totalTrades },
        { name: 'Total Wins', value: totalWins },
        { name: 'Total Losses', value: totalLosses },
        { name: 'Win Rate', value: Number(winRate.toFixed(2)) },
        { name: 'Total Profit', value: Number(totalProfit.toFixed(2)) },
        { name: 'Average Profit', value: Number(averageProfit.toFixed(2)) },
        { name: 'Win Total', value: Number(totalWinProfit.toFixed(2)) },
        { name: 'Loss Total', value: Number(totalLossProfit.toFixed(2)) },
        { name: 'Average Win', value: Number(averageWinProfit.toFixed(2)) },
        { name: 'Average Loss', value: Number(averageLossProfit.toFixed(2)) },
        { name: 'Risk/Reward Ratio', value: riskRewardRatio },
      ]
    }
  ),
})