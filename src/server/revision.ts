import type { Practice, Word } from "@prisma/client";

const initial = 0.44914437;
const growth = 2.05504173;

export default function calculateNextRevisionDate(
  lastPractice: Date,
  counter: number
) {
  lastPractice.setHours(0, 0, 0, 0);
  const days = Math.round(initial * growth ** counter);
  console.log(days);
  lastPractice.setDate(lastPractice.getDate() + days);
  console.log(lastPractice);
  return lastPractice;
}

//round(0.44914437 * 2.05504173 ^ prop("Counter"))

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

  console.log("Completing Practice", practice);
  console.log("newCounter", newCounter);
  console.log("nextPracticeDate", nextPracticeDate);

  return {
    newCounter,
    nextPracticeDate,
  };
}
