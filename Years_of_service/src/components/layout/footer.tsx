import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-200 bg-white py-5">
      <div className="mx-auto w-full max-w-7xl px-4 text-center text-sm text-slate-600 sm:px-6 lg:px-8 xl:px-10">
        {t("footer.note")}
      </div>
    </footer>
  );
};
