<template>
  <div class="chat-container flex flex-col h-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-blue-100/50">
    <!-- Chat Header -->
    <div class="chat-header bg-white border-b border-gray-100 p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
      <div class="flex items-center space-x-3">
        <div class="relative">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-105">
            <span class="text-white font-semibold text-sm">{{ getInitials(chatPartner.name) }}</span>
          </div>
          <!-- Removed green circle indicator -->
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 text-lg">{{ chatPartner.name }}</h3>
          <p class="text-sm text-gray-500 font-medium">{{ chatPartner.status || (chatPartner.role === 'tutor' ? 'Tuteur' : 'Étudiant') }}</p>
        </div>
      </div>
      <div class="flex items-center">
        <button @click="$emit('close')" class="p-2.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Chat Messages -->
    <div class="chat-messages flex-grow px-5 py-6 space-y-3 overflow-y-auto bg-gray-50 bg-opacity-80" 
         style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIG9wYWNpdHk9Ii4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIiBmaWxsPSIjOTk5Ii8+PC9nPjwvc3ZnPg==');"
         ref="messageContainer">
      <div v-if="loading" class="flex justify-center items-center h-full">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-600"></div>
      </div>
      <div v-else-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-gray-400">
        <div class="bg-blue-100 rounded-full p-8 shadow-lg mb-6 border border-blue-200">
          <svg class="w-20 h-20 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        </div>
        <p class="text-xl font-semibold text-gray-700 mb-2">Aucun message pour l'instant</p>
        <p class="text-sm text-gray-500">Envoyez un message pour démarrer la conversation!</p>
      </div>
      <template v-else>
        <div 
          v-for="message in messages" 
          :key="message.id || message.timestamp"
          class="flex items-end space-x-3 mb-6 animate-fade-in"
          :class="{
            'justify-end flex-row-reverse space-x-reverse': message.sender_type === currentUserRole,
            'justify-start': message.sender_type !== currentUserRole
          }"
        >
          <!-- Avatar for received messages -->
          <div 
            v-if="message.sender_type !== currentUserRole"
            class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 mb-1 shadow-lg transform hover:scale-105 transition-transform duration-200"
          >
            <span class="text-white font-medium text-xs">{{ getInitials(chatPartner.name) }}</span>
          </div>
          
          <!-- Message bubble -->
          <div class="flex flex-col max-w-xs lg:max-w-md">
            <div 
              class="px-5 py-3.5 rounded-2xl shadow-lg relative transition-all duration-200 hover:shadow-xl"
              :class="{
                'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md': message.sender_type === currentUserRole,
                'bg-white text-gray-800 rounded-bl-md border border-gray-200': message.sender_type !== currentUserRole
              }"
            >
              <p class="text-sm leading-relaxed break-words font-semibold">{{ message.content }}</p>
              
              <!-- Message tail -->
              <div 
                v-if="message.sender_type === currentUserRole"
                class="absolute -bottom-0 -right-1 w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 transform rotate-45 rounded-br-sm shadow-sm transition-all duration-200"
              ></div>
              <div 
                v-else
                class="absolute -bottom-0 -left-1 w-4 h-4 bg-white border-l border-b border-gray-200 transform rotate-45 rounded-bl-sm shadow-sm transition-all duration-200"
              ></div>
            </div>
            
            <!-- Timestamp -->
            <div 
              class="text-xs font-medium mt-2 px-1" :class="{
                'text-blue-500': message.sender_type === currentUserRole,
                'text-gray-500': message.sender_type !== currentUserRole
              }"
            >
              {{ formatTime(message.timestamp) }}
              <span v-if="message.sender_type === currentUserRole" class="ml-1">
                <svg class="w-4 h-4 inline text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Chat Input -->
    <div class="chat-input bg-white border-t border-gray-100 p-4 shadow-inner">
      <form @submit.prevent="sendMessage" class="flex items-end space-x-3">
        <!-- Message input -->
        <div class="flex-grow relative">
          <input 
            v-model="newMessage" 
            type="text" 
            placeholder="Tapez un message..." 
            class="w-full bg-gray-100 border-0 rounded-full px-6 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-sm placeholder-gray-500 shadow-sm"
            @keydown.enter.prevent="sendMessage"
          />
          <!-- Emoji button -->
          <button type="button" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </button>
        </div>
        
        <!-- Send button -->
        <button 
          type="submit" 
          class="p-3.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          :disabled="!newMessage.trim() || sending"
        >
          <svg v-if="!sending" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
          <div v-else class="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import chatApiService from './chatApiService';

