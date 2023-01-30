import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const practiceRouter = createTRPCRouter({
  getDuePracticesByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      const result = ctx.prisma.practice.findMany({
        where: {
          userId: input.userId,
          nextPractice: {
            lte: new Date(),
          },
        },
        include: {
          word: true,
        },
      });
      return result;
    }),
  updatePractice: protectedProcedure
    .input(
      z.object({
        practiceId: z.string(),
        newCounter: z.number(),
        nextPractice: z.date(),
      })
    )
    .mutation(({ ctx, input }) => {
      const result = ctx.prisma.practice.update({
        where: {
          id: input.practiceId,
        },
        data: {
          nextPractice: new Date(),
          lastPractice: new Date(),
          counter: input.newCounter,
        },
      });
      return result;
    }),
});
