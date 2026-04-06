import i18n from "../../i18n/i18n";

export function getTranslation(
  key: string,
  lang = "uk",
  params?: Record<string, unknown>
): string {
  if (i18n.language !== lang) {
    void i18n.changeLanguage(lang);
  }

  const value = i18n.t(key, params);
  return typeof value === "string" ? value : key;
}
