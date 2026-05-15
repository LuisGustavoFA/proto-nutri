import messagesData from './botMessages.json'

let currentIndex = 0

export default {
  sendMessage() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = messagesData[currentIndex]

        if (currentIndex < messagesData.length - 1) {
          currentIndex++
        } else {
          currentIndex = 0
        }

        resolve(response)
      }, 1800)
    })
  },
}
