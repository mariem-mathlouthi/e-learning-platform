<template>
  <div class="flex flex-col h-screen bg-gray-100">
    <NavBarStd />
    <Sidebar class="w-64" />

    <main class="flex-1 p-8 overflow-auto mt-16 ml-64">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Donner votre avis</h1>
        
        <form @submit.prevent="submitFeedback" class="bg-white rounded-lg shadow-md p-6">
          <!-- Notation -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Note</label>
            <div class="flex space-x-2">
              <button
                v-for="i in 5"
                :key="i"
                type="button"
                @click="form.note = i"
                class="text-3xl focus:outline-none transition-transform duration-100"
                :class="{
                  'text-yellow-400': i <= form.note,
                  'text-gray-300': i > form.note,
                  'hover:scale-110': true
                }"
              >
                ★
              </button>
            </div>
            <p class="text-sm text-gray-500 mt-1">
              {{ form.note ? ratingDescriptions[form.note] : 'Sélectionnez une note' }}
            </p>
          </div>

          <!-- Commentaire -->
          <div class="mb-6">
            <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">Votre avis</label>
            <textarea
              id="comment"
              v-model="form.commentaire"
              rows="5"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Décrivez votre expérience avec ce cours..."
              maxlength="500"
            ></textarea>
            <div class="text-xs text-gray-500 text-right mt-1">
              {{ form.commentaire.length }}/500 caractères
            </div>
          </div>

          <!-- Boutons -->
          <div class="flex justify-end space-x-4">
            <router-link
              :to="{ name: 'Avis', params: { id: idCours } }"
              class="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
            >
              Annuler
            </router-link>
            <button
              type="submit"
              :disabled="isSubmitting || form.note === 0"
              class="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 disabled:opacity-50"
            >
              <span v-if="isSubmitting">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Envoi...
              </span>
              <span v-else>Envoyer</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>



<script>
import axios from "axios";
import NavBarStd from "./NavBarStd.vue";
import Sidebar from "./Sidebar.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  name: "FeedbackForm",
  components: { NavBarStd, Sidebar },
  props: {
    idCours: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      form: {
        note: 0,
        commentaire: ""
      },
      isSubmitting: false,
      tutuerId: null,
      ratingDescriptions: {
        1: 'Mauvais - Pas satisfait',
        2: 'Médiocre - Peu satisfait', 
        3: 'Moyen - Correct',
        4: 'Bon - Satisfait',
        5: 'Excellent - Très satisfait'
      }
    };
  },
  methods: {

    async fetchCoursDetails() {
      const coure = await axios.get(`http://localhost:8000/api/cours/${this.idCours}`)
        .then(response => {
          this.tutuerId = response.data.cours.idTuteur;
        })
        .catch(error => {
          console.error("Error fetching course details:", error);
        });
    },

    async sendNotification (idEtudiant, idEntreprise, idTuteur ,message, destination, type, date, appointmentId) {
      const notificationData = {
        idEtudiant: idEtudiant,
        idEntreprise: idEntreprise,
        idTuteur: idTuteur,
        message: message,
        destination: destination,
        type: type,
        visibility: "shown",
        date: date,
        appointmentId: appointmentId,
      }

      await axios.post(
        "http://localhost:8000/api/notification",
        notificationData
      )

    },

    async submitFeedback() {
      // Validation
      if (this.form.note === 0) {
        toast.error("Veuillez sélectionner une note");
        return;
      }

      if (!this.form.commentaire.trim()) {
        toast.error("Veuillez saisir un commentaire valide");
        return;
      }

      this.isSubmitting = true;

      try {
        const student_id = JSON.parse(localStorage.getItem('StudentAccountInfo'))['id'];
        // Envoi du feedback
        const response = await axios.post(
          "http://localhost:8000/api/feedbacks",
          {
            etudiant_id: student_id,
            cours_id: Number(this.idCours),
            note: Number(this.form.note),
            commentaire: this.form.commentaire.trim()
          }
        );

        if ([200, 201].includes(response.status)) {
          await this.sendNotification(null, null, this.tutuerId, "Votre cours a été noté avec etudiant", "Tuteur", "cours", new Date(), null)
          toast.success("Merci pour votre feedback!");
          this.$router.push({
            name: 'Avis',
            params: { id: this.idCours }
          });
        }
      } catch (error) {
        console.error("Erreur soumission:", error.response?.data || error);
        
        let errorMessage = "Erreur lors de l'envoi";
        
        if (error.response) {
          if (error.response.status === 422) {
            errorMessage = error.response.data.message || 
              "Vous avez déjà soumis un feedback pour ce cours";
          } else {
            errorMessage = error.response.data?.message || errorMessage;
          }
        }
        
        toast.error(errorMessage);
      } finally {
        this.isSubmitting = false;
      }
    }
  },
  mounted() {
    this.fetchCoursDetails();
  }
};
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>