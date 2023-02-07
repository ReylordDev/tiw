import { prisma } from "../src/server/db";

const resetUserRanks = async () => {
  await prisma.user.updateMany({
    data: {
      currentRankProgress: 0,
    },
  });
};

resetUserRanks().catch((e) => {
  console.error(e);
});
