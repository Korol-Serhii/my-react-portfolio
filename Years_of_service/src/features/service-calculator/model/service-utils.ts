import type { ServiceDurationWithError } from "../../../shared/types/service";

export const calculateDateDifference = (
  startStr: string,
  endStr: string,
  dateOrderError: string,
): ServiceDurationWithError | null => {
  if (!startStr || !endStr) return null;

  const start = new Date(startStr);
  const end = new Date(endStr);
  if (start > end) return { y: 0, m: 0, d: 0, error: dateOrderError };

  let d1 = start.getDate();
  let m1 = start.getMonth() + 1;
  let y1 = start.getFullYear();
  let d2 = end.getDate();
  let m2 = end.getMonth() + 1;
  let y2 = end.getFullYear();

  let days = d2 - d1;
  let months = m2 - m1;
  let years = y2 - y1;

  // Український коментар: алгоритм "30 днів у місяці" вимагає позичання 30/12.
  if (days < 0) {
    days += 30;
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { y: years, m: months, d: days };
};

export const normalizeToDays = (y: number, m: number, d: number): number => y * 360 + m * 30 + d;

export const denormalizeFromDays = (totalDays: number) => {
  const y = Math.floor(totalDays / 360);
  const remainder = totalDays % 360;
  const m = Math.floor(remainder / 30);
  const d = Math.round(remainder % 30);
  return { y, m, d };
};
