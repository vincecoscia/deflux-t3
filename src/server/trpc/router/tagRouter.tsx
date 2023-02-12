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
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const tags = await ctx.prisma.tag.findMany({
        where: { userId: input.userId },
      });
      return tags;
    }
    ),
    getTagsByTradeId: protectedProcedure
    .input(z.object({ tradeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const tags = await ctx.prisma.tradeTag.findMany({
        where: { tradeId: input.tradeId },
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
    
});