import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      const User = ctx.prisma.user.findUnique({
        where: { id: input.id },
        include: {
          Practices: {},
        },
      });
      return User;
    }),
  updateCurrentRank: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        newRank: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: input.id },
        data: { currentRankProgress: input.newRank },
      });
    }),
});
