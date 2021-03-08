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
        :members="members"
        :messages="messages"
        @logout="logout"
      />
      <ChatInput v-model="newMessage" @send="sendMessage" />
    </div>
  </main>
</template>

<script>
import Ably from 'ably'

import Login from '@/components/Login.vue'
import ChatInput from '~/components/ChatInput.vue'
import Chat from '~/components/Chat.vue'

let channel = null
const URL = 'http://localhost:3000'
// const API_URL = 'http://localhost:3000/server/auth'
// const API_KEY = '3ddyRg.-e7qwg:eBMHfB2MA3TsbCVf'

export default {
  components: { Chat, ChatInput, Login },

  data() {
    return {
      code: this.$route.query.code,
      userName: '',
      isOnline: false,
      isSet: false,
      messages: [],
      members: [],
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
      this.code = this.code || Math.round(Math.random() * 10000)
      this.setupAbly()

      if (!this.$route.query.code) {
        this.$router.replace({ path: '/', qs: { code: this.code } })
      }
    },

    sendMessage(message) {
      if (!message || !this.isOnline || !channel) {
        return
      }
      channel.publish(this.code, message)
      debugger
      this.newMessage = ''
    },

    setupAbly() {
      const ably = new Ably.Realtime({
        authUrl: '/server/auth',
      })

      ably.connection.once('connected', () => {
        this.clientId = ably.auth.clientId
        this.isOnline = true
        channel = ably.channels.get(this.code)

        channel.subscribe(this.code, (message) => {
          console.log(message)
          this.messages.push(message)
        })

        channel.history((err, resultPage) => {
          if (err) {
            return
          }

          this.messages = resultPage.items.reverse()
        })

        channel.presence.subscribe('enter', (member) => {
          this.members.push(member)
        })

        channel.presence.get((err, members) => {
          if (err) {
            return
          }

          this.members = members
        })

        channel.presence.enter()
      })
    },

    logout() {
      this.code = null
      this.isSet = null
      this.userName = null
    },
  },
}
</script>

<style>
/* .scrollbar-w-2::-webkit-scrollbar {
  width: 0.25rem;
  height: 0.25rem;
}

.scrollbar-track-blue-lighter::-webkit-scrollbar-track {
  --bg-opacity: 1;
  background-color: #f7fafc;
  background-color: rgba(247, 250, 252, var(--bg-opacity));
}

.scrollbar-thumb-blue::-webkit-scrollbar-thumb {
  --bg-opacity: 1;
  background-color: #edf2f7;
  background-color: rgba(237, 242, 247, var(--bg-opacity));
}

.scrollbar-thumb-rounded::-webkit-scrollbar-thumb {
  border-radius: 0.25rem;
} */
</style>
