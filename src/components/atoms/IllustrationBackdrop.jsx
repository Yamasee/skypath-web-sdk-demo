const IllustrationBackdrop = () => {
  return (
      <svg viewBox="0 0 1440 900" aria-hidden="true" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 block size-full opacity-55 blur-[3px]">
      <defs>
      <pattern id="egrid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="1" /></pattern>
      <radialGradient id="evig" cx="50%" cy="50%" r="65%"><stop offset="20%" stopColor="#0D0D0D" stopOpacity=".7" /><stop offset="100%" stopColor="#0D0D0D" stopOpacity="1" /></radialGradient>
      <polygon id="eh" points="0,-10 8.66,-5 8.66,5 0,10 -8.66,5 -8.66,-5" />
      </defs>
      <rect fill="url(#egrid)" />
      <g fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.22)" strokeWidth=".8" transform="translate(360 300)">
      <use href="#eh" x="0" y="0" /><use href="#eh" x="17" y="0" /><use href="#eh" x="34" y="0" /><use href="#eh" x="9" y="15" /><use href="#eh" x="26" y="15" /><use href="#eh" x="43" y="15" /><use href="#eh" x="17" y="30" /><use href="#eh" x="34" y="30" />
      </g>
      <g fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.2)" strokeWidth=".8" transform="translate(1040 580)">
      <use href="#eh" x="0" y="0" /><use href="#eh" x="17" y="0" /><use href="#eh" x="-9" y="15" /><use href="#eh" x="9" y="15" /><use href="#eh" x="26" y="15" /><use href="#eh" x="0" y="30" /><use href="#eh" x="17" y="30" />
      </g>
      <path d="M-20 600 C 240 520, 420 660, 720 580 S 1200 460, 1460 520" fill="none" stroke="rgba(255,255,255,.08)" />
      <rect fill="url(#evig)" />
      </svg>
  );
};

export { IllustrationBackdrop };
