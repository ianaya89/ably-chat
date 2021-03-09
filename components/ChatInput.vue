<template>
  <div class="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
    <div class="relative flex">
      <input
        v-model="newMessage"
        type="text"
        placeholder="Write Something"
        class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-6 bg-gray-200 rounded-full py-3"
        @keypress.enter="send"
      />
      <form class="absolute right-0 items-center inset-y-0 hidden sm:flex">
        <button
          type="button"
          :disabled="!newMessage"
          class="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
          :class="{
            'opacity-50': !newMessage,
            'cursor-not-allowed': !newMessage,
          }"
          @click="send"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="h-6 w-6 transform rotate-90"
          >
            <path
              d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
            ></path>
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { newMessage: '' }
  },

  methods: {
    send() {
      this.$emit('send', this.newMessage)
      this.newMessage = ''
    },
  },
}
</script>
