import { z } from 'zod';

import { router, publicProcedure, protectedProcedure } from '../trpc';

export const tradeAccountRouter = router({
  addTradeAccount: protectedProcedure
  .input(z.object({ id: z.string() ,identifier: z.string(), balance: z.number().nullish(), platform: z.string(), name: z.string().nullish() }))
  .mutation(async ({ctx, input}) => {
    const name = input.name ? input.name : ""

    const tradeAccount = await ctx.prisma.tradeAccount.create({
      data: {
        id: input.id,
        identifier: input.identifier,
        balance: input.balance,
        platform: input.platform,
        name,
        userId: ctx.session.user.id,
      },
    });
    return tradeAccount;
  }),
  updateTradeAccount: protectedProcedure
  .input(z.object({ id: z.string(), balance: z.number().nullish(), name: z.string().nullish() }))
  .mutation(async ({ctx, input}) => {
    const name = input.name ? input.name : ""
    const tradeAccount = await ctx.prisma.tradeAccount.update({
      where: {
        id: input.id,
      },
      data: {
        balance: input.balance,
        name
      },
    });
    return tradeAccount;
  }
  ),
  deleteTradeAccount: protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ctx, input}) => {
    const tradeAccount = await ctx.prisma.tradeAccount.delete({
      where: {
        id: input.id,
      },
    });
    return tradeAccount;
  }
  ),
  getTradeAccounts: protectedProcedure
  .query(async ({ctx}) => {
    const tradeAccounts = await ctx.prisma.tradeAccount.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    return tradeAccounts;
  }
  ),
  getTradeAccountById: protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ctx, input}) => {
    const tradeAccount = await ctx.prisma.tradeAccount.findUnique({
      where: {
        id: input.id,
      },
    });
    return tradeAccount;
  }
  ),
  getTradeAccountsByPlatform: protectedProcedure
  .input(z.object({ platform: z.string() }))
  .query(async ({ctx, input}) => {
    const tradeAccount = await ctx.prisma.tradeAccount.findMany({
      where: {
        platform: input.platform,
        userId: ctx.session.user.id,
      },
    });
    return tradeAccount;
  }
  ),
  getTradeAccountByIdentifier: protectedProcedure
  .input(z.object({ identifier: z.string() }))
  .query(async ({ctx, input}) => {
    const tradeAccount = await ctx.prisma.tradeAccount.findUnique({
      where: {
        tradeAccountIdentifier: {
          identifier: input.identifier,
          userId: ctx.session.user.id,
        },
      },
    });
    return tradeAccount;
  }
  ),
});