export function SummaryCard({ title, subtitle, children, footer }) {
  return (
    <section className="rounded-2xl border border-border-subtle bg-bg-elevated px-6 py-5 shadow-sm">
      <header className="space-y-1">
        <h2 className="font-display text-xl font-semibold text-fg-primary">{title}</h2>
        {subtitle ? <p className="text-sm text-fg-muted">{subtitle}</p> : null}
      </header>
      <div className="mt-4">{children}</div>
      {footer ? (
        <footer className="mt-5 border-t border-border-subtle pt-4 text-sm text-fg-muted">{footer}</footer>
      ) : null}
    </section>
  );
}
