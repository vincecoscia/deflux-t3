import { z } from 'zod';

import { router, publicProcedure, protectedProcedure } from '../trpc';

export const executionRouter = router({
  addExecutions: protectedProcedure
    .input(z.array(z.object({ id: z.string(), symbol: z.string(), price: z.number(), commission: z.number(), quantity: z.number(), return: z.number().nullish(), dateTime: z.date(), side: z.string(), platform: z.string(), userId: z.string(), tradeId: z.string(), percentClosed: z.number() })))
    .mutation(async ({ctx, input}) => {
      const trades = await ctx.prisma.execution.createMany({
        data: input ?? [],
        skipDuplicates: true,
      });
      // Add relevant executions to a Trade

      return trades;
    }
  ),
  getExecutions: protectedProcedure
    .query(async ({ctx}) => {
      const executions = await ctx.prisma.execution.findMany();
      // get only the users trades
      const userExecutions = executions.filter(execution => execution.userId === ctx.session.user.id);
      return userExecutions;

    }
  ),

})