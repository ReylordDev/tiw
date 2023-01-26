import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      const User = ctx.prisma.user.findUnique({
        where: { id: input.id },
      });
      return User;
    }),
  getDuePractices: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      const result = ctx.prisma.user.findUnique({
        where: { id: input.id },
        include: {
          Practices: {
            where: {
              nextPractice: {
                lte: new Date(),
              },
            },
          },
        },
      });
      return result;
    }),
});
