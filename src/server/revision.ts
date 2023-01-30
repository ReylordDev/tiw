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
