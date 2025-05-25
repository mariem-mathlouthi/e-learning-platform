<template>
  <div id="app" class="flex flex-col h-screen">
    <!-- Navbar -->
    <NavbarTuteur />

    <!-- Sidebar -->
    <SidebarTuteur />

    <!-- Main Content -->
    <main class="flex-1 pt-20 ml-64 p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Titre Centré -->
        <h1 class="text-3xl font-bold text-gray-800 text-center mb-8">
          Liste des Cours
        </h1>

        <!-- Section Recherche & Ajout -->
        <div class="flex flex-col sm:flex-row justify-between gap-4 mb-8">
          <!-- Barre de Recherche Améliorée -->
          <div class="flex-1 max-w-xl relative group">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl blur opacity-60 transition-opacity duration-300"></div>
            <div class="relative flex items-center bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div class="pl-4 pr-2">
                <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder=" Rechercher par titre ou description..."
                class="w-full py-3 pr-6 bg-transparent outline-none text-gray-700 placeholder-blue-400 font-medium"
              />
              <button 
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="mr-4 p-1 rounded-full hover:bg-blue-50 transition-colors"
              >
                <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Bouton Ajout -->
          <router-link 
            to="/ajouter-cours" 
            class="btn-submit self-start flex items-center gap-2 hover:translate-y-[-2px] transition-transform"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Nouveau Cours
          </router-link>
        </div>

        <!-- Grille des Cours -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Carte de Cours -->
          <div 
            v-for="cours in filteredCourses"
            :key="cours.id"
            class="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
          >
            <!-- Effet de glassmorphisme en arrière-plan -->
            <div class="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <!-- Badge de statut -->
            <div class="absolute top-4 right-4 z-10">
              <span class="px-3 py-1 bg-blue-500/90 text-white text-xs font-medium rounded-full shadow-lg backdrop-blur-sm">Cours</span>
            </div>
            
            <!-- Image du Cours avec overlay au hover -->
            <div class="h-52 relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
              <img
                :src="getImageUrl(cours.file)"
                alt="Couverture du cours"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                @error="handleImageError"
              >
            </div>

            <!-- Détails du Cours -->
            <div class="p-6 relative z-10">
              <h2 class="text-xl font-bold text-gray-800 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">{{ cours.titre }}</h2>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ cours.description || "Aucune description disponible" }}</p>
              
              <!-- Indicateur visuel -->
              <div class="w-16 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mb-4"></div>
            </div>

            <!-- Actions avec effet de glassmorphisme -->
            <div class="px-6 pb-6 flex justify-end space-x-3 relative z-10">
              <router-link
                :to="`/cours/${cours.id}`"
                class="p-2.5 bg-white/80 hover:bg-blue-50/90 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-sm flex items-center gap-2"
                title="Voir le cours"
              >
                <svg class="w-5 h-5 text-blue-600 transform rotate-180" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
                <span class="text-blue-600 text-sm font-medium">Voir plus</span>
              </router-link>

              <router-link
                :to="`/modifier-cours/${cours.id}`"
                class="p-2.5 bg-white/80 hover:bg-blue-50/90 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-sm"
                title="Modifier le cours"
              >
                <svg class="w-5 h-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                </svg>
              </router-link>

              <router-link
                :to="`/AvisTut/${cours.id}`"
                class="p-2.5 bg-white/80 hover:bg-blue-50/90 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-sm flex items-center gap-2"
                title="Voir les avis"
              >
                <svg class="w-5 h-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                </svg>
                <span class="text-blue-600 text-sm font-medium">Avis</span>
              </router-link>

              <button 
                @click="deleteCours(cours.id)"
                class="p-2.5 bg-white/80 hover:bg-red-50/90 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-sm"
                title="Supprimer le cours"
              >
                <svg class="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import NavbarTuteur from "./NavbarTut.vue";
import SidebarTuteur from "./SidebarTut.vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  name: "CoursListe",
  components: {
    NavbarTuteur,
    SidebarTuteur,
  },
  data() {
    return {
      coursListe: [],
      defaultImage: "/placeholder-course.jpg",
      searchQuery: "",
    };
  },
  computed: {
    filteredCourses() {
      const query = this.searchQuery.toLowerCase();
      return this.coursListe.filter(cours => {
        const title = cours.titre?.toLowerCase() || '';
        const description = cours.description?.toLowerCase() || '';
        return title.includes(query) || description.includes(query);
      });
    }
  },
  methods: {
    async fetchCours() {
      try {
        const tuteurId = JSON.parse(localStorage.getItem("TuteurAccountInfo")).id;
        const response = await axios.get(
          `http://localhost:8000/api/cours-by-tuteur?tuteurId=${tuteurId}`
        );
        this.coursListe = response.data.cours.map(cours => ({
          ...cours,
          file: cours.file || this.defaultImage,
        }));
      } catch (error) {
        console.error("Erreur récupération cours :", error);
        toast.error("Impossible de récupérer les cours.");
      }
    },

    async deleteCours(id) {
      try {
        await axios.delete(`http://localhost:8000/api/cours/${id}`);
        toast.success("Cours supprimé avec succès !");
        this.fetchCours();
      } catch (error) {
        console.error("Erreur suppression cours :", error);
        toast.error("Erreur lors de la suppression.");
      }
    },

    handleImageError(event) {
      event.target.src = this.defaultImage;
    },

    getImageUrl(filePath) {
      if (!filePath || filePath === this.defaultImage) {
        return this.defaultImage;
      }
      return `http://localhost:8000${filePath}`;
    },
  },
  mounted() {
    this.fetchCours();
  },
};
</script>

<style scoped>
/* Styles Spécifiques */
.btn-submit {
  background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 500;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);
  transition: all 0.3s ease;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2);
}

/* Adaptations Responsive */
main {
  margin-left: 250px;
  transition: margin-left 0.3s;
}

@media (max-width: 768px) {
  main {
    margin-left: 0;
    padding-top: 6rem;
  }
}

/* Effets de Carte */
.card {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-0.25rem);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
}

/* Nouvelles animations pour les cartes de cours */
@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

/* Effet de ligne clamp pour limiter le texte */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Amélioration de l'apparence générale */
:deep(.grid) {
  margin-top: 1rem;
  padding-bottom: 2rem;
}
</style>