"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { db } from "@/lib/db";
import type { AiProviderConfig } from "@/types";
import Link from "next/link";

type ProviderOption = AiProviderConfig["provider"];

const providerOptions: { value: ProviderOption; label: string; description: string }[] = [
  { value: "none", label: "None", description: "Local rules only — no API key needed" },
  { value: "openrouter", label: "OpenRouter", description: "Recommended — 300+ models, single API key" },
  { value: "lmstudio", label: "LM Studio", description: "Local model — no API key needed, runs on your machine" },
  { value: "openai", label: "OpenAI", description: "Direct OpenAI API access" },
  { value: "anthropic", label: "Anthropic", description: "Direct Anthropic API access" },
];

const suggestedModels: Record<ProviderOption, { value: string; label: string }[]> = {
  none: [],
  openrouter: [
    { value: "anthropic/claude-sonnet-4-5-20250929", label: "Claude Sonnet 4.5 (best value)" },
    { value: "google/gemini-2.0-flash-001", label: "Gemini 2.0 Flash (cheap)" },
    { value: "openai/gpt-4o-mini", label: "GPT-4o Mini (fast)" },
    { value: "mistralai/mistral-large-latest", label: "Mistral Large (EU alternative)" },
  ],
  lmstudio: [],
  openai: [
    { value: "gpt-4o-mini", label: "GPT-4o Mini" },
    { value: "gpt-4o", label: "GPT-4o" },
  ],
  anthropic: [
    { value: "claude-sonnet-4-5-20250929", label: "Claude Sonnet 4.5" },
    { value: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5" },
  ],
};

export default function SettingsPage() {
  const [provider, setProvider] = useState<ProviderOption>("none");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [baseUrl, setBaseUrl] = useState("http://localhost:1234/v1");
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load existing config
  useEffect(() => {
    db.aiConfig
      .toCollection()
      .first()
      .then((config) => {
        if (config) {
          setProvider(config.provider);
          setApiKey(config.apiKey);
          setModel(config.model);
          if (config.baseUrl) setBaseUrl(config.baseUrl);
        }
      });
  }, []);

  // Reset model when provider changes
  useEffect(() => {
    const models = suggestedModels[provider];
    if (models.length > 0 && !models.some((m) => m.value === model)) {
      setModel(models[0].value);
    }
  }, [provider, model]);

  async function handleTestConnection() {
    if (provider === "none") return;
    if (provider !== "lmstudio" && !apiKey) return;
    setTestStatus("loading");
    try {
      // Simple test: try to reach the API
      let url: string;
      const headers: Record<string, string> = {};

      if (provider === "lmstudio") {
        url = `${baseUrl.replace(/\/+$/, "")}/models`;
        if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
      } else if (provider === "openrouter") {
        url = "https://openrouter.ai/api/v1/models";
        headers["Authorization"] = `Bearer ${apiKey}`;
      } else if (provider === "openai") {
        url = "https://api.openai.com/v1/models";
        headers["Authorization"] = `Bearer ${apiKey}`;
      } else if (provider === "anthropic") {
        url = "https://api.anthropic.com/v1/messages";
        headers["x-api-key"] = apiKey;
        headers["anthropic-version"] = "2023-06-01";
        headers["anthropic-dangerous-direct-browser-access"] = "true";
      } else {
        setTestStatus("error");
        return;
      }

      const response = await fetch(url, {
        method: provider === "anthropic" ? "POST" : "GET",
        headers,
        ...(provider === "anthropic"
          ? {
              body: JSON.stringify({
                model: model || "claude-haiku-4-5-20251001",
                max_tokens: 1,
                messages: [{ role: "user", content: "test" }],
              }),
            }
          : {}),
      });

      // For anthropic, any response (even 400) means the key format is valid
      // A 401 means invalid key
      if (response.status === 401) {
        setTestStatus("error");
      } else {
        setTestStatus("success");
      }
    } catch {
      setTestStatus("error");
    }
  }

  async function handleSave() {
    setSaving(true);
    const config: AiProviderConfig = {
      provider,
      apiKey: provider === "none" ? "" : apiKey,
      model: provider === "none" ? "" : model,
      ...(provider === "lmstudio" ? { baseUrl } : {}),
    };

    // Upsert: clear existing and add new
    await db.aiConfig.clear();
    await db.aiConfig.add(config);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const models = suggestedModels[provider];

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

      <h1 className="mb-6 text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>AI Provider</CardTitle>
          <CardDescription>
            Configure an AI provider to power Optimize and Variations. The app
            works without one using local rules.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Provider selection */}
          <div className="space-y-2">
            <Label>Provider</Label>
            <div className="grid gap-2">
              {providerOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setProvider(opt.value);
                    setTestStatus("idle");
                  }}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    provider === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-elevated"
                  }`}
                >
                  <div className="text-sm font-medium">{opt.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {opt.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* LM Studio config */}
          {provider === "lmstudio" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="baseUrl">Server URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="baseUrl"
                    type="text"
                    value={baseUrl}
                    onChange={(e) => {
                      setBaseUrl(e.target.value);
                      setTestStatus("idle");
                    }}
                    placeholder="http://localhost:1234/v1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTestConnection}
                    disabled={!baseUrl || testStatus === "loading"}
                    className="gap-1.5"
                  >
                    {testStatus === "loading" && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    )}
                    {testStatus === "success" && (
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    )}
                    {testStatus === "error" && (
                      <XCircle className="h-3.5 w-3.5 text-red-500" />
                    )}
                    Test
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Make sure LM Studio is running with the local server enabled.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lmModel">Model name</Label>
                <Input
                  id="lmModel"
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. llama-3.2-3b-instruct"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the model identifier loaded in LM Studio. Leave empty to use the default loaded model.
                </p>
              </div>
            </>
          )}

          {/* Cloud provider config (API Key + Model) */}
          {provider !== "none" && provider !== "lmstudio" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="apiKey"
                      type={showKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => {
                        setApiKey(e.target.value);
                        setTestStatus("idle");
                      }}
                      placeholder={`Enter your ${providerOptions.find((o) => o.value === provider)?.label} API key`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTestConnection}
                    disabled={!apiKey || testStatus === "loading"}
                    className="gap-1.5"
                  >
                    {testStatus === "loading" && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    )}
                    {testStatus === "success" && (
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    )}
                    {testStatus === "error" && (
                      <XCircle className="h-3.5 w-3.5 text-red-500" />
                    )}
                    Test
                  </Button>
                </div>
              </div>

              {/* Model selector */}
              {models.length > 0 && (
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          {/* Security notice */}
          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3 text-xs text-muted-foreground">
            {provider === "lmstudio" ? (
              <>
                LM Studio runs <strong>locally</strong> on your machine. No data
                leaves your computer.
              </>
            ) : (
              <>
                Your API key is stored <strong>only</strong> in your browser
                (IndexedDB). It is never sent to any server except the AI provider
                you selected.
              </>
            )}
          </div>

          {/* Save button */}
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saved ? "Saved!" : saving ? "Saving..." : "Save Configuration"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
