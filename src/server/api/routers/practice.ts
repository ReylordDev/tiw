import { count } from "console";
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
          nextPractice: input.nextPractice,
          lastPractice: new Date(),
          counter: input.newCounter,
        },
      });
      return result;
    }),
  initializePractice: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        wordId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const result = ctx.prisma.practice.create({
        data: {
          userId: input.userId,
          wordId: input.wordId,
          lastPractice: new Date(),
          nextPractice: new Date(),
          counter: 0,
        },
      });
      return result;
    }),
  createPracticesFromRank: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        rank: z.number(),
        count: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      ctx.prisma.word
        .findMany({
          where: {
            rank: {
              gte: input.rank,
            },
          },
          take: input.count,
          select: {
            id: true,
          },
        })
        .then((wordIds) => {
          wordIds.forEach((word) => {
            ctx.prisma.practice
              .create({
                data: {
                  userId: input.userId,
                  wordId: word.id,
                  lastPractice: new Date(),
                  nextPractice: new Date(),
                  counter: 0,
                },
              })
              .catch((err) => {
                console.log(err);
              });
          });
        })
        .catch((err) => {
          console.log(err);
        });
      ctx.prisma.user
        .update({
          where: {
            id: input.userId,
          },
          data: {
            currentRankProgress: input.rank + input.count,
          },
        })
        .catch((err) => {
          console.log(err);
        });
    }),
});
