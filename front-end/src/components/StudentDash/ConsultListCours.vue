<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/20">
    <NavBarStd class="fixed top-0 left-0 w-full z-50 shadow-sm bg-white/90 backdrop-blur-md" />
    
    <div class="pt-24 grid grid-cols-12 gap-6 p-8 items-stretch min-h-[calc(100vh-5rem)]">
      <div class="col-span-3">
        <Sidebar />
      </div>

      <div class="col-span-9 h-full">
        <div class="h-full bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-10 border border-white/20 overflow-y-auto">
          <!-- En-tête amélioré -->
          <div class="mb-16">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div class="space-y-4">
                <div class="relative inline-block">
                  <div class="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-500 blur-2xl opacity-30 animate-pulse-slow"></div>
                  <h1 class="relative text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
                    Explorez les cours
                  </h1>
                </div>
                <p class="text-gray-500/90 text-lg font-light">Plongez dans un univers de connaissances</p>
              </div>
              
              <!-- Barre de recherche premium -->
              <div class="relative group w-full md:w-96">
                <div class="absolute inset-0 bg-gradient-to-r from-indigo-300/30 to-purple-300/20 rounded-2xl blur-[30px] opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                <div class="relative flex items-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-md border border-gray-100/50 transition-all duration-300">
                  <input
                    v-model="searchQuery"
                    placeholder="Rechercher un cours..."
                    class="w-full px-6 py-4 border-none bg-transparent focus:ring-0 placeholder-gray-400/80 text-gray-700 font-medium focus:placeholder-transparent transition-all"
                  />
                  <svg class="w-6 h-6 mr-4 text-gray-400/80 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Liste des cours améliorée -->
          <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="i in 3" :key="i" class="h-[400px] bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-r from-gray-200/50 to-gray-300/0 animate-shimmer"></div>
            </div>
          </div>

          <div v-else-if="error" class="text-red-500 text-center p-8 bg-red-50/50 rounded-2xl border border-red-100 backdrop-blur-sm flex items-center justify-center gap-3">
            <svg class="w-8 h-8 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <span class="text-lg">{{ error }}</span>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Carte de cours premium redesigned -->
            <article 
              v-for="cours in filteredCours" 
              :key="cours.id"
              class="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden isolate flex flex-col h-full border border-gray-100"
            >
              <!-- Effet de halo au survol amélioré -->
              <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              
              <!-- Badge de prix repositionné -->
              <div class="absolute top-4 right-4 z-30">
                <span class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 backdrop-blur-sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ cours.prix?.toFixed(2) || 'Gratuit' }} €
                </span>
              </div>
              
              <!-- Image avec effet parallaxe amélioré -->
              <div class="relative h-56 overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent z-10"></div>
                <div class="absolute inset-0 group-hover:scale-110 transition-transform duration-700 ease-in-out will-change-transform">
                  <img 
                    :src="'http://localhost:8000' + cours.file" 
                    :alt="cours.titre"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  />
                </div>
              </div>

              <!-- Contenu avec design amélioré -->
              <div class="p-6 space-y-4 flex-grow flex flex-col justify-between bg-white">
                <div>
                  <h3 class="text-xl font-bold text-gray-800 leading-tight transition-colors duration-300 group-hover:text-indigo-600 line-clamp-2">
                    {{ cours.titre }}
                  </h3>
                  
                  <!-- Indicateur de notation amélioré -->
                  <div class="mt-2 flex items-center">
                    <div class="flex items-center gap-1">
                      <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <span class="text-sm font-medium text-gray-700">{{ averageFeedbacks[cours.id]?.toFixed(1) || '0.0' }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Boutons d'action redesigned -->
                <div class="flex space-x-3 pt-3 mt-auto">
                  <router-link 
                    :to="`/DetailCour/${cours.id}`"
                    class="flex-1 flex justify-center items-center px-4 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-semibold hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white transition-all duration-300 border border-indigo-100 hover:border-transparent"
                  >
                    <span @click="voirPlus" class="inline-flex items-center">
                      <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                      Voir plus
                    </span>
                  </router-link>
                  <router-link 
                    :to="`/Avis/${cours.id}`"
                    class="flex-1 flex justify-center items-center px-4 py-2.5 bg-purple-50 text-purple-700 rounded-xl text-sm font-semibold hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 hover:text-white transition-all duration-300 border border-purple-100 hover:border-transparent"
                  > 
                    <svg class="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /> 
                    </svg> 
                    Avis
                  </router-link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBarStd from './NavBarStd.vue';
import Sidebar from './Sidebar.vue';
import axios from "axios";

export default {
  data() {
    return {
      cours: [],
      filteredCours: [],
      searchQuery: "",
      loading: true,
      error: null,
      defaultImage: '/placeholder-course.jpg',
      showAvis: false,
      averageFeedbacks: {}
    };
  },
  components: { NavBarStd, Sidebar },
  async created() {
    await this.fetchCourses();
  },
  methods: {
    async fetchCourses() {
      try {
        const response = await axios.get("http://localhost:8000/api/cours");
        if (response.data.success) {
          this.cours = response.data.cours.map(c => ({
            id: c.id,
            titre: c.titre,
            prix: c.prix ? parseFloat(c.prix) : 0.00,
            file: c.file || this.defaultImage
          }));
          
          // Fetch average feedback for each course
          await Promise.all(this.cours.map(async (course) => {
            try {
              const feedbackResponse = await axios.get(`http://127.0.0.1:8000/api/average-feedback/${course.id}`);
              if (feedbackResponse.data.success) {
                this.averageFeedbacks[course.id] = feedbackResponse.data.average_feedback || 0;
              }
            } catch (error) {
              console.error(`Error fetching feedback for course ${course.id}:`, error);
              this.averageFeedbacks[course.id] = 0;
            }
          
          }));
          this.filteredCours = this.cours;
        }
      } catch (error) {
        console.error("Erreur:", error);
        this.error = "Erreur de chargement des cours";
      } finally {
        this.loading = false;
      }
    },
    handleImageError(event) {
      event.target.src = this.defaultImage;
    },
    filterCourses() {
    this.filteredCours = this.cours.filter(cours => 
      cours.titre.toLowerCase().includes(this.searchQuery.toLowerCase())
    )
    },
    toggleAvis() {
      this.showAvis = !this.showAvis;
    }
},
  watch: {
    searchQuery() {
      this.filterCourses();
    }
  }
};
</script>

<style scoped>
@keyframes pulse-slow {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.4; }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
  background-image: linear-gradient(
    90deg,
    transparent 25%,
    rgba(255,255,255,0.5) 50%,
    transparent 75%
  );
  background-size: 200% 100%;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.perspective-1000 {
  perspective: 1000px;
}

.group:hover .perspective-1000 {
  transform: rotateX(2deg) rotateY(2deg);
  transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

/* Line clamp for truncating text */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.feedback-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.625rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.feedback-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.feedback-btn-primary {
  background-image: linear-gradient(to right, #6366f1, #a855f7);
  color: white;
}

.feedback-btn-secondary {
  background-color: white;
  color: #6366f1;
  border: 1px solid #6366f1;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}
</style>