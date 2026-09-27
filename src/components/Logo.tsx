import clsx from "clsx";

export function LogoMark({ className, light }: { className?: string; light?: boolean }) {
  const fill = light ? "#ffffff" : "url(#simplee-grad)";
  return (
    <svg viewBox="0 0 40 44" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="simplee-grad" cx="65%" cy="4%" r="141%">
          <stop offset="0%" stopColor="#5775E5" />
          <stop offset="100%" stopColor="#445EBE" />
        </radialGradient>
      </defs>
      <path
        d="M20 1.5 37.5 11.5v21L20 42.5 2.5 32.5v-21L20 1.5Z"
        fill="none"
        stroke={fill}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <rect x="10" y="17" width="4" height="17" rx="1" fill={fill} />
      <rect x="16" y="12" width="4" height="23" rx="1" fill={fill} />
      <rect x="22" y="15" width="4" height="20" rx="1" fill={fill} />
      <rect x="28" y="20" width="3" height="12" rx="1" fill={fill} />
    </svg>
  );
}

export function Logo({ className, light, size = "md" }: { className?: string; light?: boolean; size?: "md" | "lg" }) {
  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <LogoMark light={light} className={size === "lg" ? "h-14 w-14" : "h-7 w-7"} />
      <span
        className={clsx(
          "font-bold tracking-tight",
          size === "lg" ? "text-5xl" : "text-xl",
          light ? "text-white" : "text-gradient",
        )}
      >
        Simplee
      </span>
    </div>
  );
}
