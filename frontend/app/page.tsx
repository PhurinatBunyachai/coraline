import { RockPaperScissorsGame } from '@/features/rock-paper-scissors/RockPaperScissorsGame';

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-violet-100 via-sky-50 to-rose-100 p-4 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 sm:p-8">
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-violet-400/30 blur-3xl dark:bg-violet-600/20" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-rose-400/30 blur-3xl dark:bg-rose-600/20" />
      <RockPaperScissorsGame />
    </main>
  );
}
