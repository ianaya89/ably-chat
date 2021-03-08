<template>
  <main class="flex">
    <Login v-if="!isSet" :is-set="isSet" :code="code" @submit="createCode" />
    <div
      v-else
      class="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen"
    >
      <Chat
        :is-online="isOnline"
        :user-name="userName"
        :chat-url="chatUrl"
        :online-members="onlineMembers"
        :messages="messages"
        @logout="logout"
      />
      <ChatInput v-model="newMessage" @send="sendMessage" />
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
const URL = process.env.APP_URL || 'http://localhost:3000'

export default {
  components: { Chat, ChatInput, Login },

  data() {
    return {
      code: this.$route.query.code,
      userName: '',
      isOnline: false,
      isSet: false,
      messages: [],
      onlineMembers: 0,
      newMessage: '',
      clientId: null,
    }
  },

  computed: {
    chatUrl() {
      return `${URL}/?code=${this.code}`
    },
  },

  methods: {
    createCode({ userName }) {
      if (!userName) {
        return
      }

      this.userName = userName
      this.isSet = true
      this.code = this.code || uuidv4()
      this.setupAbly()

      if (!this.$route.query.code) {
        this.$router.replace({ path: '/', query: { code: this.code } })
      }
    },

    sendMessage(message) {
      if (!message || !this.isOnline || !channel) {
        return
      }

      channel.publish(this.userName, message)
      this.newMessage = ''
    },

    setupAbly() {
      const ably = new Ably.Realtime({
        authUrl: '/server/auth',
      })

      ably.connection.once('connected', () => {
        this.clientId = ably.auth.clientId
        this.isOnline = true
        channel = ably.channels.get('chat:' + this.code)

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
      this.code = null
      this.isSet = null
      this.userName = null
    },
  },
}
</script>
