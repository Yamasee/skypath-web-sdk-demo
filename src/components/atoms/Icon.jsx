const PATHS = {
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  external: <path d="M7.5 16.5l9-9M9.5 7.5h7v7" />,
  logout: (
    <>
      <path d="M14 5h4a1 1 0 011 1v12a1 1 0 01-1 1h-4" />
      <path d="M10 8l-4 4 4 4M6 12h9" />
    </>
  ),
  chevronDown: <path d="M7 10l5 5 5-5" />,
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </>
  ),
  retry: (
    <>
      <path d="M4 12a8 8 0 0113.7-5.6L20 8.7" />
      <path d="M20 4v4.7h-4.7" />
      <path d="M20 12a8 8 0 01-13.7 5.6L4 15.3" />
      <path d="M4 20v-4.7h4.7" />
    </>
  ),
};

const FILLED = {
  play: <path d="M8 5.5v13l10.5-6.5z" />,
  pause: (
    <>
      <rect x="7" y="5.5" width="3.5" height="13" rx="1" />
      <rect x="13.5" y="5.5" width="3.5" height="13" rx="1" />
    </>
  ),
};

const Icon = ({ name, size = 16, className }) => {
  const filled = FILLED[name];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {filled || PATHS[name]}
    </svg>
  );
};

export { Icon };
