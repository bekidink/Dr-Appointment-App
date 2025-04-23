import { create } from 'zustand';

export interface BearState {
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
  updateBears: (newBears: number) => void;
  isSuccessModalVisible: boolean;
  successModalMessage: string;
  isLoading: boolean;
  openSuccessModal: (message: string) => void;
  closeSuccessModal: () => void;
  setLoadingState: (isLoading: boolean) => void;
}

export const useStore = create<BearState>((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
  isSuccessModalVisible: false,
  successModalMessage: '',
  isLoading: false,
  openSuccessModal: (message: string) =>
    set({ isSuccessModalVisible: true, successModalMessage: message }),
  closeSuccessModal: () => set({ isSuccessModalVisible: false, successModalMessage: '' }),
  setLoadingState: (isLoading: boolean) => set({ isLoading }),
}));
