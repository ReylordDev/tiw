//round(0.44914437 * 2.05504173 ^ prop("Counter"))
const initial = 0.44914437;
const growth = 2.05504173;

export function calculateNextRevisionDate(counter: number) {
  const days = Math.round(initial * growth ** counter);
  console.log("days", days);
  const nextPractice = new Date();
  nextPractice.setDate(nextPractice.getDate() + days);
  nextPractice.setHours(0, 0, 0, 0);
  return nextPractice;
}

export function calculateNewCounter(correct: boolean, counter: number) {
  let newCounter: number;
  if (correct) {
    newCounter = counter + 1;
  } else {
    newCounter = counter > 0 ? counter - 1 : 0;
  }
  return newCounter;
}
