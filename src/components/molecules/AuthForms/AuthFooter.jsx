const AuthFooter = () => {
  return (
    <div className="flex flex-col justify-center w-full gap-2 align-center">
      <p className="text-sm leading-6 text-center text-gray-500">
        {"Don't have credentials yet? "}
        <a
          href="https://skypath.io/contact/"
          target="_blank"
          className="font-semibold text-violet-600 hover:text-violet-500 focus:outline-violet-600"
        >
          Contact us
        </a>
      </p>
      <a
        href="https://docs.skypath.io/js/introduction"
        target="_blank"
        className="text-xs font-semibold leading-4 text-center text-violet-600 hover:text-violet-500 focus:outline-violet-600"
      >
        SDK Documentation
      </a>
    </div>
  );
};

export default AuthFooter; 