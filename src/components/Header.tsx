"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="h-14 shrink-0 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div />
      <div className="flex items-center gap-4 text-sm">
        {session ? (
          <>
            <BalansHeader userId={session.user.id} />
            <span className="text-gray-400">•</span>
            <span className="font-medium text-gray-700">{session.user.pseudonim}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Odjava
            </button>
          </>
        ) : (
          <span className="text-gray-400 text-xs">Učitavam...</span>
        )}
      </div>
    </header>
  );
}

function BalansHeader({ userId }: { userId: string }) {
  const [balans, setBalans] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/profil/balans")
      .then((r) => r.json())
      .then((d) => setBalans(d.balance ?? 0))
      .catch(() => setBalans(0));
  }, [userId]);

  return (
    <span className="text-gray-500">
      <span className="font-medium text-gray-900">
        {balans === null ? "..." : balans.toLocaleString()}
      </span>{" "}
      POEN
    </span>
  );
}
