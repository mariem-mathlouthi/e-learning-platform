<template>
  <div class="chat-container flex flex-col bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl h-full" style="height: calc(100vh - 100px);"> <!-- Adjust 100px based on your header/footer height -->
    <!-- Chat Header -->
    <div class="chat-header bg-white border-b border-gray-100 p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
      <div class="flex items-center space-x-3">
        <div class="relative">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-105">
            <span class="text-white font-semibold text-sm">{{ getInitials(chatPartner.name) }}</span>
          </div>
          <!-- Removed green circle indicator -->
        </div>
        <div>
          <h3 class="font-semibold text-gray-900">{{ chatPartner.name }}</h3>
          <p class="text-xs text-gray-500 font-medium">{{ chatPartner.status || (chatPartner.role === 'tutor' ? 'Tuteur' : 'Étudiant') }}</p>
        </div>
      </div>
      <button @click="$emit('close')" class="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Chat Messages -->
    <div class="chat-messages flex-grow px-4 py-3 space-y-2 overflow-y-auto bg-gray-50 bg-opacity-80 h-0" 
         style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIG9wYWNpdHk9Ii4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIiBmaWxsPSIjOTk5Ii8+PC9nPjwvc3ZnPg==');"
         ref="messageContainer">
      <div v-if="loading" class="flex justify-center items-center h-full">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-t-2 border-blue-600"></div>
      </div>
      <div v-else-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-gray-400">
        <div class="bg-blue-100 rounded-full p-6 shadow-sm mb-4 border border-blue-200">
          <svg class="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        </div>
        <p class="text-sm">Aucun message. Commencez la conversation!</p>
      </div>
      <template v-else>
        <template v-for="(message, index) in messages" :key="index">
          <div v-if="index === firstUnreadMessageIndex && firstUnreadMessageIndex !== -1" class="unread-separator my-3">
            <hr class="border-t border-red-500">
            <p class="text-center text-xs text-red-500 font-medium py-1">Messages non lus</p>
            <hr class="border-t border-red-500">
          </div>
          <div :class="[message.sender_type === currentUserRole ? 'receiver' : 'sender', 'message-bubble mb-2']">
            <div :class="[message.sender_type === currentUserRole ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border border-gray-200', 'rounded-lg py-2 px-3 max-w-xs md:max-w-sm inline-block shadow-sm text-sm']">
              <p>{{ message.content }}</p>
              <span class="text-xs block mt-1 opacity-75">{{ formatTime(message.timestamp) }}</span>
            </div>
          </div>
        </template>
      </template>
    </div>

    <!-- Chat Input -->
    <div class="chat-input border-t border-gray-100 p-3">
      <form @submit.prevent="sendMessage" class="flex">
        <input 
          v-model="newMessage" 
          type="text" 
          placeholder="Tapez votre message..." 
          class="flex-grow border border-gray-200 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button 
          type="submit" 
          class="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          :disabled="!newMessage.trim() || sending"
        >
          <svg v-if="!sending" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
          <div v-else class="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
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
      sending: false,
      firstUnreadMessageIndex: -1, // Initialize with -1 (no unread messages)
      unreadMessagesCount: 0 // To store the count of unread messages
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
        (pusherData) => {

          // pusherData is the object like: {"id":39,"etudiant_id":2,"tuteur_id":1,"message":"bhi", ... ,"sender_type":"tuteur"}
          if (pusherData && pusherData.sender_type && pusherData.sender_type !== this.currentUserRole) {
            // Determine senderId based on sender_type
            let senderId;
            if (pusherData.sender_type === 'etudiant') {
              senderId = pusherData.etudiant_id;
            } else if (pusherData.sender_type === 'tuteur') {
              senderId = pusherData.tuteur_id;
            }

            this.messages.push({
              id: pusherData.id, // Use the ID from Pusher data
              content: pusherData.message,
              senderId: senderId,
              sender_type: pusherData.sender_type,
              timestamp: new Date(pusherData.created_at),
              read_at: pusherData.read_at ? new Date(pusherData.read_at) : null
            });

            // If the received message is for the currently active chat, mark it as read immediately
            if (this.chatPartner && 
                ((pusherData.sender_type === 'etudiant' && pusherData.etudiant_id === this.chatPartner.id) || 
                 (pusherData.sender_type === 'tuteur' && pusherData.tuteur_id === this.chatPartner.id))) {
                this.markMessagesAsRead(); // This will also reset unreadMessagesCount if applicable
            } else {
                // If it's for another chat, increment unread count for that chat (if needed elsewhere or for notifications)
                // For now, just focus on the current chat. Future enhancement: update global unread counts.
            }

            if (!document.hasFocus()) {
              this.$emit('new-message', {
                title: `Nouveau message de ${pusherData.sender_type === 'tuteur' ? 'Tuteur' : 'Étudiant'}`, // Or fetch sender name if available
                message: pusherData.message,
                timestamp: pusherData.created_at
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
        // Fetch unread messages count
        const token = localStorage.getItem('token'); // Or however you store/retrieve the token
        const unreadCountResponse = await chatApiService.getUnreadCount(token, this.currentUserRole);
        if (unreadCountResponse.data.success && unreadCountResponse.data.unread_by_user) {
          const partnerUnreadInfo = unreadCountResponse.data.unread_by_user.find(
            u => u.user && u.user.id === this.chatPartner.id
          );
          this.unreadMessagesCount = partnerUnreadInfo ? partnerUnreadInfo.unread_count : 0;
        } else {
          console.error('Failed to fetch unread count or unread_by_user is missing:', unreadCountResponse.data.message);
          this.unreadMessagesCount = 0; // Default to 0 on error
        }

        const response = await chatApiService.getChatHistory(
          this.currentUserId,
          this.currentUserRole,
          this.chatPartner.id,
          this.chatPartner.role
        );
        
        if (response.data.success) {
          this.messages = response.data.messages.map(msg => ({
            content: msg.message, // Removed duplicate content property
            senderId: msg.sender_id, // Or etudiant_id/tuteur_id depending on API response structure
            sender_type: msg.sender_type, // This should be 'tutor' or 'student' from API
            timestamp: new Date(msg.created_at),
            read_at: msg.read_at ? new Date(msg.read_at) : null 
          }));
          console.log("sender::", this.messages)
          this.findFirstUnreadMessage();
        }
      } catch (error) {
        console.error('Error loading chat history or unread count:', error);
        this.$emit('error', 'Erreur lors du chargement des messages.');
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
      
      // Optimistically add message to UI
      this.messages.push({
        content: messageContent,
        senderId: this.currentUserId,
        sender_type: this.currentUserRole, // Add sender_type for correct UI rendering
        timestamp: new Date()
      });
      
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
    
    findFirstUnreadMessage() {
      if (this.unreadMessagesCount > 0 && this.messages.length > 0) {
        // Calculate the index for the separator line
        // It should be before the block of unread messages
        const unreadBlockStartIndex = this.messages.length - this.unreadMessagesCount;
        
        // Ensure the index is valid and points to a message from the other user
        if (unreadBlockStartIndex >= 0 && unreadBlockStartIndex < this.messages.length) {
            // We only want to show the separator if the *first* message in the unread block
            // is from the other user. If the current user sent the last read message,
            // and then the other user sent unread messages, this logic holds.
            // However, if the unread count includes messages from the current user that are somehow marked unread by API,
            // this might need more refinement based on exact API behavior for unread count.
            
            // For now, let's assume unreadMessagesCount is purely for messages *received* and unread.
            this.firstUnreadMessageIndex = unreadBlockStartIndex;
        } else {
            this.firstUnreadMessageIndex = -1; // Invalid index or no unread messages from others
        }

      } else {
        this.firstUnreadMessageIndex = -1; // No unread messages
      }

      // If unread messages exist, scroll to the separator and mark messages as read
      if (this.firstUnreadMessageIndex !== -1) {
        this.$nextTick(() => {
          const unreadSeparator = this.$refs.messageContainer.querySelector('.unread-separator');
          if (unreadSeparator) {
            unreadSeparator.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            const messageElements = this.$refs.messageContainer.querySelectorAll('.message-bubble');
            if (messageElements[this.firstUnreadMessageIndex]) {
              messageElements[this.firstUnreadMessageIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
          
          // Mark unread messages as read after displaying the separator
          this.markMessagesAsRead();
        });
      }
    },
    
    /**
     * Mark unread messages as read using the API
     */
    async markMessagesAsRead() {
      if (this.unreadMessagesCount <= 0 || this.firstUnreadMessageIndex === -1) {
        return; // No unread messages to mark
      }
      
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Authentication token not found for marking messages as read.');
          return;
        }
        
        // Get the IDs of unread messages
        const unreadMessageIds = [];
        for (let i = this.firstUnreadMessageIndex; i < this.messages.length; i++) {
          // Only include messages that don't have a read_at value
          if (this.messages[i] && this.messages[i].id && !this.messages[i].read_at) {
            unreadMessageIds.push(this.messages[i].id);
          }
        }
        
        if (unreadMessageIds.length === 0) {
          console.log('No unread message IDs found to mark as read.');
          return;
        }
        
        // Call the API to mark messages as read
        const response = await chatApiService.markMessagesAsRead(token, unreadMessageIds);
        
        if (response.data && response.data.success) {
          console.log('Messages marked as read successfully:', unreadMessageIds);
          
          // Update the local messages to reflect they've been read
          unreadMessageIds.forEach(id => {
            const messageIndex = this.messages.findIndex(msg => msg.id === id);
            if (messageIndex !== -1) {
              this.messages[messageIndex].read_at = new Date();
            }
          });
          
          // Reset unread count since we've marked all as read
          this.unreadMessagesCount = 0;
        } else {
          console.error('Failed to mark messages as read:', response.data.message);
        }
      } catch (error) {
        console.error('Error in markMessagesAsRead:', error);
      }
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
  scroll-behavior: smooth;
}

.message-bubble.sender {
  display: flex;
  justify-content: flex-start;
}

.message-bubble.receiver {
  display: flex;
  justify-content: flex-end;
}
</style>