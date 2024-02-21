import { create } from "zustand";

interface GlobalLoadingState {
    loadingCount: number;
    isLoading: () => boolean;
    increase: () => void;
    decrease: () => void;
}

export const useGlobalLoading = create<GlobalLoadingState>()((set, get) => ({
    loadingCount: 1,
    isLoading: () => get().loadingCount > 0,
    increase: () => set(state => ({ loadingCount: state.loadingCount + 1 })),
    decrease: () => set(state => ({ loadingCount: state.loadingCount - 1 })),
}));