<template>
  <div>
    <div
      class="flex sm:items-center justify-between py-3 border-b-2 border-gray-200"
    >
      <div class="flex items-center space-x-4">
        <Logo />
        <div class="flex flex-col leading-tight">
          <div class="text-2xl mt-1 flex items-center">
            <span class="text-gray-700 mr-3">{{ nickName }}</span>
            <span :class="isOnline ? 'text-green-500' : 'text-red-500'">
              <svg width="10" height="10">
                <circle cx="5" cy="5" r="5" fill="currentColor"></circle>
              </svg>
            </span>
          </div>
          <div>
            <button class="mb-2 text-gray-800" @click="copyUrl">
              <span class="text-sm">Copy chat link</span>
              <svg
                class="inline-flex items-center justify-center rounded-full h-5 w-5 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
            </button>
          </div>
          <span class="text-xs">Powered by Nuxt.js & Ably 🧡</span>
        </div>
      </div>
      <div class="flex flex-col items-center justify-between space-x-2">
        <span class="mb-2 text-gray-400 text-sm"> {{ members }} members</span>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-full h-8 w-8 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
          @click="logout"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </div>
    <div
      class="flex flex-col h-full space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <Message
        v-for="m in messages"
        :key="m.i"
        :is-mine="isMine(m)"
        :message="m"
      />
    </div>
  </div>
</template>

<script>
import Logo from '@/components/Logo.vue'
import Message from '@/components/Message.vue'

export default {
  components: { Logo, Message },

  props: {
    nickName: { type: String, default: '' },
    chatUrl: { type: String, default: '' },
    isOnline: { type: Boolean, default: false },
    members: { type: Number, default: 0 },
    messages: { type: Array, default: () => [] },
  },

  methods: {
    async copyUrl() {
      await navigator.clipboard.writeText(this.chatUrl)
    },

    logout() {
      this.$emit('logout')
    },

    isMine(message) {
      return message.name === this.nickName
    },
  },
}
</script>
