import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl flex-1 overflow-y-auto p-6">
      <div className="mb-6">
        <Link
          href="/editor"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Editor
        </Link>
      </div>

      <h1 className="mb-2 text-2xl font-bold">Privacy Policy</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Last updated: February 2026
      </p>

      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        {/* Intro */}
        <section>
          <p>
            <strong className="text-foreground">Pix3lPrompt</strong> is a
            client-side prompt editor for AI image, video and audio generators.
            It is part of the{" "}
            <a
              href="https://pix3ltools.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Pix3lTools
            </a>{" "}
            collection. Your privacy matters to us &mdash; this page explains
            exactly what data is stored, where it goes, and what you control.
          </p>
        </section>

        {/* No account */}
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            No Account Required
          </h2>
          <p>
            Pix3lPrompt does not require registration, login, or any form of
            account creation. There are no usernames, emails, or passwords
            involved.
          </p>
        </section>

        {/* Local storage */}
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Data Stored on Your Device
          </h2>
          <p className="mb-3">
            All application data is stored exclusively in your browser using{" "}
            <strong className="text-foreground">IndexedDB</strong>. Nothing is
            sent to our servers. This includes:
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li>Prompts you create (subject, styles, lighting, details, negative prompts)</li>
            <li>Composition settings (aspect ratio, camera angle)</li>
            <li>Ratings, notes, tags, and favorites</li>
            <li>Your AI provider configuration and API key (if configured)</li>
            <li>Theme preference (dark / light)</li>
          </ul>
          <p className="mt-3">
            You can delete all stored data at any time by clearing your
            browser&apos;s site data for this domain.
          </p>
        </section>

        {/* AI providers */}
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            AI Provider Integration (Optional)
          </h2>
          <p className="mb-3">
            Pix3lPrompt can optionally connect to third-party AI providers to
            power the Optimize and Variations features. This is entirely
            opt-in &mdash; by default, the app uses local rule-based
            processing with no external calls.
          </p>
          <p className="mb-3">
            If you choose to configure an AI provider (OpenRouter, OpenAI, or
            Anthropic), the following applies:
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li>
              Your <strong className="text-foreground">API key</strong> is
              stored only in your browser&apos;s IndexedDB. It is never sent to
              Pix3lPrompt servers.
            </li>
            <li>
              When you use Optimize or Variations, your{" "}
              <strong className="text-foreground">prompt text</strong> and
              selected model context are sent directly from your browser to the
              AI provider you chose.
            </li>
            <li>
              Each provider has its own privacy policy. We encourage you to
              review it before connecting.
            </li>
          </ul>
        </section>

        {/* Analytics */}
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Analytics
          </h2>
          <p className="mb-3">
            Pix3lPrompt uses{" "}
            <strong className="text-foreground">Vercel Analytics</strong> to
            collect anonymous, aggregated usage data such as page views and
            visitor counts. This helps us understand how the app is used and
            improve it over time.
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li>
              Vercel Analytics is{" "}
              <strong className="text-foreground">cookieless</strong> &mdash; it
              does not set any cookies on your device.
            </li>
            <li>
              No personally identifiable information (PII) is collected. There
              is no user tracking, fingerprinting, or cross-site profiling.
            </li>
            <li>
              Data is processed by{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Vercel Inc.
              </a>{" "}
              and is compliant with GDPR, CCPA, and PECR.
            </li>
          </ul>
          <p className="mt-3">
            No other analytics services (Google Analytics, Meta Pixel, etc.) are
            used. We do not track clicks, sessions, IP addresses, or device
            information.
          </p>
        </section>

        {/* Third party */}
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Third-Party Services
          </h2>
          <p className="mb-3">The app loads the following external resources:</p>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong className="text-foreground">Google Fonts</strong> (Inter
              and JetBrains Mono) &mdash; loaded for typography. Google may log
              font requests per their{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                privacy policy
              </a>
              .
            </li>
          </ul>
          <p className="mt-3">
            No other third-party scripts, pixels, or beacons are included
            beyond Vercel Analytics (described above).
          </p>
        </section>

        {/* Data sharing */}
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Data Sharing
          </h2>
          <p>
            We do not sell, share, or transfer your data to any third party.
            Since all data lives in your browser, we never have access to it in
            the first place.
          </p>
        </section>

        {/* Your control */}
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Your Control
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>You can delete individual prompts from the History panel.</li>
            <li>
              You can remove your API key by going to Settings and selecting
              &quot;None&quot; as provider.
            </li>
            <li>
              You can erase all app data by clearing site data in your
              browser settings.
            </li>
          </ul>
        </section>

        {/* Contact */}
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Contact
          </h2>
          <p>
            For questions about this privacy policy, reach out via{" "}
            <a
              href="https://x.com/pix3ltools"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @pix3ltools on X
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
