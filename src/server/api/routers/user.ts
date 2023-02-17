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
        userId: z.string(),
        newRank: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      const result = ctx.prisma.user.update({
        where: { id: input.userId },
        data: { currentRankProgress: input.newRank },
      });
      console.log(result);
      return result;
    }),
});
