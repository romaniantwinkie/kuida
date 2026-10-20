"use client";

import { createContext, useContext } from "react";

export type AgencyAccount = {
  demo: boolean;
  name: string;
  email: string;
};

const AgencyAccountContext = createContext<AgencyAccount>({
  demo: true,
  name: "",
  email: "",
});

export function AgencyAccountProvider({ value, children }: { value: AgencyAccount; children: React.ReactNode }) {
  return <AgencyAccountContext.Provider value={value}>{children}</AgencyAccountContext.Provider>;
}

export function useAgencyAccount() {
  return useContext(AgencyAccountContext);
}
