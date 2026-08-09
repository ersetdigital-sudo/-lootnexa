export function LogoMark({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      aria-hidden="true"
      style={{ filter: "drop-shadow(0 6px 18px rgba(255,91,38,.45))" }}
    >
      <defs>
        <linearGradient id="lx-grad" x1="4" y1="2" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff8c5a" />
          <stop offset=".5" stopColor="#ff5b26" />
          <stop offset="1" stopColor="#c43a0d" />
        </linearGradient>
        <linearGradient id="lx-bolt" x1="14" y1="7" x2="27" y2="33" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#ffe8d6" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="13" fill="url(#lx-grad)" />
      <rect x="1" y="1" width="38" height="38" rx="13" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="1" />
      <path
        d="M23.1 6.6 11.6 22.1a.9.9 0 0 0 .72 1.44h5.1l-1.6 9.06a.62.62 0 0 0 1.1.5l11.6-15.6a.9.9 0 0 0-.72-1.44h-5.2l1.6-8.36a.62.62 0 0 0-1.1-.5Z"
        fill="url(#lx-bolt)"
      />
      <circle cx="31.4" cy="9.2" r="2.5" fill="#ff5b26" />
    </svg>
  );
}
