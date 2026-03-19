"use client";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Earn", href: "#earn" },
  { label: "FAQ", href: "#faq" },
];

const socialLinks = [
  { label: "X", href: "#" },
  { label: "Telegram", href: "#" },
  { label: "Discord", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-dashed border-border-strong">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            <span className="text-[14px] font-semibold text-text-primary tracking-[-0.01em]">
              grovegrove
            </span>
          </div>

          <div className="flex flex-wrap gap-6">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[13px] text-text-tertiary hover:text-text-secondary transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex gap-5">
            {socialLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-[13px] text-text-tertiary hover:text-text-secondary transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-text-tertiary">
            © {new Date().getFullYear()} grovegrove
          </p>
          <div className="flex gap-5">
            <a href="#" className="text-[12px] text-text-tertiary hover:text-text-secondary transition-colors">
              Privacy
            </a>
            <a href="#" className="text-[12px] text-text-tertiary hover:text-text-secondary transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
