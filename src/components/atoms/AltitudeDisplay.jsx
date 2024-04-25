const AltitudeDisplay = ({ value }) => {
  return (
    <div className="flex items-center justify-center text-sm leading-none text-center text-black bg-white rounded-md shadow-dark w-14 h-9">
      {value}
    </div>
  );
};

export { AltitudeDisplay };