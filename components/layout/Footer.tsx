export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="flex flex-col items-center gap-3 px-4 py-3 text-xs sm:flex-row sm:justify-between">
        <span className="text-muted-foreground">
          From the{" "}
          <a
            href="https://pix3ltools.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:underline"
          >
            Pix3lTools
          </a>{" "}
          Collection
        </span>

        <div className="flex items-center gap-4">
          <a
            href="https://x.com/pix3ltools"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Follow
          </a>
          <a
            href="/privacy"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
