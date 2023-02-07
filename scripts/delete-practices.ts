import { prisma } from "../src/server/db";

const deletePractices = async () => {
  await prisma.practice.deleteMany();
};

deletePractices().catch((e) => {
  console.error(e);
});
