import { EDUTRACK_APP_NAME } from "@edutrack/shared";
import { EduTrackPlaceholder } from "@edutrack/ui";

import { fr } from "@/lib/locales/fr";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 px-6 py-16 text-center">
      <EduTrackPlaceholder />
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        {fr.home.greeting} — {EDUTRACK_APP_NAME}
      </h1>
      <p className="max-w-md text-sm text-zinc-600">
        {fr.home.blurb}{" "}
        <code className="rounded bg-zinc-200 px-1">{fr.home.blurbCodeLabel}</code>{" "}
        {fr.home.blurbSuffix}
      </p>
    </div>
  );
}
