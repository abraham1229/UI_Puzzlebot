import { create } from 'zustand'

interface TopicStatus {
  conectionStatus: Boolean
  setTopicState: (newValue: Boolean) => void
}

export const useTopicStatus = create<TopicStatus>((set) => ({
  conectionStatus: false,
  setTopicState: (newValue) => set({ conectionStatus: newValue }),
}))
