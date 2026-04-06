import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Footer } from "../components/layout/footer";
import { Navbar } from "../components/layout/navbar";

const HomePage = lazy(() =>
  import("../pages/home-page").then((module) => ({ default: module.HomePage })),
);
const AboutPage = lazy(() =>
  import("../pages/about-page").then((module) => ({ default: module.AboutPage })),
);
const ContactPage = lazy(() =>
  import("../pages/contact-page").then((module) => ({
    default: module.ContactPage,
  })),
);

export const AppRouter = () => {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 transition-all duration-300">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8 xl:px-10">
        <Suspense
          fallback={
            <div className="rounded-xl bg-white p-6 text-center shadow-sm">
              Завантаження...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};
