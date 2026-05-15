import { defineStore } from 'pinia'

export const useMessagesStore = defineStore('messages', {
  state: () => ({
    messages: [],
  }),

  actions: {
    addMessage(msg) {
      this.messages.push(msg)
    },
  },
})
