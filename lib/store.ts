import { create } from "zustand";
import type { SavedPrompt } from "@/types";

export type ActivePanel = "history" | "editor" | "templates";

interface EditorState {
  // Editor fields
  subject: string;
  styles: string[];
  customStyle: string;
  styleWeight: number;
  lighting: string[];
  aspectRatio: string;
  cameraAngle: string;
  details: string;
  negativePrompt: string;
  parameters: Record<string, string | number>;
  targetModel: string;

  // UI state
  editingPromptId: number | null;
  activePanel: ActivePanel;
  isParametersPanelOpen: boolean;
  isOptimizing: boolean;
  isGeneratingVariations: boolean;
}

interface EditorActions {
  // Field setters
  setSubject: (value: string) => void;
  setDetails: (value: string) => void;
  setNegativePrompt: (value: string) => void;
  setCustomStyle: (value: string) => void;
  setStyleWeight: (value: number) => void;
  setAspectRatio: (value: string) => void;
  setCameraAngle: (value: string) => void;
  setTargetModel: (value: string) => void;
  setParameter: (key: string, value: string | number) => void;

  // Bulk setters
  setStyles: (styles: string[]) => void;
  setLighting: (lighting: string[]) => void;

  // Toggle actions
  toggleStyle: (id: string) => void;
  toggleLighting: (id: string) => void;

  // UI actions
  setActivePanel: (panel: ActivePanel) => void;
  setParametersPanelOpen: (open: boolean) => void;
  setOptimizing: (value: boolean) => void;
  setGeneratingVariations: (value: boolean) => void;

  // Bulk actions
  loadPrompt: (prompt: SavedPrompt) => void;
  resetEditor: () => void;
}

const initialEditorState: EditorState = {
  subject: "",
  styles: [],
  customStyle: "",
  styleWeight: 1.0,
  lighting: [],
  aspectRatio: "16:9",
  cameraAngle: "",
  details: "",
  negativePrompt: "",
  parameters: {},
  targetModel: "midjourney-v7",

  editingPromptId: null,
  activePanel: "editor",
  isParametersPanelOpen: false,
  isOptimizing: false,
  isGeneratingVariations: false,
};

function toggleItem(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export const useStore = create<EditorState & EditorActions>()((set) => ({
  ...initialEditorState,

  setSubject: (value) => set({ subject: value }),
  setDetails: (value) => set({ details: value }),
  setNegativePrompt: (value) => set({ negativePrompt: value }),
  setCustomStyle: (value) => set({ customStyle: value }),
  setStyleWeight: (value) => set({ styleWeight: value }),
  setAspectRatio: (value) => set({ aspectRatio: value }),
  setCameraAngle: (value) => set({ cameraAngle: value }),
  setTargetModel: (value) => set({ targetModel: value, parameters: {} }),
  setParameter: (key, value) =>
    set((state) => ({
      parameters: { ...state.parameters, [key]: value },
    })),

  setStyles: (styles) => set({ styles }),
  setLighting: (lighting) => set({ lighting }),

  toggleStyle: (id) => set((state) => ({ styles: toggleItem(state.styles, id) })),
  toggleLighting: (id) =>
    set((state) => ({ lighting: toggleItem(state.lighting, id) })),

  setActivePanel: (panel) => set({ activePanel: panel }),
  setParametersPanelOpen: (open) => set({ isParametersPanelOpen: open }),
  setOptimizing: (value) => set({ isOptimizing: value }),
  setGeneratingVariations: (value) => set({ isGeneratingVariations: value }),

  loadPrompt: (prompt) =>
    set({
      editingPromptId: prompt.id ?? null,
      subject: prompt.subject,
      styles: prompt.styles,
      lighting: prompt.lighting,
      aspectRatio: prompt.composition.aspectRatio,
      cameraAngle: prompt.composition.cameraAngle,
      details: prompt.details,
      negativePrompt: prompt.negativePrompt,
      parameters: prompt.parameters,
      targetModel: prompt.targetModel,
      activePanel: "editor",
    }),

  resetEditor: () => set(initialEditorState),
}));