export default {
  name: 'ChatComponent',
  props: {
    chatPartner: {
      type: Object,
      required: true
    },
    currentUserId: {
      type: [String, Number],
      required: true
    },
    currentUserRole: {
      type: String,
      required: true
    },
    channelName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      messages: [],
      newMessage: '',
      pusher: null,
      channel: null,
      loading: true,
      sending: false
    };
  },
  mounted() {
    this.initializePusher();
    this.loadChatHistory();
  },
  beforeUnmount() {
    if (this.channel) {
      this.channel.unbind_all();
      this.pusher.unsubscribe(this.channelName);
    }
  },
  watch: {
    messages() {
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    chatPartner() {
      // Reload chat history when chat partner changes
      this.loading = true;
      this.messages = [];
      this.loadChatHistory();
      
      // Reinitialize Pusher with new channel
      if (this.channel) {
        this.channel.unbind_all();
        this.pusher.unsubscribe(this.channelName);
      }
      this.initializePusher();
    }
  },
  methods: {
    initializePusher() {
      const { pusher, channel } = chatApiService.initializePusher(
        this.currentUserId, 
        this.currentUserRole,
        (message) => {
          // Only add the message if it's not from the current user
          // This prevents duplicate messages since we already add them optimistically
          if (message.sender_type !== this.currentUserRole) {
            this.messages.push({
              id: message.id,
              tuteur_id: message.tuteur_id,
              etudiant_id: message.etudiant_id,
              content: message.message,
              read_at: message.read_at,
              created_at: message.created_at,
              sender_type: message.sender_type,
              timestamp: new Date(message.created_at || message.timestamp)
            });
            
            // Emit notification event if the chat is not currently focused
            if (!document.hasFocus()) {
              this.$emit('new-message', {
                title: `Nouveau message de ${this.chatPartner.name}`,
                message: message.message,
                timestamp: message.timestamp
              });
            }
          }
        }
      );
      
      this.pusher = pusher;
      this.channel = channel;
    },
    
    async loadChatHistory() {
      this.loading = true;
      try {
        const response = await chatApiService.getChatHistory(
          this.currentUserId,
          this.currentUserRole,
          this.chatPartner.id,
          this.chatPartner.role
        );
        
        if (response.data.success) {
          this.messages = response.data.messages.map(msg => ({
            id: msg.id,
            tuteur_id: msg.tuteur_id,
            etudiant_id: msg.etudiant_id,
            content: msg.message,
            read_at: msg.read_at,
            created_at: msg.created_at,
            sender_type: msg.sender_type,
            timestamp: new Date(msg.created_at)
          }));
          console.log("messages::", this.messages)
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        this.$emit('error', 'Erreur lors du chargement de l\'historique des messages.');
      } finally {
        this.loading = false;
      }
    },
    
    async sendMessage() {
      if (!this.newMessage.trim() || this.sending) return;
      
      const messageContent = this.newMessage.trim();
      this.sending = true;
      
      const messageData = {
        content: messageContent,
        senderId: this.currentUserId,
        senderRole: this.currentUserRole,
        receiverId: this.chatPartner.id,
        receiverRole: this.chatPartner.role,
        timestamp: new Date()
      };
      
      // Optimistically add message to UI with new structure
      const optimisticMessage = {
        id: Date.now(), // temporary ID
        tuteur_id: this.currentUserRole === 'tuteur' ? this.currentUserId : this.chatPartner.id,
        etudiant_id: this.currentUserRole === 'etudiant' ? this.currentUserId : this.chatPartner.id,
        content: messageContent,
        read_at: null,
        created_at: new Date().toISOString(),
        sender_type: this.currentUserRole,
        timestamp: new Date()
      };
      
      this.messages.push(optimisticMessage);
      
      // Clear input field
      this.newMessage = '';
      
      try {
        // Send message to server using our improved API service
        const response = await chatApiService.sendMessage(messageData);
        
        if (!response.data.success) {
          console.error('Failed to send message:', response.data.message);
          this.$emit('error', 'Erreur lors de l\'envoi du message.');
          
          // Remove the optimistically added message if sending failed
          this.messages.pop();
        }
      } catch (error) {
        console.error('Error sending message:', error);
        this.$emit('error', 'Erreur lors de l\'envoi du message. Veuillez réessayer.');
        
        // Remove the optimistically added message if sending failed
        this.messages.pop();
      } finally {
        this.sending = false;
      }
    },
    
    scrollToBottom() {
      const container = this.$refs.messageContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    
    formatTime(timestamp) {
      if (!timestamp) return '';
      
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    
    getInitials(name) {
      if (!name) return '';
      
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();
    }
  }
};
</script>

<style scoped>
.chat-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex-grow: 1;
}

.message-bubble.sender {
  display: flex;
  justify-content: flex-end;
}

.message-bubble.receiver {
  display: flex;
  justify-content: flex-start;
}
</style>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 600px;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.message-bubble.sender {
  text-align: right;
}

.message-bubble.receiver {
  text-align: left;
}
</style>