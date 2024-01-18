import { create } from "zustand";

interface IModal {
  isNetworkModalOpen: boolean;
  openNetworkModal: () => void;
  closeNetworkModal: () => void;
}

export const useNetworkModal = create<IModal>((set) => ({
  isNetworkModalOpen: false,
  openNetworkModal: () => set({ isNetworkModalOpen: true }),
  closeNetworkModal: () => set({ isNetworkModalOpen: false }),
}));
