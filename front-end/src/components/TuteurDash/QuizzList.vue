<template>
  <div id="app" class="flex flex-col h-screen">
    <NavbarTuteur />
    <SidebarTuteur />

    <section id="content" class="flex-1 flex justify-center items-center py-6">
      <div class="container mx-auto p-6">
        <h1 class="text-3xl font-bold text-gray-800 text-center mb-6">
          Gestion des Quizz
        </h1>

        <div class="text-right mb-6">
          <router-link to="/QuizzAdd" class="btn-submit">
            + Nouveau Quizz
          </router-link>
        </div>

        <!-- État de chargement -->
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin inline-block text-4xl mb-4">🔄</div>
          <p class="text-gray-500">Chargement des quizz...</p>
        </div>

        <!-- Liste des quizz -->
        <div v-else>
          <div v-if="quizzListe.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="quizz in quizzListe"
              :key="quizz.titre + quizz.idCours"
              class="card transform transition-all hover:scale-105"
            >
              <h2 class="font-medium text-indigo-600 mb-2 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                {{ quizz.coursTitre }}
              </h2>

              <div class="text">
                <div class="flex items-center justify-between mb-4">
                  <p class="title">{{ quizz.titre }}</p>
                  <span class="bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {{ quizz.questionCount }} Q
                  </span>
                </div>
              </div>

              <div class="flex justify-between items-center mt-4">
                <router-link
                  :to="`/question-list/${quizz.idCours}/${quizz.titre}`"
                  class="btn-consulter flex items-center"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  Consulter
                </router-link>

                <div class="flex space-x-2">
                  <button
                    @click="deleteQuizzGroup(quizz.titre, quizz.idCours)"
                    class="btn-action text-red-600 hover:text-red-800"
                    title="Supprimer"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Aucun résultat -->
          <div v-else class="text-center py-8 bg-gray-50 rounded-lg">
            <p class="text-gray-500 mb-4">Aucun quizz créé pour le moment</p>
            <router-link to="/QuizzAdd" class="btn-submit">
              Créer votre premier quizz
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import NavbarTuteur from "./NavbarTut.vue";
import SidebarTuteur from "./SidebarTut.vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  name: "QuizzList",
  components: {
    NavbarTuteur,
    SidebarTuteur,
  },
  data() {
    return {
      quizzListe: [],
      loading: true,
    };
  },
  methods: {
    async fetchQuizz() {
      try {
        this.loading = true;
        
        const tuteurData = localStorage.getItem("TuteurAccountInfo");
        if (!tuteurData) throw new Error("Session expirée");

        const tuteurId = JSON.parse(tuteurData).id;
        
        const response = await axios.get(
          "http://localhost:8000/api/quizz-by-tuteur",
          { params: { tuteurId } }
        );

        // Grouper par titre et cours
        const grouped = response.data.reduce((acc, quiz) => {
          const key = `${quiz.titre}-${quiz.idCours}`;
          if (!acc[key]) {
            acc[key] = {
              ...quiz,
              coursTitre: quiz.cours?.titre || 'Cours inconnu',
              questionCount: 0,
              ids: []
            };
          }
          acc[key].questionCount++;
          acc[key].ids.push(quiz.id);
          return acc;
        }, {});

        this.quizzListe = Object.values(grouped);

      } catch (error) {
        console.error("Erreur :", error);
        toast.error(error.response?.data?.message || error.message);
        if (error.message.includes("Session")) this.$router.push("/login-tuteur");
      } finally {
        this.loading = false;
      }
    },

    async deleteQuizzGroup(titre, idCours) {
      const confirmation = await this.$swal.fire({
        title: 'Confirmer la suppression',
        text: `Voulez-vous vraiment supprimer le quizz "${titre}" et toutes ses questions ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
      });

      if (!confirmation.isConfirmed) return;

      try {
        const idsToDelete = this.quizzListe
          .find(q => q.titre === titre && q.idCours === idCours)
          ?.ids || [];

        // CORRECTION APPLIQUÉE ICI
        await Promise.all(
          idsToDelete.map(id => 
            axios.delete(`http://localhost:8000/api/quizz/${id}`)
          )
        );

        this.quizzListe = this.quizzListe.filter(q => 
          !(q.titre === titre && q.idCours === idCours)
        );

        toast.success("Quizz supprimé avec succès !");
      } catch (error) {
        toast.error("Erreur lors de la suppression : " + error.message);
      }
    },
  },
  mounted() {
    this.fetchQuizz();
  },
};
</script>

<style scoped>
.card {
  @apply w-full p-6 bg-white rounded-lg shadow-md border border-gray-100;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  @apply text-xl font-bold text-gray-800;
}

.btn-submit {
  @apply bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm inline-flex items-center;
}

.btn-consulter {
  @apply text-indigo-600 hover:text-indigo-800 text-sm transition-colors;
}

.btn-action {
  @apply p-1 hover:bg-gray-100 rounded-full transition-colors;
}

.svg-icon {
  @apply w-5 h-5;
}
</style>