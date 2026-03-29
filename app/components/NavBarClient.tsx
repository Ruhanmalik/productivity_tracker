"use client";

import Link from "next/link";

type NavBarClientProps = {
  userEmail: string | null;
};

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        fontFamily: "var(--font-family-sans)",
        fontSize: 13,
        fontWeight: 500,
        color: "#71717A",
        textDecoration: "none",
        padding: "4px 10px",
        borderRadius: 6,
        transition: "color 0.15s, background 0.15s",
      }}
      onMouseEnter={(e) => {
        const t = e.currentTarget as HTMLAnchorElement;
        t.style.color = "#F0F0F2";
        t.style.background = "#1C1C1F";
      }}
      onMouseLeave={(e) => {
        const t = e.currentTarget as HTMLAnchorElement;
        t.style.color = "#71717A";
        t.style.background = "transparent";
      }}
    >
      {children}
    </Link>
  );
}

export function NavBarClient({ userEmail }: NavBarClientProps) {
  const user = userEmail !== null;

  return (
    <nav
      style={{
        height: 56,
        background: "#0C0C0E",
        borderBottom: "1px solid #1C1C1F",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-family-mono)",
            fontSize: 13,
            fontWeight: 500,
            color: "#00D97E",
            textDecoration: "none",
            letterSpacing: "0.1em",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              background: "#00D97E",
              borderRadius: "50%",
              boxShadow: "0 0 8px #00D97E",
              flexShrink: 0,
            }}
          />
          SCHEDULE.IO
        </Link>

        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <NavLink href="/">Events</NavLink>
            <NavLink href="/calendar">Calendar</NavLink>
          </div>
        )}
      </div>

      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              fontFamily: "var(--font-family-mono)",
              fontSize: 11,
              color: "#52525B",
              letterSpacing: "0.02em",
            }}
          >
            {userEmail}
          </span>
          <form action="/auth/logout" method="post">
            <button
              type="submit"
              style={{
                fontFamily: "var(--font-family-sans)",
                fontSize: 12,
                fontWeight: 500,
                color: "#71717A",
                background: "transparent",
                border: "1px solid #2A2A2D",
                borderRadius: 6,
                padding: "5px 12px",
                cursor: "pointer",
                transition: "color 0.15s, border-color 0.15s, background 0.15s",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={(e) => {
                const t = e.currentTarget;
                t.style.color = "#F87171";
                t.style.borderColor = "rgba(248,113,113,0.4)";
                t.style.background = "rgba(248,113,113,0.06)";
              }}
              onMouseLeave={(e) => {
                const t = e.currentTarget;
                t.style.color = "#71717A";
                t.style.borderColor = "#2A2A2D";
                t.style.background = "transparent";
              }}
            >
              Sign out
            </button>
          </form>
        </div>
      )}
    </nav>
  );
}
