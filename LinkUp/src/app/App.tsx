import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "../router/router";

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-4 text-sm">Завантаження...</div>}>
        <AppRouter />
      </Suspense>
    </BrowserRouter>
  );
}
