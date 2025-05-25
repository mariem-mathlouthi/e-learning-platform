<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/20">
    <NavbarTuteur class="fixed top-0 left-0 w-full z-50 shadow-sm bg-white/90 backdrop-blur-md" />
    <SidebarTuteur class="fixed left-0 top-0 h-full z-40" />

    <main class="pt-24 pl-72 pr-8 pb-8 min-h-screen">
      <div class="max-w-4xl mx-auto space-y-12">
        <!-- En-tête animé -->
        <div class="relative group">
          <div class="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-500/10 rounded-xl blur-2xl opacity-40 animate-pulse-slow"></div>
          <h1 class="relative text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent text-center animate-fade-in-down">
            Détails du Cours
          </h1>
        </div>

        <!-- Carte détaillée -->
        <div class="relative bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 border border-white/20 hover:shadow-3xl transition-shadow duration-300">
          <!-- Effet de halo au survol -->
          <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 hover:opacity-100 rounded-[2rem] transition-opacity duration-300 -z-10"></div>

          <div class="space-y-6">
            <!-- Section Informations -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Colonne Gauche -->
              <div class="space-y-4">
                <div class="flex items-center p-4 bg-gray-50/50 rounded-xl">
                  <svg class="w-6 h-6 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Titre</p>
                    <p class="text-lg font-semibold text-gray-900">{{ cours.titre }}</p>
                  </div>
                </div>

                <div class="flex items-center p-4 bg-gray-50/50 rounded-xl">
                  <svg class="w-6 h-6 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Durée</p>
                    <p class="text-lg font-semibold text-gray-900">{{ cours.duration }} heures</p>
                  </div>
                </div>
              </div>

              <!-- Colonne Droite -->
              <div class="space-y-4">
                <div class="flex items-center p-4 bg-gray-50/50 rounded-xl">
                  <svg class="w-6 h-6 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Prix</p>
                    <p class="text-lg font-semibold text-gray-900">{{ cours.prix }} €</p>
                  </div>
                </div>

                <div class="flex items-center p-4 bg-gray-50/50 rounded-xl">
                  <svg class="w-6 h-6 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Catégorie</p>
                    <p class="text-lg font-semibold text-gray-900">{{ cours.category?.description || "Non spécifiée" }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="p-6 bg-gradient-to-br from-gray-50 to-indigo-50/20 rounded-xl border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Description
              </h3>
              <p class="text-gray-600 leading-relaxed">{{ cours.description }}</p>
            </div>

            <!-- Bouton d'action -->
            <div class="pt-6 text-center">
              <!-- Bouton S'inscrire si l'étudiant n'a pas payé -->
              <router-link 
                v-if="!isPaid"
                :to="'/Payment/' + cours.id"
                class="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-500 text-white rounded-2xl text-lg font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group/button"
              >
                <span>S'inscrire maintenant</span>
                <svg class="w-5 h-5 ml-3 transform group-hover/button:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </router-link>
              
              <!-- Bouton Ressources si l'étudiant a déjà payé -->
              <router-link 
                v-if="isPaid"
                :to="'/DetailsCours/' + cours.id"
                class="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-2xl text-lg font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group/button"
              >
                <span>Ressources</span>
                <svg class="w-5 h-5 ml-3 transform group-hover/button:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import NavbarTuteur from "./NavBarStd.vue";
import SidebarTuteur from "./Sidebar.vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  name: "CoursDetails",
  components: {
    NavbarTuteur,
    SidebarTuteur,
  },
  data() {
    return {
      cours: {},
      isPaid: false,
      studentInfo: null,
      tuteurId: null,
    };
  },
  methods: {
    async fetchCoursDetails() {
      try {
        const coursId = this.$route.params.id;
        const response = await axios.get(`http://localhost:8000/api/cours/${coursId}`);
        this.cours = response.data.cours;
        localStorage.setItem("coursDetails", JSON.stringify(this.cours));
        // this.checkPaymentStatus();
      } catch (error) {
        console.error("Erreur :", error);
        toast.error("Erreur de chargement des détails", {
          icon: "⚠️",
          theme: "colored",
          position: "bottom-right",
          transition: "flip",
        });
      }
    },
    
    async checkPaymentStatus() {
      try {
        this.studentInfo = JSON.parse(localStorage.getItem("StudentAccountInfo"));
        this.tuteurId = JSON.parse(localStorage.getItem("coursDetails")).idTuteur;
        if (!this.studentInfo && !this.tuteurInfo) return;
        
        const coursId = this.$route.params.id;
        const studentId = this.studentInfo.id;
        const tuteurId = this.tuteurId;
        
        // console.log("etudiant id:::", studentId);
        // Vérifier si l'étudiant a déjà payé pour ce cours
        const response = await axios.get(`http://localhost:8000/api/subscribtions/cours/${coursId}`, 
        {
          params: {
            etudiant_id: studentId,
            tuteur_id: tuteurId
          }
        });
        this.isPaid = response.data.isSubscribed;
      } catch (error) {
        console.error("Erreur lors de la vérification du paiement :", error);
        // Si l'API renvoie une erreur 404, cela signifie que l'étudiant n'a pas payé
        if (error.response && error.response.status === 404) {
          this.isPaid = false;
        }
      }
    },
  },
  mounted() {
    this.checkPaymentStatus();
    this.fetchCoursDetails();
  },
  
  created() {
    // Vérifier si l'étudiant est connecté
    const studentInfo = localStorage.getItem("StudentAccountInfo");
    if (studentInfo) {
      this.studentInfo = JSON.parse(studentInfo);
    }
  },
};
</script>

<style scoped>
.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-fade-in-down {
  animation: fadeInDown 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.1; }
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.backdrop-blur-xl {
  backdrop-filter: blur(24px);
}
</style>