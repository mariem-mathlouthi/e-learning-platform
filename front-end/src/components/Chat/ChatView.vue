<template>
  <div>
    <!-- Navbar - Conditionally render based on user role -->
    <NavBarStd v-if="userRole === 'student'" class="fixed top-0 left-0 w-full z-50 shadow-sm bg-white/90 backdrop-blur-md" />
    <NavBarTut v-if="userRole === 'tutor'" class="fixed top-0 left-0 w-full z-50 shadow-sm bg-white/90 backdrop-blur-md" />
    
    <!-- Sidebar - Conditionally render based on user role -->
    <Sidebar v-if="userRole === 'student'" />
    <SidebarTut v-if="userRole === 'tutor'" />
    
    <div class="chat-view-container">
      <!-- Chat Notification Component -->
      <ChatNotification
        :show="showNotification"
        :title="notificationTitle"
        :message="notificationMessage"
        :timestamp="notificationTimestamp"
        :userRole="currentUserRole"
        :error="errorMessage"
        @close="closeNotification"
      />
      
      <div class="grid grid-cols-12 gap-6 h-full">
        <!-- Chat List Section -->
        <div class="col-span-12 md:col-span-4 lg:col-span-3">
          <ChatList 
            :currentUserId="currentUserId" 
            :currentUserRole="currentUserRole"
            @select-contact="selectContact"
          />
        </div>
        
        <!-- Chat Component Section -->
        <div class="col-span-12 md:col-span-8 lg:col-span-9">
          <div v-if="selectedContact" class="h-full">
            <ChatComponent 
              :chatPartner="selectedContact"
              :currentUserId="currentUserId"
              :currentUserRole="currentUserRole"
              :channelName="channelName"
              @close="closeChat"
              @new-message="handleNewMessage"
              @error="handleError"
            />
          </div>
          <div v-else class="h-full flex items-center justify-center bg-white rounded-2xl shadow-2xl border border-gray-100 p-12">
            <div class="text-center text-gray-500 max-w-md">
              <div class="bg-gray-50 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                <svg class="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-800 mb-3">Bienvenue dans vos Messages</h3>
              <p class="text-gray-500 text-lg mb-6">Sélectionnez une conversation pour commencer à discuter</p>
              <div class="flex items-center justify-center space-x-4 text-sm text-gray-400">
                <!-- Removed online status indicator -->
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  <span>Messages chiffrés</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChatList from './ChatList.vue';
import ChatComponent from './ChatComponent.vue';
import ChatNotification from './ChatNotification.vue';
import Sidebar from '../StudentDash/Sidebar.vue';
import SidebarTut from '../TuteurDash/SidebarTut.vue';
import NavBarStd from '../StudentDash/NavBarStd.vue';
import NavBarTut from '../TuteurDash/NavBarTut.vue';
import chatApiService from './chatApiService';

export default {
  name: 'ChatView',
  components: {
    ChatList,
    ChatComponent,
    ChatNotification,
    Sidebar,
    SidebarTut,
    NavBarStd,
    NavBarTut
  },
  props: {
    userRole: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      currentUserId: null,
      currentUserRole: '',
      selectedContact: null,
      channelName: '',
      showNotification: false,
      notificationTitle: '',
      notificationMessage: '',
      notificationTimestamp: null,
      errorMessage: ''
    };
  },
  created() {
    this.initializeUserData();
    this.initializePusher();
  },
  methods: {
    initializeUserData() {
      // Set user data based on role
      if (this.userRole === 'student') {
        const studentInfo = JSON.parse(localStorage.getItem('StudentAccountInfo'));
        this.currentUserId = studentInfo.id;
        this.currentUserRole = 'etudiant';
      } else if (this.userRole === 'tutor') {
        const tuteurInfo = JSON.parse(localStorage.getItem('TuteurAccountInfo'));
        this.currentUserId = tuteurInfo.id;
        this.currentUserRole = 'tuteur';
      }
    },

    initializePusher() {
      // Import the chatApiService at the top of the script
      const { pusher, channel } = chatApiService.initializePusher(
        this.currentUserId,
        this.currentUserRole,
        (message) => {
          // Handle global notifications here if needed
          console.log('Global chat notification received:', message);
          
          // Show notification if the chat is not with the current selected contact
          if (!this.selectedContact || message.senderId !== this.selectedContact.id) {
            this.showNotification = true;
            this.notificationTitle = 'Nouveau message';
            this.notificationMessage = message.message;
            this.notificationTimestamp = new Date(message.created_at);
            
            // Auto-hide notification after 5 seconds
            setTimeout(() => {
              this.showNotification = false;
            }, 5000);
          }
        }
      );
      
      this.pusher = pusher;
      this.chatChannel = channel;
    },
    
    selectContact(contact) {
      this.selectedContact = contact;
      
      // Create a unique channel name for this conversation
      // Format: chat.{smaller_id}_{smaller_role}.{larger_id}_{larger_role}
      // This ensures the same channel name regardless of who initiates the chat
      const participants = [
        { id: this.currentUserId, role: this.currentUserRole },
        { id: contact.id, role: contact.role }
      ];
      
      // Sort participants to ensure consistent channel naming
      participants.sort((a, b) => {
        if (a.id !== b.id) return a.id - b.id;
        return a.role.localeCompare(b.role);
      });
      
      this.channelName = `chat.${participants[0].id}_${participants[0].role}.${participants[1].id}_${participants[1].role}`;
    },
    
    closeChat() {
      this.selectedContact = null;
      this.channelName = '';
    },

    handleNewMessage(message) {
      // Handle new message notification
      console.log('New message received:', message);
      
      // Show notification
      this.showNotification = true;
      this.notificationTitle = message.title || 'Nouveau message';
      this.notificationMessage = message.message;
      this.notificationTimestamp = message.timestamp ? new Date(message.timestamp) : new Date();
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        this.showNotification = false;
      }, 5000);
    },

    handleError(error) {
      this.errorMessage = error;
      this.showNotification = true;
      this.notificationTitle = 'Error';
      this.notificationMessage = error;
      this.notificationTimestamp = new Date();
    },

    closeNotification() {
      this.showNotification = false;
      this.errorMessage = '';
    }
  }
};
</script>

<style scoped>
.chat-view-container {
  padding: 1rem;
  height: 100%;
  min-height: 600px;
  margin-left: 250px; /* Width of the sidebar */
  margin-top: 72px; /* Height of the navbar */
  width: calc(100% - 250px);
}

@media (max-width: 768px) {
  .chat-view-container {
    margin-left: 0;
    width: 100%;
  }
}
</style>