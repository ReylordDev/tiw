import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const wordRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.word.findMany();
  }),
  getFromRank: protectedProcedure
    // todo: add input validation
    .input(z.object({ rank: z.number(), count: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.word.findMany({
        where: {
          rank: {
            gte: input.rank,
          },
        },
        take: input.count,
      });
    }),
});
