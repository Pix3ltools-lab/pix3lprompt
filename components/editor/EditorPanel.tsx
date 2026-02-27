"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Copy, Sparkles, Shuffle, Send, Check, RotateCcw, Save, Settings, Loader2, X,
} from "lucide-react";
import {
  styleChips,
  lightingPresets,
  cameraAnglePresets,
  colorPalettePresets,
  mediumPresets,
  qualityPresets,
  framingPresets,
  moodPresets,
  type Preset,
} from "@/data/mock";
import { getModelConfig } from "@/data/models";
import { useStore } from "@/lib/store";
import { useHistory } from "@/hooks/useHistory";
import { useAiProvider } from "@/hooks/useAiProvider";
import { ModelSelector } from "@/components/editor/ModelSelector";
import { SendToPix3lBoardModal } from "@/components/editor/SendToPix3lBoardModal";
import Link from "next/link";
import { toast } from "sonner";

const aspectRatios = ["16:9", "3:2", "1:1", "9:16", "4:5", "21:9"];

/** Reusable chip section */
function ChipSection({
  label,
  presets,
  selected,
  onToggle,
}: {
  label: string;
  presets: Preset[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <section>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <Badge
            key={p.id}
            variant={selected.includes(p.id) ? "default" : "outline"}
            className="cursor-pointer select-none transition-colors"
            onClick={() => onToggle(p.id)}
          >
            {p.label}
          </Badge>
        ))}
      </div>
    </section>
  );
}

