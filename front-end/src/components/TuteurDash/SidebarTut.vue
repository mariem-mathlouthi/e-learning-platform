<template>
  <nav
    class="bg-blue-50 shadow-xl h-screen fixed top-0 left-0 min-w-[250px] py-6 font-[sans-serif] overflow-auto"
    style="margin-top:72px"
  >
    <div class="relative flex flex-col h-full">
      <ul class="space-y-1 my-10 flex-1">
        <!-- Tableau de bord -->
        <li key="dashboard">
          <router-link
            to="/TuteurDashboard"
            class="text-gray-600 text-sm flex items-center hover:text-blue-600 hover:border-r-4 border-blue-500 hover:bg-blue-50 px-8 py-4 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 mr-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l3-3m-3 9l3-3m-3 5l3-3m4-12l3-3m-3 15l3-3m-3 5l3-3m4-12l3-3m-3 15l3-3m-3 5l3-3"
              />
            </svg>
            <span>Tableau de bord</span>
          </router-link>
        </li>

        <!-- Cours -->
        <li key="cours">
          <router-link
            to="/cours"
            class="text-gray-600 text-sm flex items-center hover:text-blue-600 hover:border-r-4 border-blue-500 hover:bg-blue-50 px-8 py-4 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 mr-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span>Cours</span>
          </router-link>
        </li>

        <!-- Quizz -->
        <li key="QuizzList">
          <router-link
            to="/QuizzList"
            class="text-gray-600 text-sm flex items-center hover:text-blue-600 hover:border-r-4 border-blue-500 hover:bg-blue-50 px-8 py-4 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 mr-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <span>Quizz</span>
          </router-link>
        </li>

        <!-- Rendez-vous vidéo -->
        <li key="videoAppointments">
          <router-link
            to="/AppointVideoCall"
            class="text-gray-600 text-sm flex items-center hover:text-blue-600 hover:border-r-4 border-blue-500 hover:bg-blue-50 px-8 py-4 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 mr-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span>Rendez-vous vidéo</span>
          </router-link>
        </li>

        <!-- Chat avec étudiants -->
        <li key="chatWithStudents">
          <router-link
            to="/tutor-chat"
            class="text-gray-600 text-sm flex items-center justify-between hover:text-blue-600 hover:border-r-4 border-blue-500 hover:bg-blue-50 px-8 py-4 transition-all"
          >
            <div class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 mr-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>Chat avec étudiants</span>
            </div>
            <span v-if="totalUnreadCount > 0" class="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {{ totalUnreadCount > 99 ? '99+' : totalUnreadCount }}
            </span>
          </router-link>
        </li>

        <!-- Compte -->
        <li>
          <router-link
            to="/TuteurProfile"
            class="text-gray-600 text-sm flex items-center hover:text-blue-600 hover:border-r-4 border-blue-500 hover:bg-blue-50 px-8 py-4 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 mr-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>Compte</span>
          </router-link>
        </li>

        <!-- Déconnexion -->
        <li>
          <router-link
            to="/SignIn"
            class="text-gray-600 text-sm flex items-center hover:text-blue-600 hover:border-r-4 border-blue-500 hover:bg-blue-50 px-8 py-4 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 mr-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
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
  name: "SidebarTuteur",
  data() {
    return {
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
    async fetchTotalUnreadCount() {
      try {
        const tuteurInfo = JSON.parse(localStorage.getItem('TuteurAccountInfo'));
        const token = tuteurInfo ? tuteurInfo.token : null;
        const userRole = 'tutor'; // Assuming this sidebar is for tutors

        if (!token) {
          console.warn('Token not found for fetching total unread count in SidebarTut.');
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
};
</script>