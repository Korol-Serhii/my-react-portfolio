import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
    isActive
      ? "bg-slate-900 text-white"
      : "text-slate-700 hover:bg-slate-200 hover:text-slate-900"
  }`;

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const nextLanguage = i18n.language.startsWith("uk") ? "en" : "uk";
    void i18n.changeLanguage(nextLanguage);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur transition-all duration-300">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8 xl:px-10">
        <Link
          to="/"
          className="text-base font-semibold text-slate-900 transition-all duration-300 hover:text-blue-700 sm:text-lg"
        >
          {t("app.title")}
        </Link>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-700 transition-all duration-300 hover:bg-slate-100 md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={t("nav.toggleMenu")}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            {t("nav.home")}
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            {t("nav.about")}
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            {t("nav.contact")}
          </NavLink>
          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-300 hover:border-slate-500 hover:text-slate-900"
          >
            {i18n.language.startsWith("uk") ? "EN" : "UK"}
          </button>
        </div>
      </div>

      <div
        className={`border-t border-slate-200 bg-white px-4 py-3 transition-all duration-300 md:hidden ${
          isMenuOpen ? "max-h-80 opacity-100" : "max-h-0 overflow-hidden py-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-2">
          <NavLink to="/" className={navLinkClass} end onClick={() => setIsMenuOpen(false)}>
            {t("nav.home")}
          </NavLink>
          <NavLink to="/about" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
            {t("nav.about")}
          </NavLink>
          <NavLink to="/contact" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
            {t("nav.contact")}
          </NavLink>
          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded-lg border border-slate-300 px-3 py-2 text-left text-sm font-medium text-slate-700 transition-all duration-300 hover:border-slate-500 hover:text-slate-900"
          >
            {t("nav.switchLanguage")}
          </button>
        </nav>
      </div>
    </header>
  );
};