export function EditorPanel() {
  const subject = useStore((s) => s.subject);
  const setSubject = useStore((s) => s.setSubject);
  const styles = useStore((s) => s.styles);
  const toggleStyle = useStore((s) => s.toggleStyle);
  const lighting = useStore((s) => s.lighting);
  const toggleLighting = useStore((s) => s.toggleLighting);
  const cameraAngles = useStore((s) => s.cameraAngles);
  const toggleCameraAngle = useStore((s) => s.toggleCameraAngle);
  const colorPalette = useStore((s) => s.colorPalette);
  const toggleColorPalette = useStore((s) => s.toggleColorPalette);
  const medium = useStore((s) => s.medium);
  const toggleMedium = useStore((s) => s.toggleMedium);
  const quality = useStore((s) => s.quality);
  const toggleQuality = useStore((s) => s.toggleQuality);
  const framing = useStore((s) => s.framing);
  const toggleFraming = useStore((s) => s.toggleFraming);
  const mood = useStore((s) => s.mood);
  const toggleMood = useStore((s) => s.toggleMood);
  const aspectRatio = useStore((s) => s.aspectRatio);
  const setAspectRatio = useStore((s) => s.setAspectRatio);
  const details = useStore((s) => s.details);
  const setDetails = useStore((s) => s.setDetails);
  const negativePrompt = useStore((s) => s.negativePrompt);
  const setNegativePrompt = useStore((s) => s.setNegativePrompt);
  const parameters = useStore((s) => s.parameters);
  const targetModel = useStore((s) => s.targetModel);
  const editingPromptId = useStore((s) => s.editingPromptId);
  const resetEditor = useStore((s) => s.resetEditor);

  const setStyles = useStore((s) => s.setStyles);
  const setLighting = useStore((s) => s.setLighting);
  const setCameraAngles = useStore((s) => s.setCameraAngles);
  const setColorPalette = useStore((s) => s.setColorPalette);
  const setMedium = useStore((s) => s.setMedium);
  const setQuality = useStore((s) => s.setQuality);
  const setFraming = useStore((s) => s.setFraming);
  const setMood = useStore((s) => s.setMood);

  const { savePrompt, updatePrompt } = useHistory();
  const { optimize, generateVariations, isLoading: aiLoading, isLocal, error: aiError } = useAiProvider();

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [variations, setVariations] = useState<string[] | null>(null);
  const [sendModalOpen, setSendModalOpen] = useState(false);

  const modelConfig = useMemo(() => getModelConfig(targetModel), [targetModel]);

  // All chip arrays mapped to their preset lookup
  const chipArrays: { selected: string[]; presets: Preset[] }[] = [
    { selected: styles, presets: styleChips },
    { selected: lighting, presets: lightingPresets },
    { selected: cameraAngles, presets: cameraAnglePresets },
    { selected: colorPalette, presets: colorPalettePresets },
    { selected: medium, presets: mediumPresets },
    { selected: quality, presets: qualityPresets },
    { selected: framing, presets: framingPresets },
    { selected: mood, presets: moodPresets },
  ];

  /** Resolve selected chip IDs to labels */
  function resolveChips(selected: string[], presets: Preset[]): string {
    return selected
      .map((id) => presets.find((p) => p.id === id)?.label ?? id)
      .join(", ");
  }

  /** Build content parts (all chip labels + details, no model params) */
  function buildContentParts(): string[] {
    const parts: string[] = [];
    if (subject.trim()) parts.push(subject.trim());
    for (const { selected, presets } of chipArrays) {
      if (selected.length > 0) parts.push(resolveChips(selected, presets));
    }
    if (details.trim()) parts.push(details.trim());
    return parts;
  }

  const assembledPrompt = useMemo(() => {
    let prompt = buildContentParts().join(", ");

    const arStr = modelConfig.arFormat(aspectRatio);
    if (arStr) prompt += ` ${arStr}`;
    if (modelConfig.suffix) prompt += ` ${modelConfig.suffix}`;
    const negStr = modelConfig.negFormat(negativePrompt.trim());
    if (negStr) prompt += ` ${negStr}`;

    return prompt;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, styles, lighting, cameraAngles, colorPalette, medium, quality, framing, mood, aspectRatio, details, negativePrompt, targetModel, modelConfig]);

  const contentPrompt = useMemo(() => {
    return buildContentParts().join(", ");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, styles, lighting, cameraAngles, colorPalette, medium, quality, framing, mood, details]);

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
      cameraAngles,
      colorPalette,
      medium,
      quality,
      framing,
      mood,
      composition: { aspectRatio },
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

  function clearAllChips() {
    setStyles([]);
    setLighting([]);
    setCameraAngles([]);
    setColorPalette([]);
    setMedium([]);
    setQuality([]);
    setFraming([]);
    setMood([]);
    setDetails("");
  }

  const buildContext = () => ({
    targetModel,
    previousRatings: [],
    preferredStyles: styles,
    avoidKeywords: [],
  });

  async function handleOptimize() {
    if (!contentPrompt) return;
    const result = await optimize(contentPrompt, buildContext());
    setSubject(result);
    clearAllChips();
  }

  async function handleVariations() {
    if (!contentPrompt) return;
    const result = await generateVariations(contentPrompt, 4, buildContext());
    setVariations(result);
  }

  // Preview color map for each chip category
  const previewColors = [
    { selected: styles, presets: styleChips, color: "text-green-400" },
    { selected: lighting, presets: lightingPresets, color: "text-yellow-400" },
    { selected: cameraAngles, presets: cameraAnglePresets, color: "text-cyan-400" },
    { selected: colorPalette, presets: colorPalettePresets, color: "text-pink-400" },
    { selected: medium, presets: mediumPresets, color: "text-amber-400" },
    { selected: quality, presets: qualityPresets, color: "text-lime-400" },
    { selected: framing, presets: framingPresets, color: "text-indigo-400" },
    { selected: mood, presets: moodPresets, color: "text-rose-400" },
  ];

  function renderPreview() {
    const hasContent =
      subject.trim() ||
      chipArrays.some((c) => c.selected.length > 0) ||
      details.trim();

    if (!hasContent) {
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
    for (const { selected, presets, color } of previewColors) {
      if (selected.length > 0) addSegment(resolveChips(selected, presets), color);
    }
    if (details.trim()) addSegment(details.trim(), "text-slate-300");

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

      {/* Chip Sections */}
      <ChipSection label="Style" presets={styleChips} selected={styles} onToggle={toggleStyle} />
      <ChipSection label="Lighting" presets={lightingPresets} selected={lighting} onToggle={toggleLighting} />
      <ChipSection label="Camera Angle" presets={cameraAnglePresets} selected={cameraAngles} onToggle={toggleCameraAngle} />
      <ChipSection label="Color Palette" presets={colorPalettePresets} selected={colorPalette} onToggle={toggleColorPalette} />
      <ChipSection label="Medium / Texture" presets={mediumPresets} selected={medium} onToggle={toggleMedium} />
      <ChipSection label="Quality" presets={qualityPresets} selected={quality} onToggle={toggleQuality} />
      <ChipSection label="Framing" presets={framingPresets} selected={framing} onToggle={toggleFraming} />
      <ChipSection label="Mood" presets={moodPresets} selected={mood} onToggle={toggleMood} />

      {/* Aspect Ratio */}
      <section>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Aspect Ratio
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
          placeholder="Additional details, modifiers..."
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
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={() => setSendModalOpen(true)}
        >
          <Send className="h-3.5 w-3.5" />
          Send to Pix3lBoard
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

      {/* Send to Pix3lBoard modal */}
      <SendToPix3lBoardModal
        open={sendModalOpen}
        onClose={() => setSendModalOpen(false)}
        assembledPrompt={assembledPrompt}
        subject={subject}
        details={details}
        targetModel={targetModel}
      />

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
                  clearAllChips();
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
