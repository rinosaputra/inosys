import { os } from "@orpc/server";

export interface BaseContext {
  // Add any properties you want to be available in the context here
}

export const base = os.$context<BaseContext>()
