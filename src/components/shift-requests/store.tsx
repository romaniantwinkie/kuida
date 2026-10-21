"use client";

import { useEffect, useState } from "react";
import {
  createShiftRequest,
  parseStoredShiftRequests,
  respondToShiftRequest,
  type CreateShiftRequestInput,
  type ShiftRequest,
} from "@/lib/shift-requests";

const STORAGE_KEY = "kuidao.shiftRequests.v1";

let requests: ShiftRequest[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function persist() {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

function hydrateShiftRequests() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    requests = raw ? parseStoredShiftRequests(JSON.parse(raw)) : [];
  } catch {
    requests = [];
  }
  emit();
}

export function submitShiftRequest(input: CreateShiftRequestInput) {
  hydrateShiftRequests();
  const result = createShiftRequest(requests, input);
  if (!result.ok) return result;
  requests = [result.request, ...requests];
  persist();
  emit();
  return result;
}

export function answerShiftRequest(id: string, response: "accepted" | "declined") {
  hydrateShiftRequests();
  const result = respondToShiftRequest(requests, id, response);
  if (!result.ok) return result;
  requests = result.requests;
  persist();
  emit();
  return result;
}

export function useShiftRequests() {
  const [state, setState] = useState<ShiftRequest[]>(requests);
  useEffect(() => {
    hydrateShiftRequests();
    const listener = () => setState(requests);
    listeners.add(listener);
    setState(requests);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  return state;
}
