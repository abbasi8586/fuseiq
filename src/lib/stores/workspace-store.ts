import { create } from 'zustand';
import type { Mode, Workspace } from '@/types';

interface WorkspaceState {
  currentWorkspace: Workspace | null;
  mode: Mode;
  setWorkspace: (workspace: Workspace) => void;
  setMode: (mode: Mode) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  currentWorkspace: null,
  mode: 'Hybrid',
  setWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  setMode: (mode) => set({ mode }),
}));
