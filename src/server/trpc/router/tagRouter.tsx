import { z } from 'zod';

import { router, publicProcedure, protectedProcedure } from '../trpc';

export const tagRouter = router({
  addTags: protectedProcedure
    .input(z.array(z.object({ id: z.string(), name: z.string(), userId: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const tags = await ctx.prisma.tag.createMany({
        data: input,
        skipDuplicates: true,
      });
      return tags;
    }),
  getTags: protectedProcedure
    .query(async ({ ctx, input }) => {
      const tags = await ctx.prisma.tag.findMany({
        where: { userId: ctx.session.user.id },
      });
      return tags;
    }
    ),
    getTagsByTradeId: protectedProcedure
    .input(z.object({ tradeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const tags = await ctx.prisma.tradeTag.findMany({
        where: { tradeId: input.tradeId },
        include: {
          tag: true,
        },
      });
      return tags;
    }
    ),

  deleteTag: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tag = await ctx.prisma.tag.delete({
        where: { id: input.id },
      });
      return tag;
    }
    ),
    deleteTagFromTrade: protectedProcedure
    .input(z.object({ tradeId: z.string(), tagId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tag = await ctx.prisma.tradeTag.delete({
        where: { tradeTagIdentifier: { tradeId: input.tradeId, tagId: input.tagId } },
      });
      return tag;
    }
    ),
  updateTagColor: protectedProcedure
    .input(z.object({ id: z.string(), color: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tag = await ctx.prisma.tag.update({
        where: { id: input.id },
        data: { color: input.color },
      });
      return tag;
    }
    ),
    getTradesByTag: protectedProcedure
    .input(z.object({ tagId: z.string() }))
    .query(async ({ ctx, input }) => {
      const trades = await ctx.prisma.tradeTag.findMany({
        where: { tagId: input.tagId },
        include: {
          trade: true,
        },
      });
      return trades;
    }
    ),
    getTagAnalytics: protectedProcedure
    .query(async ({ ctx }) => {
      const trades = await ctx.prisma.trade.findMany({
        where: { 
          userId: ctx.session.user.id,
        },
        include: {
          tradeTags: true,
        },
      });
      const tags = await ctx.prisma.tag.findMany({
        where: {
          userId: ctx.session.user.id,
          tradeTags: {
            some: {
              trade: {
                userId: ctx.session.user.id,
              },
            }
          },
        },
      });
      // get win rate for each tag
      const tagAnalytics = tags.map((tag) => {
        const tradesWithThisTag = trades.filter((trade) => {
          return trade.tradeTags.find((tradeTag) => tradeTag.tagId === tag.id);
        });
        const tradesWithThisTagAndProfit = tradesWithThisTag.filter((trade) => trade.winLoss === "WIN");
        const winRate = tradesWithThisTagAndProfit.length / tradesWithThisTag.length;
        
        const totalProfit = tradesWithThisTagAndProfit.reduce((acc, trade) => acc + trade.netProfit, 0);
        const avgProfit = totalProfit / tradesWithThisTagAndProfit.length;

        const totalWin = tradesWithThisTagAndProfit.reduce((acc, trade) => acc + trade.netProfit, 0);
        const avgWin = totalWin / tradesWithThisTagAndProfit.length;

        const tradesWithThisTagAndLoss = tradesWithThisTag.filter((trade) => trade.winLoss === "LOSS");
        const totalLoss = tradesWithThisTagAndLoss.reduce((acc, trade) => acc + trade.netProfit, 0);

        const avgLoss = totalLoss / tradesWithThisTagAndProfit.length;
        const riskReward = totalProfit / totalLoss;

        return { tag, winRate, avgProfit, avgWin, avgLoss, riskReward };
      });

      return tagAnalytics;
    }
    ),
    
});