import { DOCS_URL } from '../../lib/constants';
import { IllustrationBackdrop } from '../atoms/IllustrationBackdrop';
import { Logo } from '../atoms/Logo';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { CursorHeadline } from '../molecules/CursorHeadline';

const Fallback = ({ error, resetErrorBoundary }) => (
  <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-page p-4 text-ink">
    <IllustrationBackdrop />

    <div className="absolute top-7 left-8">
      <Logo />
    </div>

    <main role="alert" className="relative flex w-full max-w-[560px] flex-col gap-[26px] rounded-[28px] bg-surface px-11 pt-11 pb-[38px]">
      <span className="absolute top-11 right-11 size-2.5 rounded-full bg-danger shadow-[0_0_12px_1px_var(--color-danger)]"></span>
      <CursorHeadline muted="Something" highlighted="went wrong" surface="#1D1D1D" className="text-[52px]" />
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-ink-secondary">Error message</span>
        <pre className="m-0 max-h-[132px] overflow-auto rounded-[14px] border border-hairline bg-[#0F0F0F] px-[18px] py-4 font-display text-[13px] leading-[1.55] whitespace-pre-wrap text-danger-ink">
          <code className="font-[inherit]">{error?.message || "An error occurred"}</code>
        </pre>
      </div>
      <p className="m-0 text-[13px] leading-[1.55] text-ink-muted">
        Try again first. If it keeps happening, check the{" "}
        <span className="font-medium text-ink">SDK documentation</span> — most errors here come from credentials or a
        layer that is not enabled for the account.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="md" className="px-7 text-[15px]" onClick={resetErrorBoundary}>
          <Icon name="retry" />
          Try again
        </Button>
        <a
          href={DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-[52px] items-center gap-1.5 rounded-full bg-chip px-[22px] text-sm font-semibold text-ink hover:bg-chip-active"
        >
          Documentation
          <Icon name="external" size={14} />
        </a>
      </div>
    </main>
  </div>
);

export default Fallback;
