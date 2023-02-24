# 🚧 Under Construction 🚧


# 🇮🇹 tiw

tiw (Top Italian Words) is a web app that helps you learn the most common Italian words.

## Core Principles:

## ⚡ **Speed** ⚡

  * It is very important to me that the revision process has as little friction as possible and that the user can do their daily practice in a very short amount of time.


## 🗽 **Freedom** 🗽

  * The user can decide themselves if they got the word right or wrong. 

  * There is no comparison with other users, no ranking, no leaderboards.

  * Getting the word right or wrong is not a matter of pride, it is a matter of learning. It only adapts the learning process to the user's needs.

  * Therefore the user is incentivized to be honest with themselves about their progress.

---
## Word List:

The full word list is available in the [words](words/words.csv) folder.

It will also be added as a separate page to the website.

---

## Algorithm:

The spaced repetition algorithm is currently based on a very simple algorithm that I came up with myself.

This function calculates the number of days from the last review to the next review as follows:

  * $D(\text{Counter}) = \text{round}(0.44914437 \cdot 2.05504173 ^{Counter})$
  * $D(1) = 1$
  * $D(2) = 2$
  * $D(3) = 4$
  * $D(4) = 8$
  * $D(5) = 16$
  * $D(6) = 34$
  * $D(7) = 70$
  * $D(8) = 143$

I plan on implementing a more sophisticated algorithm, like [SM-2](https://en.wikipedia.org/wiki/SuperMemo),  in the future.

---
## Contributing:

  This is my first web app and I am still learning. If you have any suggestions or improvements, please let me know.

  A full guide on how to fork and contribute to this project will be added soon.

---

