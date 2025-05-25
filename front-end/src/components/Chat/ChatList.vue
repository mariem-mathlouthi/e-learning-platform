<template>
  <div class="chat-list-container bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col h-full" style="height: calc(100vh - 100px);">
    <!-- Header -->
    <div class="chat-list-header bg-white border-b border-gray-100 p-6">
      <div class="flex items-center justify-between">
        <h2 class="font-bold text-2xl text-gray-900">Messages</h2>
        <button class="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="p-4 border-b border-gray-100">
      <div class="relative">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Rechercher des conversations..." 
          class="w-full pl-12 pr-4 py-3 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-sm placeholder-gray-500"
        />
        <svg class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
    </div>

    <!-- Contact List -->
    <div class="chat-contacts overflow-y-auto flex-grow">
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
      
      <div v-else-if="filteredContacts.length === 0" class="text-center text-gray-500 py-12">
        <div class="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
        <p class="font-medium text-gray-600">Aucun contact disponible</p>
        <p class="text-sm text-gray-400 mt-1">Vos conversations apparaîtront ici</p>
      </div>
      
      <div v-else>
        <div 
          v-for="contact in filteredContacts" 
          :key="contact.id"
          @click="selectContact(contact)"
          class="chat-contact px-4 py-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 border-b border-gray-50 last:border-b-0"
          :class="{'bg-blue-50 border-blue-100': selectedContactId === contact.id}"
        >
          <div class="flex items-center space-x-3">
            <!-- Avatar -->
            <div class="relative flex-shrink-0">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                <span class="text-white font-semibold text-sm">{{ getInitials(contact.name) }}</span>
              </div>
              <!-- Removed green circle indicator -->
            </div>
            
            <!-- Contact info -->
            <div class="flex-grow min-w-0">
              <div class="flex items-center justify-between mb-1">
                <h3 class="font-semibold text-gray-900 truncate">{{ contact.name }}</h3>
                <span class="text-xs text-gray-400 flex-shrink-0 ml-2">12:30</span>
              </div>
              <div class="flex items-center justify-between">
                <p class="text-sm text-gray-500 truncate flex-grow">{{ contact.lastMessage || 'Commencer une conversation' }}</p>
                <div v-if="contact.unreadCount" class="bg-blue-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 ml-2 flex-shrink-0">
                  {{ contact.unreadCount > 99 ? '99+' : contact.unreadCount }}
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
import chatApiService from './chatApiService';

export default {
  name: 'ChatList',
  props: {
    currentUserId: {
      type: [String, Number],
      required: true
    },
    currentUserRole: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      contacts: [],
      loading: true,
      searchQuery: '',
      selectedContactId: null
    };
  },
  computed: {
    filteredContacts() {
      if (!this.searchQuery) return this.contacts;
      
      const query = this.searchQuery.toLowerCase();
      return this.contacts.filter(contact => 
        contact.name.toLowerCase().includes(query)
      );
    }
  },
  mounted() {
    this.loadContacts();
  },
  methods: {
    async loadContacts() {
      this.loading = true;
      try {
        // Get the appropriate token based on user role
        let authToken;
        if (this.currentUserRole === 'tuteur') {
          const tuteurInfo = JSON.parse(localStorage.getItem('TuteurAccountInfo'));
          authToken = tuteurInfo ? tuteurInfo.token : null;
        } else {
          const studentInfo = JSON.parse(localStorage.getItem('StudentAccountInfo'));
          authToken = studentInfo ? studentInfo.token : null;
        }

        if (!authToken) {
          console.error('Auth token not found for loading contacts.');
          this.loading = false;
          return;
        }

        // Fetch contacts
        const contactsResponse = await chatApiService.getContacts(
          this.currentUserId,
          this.currentUserRole,
          authToken
        );
        
        let contacts = [];
        if (contactsResponse.data.success) {
          contacts = contactsResponse.data.contacts;
        }

        // Fetch unread counts
        const unreadCountsResponse = await chatApiService.getUnreadCount(authToken, this.currentUserRole);
        if (unreadCountsResponse.data.success) {
          const unreadByUser = unreadCountsResponse.data.unread_by_user;
          // Emit total unread count for sidebar or other components
          this.$emit('total-unread-count', unreadCountsResponse.data.total_unread_count);

          // Map unread counts to contacts
          this.contacts = contacts.map(contact => {
            const unreadInfo = unreadByUser.find(u => u.user.id === contact.id);
            return {
              ...contact,
              unreadCount: unreadInfo ? unreadInfo.unread_count : 0
            };
          });
        } else {
          // If fetching unread counts fails, still display contacts without counts
          this.contacts = contacts.map(contact => ({ ...contact, unreadCount: 0 }));
        }

      } catch (error) {
        console.error('Error loading contacts or unread counts:', error);
        // Initialize contacts to empty array on error to prevent issues
        this.contacts = []; 
      } finally {
        this.loading = false;
      }
    },
    
    selectContact(contact) {
      this.selectedContactId = contact.id;
      this.$emit('select-contact', contact);
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
.chat-list-container {
  width: 100%;
  height: 100%;
}

.chat-contacts {
  max-height: calc(100% - 120px);
}
</style>