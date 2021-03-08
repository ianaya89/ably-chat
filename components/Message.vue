<template>
  <div class="chat-message">
    <div class="flex items-end" :class="{ 'justify-end': isMine }">
      <div
        class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1"
        :class="isMine ? 'items-end order-1' : 'items-start order-2'"
      >
        <div>
          <span
            class="px-4 py-2 rounded-lg inline-block text-white"
            :class="chatColor"
            >{{ message.data }}</span
          >
        </div>
      </div>
      <span
        :class="isMine ? 'order-2' : 'order-1'"
        class="w-8 h-8 rounded-full bg-purple-500 flex justify-center items-center text-white"
      >
        {{ initials }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isMine: { type: Boolean, default: false },
    message: { type: Object, required: true },
  },

  computed: {
    initials() {
      if (this.message.name.length === 1) {
        return this.message.name
      }

      return this.message.name.substring(0, 2).toUpperCase()
    },

    chatColor() {
      return this.isMine
        ? 'bg-blue-500 rounded-br-none'
        : 'bg-gray-400 rounded-bl-none'
    },
  },
}
</script>
