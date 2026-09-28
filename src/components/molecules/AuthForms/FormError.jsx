const FormError = ({ message }) =>
  message ? (
    <div role="alert" className="flex items-center gap-2.5 rounded-[14px] bg-danger-surface px-4 py-3 text-[13px] font-medium text-danger-ink">
      <span className="size-2 shrink-0 rounded-full bg-danger shadow-[0_0_10px_1px_var(--color-danger)]"></span>
      {message}
    </div>
  ) : null;

export default FormError;
