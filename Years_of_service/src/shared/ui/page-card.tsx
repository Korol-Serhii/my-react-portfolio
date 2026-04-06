import type { PropsWithChildren } from "react";

export const PageCard = ({ children }: PropsWithChildren) => {
  return <div className="rounded-2xl bg-white p-6 shadow-sm">{children}</div>;
};
