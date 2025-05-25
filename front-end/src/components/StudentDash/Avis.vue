<template>
  <div class="flex flex-col h-screen bg-gray-100">
    <NavBarStd />
    <Sidebar class="w-64" />

    <main class="flex-1 p-8 overflow-auto mt-16 ml-64">
      <!-- Bouton de retour -->
      <router-link
        :to="`/ConsultListCours`"
        class="inline-flex items-center px-4 py-2 mb-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour à la liste des cours
      </router-link>

      <!-- Boutons Avis + Feedback -->
      <div class="flex justify-start space-x-4">
    <!-- <button
        @click="toggleAvis"
        class="feedback-btn"
        :class="{ 'feedback-btn-primary': !showAvis, 'feedback-btn-secondary': showAvis }"
    >
        <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        {{ showAvis ? 'Masquer les Avis' : 'Afficher les Avis' }}
    </button> -->
    
    <router-link
        v-if="isSubscript"
        :to="{ name: 'FeedbackForm', params: { idCours: idCours } }"
        class="feedback-btn feedback-btn-accent"
    >
        <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Donner ton feedback
    </router-link>
    </div>

    <!-- Section Avis -->
    <div class="mt-6 bg-gray-100 rounded-lg p-6 -mx-8">
    <div class="max-w-6xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Avis des Étudiants</h1>

        <!-- Barre de recherche et filtre -->
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <div class="flex-1 relative">
            <input
            type="text"
            v-model="searchQuery"
            placeholder="Rechercher des avis..."
            class="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
            class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
            </svg>
            <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
                />
            </svg>
            </button>
        </div>

        <div class="w-full sm:w-64">
            <select
            v-model="selectedRating"
            class="w-full pl-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="0">Toutes les notes</option>
            <option value="1">1 étoile</option>
            <option value="2">2 étoiles</option>
            <option value="3">3 étoiles</option>
            <option value="4">4 étoiles</option>
            <option value="5">5 étoiles</option>
            </select>
        </div>
        </div>

        <!-- État de chargement -->
        <div v-if="isLoadingFeedbacks" class="text-center py-10">
        <i class="fas fa-spinner fa-spin text-blue-500 text-2xl"></i>
        <p class="mt-2 text-gray-600">Chargement des avis...</p>
        </div>

        <!-- Message d'erreur -->
        <div v-else-if="feedbackError" class="text-center py-10 text-red-500">
        {{ feedbackError }}
        </div>

        <!-- Liste des avis -->
        <div v-else class="space-y-6 bg-white rounded-lg p-6 shadow-sm">
        <div v-for="feedback in filteredAvis" :key="feedback.id" class="border-b pb-6 last:border-b-0">
            <div class="flex justify-between items-start">
            <div>
                <h2 class="font-bold text-lg text-gray-800">
                {{ feedback.etudiant.fullname }}
                </h2>
                <p class="text-sm text-gray-500">
                {{ feedback.etudiant.specialite }} - {{ feedback.etudiant.niveau }}
                </p>
            </div>
            <div class="flex items-center">
                <div class="flex mr-2">
                <span v-for="i in 5" :key="i" class="text-yellow-400 text-xl">
                    <span v-if="i <= feedback.note">★</span>
                    <span v-else>☆</span>
                </span>
                </div>
                <span class="text-gray-500 text-sm">{{ formatDate(feedback.created_at) }}</span>
            </div>
            </div>
            
            <p class="mt-4 text-gray-700">{{ feedback.commentaire }}</p>

            <div v-if="isSubscript && !feedback.reponse" class="mt-4">
              <button
                @click="repondreAuFeedback(feedback)"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Répondre
              </button>
            </div>

            <!-- Section des réponses -->
            <div class="mt-4 space-y-4">
              <!-- État de chargement des réponses -->
              <div v-if="loadingReponses[feedback.id]" class="ml-8 text-gray-500">
                <i class="fas fa-spinner fa-spin"></i> Chargement des réponses...
              </div>

              <!-- Liste des réponses -->
              <div v-else-if="feedbackReponses[feedback.id] && feedbackReponses[feedback.id].length > 0" class="space-y-2">
                <div v-for="reponse in feedbackReponses[feedback.id]" :key="reponse.id" 
                  class="ml-6 p-3 bg-white rounded-md shadow-sm border border-gray-100 hover:shadow-sm transition-shadow duration-200"
                >
                  <div class="flex items-start space-x-2">
                    <!-- Icône du rôle -->
                    <div class="flex-shrink-0">
                      <div class="w-8 h-8 rounded-full flex items-center justify-center" 
                        :class="reponse.user_role === 'tuteur' ? 'bg-purple-50' : 'bg-blue-50'"
                      >
                        <svg v-if="reponse.user_role === 'tuteur'" class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"/>
                        </svg>
                        <svg v-else class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                      </div>
                    </div>
                    
                    <!-- Contenu de la réponse -->
                    <div class="flex-grow">
                      <div class="flex items-center justify-between mb-1">
                        <span class="text-sm font-medium" :class="reponse.user_role === 'tuteur' ? 'text-purple-700' : 'text-blue-700'">
                          {{ reponse.user_role === 'tuteur' ? 'Réponse de l\'enseignant' : 'Réponse de l\'étudiant' }}
                        </span>
                        <div class="flex items-center">
                          <span class="text-xs text-gray-500 mr-2">{{ formatDate(reponse.created_at) }}</span>
                          
                          <!-- Menu pour les actions (modifier/supprimer) -->
                          <div v-if="isMyReponse(reponse)" class="relative">
                            <button 
                              @click.stop="toggleReponseMenu(reponse.id)"
                              class="text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded-full hover:bg-gray-200"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                              </svg>
                            </button>
                            
                            <!-- Menu déroulant pour les réponses -->
                            <transition name="menu">
                              <div 
                                v-if="activeReponseMenu === reponse.id"
                                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
                                v-click-outside="closeReponseMenu"
                              >
                                <!-- Option Modifier -->
                                <button
                                  @click="editReponse(reponse, feedback.id)"
                                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center menu-option"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Modifier
                                </button>
                                
                                <!-- Option Supprimer -->
                                <button
                                  @click="confirmDeleteReponse(reponse.id, feedback.id)"
                                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center menu-option"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Supprimer
                                </button>
                              </div>
                            </transition>
                          </div>
                        </div>
                      </div>
                      <p class="text-sm text-gray-700">{{ reponse.contenu }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Message si aucune réponse -->
              <div v-else-if="!loadingReponses[feedback.id]" class="ml-8 text-gray-500">
                Aucune réponse pour cet avis
              </div>
            </div>

            <!-- Bouton Répondre (visible uniquement pour les enseignants)
            <div v-if="isTuteur && !feedback.reponse" class="mt-4">
              <button
                @click="repondreAuFeedback(feedback)"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Répondre
              </button>
            </div> -->
            
            <div class="mt-2 flex items-center justify-between">
            <div class="flex items-center">
                <!-- <img 
                v-if="feedback.etudiant.image" 
                :src="'/storage/' + feedback.etudiant.image" 
                class="w-8 h-8 rounded-full mr-2"
                alt="Photo de profil"
                > -->
                <span class="text-sm text-gray-500">
                Posté le {{ new Date(feedback.created_at).toLocaleDateString() }}
                </span>
            </div>
            
            <!-- Menu déroulant pour les actions -->
            <div v-if="isMyFeedback(feedback)" class="relative">
                <!-- Bouton des trois points -->
                <button 
                @click.stop="toggleMenu(feedback.id)"
                class="text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded-full hover:bg-gray-200"
                >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
                </button>
                
                <!-- Menu déroulant -->
                <transition name="menu">
                <div 
                    v-if="activeMenu === feedback.id"
                    class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
                    v-click-outside="closeMenu"
                >
                    <!-- Option Modifier -->
                    <router-link
                    :to="{ name: 'EditFeedback', params: { id: feedback.id, idCours: idCours } }"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center menu-option"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Modifier
                    </router-link>
                    
                    <!-- Option Supprimer -->
                    <button
                    @click="confirmDeleteFeedback(feedback.id)"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center menu-option"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Supprimer
                    </button>
                    
                    <!-- Option Copier -->
                    <button
                    @click="copyFeedback(feedback.commentaire)"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center menu-option"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copier
                    </button>
                </div>
                </transition>
            </div>
            </div>
        </div>

        <div v-if="!isLoadingFeedbacks && filteredAvis.length === 0" class="text-center py-10">
            <p class="text-gray-500">Aucun avis disponible pour ce cours.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
  <!-- Modal de réponse -->
  <div v-if="showReponseModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg max-w-lg w-full p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Répondre à l'avis</h3>
        <button @click="showReponseModal = false" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="mb-4">
        <p class="text-sm text-gray-500 mb-2">Avis de l'étudiant :</p>
        <p class="text-gray-700 bg-gray-50 p-3 rounded">{{ selectedFeedback?.commentaire }}</p>
      </div>

      <div class="mb-4">
        <label for="reponse" class="block text-sm font-medium text-gray-700 mb-2">Votre réponse</label>
        <textarea
          id="reponse"
          v-model="reponseText"
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Écrivez votre réponse ici..."
        ></textarea>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          @click="showReponseModal = false"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Annuler
        </button>
        <button
          @click="submitReponse"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Envoyer la réponse
        </button>
      </div>
    </div>
  </div>
  
  <!-- Modal de modification de réponse -->
  <div v-if="showEditReponseModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg max-w-lg w-full p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Modifier votre réponse</h3>
        <button @click="showEditReponseModal = false" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="mb-4">
        <label for="edit-reponse" class="block text-sm font-medium text-gray-700 mb-2">Votre réponse</label>
        <textarea
          id="edit-reponse"
          v-model="editReponseText"
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Modifiez votre réponse ici..."
        ></textarea>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          @click="showEditReponseModal = false"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Annuler
        </button>
        <button
          @click="updateReponse"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Mettre à jour
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavBarStd from "./NavBarStd.vue";
import Sidebar from "./Sidebar.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import clickOutside from '../../directives/clickOutside';
export default {
  name: "ConsultRessource",
  components: { NavBarStd, Sidebar },
  directives: {
    'click-outside': clickOutside
  },
  data() {
    return {
      isTuteur: false, // This will be set based on user role
      ressources: [],
      idCours: this.$route.params.id,
      showAvis: false,
      listeAvis: [],
      isSubscript: false,
      selectedRating: 0,
      searchQuery: "",
      isLoadingFeedbacks: false,
      feedbackError: null,
      activeMenu: null,
      activeReponseMenu: null,
      showReponseModal: false,
      showEditReponseModal: false,
      selectedFeedback: null,
      selectedReponse: null,
      selectedFeedbackId: null,
      reponseText: "",
      editReponseText: "",
      feedbackReponses: {},
      loadingReponses: {},
      studentInfo: null,
      tuteurInfo: null,
      tutuerId: null,
    };
  },
  computed: {

    filteredAvis() {
      let filtered = this.listeAvis;
      
      if (this.selectedRating > 0) {
        filtered = filtered.filter(avis => avis.note == this.selectedRating);
      }
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(avis => 
          (avis.etudiant.fullname && avis.etudiant.fullname.toLowerCase().includes(query)) ||
          (avis.commentaire && avis.commentaire.toLowerCase().includes(query))
        );
      }
      
      return filtered;
    }
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

    async checkPaymentStatus() {
      try {
        this.studentInfo = JSON.parse(localStorage.getItem("StudentAccountInfo"));
        this.tuteurId = JSON.parse(localStorage.getItem("coursDetails")).idTuteur;
        if (!this.studentInfo && !this.tuteurInfo) return;
        
        const coursId = this.$route.params.id;
        const studentId = this.studentInfo.id;
        const tuteurId = this.tuteurId;
        
        // Vérifier si l'étudiant a déjà payé pour ce cours
        const response = await axios.get(`http://localhost:8000/api/subscribtions/cours/${coursId}`, 
        {
          params: {
            etudiant_id: studentId,
            tuteur_id: tuteurId
          }
        });
        this.isSubscript = response.data.isSubscribed;
      } catch (error) {
        console.error("Erreur lors de la vérification du paiement :", error);
        // Si l'API renvoie une erreur 404, cela signifie que l'étudiant n'a pas payé
        if (error.response && error.response.status === 404) {
          this.isSubscript = false;
        }
      }
    },

    repondreAuFeedback(feedback) {
      // Handle reply action here
      console.log('Replying to feedback:', feedback);
      // You can implement a modal or navigation to reply form
    },

    async fetchRessources() {
      try {
        const response = await axios.get("http://localhost:8000/api/ressources");
        this.ressources = response.data.filter(
          ressource => ressource.idCours === parseInt(this.idCours)
        );
      } catch (error) {
        console.error("Erreur lors du chargement des ressources :", error);
        toast.error("Erreur lors du chargement des ressources");
      }
    },

    async fetchAvis() {
      this.isLoadingFeedbacks = true;
      this.feedbackError = null;
      
      try {
        const response = await axios.get(
          `http://localhost:8000/api/feedbacks/course/${this.idCours}`
        );
        
        if (response.data.success) {
          this.listeAvis = response.data.feedbacks.map(feedback => {
            return {
              ...feedback,
              etudiant: {
                ...feedback.etudiant,
                fullname: feedback.etudiant.fullname || 'Étudiant'
              }
            };
          }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

          // Charger les réponses pour chaque avis
          this.listeAvis.forEach(feedback => {
            this.fetchReponses(feedback.id);
          });
        } else {
          throw new Error(response.data.message || 'Erreur inconnue');
        }
      } catch (error) {
        console.error("Erreur lors du chargement des avis :", error);
        this.feedbackError = error.response?.data?.message || "Impossible de charger les avis";
        toast.error(this.feedbackError);
      } finally {
        this.isLoadingFeedbacks = false;
      }
    },

    async fetchReponses(feedbackId) {
      this.loadingReponses[feedbackId] = true;
      try {
        const response = await axios.get(`http://localhost:8000/api/feedback/${feedbackId}/reponses`);
        this.feedbackReponses[feedbackId] = response.data.reponses.map(reponse => ({
          ...reponse,
          contenu: reponse.reponse
        }));
      } catch (error) {
        console.error(`Erreur lors du chargement des réponses pour l'avis ${feedbackId}:`, error);
      } finally {
        this.loadingReponses[feedbackId] = false;
      }
    },

    // toggleAvis() {
    //   this.showAvis = !this.showAvis;
    //   if (this.showAvis && this.listeAvis.length === 0) {
    //     this.fetchAvis();
    //   }
    // },

    formatDate(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30);
      const years = Math.floor(months / 12);
      
      if (years > 0) return `${years} an${years > 1 ? 's' : ''}`;
      if (months > 0) return `${months} mois`;
      if (days > 0) return `${days} jour${days > 1 ? 's' : ''}`;
      if (hours > 0) return `${hours} heure${hours > 1 ? 's' : ''}`;
      if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
      return `${seconds} seconde${seconds > 1 ? 's' : ''}`;
    },

    clearSearch() {
      this.searchQuery = "";
    },

    isVideo(file) {
      if (!file) return false;
      const videoExtensions = [".mp4", ".webm", ".ogg"];
      return videoExtensions.some(ext => file.toLowerCase().endsWith(ext));
    },
    
    isMyFeedback(feedback) {
      const studentInfo = JSON.parse(localStorage.getItem('StudentAccountInfo'));
      return studentInfo && studentInfo.id === feedback.etudiant_id;
    },
    
    isMyReponse(reponse) {
      const studentInfo = JSON.parse(localStorage.getItem('StudentAccountInfo'));
      const tuteurInfo = JSON.parse(localStorage.getItem('TuteurAccountInfo'));
      
      const currentUser = JSON.parse(sessionStorage.getItem('CurrentUser'));

      return reponse.user_role === currentUser && (
        (currentUser === 'etudiant' && studentInfo && studentInfo.id === reponse.user_id) ||
        (currentUser === 'tuteur' && tuteurInfo && tuteurInfo.id === reponse.user_id)
      );
      // if (reponse.user_role === currentUser && studentInfo) {
      //   return studentInfo.id === reponse.user_id;
      // } else if (reponse.user_role === currentUser && tuteurInfo) {
      //   return tuteurInfo.id === reponse.user_id;
      // }
      // return false;
    },
    
    toggleReponseMenu(reponseId) {
      this.activeReponseMenu = this.activeReponseMenu === reponseId ? null : reponseId;
    },
    
    closeReponseMenu() {
      this.activeReponseMenu = null;
    },
    
    editReponse(reponse, feedbackId) {
      this.selectedReponse = reponse;
      this.selectedFeedbackId = feedbackId;
      this.editReponseText = reponse.contenu;
      this.showEditReponseModal = true;
      this.activeReponseMenu = null;
    },
    
    async updateReponse() {
      if (!this.editReponseText.trim()) {
        toast.error('Veuillez entrer une réponse');
        return;
      }
      
      try {
        const token = JSON.parse(localStorage.getItem('StudentAccountInfo')).token;
        const userRole = this.selectedReponse.user_role;
        const response = await axios.put(
          `http://localhost:8000/api/reponse/${this.selectedReponse.id}`,
          { 
            reponse: this.editReponseText,
            user_role: userRole
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        if (response.status === 200) {
          await this.sendNotification(null, null, this.tutuerId, "Vous avez un modification au reponse du feedback", "Tuteur", "cours", new Date(), null)
          toast.success('Réponse modifiée avec succès');
          this.showEditReponseModal = false;
          this.fetchReponses(this.selectedFeedbackId);
        }
      } catch (error) {
        console.error('Erreur lors de la modification de la réponse:', error);
        toast.error(error.response?.data?.message || 'Erreur lors de la modification de la réponse');
      }
    },
    
    async confirmDeleteReponse(reponseId, feedbackId) {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette réponse ? Cette action est irréversible.')) {
        try {
          const token = JSON.parse(localStorage.getItem('StudentAccountInfo')).token;
          const userRole = this.feedbackReponses[feedbackId].find(r => r.id === reponseId).user_role;
          await axios.delete(
            `http://localhost:8000/api/reponse/${reponseId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              },
              data: { user_role: userRole }
            }
          );
          await this.sendNotification(null, null, this.tutuerId, "Vous avez un suppression au reponse du feedback", "Tuteur", "cours", new Date(), null)
          toast.success('Réponse supprimée avec succès');
          this.activeReponseMenu = null;
          this.fetchReponses(feedbackId);
        } catch (error) {
          console.error("Erreur lors de la suppression de la réponse:", error);
          const errorMessage = error.response?.data?.message || 
            'Une erreur est survenue lors de la suppression';
          toast.error(errorMessage);
        }
      }
    },

    async confirmDeleteFeedback(feedbackId) {
      if (confirm('Êtes-vous sûr de vouloir supprimer votre avis ? Cette action est irréversible.')) {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(
            `http://localhost:8000/api/feedbacks/${feedbackId}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          await this.sendNotification(null, null, this.tutuerId, "Vous avez un suppression du feedback", "Tuteur", "cours", new Date(), null)
          toast.success('Votre avis a été supprimé avec succès');
          this.fetchAvis();
          this.activeMenu = null;
        } catch (error) {
          console.error("Erreur lors de la suppression:", error);
          const errorMessage = error.response?.data?.message || 
            'Une erreur est survenue lors de la suppression';
          toast.error(errorMessage);
        }
      }
    },

    toggleMenu(feedbackId) {
      this.activeMenu = this.activeMenu === feedbackId ? null : feedbackId;
    },
    
    closeMenu() {
      this.activeMenu = null;
    },
    
    copyFeedback(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          toast.success('Commentaire copié dans le presse-papier');
          this.activeMenu = null;
        })
        .catch(err => {
          console.error('Erreur lors de la copie:', err);
          toast.error('Échec de la copie');
        });
    },

    async checkUserRole() {
      const userInfo = JSON.parse(localStorage.getItem('TuteurAccountInfo'));
      this.isTuteur = !!userInfo;
    },

    repondreAuFeedback(feedback) {
      this.selectedFeedback = feedback;
      this.reponseText = '';
      this.showReponseModal = true;
    },

    async submitReponse() {
      if (!this.reponseText.trim()) {
        toast.error('Veuillez entrer une réponse');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const studentInfo = JSON.parse(localStorage.getItem('StudentAccountInfo'));
        const response = await axios.post(
          `http://localhost:8000/api/feedbacks/${this.selectedFeedback.id}/reponse`,
          { 
            reponse: this.reponseText,
            user_id: studentInfo.id,
            user_role: 'etudiant'
           },
          // {
          //   headers: {
          //     'Authorization': `Bearer ${token}`
          //   }
          // }
        );
           console.log(response)
        if (response.status === 200) {
          await this.sendNotification(null, null, this.tutuerId, "Vous avez un reponse au feedback", "Tuteur", "cours", new Date(), null)
          toast.success('Réponse ajoutée avec succès');
          this.showReponseModal = false;
          // window.location.reload(); // Reload the page after adding the reply
          this.fetchAvis();
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la réponse:', error);
        toast.error(error.response?.data?.message || 'Erreur lors de l\'ajout de la réponse');
      }
    },
  },
  mounted() {
    this.fetchCoursDetails()
    this.checkPaymentStatus();
    this.fetchAvis();
    this.checkUserRole();
    this.studentInfo = JSON.parse(localStorage.getItem('StudentAccountInfo'));
    this.tuteurInfo = JSON.parse(localStorage.getItem('TuteurAccountInfo'));
  }
};
</script>

<style scoped>
.feedback-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

.feedback-btn:hover {
  transform: translateY(-0.125rem);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.feedback-btn-primary {
  background-color: #4f46e5;
  color: white;
}

.feedback-btn-primary:hover {
  background-color: #4338ca;
}

.feedback-btn-secondary {
  background-color: #6b7280;
  color: white;
}

.feedback-btn-secondary:hover {
  background-color: #4b5563;
}

.feedback-btn-accent {
  background-color: #059669;
  color: white;
}

.feedback-btn-accent:hover {
  background-color: #047857;
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.btn-link {
  display: inline-flex;
  align-items: center;
  color: #4f46e5;
  font-weight: bold;
  text-decoration: none;
  transition: 0.3s;
}

.btn-link:hover {
  color: #4338ca;
  text-decoration: underline;
}

/* Animation pour le menu déroulant */
.menu-enter-active, .menu-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.menu-enter-from, .menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Style pour les options du menu */
.menu-option {
  transition: background-color 0.2s;
}
.menu-option:hover {
  background-color: #f3f4f6;
}

@media (min-width: 640px) {
  .sm\:flex-row {
    flex-direction: row;
  }
  
  .sm\:w-64 {
    width: 16rem;
  }
}
</style>