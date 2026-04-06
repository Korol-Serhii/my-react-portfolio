import { useTranslation } from "react-i18next";

export const AboutPage = () => {
  const { i18n } = useTranslation();
  const isUk = i18n.language.startsWith("uk");

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">{isUk ? "Про проєкт" : "About project"}</h1>
      <p className="mt-3 text-slate-600">
        {isUk
          ? "Додаток допомагає швидко обчислювати календарну та пільгову вислугу за методикою 30 днів у місяці."
          : "The application helps quickly calculate calendar and preferential service using the 30-day month method."}
      </p>
    </section>
  );
};
