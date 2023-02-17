import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

export function LanguageSelectionButton({ url }: { url: string }) {
  const t = useTranslations();
  const { locale } = useRouter();
  const localeValue = locale === "en" ? "de" : "en";
  return (
    <Link
      className="flex w-44 flex-row items-center gap-4 rounded-2xl border-2 p-2 md:w-52 lg:w-64 lg:p-4"
      href={url}
      locale={localeValue}
    >
      <Image
        src={"../globe.svg"}
        height={32}
        width={32}
        alt="Globe for language selection"
        className="md:h-12 md:w-12 lg:h-16 lg:w-16"
      />
      <p className="pr-2 text-2xl md:text-3xl lg:text-4xl">
        {t("Index.languageSelectionButton")}
      </p>
    </Link>
  );
}
