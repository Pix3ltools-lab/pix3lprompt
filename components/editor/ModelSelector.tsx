"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/lib/store";

interface ModelOption {
  id: string;
  label: string;
}

interface ModelGroup {
  label: string;
  models: ModelOption[];
}

const modelGroups: ModelGroup[] = [
  {
    label: "Image",
    models: [
      { id: "midjourney-v7", label: "Midjourney v7" },
      { id: "midjourney-v6.1", label: "Midjourney v6.1" },
      { id: "flux-pro", label: "Flux.1 Pro" },
      { id: "flux-dev", label: "Flux.1 Dev" },
      { id: "sd-3.5", label: "SD 3.5" },
      { id: "sdxl", label: "SDXL" },
      { id: "leonardo-phoenix", label: "Leonardo Phoenix" },
      { id: "dall-e-3", label: "DALL-E 3" },
      { id: "ideogram-2", label: "Ideogram 2" },
    ],
  },
  {
    label: "Video",
    models: [
      { id: "kling-2.0", label: "Kling 2.0" },
      { id: "runway-gen3", label: "Runway Gen-3" },
      { id: "pika-2.0", label: "Pika 2.0" },
      { id: "luma-dream-machine", label: "Luma Dream Machine" },
    ],
  },
  {
    label: "Audio",
    models: [
      { id: "suno-v4", label: "Suno v4" },
      { id: "udio", label: "Udio" },
    ],
  },
];

export function ModelSelector() {
  const targetModel = useStore((s) => s.targetModel);
  const setTargetModel = useStore((s) => s.setTargetModel);

  return (
    <Select value={targetModel} onValueChange={setTargetModel}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {modelGroups.map((group) => (
          <SelectGroup key={group.label}>
            <SelectLabel>{group.label}</SelectLabel>
            {group.models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
