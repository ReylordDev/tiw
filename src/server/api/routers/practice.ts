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
});
