"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy, Sparkles, Shuffle, Send } from "lucide-react";
import { styleChips, lightingPresets } from "@/data/mock";

export function EditorPanel() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      {/* Subject */}
      <section>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Subject
        </label>
        <div className="min-h-[80px] rounded-lg border border-input bg-background p-3 text-sm text-foreground">
          <span className="text-muted-foreground">
            Describe what you want to generate...
          </span>
        </div>
      </section>

      {/* Style Chips */}
      <section>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Style
        </label>
        <div className="flex flex-wrap gap-1.5">
          {styleChips.map((chip, i) => (
            <Badge
              key={chip.id}
              variant={i === 4 || i === 0 ? "default" : "outline"}
              className="cursor-pointer select-none transition-colors"
            >
              {chip.label}
            </Badge>
          ))}
        </div>
      </section>

      {/* Lighting Chips */}
      <section>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Lighting
        </label>
        <div className="flex flex-wrap gap-1.5">
          {lightingPresets.map((preset, i) => (
            <Badge
              key={preset.id}
              variant={i === 0 ? "default" : "outline"}
              className="cursor-pointer select-none transition-colors"
            >
              {preset.label}
            </Badge>
          ))}
        </div>
      </section>

      {/* Composition */}
      <section>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Composition
        </label>
        <div className="flex flex-wrap gap-2">
          {["16:9", "3:2", "1:1", "9:16", "4:5", "21:9"].map((ratio, i) => (
            <button
              key={ratio}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                i === 0
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>
      </section>

      {/* Details */}
      <section>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Details
        </label>
        <div className="min-h-[60px] rounded-lg border border-input bg-background p-3 text-sm">
          <span className="text-muted-foreground">
            Additional details, quality modifiers...
          </span>
        </div>
      </section>

      {/* Negative Prompt */}
      <section>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Negative Prompt
        </label>
        <div className="min-h-[40px] rounded-lg border border-input bg-background p-3 text-sm">
          <span className="text-muted-foreground">
            blurry, deformed, watermark...
          </span>
        </div>
      </section>

      <Separator />

      {/* Live Preview */}
      <section>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Live Preview
        </label>
        <div className="rounded-lg border border-border bg-background p-4 font-mono text-sm leading-relaxed">
          <span className="text-blue-400">
            A futuristic cityscape at sunset
          </span>
          <span className="text-foreground">, </span>
          <span className="text-green-400">cinematic, photorealistic</span>
          <span className="text-foreground">, </span>
          <span className="text-yellow-400">golden hour lighting</span>
          <span className="text-foreground">, </span>
          <span className="text-purple-400">wide shot, 16:9</span>
          <span className="text-foreground">, </span>
          <span className="text-slate-300">highly detailed, 8k</span>
          <span className="text-foreground"> </span>
          <span className="text-orange-400">--v 6.1 --stylize 750</span>
          <span className="text-foreground"> </span>
          <span className="text-red-400/60">--no blurry, watermark</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>142 characters</span>
          <span>~32 tokens</span>
        </div>
      </section>

      {/* Action Bar */}
      <section className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" className="gap-1.5">
          <Copy className="h-3.5 w-3.5" />
          Copy
        </Button>
        <Button size="sm" className="gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Optimize
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Shuffle className="h-3.5 w-3.5" />
          Variations
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Send className="h-3.5 w-3.5" />
          Send to Board
        </Button>
      </section>
    </div>
  );
}
