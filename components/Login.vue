<template>
  <div class="flex flex-col justify-start items-center flex-1 h-screen">
    <Logo class="my-20" />
    <h1 class="text-gray-700 text-4xl mb-5">Real Time Chat</h1>
    <h2 class="text-gray-700 text-lg mb-12">Ably 🧡 Nuxt.js</h2>
    <input
      v-model="userName"
      type="text"
      placeholder="Enter your user name"
      class="mb-5 w-72 focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-5 bg-gray-200 rounded-full py-3"
      @keypress.enter="submit"
    />
    <form>
      <button
        type="button"
        :disabled="!userName"
        class="inline-flex w-48 items-center justify-center rounded-full p-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
        :class="{ 'opacity-50': !userName, 'cursor-not-allowed': !userName }"
        @click="submit"
      >
        {{ !code ? 'Create chat' : 'Join chat' }}
      </button>
    </form>
    <span v-if="code" class="mt-5 text-xs"
      >You will join chat <b>#{{ code }}</b>
    </span>
  </div>
</template>

<script>
import Logo from '@/components/Logo.vue'

export default {
  components: { Logo },
  props: {
    isSet: { type: Boolean, default: false },
    code: { type: String, default: '' },
  },

  data() {
    return {
      userName: '',
    }
  },

  methods: {
    submit() {
      this.$emit('submit', { userName: this.userName })
    },
  },
}
</script>
