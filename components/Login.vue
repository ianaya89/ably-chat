<template>
  <div class="flex flex-col justify-start items-center flex-1 h-screen">
    <Logo class="my-20" />
    <h1 class="text-gray-700 text-4xl mb-5">Real Time Chat</h1>
    <h2 class="text-gray-700 text-lg mb-12">Ably 🧡 Nuxt.js</h2>
    <input
      v-model="nickName"
      type="text"
      placeholder="Enter your user name"
      class="mb-5 w-72 focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-5 bg-gray-200 rounded-full py-3"
      @keypress.enter="login"
    />
    <form>
      <button
        type="button"
        :disabled="!nickName"
        class="inline-flex w-48 items-center justify-center rounded-full p-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
        :class="{ 'opacity-50': !nickName, 'cursor-not-allowed': !nickName }"
        @click="login"
      >
        {{ !chatId ? 'Create chat' : 'Join chat' }}
      </button>
    </form>
    <span v-if="chatId" class="mt-5 text-xs"
      >You will join chat <b>#{{ chatId }}</b>
    </span>
  </div>
</template>

<script>
import Logo from '@/components/Logo.vue'

export default {
  components: { Logo },
  props: {
    chatId: { type: String, default: '' },
  },

  data() {
    return {
      nickName: '',
    }
  },

  methods: {
    login() {
      this.$emit('login', this.nickName)
    },
  },
}
</script>
