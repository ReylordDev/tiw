import type { Practice } from "@prisma/client";

//round(0.44914437 * 2.05504173 ^ prop("Counter"))
const initial = 0.44914437;
const growth = 2.05504173;

export function calculateNextRevisionDate(lastPractice: Date, counter: number) {
  const days = Math.round(initial * growth ** counter);
  console.log("days", days);
  const nextPractice = new Date(lastPractice.getTime());
  nextPractice.setDate(nextPractice.getDate() + days);
  nextPractice.setHours(0, 0, 0, 0);
  return nextPractice;
}

export function completePractice(correct: boolean, practice: Practice) {
  let newCounter: number;
  if (correct) {
    newCounter = practice.counter + 1;
  } else {
    newCounter = practice.counter > 0 ? practice.counter - 1 : 0;
  }

  const nextPracticeDate = calculateNextRevisionDate(
    practice.lastPractice,
    newCounter
  );

  return {
    newCounter,
    nextPracticeDate,
  };
}
