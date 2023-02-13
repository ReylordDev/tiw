import { parse } from "csv-parse";
import * as path from "path";
import * as fs from "fs";
import { prisma } from "../src/server/db";

type Word = {
  italian: string;
  english: string;
  german: string;
  rank: number;
};

const doBackfill = () => {
  const csvFilePath = path.resolve(__dirname, "../words/words.csv");
  console.log("filepath", csvFilePath);

  const headers = ["italian", "english", "german", "rank"];

  const fileContent = fs.readFileSync(csvFilePath, { encoding: "utf-8" });

  parse(
    fileContent,
    {
      delimiter: ",",
      columns: headers,
      fromLine: 2,
      skip_empty_lines: true,
      cast: (value, context) => {
        if (context.column === "rank") {
          return parseInt(value, 10);
        }
        return value;
      },
    },
    (err, result: Word[]) => {
      if (err) {
        console.error(err);
      }
      result.map(async (word) => {
        console.log(word);
        await prisma.word.create({
          data: {
            italian: word.italian,
            english: word.english,
            german: word.german,
            rank: word.rank,
          },
        });
      });
    }
  );
};

doBackfill();
