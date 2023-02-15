import React, { useState } from "react";
import { api } from "../../utils/api";

export default function AddWordsModal(props: {
  setModal: (open: boolean) => void;
  userId: string;
}) {
  const [count, setCount] = useState<string>("");
  const { data, isLoading } = api.user.getById.useQuery({ id: props.userId });
  if (!data || isLoading) return <div>Loading...</div>;
  const currentRank = data.currentRankProgress;
  const { mutate: createPracticesFromRank } =
    api.practice.createPracticesFromRank.useMutation();
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/90">
      <div className=" lg:border-6 rounded-2xl border-4 bg-green-900 px-6 py-4 text-center text-xl lg:px-14 lg:py-8 lg:text-4xl ">
        <h3 className="pb-4 font-medium">How many words?</h3>
        <input
          type="number"
          value={count}
          onChange={(e) => {
            setCount(e.target.value);
          }}
          min={1}
          max={1000}
          className="w-1/2 rounded-md bg-[#121212] px-1 text-center shadow-sm focus:border-red-300 focus:ring"
        />
        <div className="flex justify-around py-4">
          <button
            className="rounded-md bg-[#121212] px-4 py-2"
            onClick={() => {
              props.setModal(false);
            }}
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-[#121212] px-4 py-2"
            onClick={() => {
              createPracticesFromRank({
                userId: props.userId,
                count: parseInt(count),
                rank: currentRank,
              });
              props.setModal(false);
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
