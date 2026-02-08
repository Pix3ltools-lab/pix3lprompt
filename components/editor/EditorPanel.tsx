"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Copy, Sparkles, Shuffle, Send, Check, RotateCcw, Save, Settings, Loader2, X,
} from "lucide-react";
import { styleChips, lightingPresets } from "@/data/mock";
import { getModelConfig } from "@/data/models";
import { useStore } from "@/lib/store";
import { useHistory } from "@/hooks/useHistory";
import { useAiProvider } from "@/hooks/useAiProvider";
import { ModelSelector } from "@/components/editor/ModelSelector";
import Link from "next/link";

const aspectRatios = ["16:9", "3:2", "1:1", "9:16", "4:5", "21:9"];

export function EditorPanel() {
  const subject = useStore((s) => s.subject);
  const setSubject = useStore((s) => s.setSubject);
  const styles = useStore((s) => s.styles);
  const toggleStyle = useStore((s) => s.toggleStyle);
  const lighting = useStore((s) => s.lighting);
  const toggleLighting = useStore((s) => s.toggleLighting);
  const aspectRatio = useStore((s) => s.aspectRatio);
  const setAspectRatio = useStore((s) => s.setAspectRatio);
  const details = useStore((s) => s.details);
  const setDetails = useStore((s) => s.setDetails);
  const negativePrompt = useStore((s) => s.negativePrompt);
  const setNegativePrompt = useStore((s) => s.setNegativePrompt);
  const cameraAngle = useStore((s) => s.cameraAngle);
  const parameters = useStore((s) => s.parameters);
  const targetModel = useStore((s) => s.targetModel);
  const editingPromptId = useStore((s) => s.editingPromptId);
  const resetEditor = useStore((s) => s.resetEditor);

  const { savePrompt, updatePrompt } = useHistory();
  const { optimize, generateVariations, isLoading: aiLoading, isLocal, error: aiError } = useAiProvider();

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [variations, setVariations] = useState<string[] | null>(null);

  const modelConfig = useMemo(() => getModelConfig(targetModel), [targetModel]);

  const assembledPrompt = useMemo(() => {
    const parts: string[] = [];
    if (subject.trim()) parts.push(subject.trim());
    if (styles.length > 0) {
      parts.push(
        styles
          .map((id) => styleChips.find((c) => c.id === id)?.label ?? id)
          .join(", ")
      );
    }
    if (lighting.length > 0) {
      parts.push(
        lighting
          .map((id) => lightingPresets.find((p) => p.id === id)?.label ?? id)
          .join(", ")
      );
    }
    if (details.trim()) parts.push(details.trim());
    let prompt = parts.join(", ");

    // Model-specific aspect ratio
    const arStr = modelConfig.arFormat(aspectRatio);
    if (arStr) prompt += ` ${arStr}`;

    // Model-specific suffix (e.g. --v 6.1)
    if (modelConfig.suffix) prompt += ` ${modelConfig.suffix}`;

    // Model-specific negative prompt
    const negStr = modelConfig.negFormat(negativePrompt.trim());
    if (negStr) prompt += ` ${negStr}`;

    return prompt;
  }, [subject, styles, lighting, aspectRatio, details, negativePrompt, targetModel, modelConfig]);

  const charCount = assembledPrompt.length;
  const tokenEstimate = Math.max(1, Math.round(charCount / 4));

  async function handleCopy() {
    if (!assembledPrompt) return;
    await navigator.clipboard.writeText(assembledPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleSave() {
    const data = {
      subject,
      styles,
      lighting,
      composition: { aspectRatio, cameraAngle },
      details,
      negativePrompt,
      parameters,
      targetModel,
      assembledPrompt,
      rating: null,
      notes: "",
      tags: [],
      isFavorite: false,
    };

    if (editingPromptId) {
      await updatePrompt(editingPromptId, data);
    } else {
      await savePrompt(data);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  const buildContext = () => ({
    targetModel,
    previousRatings: [],
    preferredStyles: styles,
    avoidKeywords: [],
  });

  async function handleOptimize() {
    if (!assembledPrompt) return;
    const result = await optimize(assembledPrompt, buildContext());
    // Parse result back into the subject field (optimized prompt replaces subject)
    setSubject(result);
  }

  async function handleVariations() {
    if (!assembledPrompt) return;
    const result = await generateVariations(assembledPrompt, 4, buildContext());
    setVariations(result);
  }

  function renderPreview() {
    if (
      !subject.trim() &&
      styles.length === 0 &&
      lighting.length === 0 &&
      !details.trim()
    ) {
      return (
        <span className="text-muted-foreground">
          Your prompt will appear here...
        </span>
      );
    }

    const segments: React.ReactNode[] = [];
    let needsComma = false;

    function addSegment(text: string, color: string) {
      if (needsComma)
        segments.push(
          <span key={`sep-${segments.length}`} className="text-foreground">
            ,{" "}
          </span>
        );
      segments.push(
        <span key={`seg-${segments.length}`} className={color}>
          {text}
        </span>
      );
      needsComma = true;
    }

    if (subject.trim()) addSegment(subject.trim(), "text-blue-400");
    if (styles.length > 0) {
      addSegment(
        styles
          .map((id) => styleChips.find((c) => c.id === id)?.label ?? id)
          .join(", "),
        "text-green-400"
      );
    }
    if (lighting.length > 0) {
      addSegment(
        lighting
          .map((id) => lightingPresets.find((p) => p.id === id)?.label ?? id)
          .join(", "),
        "text-yellow-400"
      );
    }
    if (details.trim()) addSegment(details.trim(), "text-slate-300");

    // Model-specific params (AR, suffix, negative) shown in orange/red
    const arStr = modelConfig.arFormat(aspectRatio);
    if (arStr) {
      segments.push(<span key="ar-sp" className="text-foreground"> </span>);
      segments.push(<span key="ar" className="text-purple-400">{arStr}</span>);
    }
    if (modelConfig.suffix) {
      segments.push(<span key="suf-sp" className="text-foreground"> </span>);
      segments.push(<span key="suf" className="text-orange-400">{modelConfig.suffix}</span>);
    }
    const negStr = modelConfig.negFormat(negativePrompt.trim());
    if (negStr) {
      segments.push(<span key="neg-sp" className="text-foreground"> </span>);
      segments.push(<span key="neg" className="text-red-400/60">{negStr}</span>);
    }

    return segments;
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      {/* Model Selector + Settings link */}
      <section>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Target Model
          </label>
          <Link
            href="/settings"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-3.5 w-3.5" />
            {isLocal ? "AI: Local Rules" : "AI: Connected"}
          </Link>
        </div>
        <ModelSelector />
      </section>

      {/* Subject */}
      <section>
        <label
          htmlFor="subject"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Subject
        </label>
        <textarea
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder={modelConfig.placeholder}
          rows={3}
          className="w-full resize-none rounded-lg border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </section>

      {/* Style Chips */}
      <section>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Style
        </label>
        <div className="flex flex-wrap gap-1.5">
          {styleChips.map((chip) => (
            <Badge
              key={chip.id}
              variant={styles.includes(chip.id) ? "default" : "outline"}
              className="cursor-pointer select-none transition-colors"
              onClick={() => toggleStyle(chip.id)}
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
          {lightingPresets.map((preset) => (
            <Badge
              key={preset.id}
              variant={lighting.includes(preset.id) ? "default" : "outline"}
              className="cursor-pointer select-none transition-colors"
              onClick={() => toggleLighting(preset.id)}
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
          {aspectRatios.map((ratio) => (
            <button
              key={ratio}
              onClick={() => setAspectRatio(ratio)}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                aspectRatio === ratio
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
        <label
          htmlFor="details"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Details
        </label>
        <textarea
          id="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Additional details, quality modifiers..."
          rows={2}
          className="w-full resize-none rounded-lg border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </section>

      {/* Negative Prompt */}
      <section>
        <label
          htmlFor="negative"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Negative Prompt
        </label>
        <textarea
          id="negative"
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          placeholder="blurry, deformed, watermark..."
          rows={2}
          className="w-full resize-none rounded-lg border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </section>

      <Separator />

      {/* Live Preview */}
      <section>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Live Preview
        </label>
        <div className="rounded-lg border border-border bg-background p-4 font-mono text-sm leading-relaxed">
          {renderPreview()}
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>{charCount} characters</span>
          <span>~{tokenEstimate} tokens</span>
        </div>
      </section>

      {/* Action Bar */}
      <section className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied ? "Copied!" : "Copy"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={handleSave}
        >
          {saved ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          {saved ? "Saved!" : "Save"}
        </Button>
        <Button
          size="sm"
          className="gap-1.5"
          onClick={handleOptimize}
          disabled={aiLoading || !assembledPrompt}
        >
          {aiLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          Optimize
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={handleVariations}
          disabled={aiLoading || !assembledPrompt}
        >
          {aiLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Shuffle className="h-3.5 w-3.5" />
          )}
          Variations
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Send className="h-3.5 w-3.5" />
          Send to Board
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="ml-auto gap-1.5 text-muted-foreground"
          onClick={resetEditor}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      </section>

      {/* AI Error */}
      {aiError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
          {aiError}
        </div>
      )}

      {/* Variations panel */}
      {variations && variations.length > 0 && (
        <section>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Variations
            </label>
            <button
              onClick={() => setVariations(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {variations.map((v, i) => (
              <button
                key={i}
                onClick={() => {
                  setSubject(v);
                  setVariations(null);
                }}
                className="rounded-lg border border-border bg-background p-3 text-left font-mono text-xs leading-relaxed transition-colors hover:bg-elevated"
              >
                {v}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
