import { create } from 'zustand'

interface TopicValue {
  value: Number
  setValue: (newValue: number) => void
}

export const useTopicValue = create<TopicValue>((set) => ({
  value: 0,
  setValue: (newValue) => set({ value: newValue }),
}))
