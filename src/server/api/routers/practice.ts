import {
  calculateNewCounter,
  calculateNextRevisionDate,
} from "@/utils/revisionCalculations";
import shuffle from "@/utils/shuffle";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const practiceRouter = createTRPCRouter({
  getDuePracticesByContextShuffled: protectedProcedure.query(
    async ({ ctx }) => {
      const practices = await ctx.prisma.practice.findMany({
        where: {
          userId: ctx.session.user.id,
          nextPractice: {
            lte: new Date(),
          },
        },
        include: {
          word: true,
        },
      });
      const shuffledPractices = shuffle(practices);
      return shuffledPractices;
    }
  ),

  submitPractice: protectedProcedure
    .input(
      z.object({
        practiceId: z.string(),
        correct: z.boolean(),
        oldCounter: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      const newCounter = calculateNewCounter(input.correct, input.oldCounter);
      const nextPracticeDate = calculateNextRevisionDate(newCounter);
      const result = ctx.prisma.practice.update({
        where: {
          id: input.practiceId,
        },
        data: {
          nextPractice: nextPracticeDate,
          lastPractice: new Date(),
          counter: newCounter,
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

  createPracticesFromRank: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        rank: z.number(),
        count: z.number().min(1).max(1000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const wordIds = await ctx.prisma.word.findMany({
        where: {
          rank: {
            gt: input.rank,
          },
        },
        take: input.count,
        select: {
          id: true,
        },
        orderBy: {
          rank: "asc",
        },
      });
      wordIds.map(async (word) => {
        await ctx.prisma.practice.create({
          data: {
            userId: input.userId,
            wordId: word.id,
          },
        });
      });
      await ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          currentRankProgress: input.rank + input.count,
        },
      });
    }),

  getPracticesWithWordsByContext: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.practice.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        word: true,
      },
    });

    const sortedResult = result.sort((a, b) => a.word.rank - b.word.rank);
    return sortedResult;
  }),

  getDuePracticesCountWithWordsFromContext: protectedProcedure.query(
    ({ ctx }) => {
      const result = ctx.prisma.practice.count({
        where: {
          userId: ctx.session.user.id,
          nextPractice: {
            lte: new Date(),
          },
        },
      });
      return result;
    }
  ),
});
