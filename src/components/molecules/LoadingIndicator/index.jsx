const LoadingIndicator = ({ layerNames }) => {
  return (
    <div
      role="status"
      className="flex h-[34px] items-center gap-2.5 rounded-full border border-accent/25 bg-panel px-3.5 text-xs font-medium text-accent"
    >
      <span className="relative h-0.5 w-12 overflow-hidden rounded-full bg-accent/18">
        <span className="absolute inset-y-0 left-0 w-5 animate-[loading-sweep_1.1s_ease-in-out_infinite] rounded-full bg-accent"></span>
      </span>
      Loading {layerNames} for this area
    </div>
  );
};

export default LoadingIndicator;
