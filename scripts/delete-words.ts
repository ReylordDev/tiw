import { prisma } from "../src/server/db";

const deleteWords = async () => {
  await prisma.word.deleteMany();
};

deleteWords().catch((e) => {
  console.error(e);
});
