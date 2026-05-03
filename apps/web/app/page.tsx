import { EDUTRACK_APP_NAME } from "@edutrack/shared";
import { EduTrackPlaceholder } from "@edutrack/ui";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 px-6 py-16 text-center">
      <EduTrackPlaceholder />
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Bonjour — {EDUTRACK_APP_NAME}
      </h1>
      <p className="max-w-md text-sm text-zinc-600">
        Monorepo pnpm : applications web, API, bureau et paquets partagés sont
        câblés. Lancez <code className="rounded bg-zinc-200 px-1">pnpm dev</code> à la racine.
      </p>
    </div>
  );
}
