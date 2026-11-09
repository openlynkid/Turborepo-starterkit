import type { Instrumentation } from "next";

/**
 * Server-side error reporting hook. Wire a provider (Sentry, Axiom, a webhook,
 * ...) here to capture production errors. Logging to stderr is the safe
 * default: container platforms and log drains collect it without extra setup.
 */
export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  const digest =
    typeof error === "object" && error !== null && "digest" in error
      ? String((error as { digest?: unknown }).digest)
      : undefined;

  console.error(
    JSON.stringify({
      level: "error",
      source: "onRequestError",
      message: error instanceof Error ? error.message : String(error),
      digest,
      method: request.method,
      path: request.path,
      routerKind: context.routerKind,
      routePath: context.routePath,
      routeType: context.routeType,
    }),
  );
};
