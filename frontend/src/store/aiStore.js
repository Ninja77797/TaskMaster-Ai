import { create } from 'zustand';

export const useAIStore = create((set) => ({
  chatHistory: [],

  addUserMessage: (content) =>
    set((state) => ({
      chatHistory: [...state.chatHistory, { role: 'user', content }],
    })),

  addAssistantMessage: (content) =>
    set((state) => ({
      chatHistory: [...state.chatHistory, { role: 'assistant', content }],
    })),

  clearChat: () => set({ chatHistory: [] }),
}));
