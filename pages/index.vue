<template>
  <main class="flex">
    <Login v-if="!isLoggedIn" :chat-id="chatId" @login="createChat" />
    <div
      v-else
      class="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen"
    >
      <Chat
        :is-online="isOnline"
        :nick-name="nickName"
        :chat-url="chatUrl"
        :online-members="onlineMembers"
        :messages="messages"
        @logout="logout"
      />
      <ChatInput @send="sendMessage" />
    </div>
  </main>
</template>

<script>
import Ably from 'ably'
import { v4 as uuidv4 } from 'uuid'

import Login from '@/components/Login.vue'
import ChatInput from '~/components/ChatInput.vue'
import Chat from '~/components/Chat.vue'

let channel = null

export default {
  components: { Chat, ChatInput, Login },

  data() {
    return {
      chatId: this.$route.query.chatId,
      nickName: '',
      isOnline: false,
      isLoggedIn: false,
      messages: [],
      onlineMembers: 0,
    }
  },

  computed: {
    chatUrl() {
      const { host, protocol } = window.location
      return `${protocol}//${host}/?chatId=${this.chatId}`
    },
  },

  methods: {
    createChat(nickName) {
      if (!nickName) {
        return
      }

      this.nickName = nickName
      this.isLoggedIn = true
      this.chatId = this.chatId || uuidv4()
      this.setupAbly()

      if (!this.$route.query.chatId) {
        this.$router.replace({ path: '/', query: { chatId: this.chatId } })
      }
    },

    sendMessage(message) {
      if (!message || !this.isOnline || !channel) {
        return
      }

      channel.publish(this.nickName, message)
    },

    setupAbly() {
      const ably = new Ably.Realtime({
        authUrl: '/server/auth',
      })

      ably.connection.once('connected', () => {
        this.isOnline = true

        channel = ably.channels.get('chat:' + this.chatId)

        channel.subscribe((message) => {
          this.messages.push(message)
        })

        channel.history((err, resultPage) => {
          if (err) {
            throw err
          }

          this.messages = resultPage.items.reverse()
        })

        channel.presence.get((err, members) => {
          if (err) {
            throw err
          }

          this.onlineMembers = members.length
          channel.presence.enter()
        })
      })
    },

    logout() {
      channel.presence.leave()
      this.chatId = null
      this.isLoggedIn = null
      this.nickName = null
    },
  },
}
</script>
