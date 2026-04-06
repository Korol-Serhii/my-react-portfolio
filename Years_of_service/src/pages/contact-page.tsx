import { useTranslation } from "react-i18next";

export const ContactPage = () => {
  const { i18n } = useTranslation();
  const isUk = i18n.language.startsWith("uk");

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">{isUk ? "Контакти" : "Contacts"}</h1>
      <p className="mt-3 text-slate-600">
        {isUk
          ? "Для запитань щодо використання калькулятора зверніться до автора проєкту."
          : "For questions about using the calculator, contact the project author."}
      </p>
    </section>
  );
};
