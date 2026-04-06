# Years of Service

Vite + React + TypeScript застосунок для розрахунку календарної та пільгової вислуги років за методикою `30 днів у місяці`.

## Основні можливості

- Розрахунок тривалості періодів служби та підсумкових значень.
- Підтримка коефіцієнтів: `0.5`, `1`, `1.5`, `2`, `3`.
- Експорт результатів у CSV (сумісний з Excel, UTF-8 BOM).
- Локалізація: українська (`uk`, за замовчуванням) та англійська (`en`).
- Маршрутизація через `react-router-dom` з lazy loading сторінок.
- Адаптивний інтерфейс з mobile menu (hamburger) та плавними transition.

## Технології

- `React 18`
- `TypeScript` (strict mode)
- `Vite 5`
- `Tailwind CSS`
- `react-router-dom` (v6.4+)
- `react-i18next` + `i18next-browser-languagedetector`

## Структура проєкту

```text
src/
├── app/         # App.tsx, providers, routes
├── pages/       # Home, About, Contact
├── components/  # Layout/UI компоненти
├── features/    # feature-модулі (service-calculator)
├── shared/      # constants, types, ui
├── assets/      # статичні ресурси
├── i18n/        # i18n.ts + locales/{uk,en}/common.json
├── router/      # router.tsx
├── styles/      # global.css
└── lib/         # утиліти (download/export)
```

## Встановлення

```bash
npm install
```

## Запуск

```bash
npm run dev
```

Dev-сервер: `http://localhost:5173`

## Перевірка та збірка

```bash
npm run typecheck
npm run build
npm run preview
```

## Змінні середовища

Створіть `.env` на основі `.env.example`:

```bash
cp .env.example .env
```

Доступні змінні:

- `VITE_APP_NAME`
- `VITE_DEFAULT_LOCALE`

## Локалізація

- Файли перекладів: `src/i18n/locales/uk/common.json` та `src/i18n/locales/en/common.json`.
- Мова за замовчуванням: `uk`.
- Перемикання мови доступне в navbar.
