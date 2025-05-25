<template>
  <nav class="bg-blue-50 shadow-xl fixed left-0 min-w-[250px] py-4 font-[sans-serif] overflow-y-auto" style="top: 72px; height: calc(100vh - 72px);">
    <div class="relative flex flex-col h-full">
      <ul class="h-full flex flex-col justify-around">
        <!-- Tableau de bord -->
        <li>
          <router-link to="/StudentDash" class="text-gray-600 text-sm flex items-center hover:text-blue-600 hover:border-r-4 border-blue-500 hover:bg-blue-50 px-8 py-3 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>Tableau de bord</span>
          </router-link>
        </li>

        <!-- Liste des cours -->
        <li>
          <router-link to="/ConsultListCours" class="text-gray-600 text-sm flex items-center hover:text-blue-600 hover:border-r-4 border-blue-500 hover:bg-blue-50 px-8 py-3 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 19.477 5.754 19 7.5 19s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 19.477 18.247 19 16.5 19c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Liste des cours</span>
          </router-link>
        </li>

        <!-- Liste des offres -->
        <li>
          <router-link to="/OffersListStd" class="text-gray-600 text-sm flex items-center hover:text-blue-600 hover:border-r-4 border-blue-500 hover:bg-blue-50 px-8 py-3 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Liste des offres</span>
          </router-link>
        </li>

        <!-- Liste des stages -->
        <li>
          <router-link to="/ListeStagesAcceptes" class="text-gray-600 text-sm flex items-center hover:text-blue-600 hover:border-r-4 border-blue-500 hover:bg-blue-50 px-8 py-3 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Liste des stages</span>
          </router-link>
        </li>

        <!-- Mes rendez-vous -->
        <li>
          <router-link to="/AppointmentView" class="text-gray-600 text-sm flex items-center hover:text-blue-600 hover:border-r-4 border-blue-500 hover:bg-blue-50 px-8 py-3 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Mes rendez-vous</span>
          </router-link>
        </li>

        <!-- Consulter notifications -->
        <li>
          <router-link to="/Consulternotif" class="text-gray-600 text-sm flex items-center hover:text-blue-600 hover:border-r-4 border-blue-500 hover:bg-blue-50 px-8 py-3 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span>Notifications</span>
          </router-link>
        </li>

        <!-- Chat avec tuteurs -->
        <li>
          <router-link to="/student-chat" class="text-gray-600 text-sm flex items-center justify-between hover:text-blue-600 hover:border-r-4 border-blue-500 hover:bg-blue-50 px-8 py-3 transition-all">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Chat avec tuteurs</span>
            </div>
            <span v-if="totalUnreadCount > 0" class="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {{ totalUnreadCount > 99 ? '99+' : totalUnreadCount }}
            </span>
          </router-link>
        </li>  

        <!-- Compte -->
        <li>
          <router-link to="/EtudiantAccount" class="text-gray-600 text-sm flex items-center hover:text-blue-600 hover:border-r-4 border-blue-500 hover:bg-blue-50 px-8 py-3 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Compte</span>
          </router-link>
        </li>

        <!-- Déconnexion -->
        <li>
          <router-link to="/SignIn" class="text-gray-600 text-sm flex items-center hover:text-blue-600 hover:border-r-4 border-blue-500 hover:bg-blue-50 px-8 py-3 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Déconnexion</span>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import chatApiService from '../Chat/chatApiService'; // Adjust path as needed

export default {
  data() {
    return {
      isSidebarOpen: false,
      state: false,
      imageUrl: 'https://i.postimg.cc/mDWkzGDv/istockphoto-1200064810-170667a.jpg',
      totalUnreadCount: 0,
      pollingInterval: null,
    };
  },
  created() {
    this.fetchTotalUnreadCount();
    // Poll for new unread counts every 30 seconds (adjust as needed)
    this.pollingInterval = setInterval(this.fetchTotalUnreadCount, 30000);
  },
  beforeUnmount() {
    clearInterval(this.pollingInterval);
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    async fetchTotalUnreadCount() {
      try {
        const studentInfo = JSON.parse(localStorage.getItem('StudentAccountInfo'));
        const token = studentInfo ? studentInfo.token : null;
        const userRole = 'student'; // Assuming this sidebar is for students

        if (!token) {
          console.warn('Token not found for fetching total unread count in Sidebar.');
          return;
        }

        const response = await chatApiService.getUnreadCount(token, userRole);
        if (response.data && response.data.success) {
          this.totalUnreadCount = response.data.total_unread_count;
        } else {
          console.error('Failed to fetch total unread count:', response.data.message);
          this.totalUnreadCount = 0; // Reset on error
        }
      } catch (error) {
        console.error('Error fetching total unread count:', error);
        this.totalUnreadCount = 0; // Reset on error
      }
    },
  },
  mounted() {}
};
</script>