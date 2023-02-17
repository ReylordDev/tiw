import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { Loader } from "..";
import { api } from "../../utils/api";

export default function AddWordsModal(props: {
  setModal: (open: boolean) => void;
  userId: string;
}) {
  const t = useTranslations();
  const [count, setCount] = useState<string>("10");
  const { data, isLoading } = api.user.getById.useQuery({ id: props.userId });
  const { mutate: createPracticesFromRank } =
    api.practice.createPracticesFromRank.useMutation();
  if (!data || isLoading) return <Loader />;
  const currentRank = data.currentRankProgress;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/90">
      <div className=" lg:border-6 rounded-2xl border-4 bg-green-900 px-6 py-4 text-center text-xl lg:px-14 lg:py-8 lg:text-4xl ">
        <h3 className="pb-4 font-medium">{t("Index.AddWordsModal.howMany")}</h3>
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
            {t("Index.AddWordsModal.cancelButton")}
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
            {t("Index.AddWordsModal.addButton")}
          </button>
        </div>
      </div>
    </div>
  );
}
