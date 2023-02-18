import Link from "next/link";
import { useTranslations } from "next-intl";

export default function BackButton() {
  const t = useTranslations();
  return (
    <Link
      href="/"
      className="rounded-2xl border-2 p-2 text-2xl md:px-4 md:py-3 md:text-3xl lg:px-6 lg:py-4 lg:text-4xl "
    >
      {t("Revision.back")}
    </Link>
  );
}
