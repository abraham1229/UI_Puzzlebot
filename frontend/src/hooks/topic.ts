import { create } from 'zustand'

interface TopicValue {
  value: Number
  setValue: (newValue: number) => void
}

export const useUserStore = create<TopicValue>((set) => ({
  value: 0,
  setValue: (newValue) => set({ value: newValue }),
}))
