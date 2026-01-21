import { INITIAL_Z_INDEX, WINDOW_CONFIG } from "@/constants";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Store = {
  windows: typeof WINDOW_CONFIG;
  openWindow: (windowKey: keyof typeof WINDOW_CONFIG, data?: any) => void;
  closeWindow: (windowKey: keyof typeof WINDOW_CONFIG) => void;
  focusWindow: (windowKey: keyof typeof WINDOW_CONFIG) => void;
  nextZIndex: number;
};

const useWindowStore = create<Store>()(
  immer((set) => ({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX + 1,

    openWindow: (windowKey: keyof typeof WINDOW_CONFIG, data = null) =>
      set((state) => {
        const win = state.windows[windowKey];
        win.isOpen = true;
        win.zIndex = state.nextZIndex;
        win.data = data ?? win.data;
        state.nextZIndex++;
      }),
    closeWindow: (windowKey: keyof typeof WINDOW_CONFIG) =>
      set((state) => {
        const win = state.windows[windowKey];
        win.isOpen = false;
        win.zIndex = INITIAL_Z_INDEX;
        win.data = null;
      }),
    focusWindow: (windowKey: keyof typeof WINDOW_CONFIG) =>
      set((state) => {
        const win = state.windows[windowKey];
        win.zIndex = state.nextZIndex++;
      }),
  })),
);

export default useWindowStore;
