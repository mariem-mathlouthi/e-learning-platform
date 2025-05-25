<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div
      class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl"
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
        <h1 class="text-2xl font-bold">Paiement sécurisé</h1>
        <p class="text-blue-100 mt-1">
          Complétez votre transaction en toute sécurité
        </p>
      </div>

      <!-- Progress Steps -->
      <div class="px-6 pt-6">
        <div class="flex items-center justify-between">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="flex flex-col items-center"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
              :class="{
                'bg-blue-600 text-white':
                  currentStep > index ||
                  (currentStep === index && !formSubmitted),
                'bg-gray-200 text-gray-600': currentStep < index,
                'bg-green-500 text-white':
                  currentStep === index && formSubmitted,
              }"
            >
              <span
                v-if="
                  currentStep > index ||
                  (currentStep === index && formSubmitted)
                "
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span
              class="text-xs mt-2 font-medium"
              :class="{
                'text-blue-600': currentStep >= index,
                'text-gray-500': currentStep < index,
              }"
            >
              {{ step }}
            </span>
          </div>
        </div>
        <div class="relative mt-4">
          <div
            class="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-full"
          ></div>
          <div
            class="absolute top-0 left-0 h-1 bg-blue-600 rounded-full transition-all duration-500"
            :style="`width: ${(currentStep / (steps.length - 1)) * 100}%`"
          ></div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="p-6">
        <!-- Step 1: Payment Method Selection -->
        <div v-if="currentStep === 0" class="space-y-6">
          <h2 class="text-lg font-semibold text-gray-800">
            Méthode de paiement
          </h2>

          <div class="grid gap-4">
            <!-- Credit Card Option -->
            <div
              @click="selectPaymentMethod('card')"
              class="border rounded-lg p-4 cursor-pointer transition-all"
              :class="{
                'border-blue-500 ring-2 ring-blue-200 bg-blue-50':
                  paymentMethod === 'card',
                'border-gray-300 hover:border-blue-300':
                  paymentMethod !== 'card',
              }"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-6 bg-white border border-gray-300 rounded flex items-center justify-center"
                  >
                    <svg
                      class="w-6 h-4 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4V8h16v10zm-6-4h-4v-2h4v2zm3-4H7V8h10v2z"
                      />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-sm font-medium text-gray-900">
                    Carte de crédit/débit
                  </h3>
                  <p class="text-xs text-gray-500">
                    Paiement sécurisé avec cryptage SSL
                  </p>
                </div>
                <div class="ml-auto flex space-x-2">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/196/196578.png"
                    alt="Visa"
                    class="h-5 opacity-70"
                  />
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/196/196566.png"
                    alt="Mastercard"
                    class="h-5 opacity-70"
                  />
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/196/196561.png"
                    alt="Amex"
                    class="h-5 opacity-70"
                  />
                </div>
              </div>
            </div>

            <!-- PayPal Option -->
            <div
              @click="selectPaymentMethod('paypal')"
              class="border rounded-lg p-4 cursor-pointer transition-all"
              :class="{
                'border-blue-500 ring-2 ring-blue-200 bg-blue-50':
                  paymentMethod === 'paypal',
                'border-gray-300 hover:border-blue-300':
                  paymentMethod !== 'paypal',
              }"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2504/2504806.png"
                    alt="PayPal"
                    class="h-6"
                  />
                </div>
                <div class="ml-4">
                  <h3 class="text-sm font-medium text-gray-900">PayPal</h3>
                  <p class="text-xs text-gray-500">
                    Payer avec votre compte PayPal
                  </p>
                </div>
              </div>
            </div>

            <!-- Bank Transfer Option -->
            <div
              @click="selectPaymentMethod('bank')"
              class="border rounded-lg p-4 cursor-pointer transition-all"
              :class="{
                'border-blue-500 ring-2 ring-blue-200 bg-blue-50':
                  paymentMethod === 'bank',
                'border-gray-300 hover:border-blue-300':
                  paymentMethod !== 'bank',
              }"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg
                    class="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                    />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-sm font-medium text-gray-900">
                    Virement bancaire
                  </h3>
                  <p class="text-xs text-gray-500">
                    Effectuez un virement depuis votre banque
                  </p>
                </div>
              </div>
            </div>

            <!-- Apple Pay Option -->
            <div
              @click="selectPaymentMethod('apple')"
              class="border rounded-lg p-4 cursor-pointer transition-all"
              :class="{
                'border-blue-500 ring-2 ring-blue-200 bg-blue-50':
                  paymentMethod === 'apple',
                'border-gray-300 hover:border-blue-300':
                  paymentMethod !== 'apple',
              }"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/179/179457.png"
                    alt="Apple Pay"
                    class="h-6"
                  />
                </div>
                <div class="ml-4">
                  <h3 class="text-sm font-medium text-gray-900">Apple Pay</h3>
                  <p class="text-xs text-gray-500">
                    Paiement rapide avec Apple Pay
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Amount -->
          <div class="pt-4 border-t border-gray-200">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-600"
                >Montant à payer</span
              >
              <span class="text-xl font-bold text-gray-800">{{
                formatCurrency(payment.amount)
              }}</span>
            </div>
          </div>
        </div>

        <!-- Step 2: Payment Details -->
        <div
          v-if="currentStep === 1 && paymentMethod === 'card'"
          class="space-y-6"
        >
          <h2 class="text-lg font-semibold text-gray-800">
            Informations de paiement
          </h2>

          <!-- Card Number -->
          <div>
            <label
              for="cardNumber"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Numéro de carte</label
            >
            <div id="card-element" class="stripe-card"></div>
            <div id="card-errors" class="error-message"></div>

            <!-- <div class="relative">
              <input
                id="cardNumber"
                v-model="payment.cardNumber"
                @input="formatCardNumber"
                type="text"
                maxlength="19"
                placeholder="1234 5678 9012 3456"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.cardNumber }"
              />
              <div class="absolute right-3 top-2.5">
                <img 
                  :src="cardTypeIcon" 
                  v-if="cardTypeIcon" 
                  class="h-6 w-auto" 
                  :alt="cardType"
                >
              </div>
            </div> -->
            <!-- <p v-if="errors.cardNumber" class="mt-1 text-sm text-red-600">
              {{ errors.cardNumber }}
            </p> -->
          </div>

          <!-- Cardholder Name -->
          <div>
            <label
              for="cardName"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Nom sur la carte</label
            >
            <input
              id="cardName"
              v-model="payment.cardName"
              type="text"
              placeholder="John Doe"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': errors.cardName }"
            />
            <p v-if="errors.cardName" class="mt-1 text-sm text-red-600">
              {{ errors.cardName }}
            </p>
          </div>

          <!-- Payment Amount -->
          <div class="pt-4 border-t border-gray-200">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-600"
                >Montant à payer</span
              >
              <span class="text-xl font-bold text-gray-800">{{
                formatCurrency(payment.amount)
              }}</span>
            </div>
          </div>
        </div>

        <!-- Step 2: Alternative Payment Methods -->
        <div
          v-if="currentStep === 1 && paymentMethod !== 'card'"
          class="space-y-6"
        >
          <h2 class="text-lg font-semibold text-gray-800">
            Paiement avec {{ paymentMethodLabels[paymentMethod] }}
          </h2>

          <div v-if="paymentMethod === 'paypal'" class="text-center py-8">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2504/2504806.png"
              alt="PayPal"
              class="h-16 mx-auto mb-6"
            />
            <p class="text-gray-600 mb-6">
              Vous serez redirigé vers PayPal pour compléter votre paiement de
              {{ formatCurrency(payment.amount) }}
            </p>
            <button
              class="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 rounded-full text-white font-medium flex items-center mx-auto"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/2504/2504806.png"
                alt="PayPal"
                class="h-5 mr-2"
              />
              Payer avec PayPal
            </button>
          </div>

          <div v-if="paymentMethod === 'bank'" class="space-y-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-medium text-blue-800 mb-2">
                Instructions pour virement bancaire
              </h3>
              <div class="space-y-3 text-sm text-gray-700">
                <p>Veuillez effectuer un virement au compte suivant :</p>
                <div class="grid grid-cols-2 gap-2">
                  <span class="font-medium">Banque :</span>
                  <span>BNP Paribas</span>
                  <span class="font-medium">IBAN :</span>
                  <span>FR76 3000 4000 5500 0000 0000 123</span>
                  <span class="font-medium">BIC :</span>
                  <span>BNPAFRPPXXX</span>
                  <span class="font-medium">Bénéficiaire :</span>
                  <span>Votre Entreprise</span>
                  <span class="font-medium">Montant :</span>
                  <span>{{ formatCurrency(payment.amount) }}</span>
                  <span class="font-medium">Référence :</span>
                  <span
                    >CMD-{{ Math.floor(100000 + Math.random() * 900000) }}</span
                  >
                </div>
              </div>
            </div>
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="bank-transfer-confirm"
                  v-model="bankTransferConfirmed"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div class="ml-3">
                <label
                  for="bank-transfer-confirm"
                  class="text-sm text-gray-700"
                >
                  Je confirme avoir effectué le virement bancaire
                </label>
                <p v-if="errors.bankTransfer" class="mt-1 text-sm text-red-600">
                  {{ errors.bankTransfer }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="paymentMethod === 'apple'" class="text-center py-8">
            <img
              src="https://cdn-icons-png.flaticon.com/512/179/179457.png"
              alt="Apple Pay"
              class="h-16 mx-auto mb-6"
            />
            <p class="text-gray-600 mb-6">
              Cliquez sur le bouton ci-dessous pour payer avec Apple Pay
            </p>
            <button
              class="px-6 py-3 bg-black hover:bg-gray-800 rounded-full text-white font-medium flex items-center mx-auto"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
                />
              </svg>
              Payer avec Apple Pay
            </button>
          </div>
        </div>

        <!-- Step 3: Billing Information -->
        <div v-if="currentStep === 2" class="space-y-6">
          <h2 class="text-lg font-semibold text-gray-800">
            Informations de facturation
          </h2>

          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Email</label
            >
            <input
              id="email"
              v-model="billing.email"
              type="email"
              placeholder="votre@email.com"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">
              {{ errors.email }}
            </p>
          </div>

          <!-- Address -->
          <div>
            <label
              for="address"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Adresse</label
            >
            <input
              id="address"
              v-model="billing.address"
              type="text"
              placeholder="123 Rue Principale"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': errors.address }"
            />
            <p v-if="errors.address" class="mt-1 text-sm text-red-600">
              {{ errors.address }}
            </p>
          </div>

          <!-- City and Postal Code -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                for="city"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Ville</label
              >
              <input
                id="city"
                v-model="billing.city"
                type="text"
                placeholder="Paris"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.city }"
              />
              <p v-if="errors.city" class="mt-1 text-sm text-red-600">
                {{ errors.city }}
              </p>
            </div>
            <div>
              <label
                for="postalCode"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Code postal</label
              >
              <input
                id="postalCode"
                v-model="billing.postalCode"
                type="text"
                placeholder="75001"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.postalCode }"
              />
              <p v-if="errors.postalCode" class="mt-1 text-sm text-red-600">
                {{ errors.postalCode }}
              </p>
            </div>
          </div>

          <!-- Country -->
          <div>
            <label
              for="country"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Pays</label
            >
            <select
              id="country"
              v-model="billing.country"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': errors.country }"
            >
              <option value="" disabled selected>Sélectionnez un pays</option>
              <option value="TN">Tunisie</option>
              <option value="FR">France</option>
              <option value="BE">Belgique</option>
              <option value="CH">Suisse</option>
              <option value="CA">Canada</option>
              <option value="LU">Luxembourg</option>
            </select>
            <p v-if="errors.country" class="mt-1 text-sm text-red-600">
              {{ errors.country }}
            </p>
          </div>
        </div>

        <!-- Step 4: Review and Confirm -->
        <div v-if="currentStep === 3" class="space-y-6">
          <h2 class="text-lg font-semibold text-gray-800">Récapitulatif</h2>

          <!-- Payment Summary -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-700 mb-3">Détails du paiement</h3>

            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Montant</span>
                <span class="text-sm font-medium">{{
                  formatCurrency(payment.amount)
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Méthode de paiement</span>
                <span class="text-sm font-medium flex items-center">
                  <template v-if="paymentMethod === 'card'">
                    <img
                      :src="cardTypeIcon"
                      v-if="cardTypeIcon"
                      class="h-4 w-auto mr-1"
                      :alt="cardType"
                    />
                    <!-- {{ cardType }} •••• {{ payment.cardNumber.slice(-4) }} -->
                  </template>
                  <template v-else>
                    <img
                      :src="paymentMethodIcons[paymentMethod]"
                      class="h-4 w-auto mr-1"
                      :alt="paymentMethodLabels[paymentMethod]"
                    />
                    {{ paymentMethodLabels[paymentMethod] }}
                  </template>
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Frais de service</span>
                <span class="text-sm font-medium">{{ formatCurrency(0) }}</span>
              </div>
              <div class="pt-2 border-t border-gray-200 flex justify-between">
                <span class="text-sm font-medium text-gray-700">Total</span>
                <span class="text-sm font-bold text-blue-600">{{
                  formatCurrency(payment.amount)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Billing Summary -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-700 mb-3">
              Informations de facturation
            </h3>

            <div class="space-y-2">
              <p class="text-sm">{{ billing.email }}</p>
              <p class="text-sm">{{ billing.address }}</p>
              <p class="text-sm">{{ billing.postalCode }} {{ billing.city }}</p>
              <p class="text-sm">{{ getCountryName(billing.country) }}</p>
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="terms"
                v-model="termsAccepted"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3">
              <label for="terms" class="text-sm text-gray-700">
                J'accepte les
                <a href="#" class="text-blue-600 hover:text-blue-800"
                  >conditions générales</a
                >
                et la
                <a href="#" class="text-blue-600 hover:text-blue-800"
                  >politique de confidentialité</a
                >
              </label>
              <p v-if="errors.terms" class="mt-1 text-sm text-red-600">
                {{ errors.terms }}
              </p>
            </div>
          </div>
        </div>

        <!-- Step 5: Confirmation -->
        <div v-if="currentStep === 4" class="text-center py-8">
          <div
            class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
          >
            <svg
              class="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 class="mt-3 text-lg font-medium text-gray-900">
            Paiement réussi !
          </h2>
          <p class="mt-2 text-sm text-gray-500">
            Votre paiement de {{ formatCurrency(payment.amount) }} a été traité
            avec succès.
          </p>
          <p class="mt-1 text-sm text-gray-500">
            <template v-if="paymentMethod !== 'bank'">
              Un reçu a été envoyé à {{ billing.email }}
            </template>
            <template v-else>
              Un email de confirmation vous a été envoyé à
              {{ billing.email }} avec les instructions de paiement.
            </template>
          </p>
            <div class="mt-6 space-x-4">
            <button
              @click="goTo('home')"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
              :disabled="isLoadingHome"
            >
              <span :class="{ 'opacity-0': isLoadingHome }">Retour à l'accueil</span>
              <div v-if="isLoadingHome" class="absolute inset-0 flex items-center justify-center">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <svg
                v-else
                class="ml-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <button
              @click="goTo('resource')" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 relative"
              :disabled="isLoadingResource"
            >
              <span :class="{ 'opacity-0': isLoadingResource }">Retour à la ressource</span>
              <div v-if="isLoadingResource" class="absolute inset-0 flex items-center justify-center">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <svg
                v-else
                class="ml-2 h-5 w-5"
                fill="none" 
              stroke="currentColor"
              viewBox="0 0 24 24"
              >
              <path
                stroke-linecap="round"
                stroke-linejoin="round" 
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
              </svg>
            </button>
            </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="mt-8 flex justify-between">
          <button
            v-if="currentStep > 0 && currentStep < 4"
            @click="prevStep"
            type="button"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              class="mr-2 h-5 w-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Précédent
          </button>

          <button
            v-else
            @click="this.$router.push(`/DetailCour/${$route.params.id}`)"
            type="button"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              class="mr-2 h-5 w-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Retour au detail du cours
          </button>
          <!-- <div v-else></div> -->
          <!-- Empty div to maintain space -->

          <button
            v-if="currentStep < 3"
            @click="nextStep"
            type="button"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
            :disabled="currentStep === 0 && !paymentMethod || isLoading"
          >
            <span :class="{ 'opacity-0': isLoading }">Suivant</span>
            <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <svg
              v-if="!isLoading"
              class="ml-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <button
            v-if="currentStep === 3"
            @click="submitPayment"
            type="button"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            :disabled="processingPayment"
          >
            <span v-if="!processingPayment">Confirmer le paiement</span>
            <span v-else class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Traitement...
            </span>
          </button>
        </div>
      </div>

      <!-- Security Badges -->
      <div class="px-6 pb-6 flex items-center justify-center space-x-6">
        <img
          src="https://cdn-icons-png.flaticon.com/512/196/196578.png"
          alt="SSL Secure"
          class="h-8 opacity-70"
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/179/179457.png"
          alt="Stripe"
          class="h-8 opacity-70"
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/196/196561.png"
          alt="PCI Compliant"
          class="h-8 opacity-70"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

let stripe;
let elements;
let cardElement;
const stripePromise = loadStripe(
  "pk_test_51Qr5Z7F7RN1bvuhw6bs7KjPMYL247PSdj71j2OYVV617KcloMBuA9K6ZomCJDodCt9jId38fEr2sitFGpylR4Ebf00rXkaHQRz"
);
export default {
  data() {
    return {
      isLoading: false,
      isLoadingHome: false,
      isLoadingResource: false,
      cardElement: null,
      cardValid: false,
      currentStep: 0,
      steps: ["Méthode", "Paiement", "Facturation", "Confirmation", "Terminé"],
      formSubmitted: false,
      processingPayment: false,
      showCvvInfo: false,
      termsAccepted: false,
      bankTransferConfirmed: false,
      paymentMethod: null,
      paymentMethodLabels: {
        card: "Carte de crédit",
        paypal: "PayPal",
        bank: "Virement bancaire",
        apple: "Apple Pay",
      },
      paymentMethodIcons: {
        card: "https://cdn-icons-png.flaticon.com/512/196/196578.png",
        paypal: "https://cdn-icons-png.flaticon.com/512/2504/2504806.png",
        bank: "https://cdn-icons-png.flaticon.com/512/196/196566.png",
        apple: "https://cdn-icons-png.flaticon.com/512/179/179457.png",
      },
      payment: {
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
        amount: JSON.parse(localStorage.getItem("coursDetails")).prix || 0,
      },
      billing: {
        email: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
      },
      errors: {
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
        email: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        terms: "",
        bankTransfer: "",
      },
    };
  },
  computed: {
    // cardType() {
    //   const number = this.payment.cardNumber.replace(/\s/g, "");
    //   if (/^4/.test(number)) return "Visa";
    //   if (/^5[1-5]/.test(number)) return "Mastercard";
    //   if (/^3[47]/.test(number)) return "American Express";
    //   if (/^6(?:011|5)/.test(number)) return "Discover";
    //   return "Carte";
    // },
    cardTypeIcon() {
      switch (this.cardType) {
        case "Visa":
          return "https://cdn-icons-png.flaticon.com/512/196/196578.png";
        case "Mastercard":
          return "https://cdn-icons-png.flaticon.com/512/196/196566.png";
        case "American Express":
          return "https://cdn-icons-png.flaticon.com/512/196/196561.png";
        case "Discover":
          return "https://cdn-icons-png.flaticon.com/512/196/196565.png";
        default:
          return null;
      }
    },
  },
  watch: {
    currentStep: {
      async handler(newStep) {
        if (newStep === 1 && this.paymentMethod === "card") {
          // Initialize Stripe when reaching step 1 and payment method is card
          stripe = await stripePromise;
          elements = stripe.elements();
          this.initCardElement();
        }
      },
      immediate: true,
    },
  },
  methods: {
    initCardElement() {
      // Create Stripe card element with custom style
      this.cardElement = elements.create("card", {
        style: {
          base: {
            iconColor: "#4CAF50",
            fontSize: "16px",
            fontSmoothing: "antialiased",
            "::placeholder": {
              color: "#CFD7DF",
            },
          },
          invalid: {
            iconColor: "#fa755a",
            color: "#fa755a",
          },
        },
        hidePostalCode: true,
      });

      // Mount card element and attach event listener
      this.$nextTick(() => {
        const cardElement = document.getElementById("card-element");
        if (cardElement) {
          this.cardElement.mount("#card-element");
          this.cardElement.on("change", this.handleCardChange);
          console.log("Stripe card element initialized");
        } else {
          console.error("Card element container not found");
        }
      });
    },
    handleCardChange(event) {
      const displayError = document.getElementById("card-errors");
      if (displayError) {
        displayError.textContent = event.error ? event.error.message : "";
      }

      // Mettre à jour l'état de validation de la carte
      this.cardValid = event.complete && !event.error;
    },
    selectPaymentMethod(method) {
      this.paymentMethod = method;
    },
    async nextStep() {
      if (this.currentStep === 0 && !this.paymentMethod) {
        return;
      }

      if (this.validateCurrentStep()) {
        this.isLoading = true;
        await new Promise(resolve => setTimeout(resolve, 800));
        this.currentStep++;

        // Skip payment details step if not using credit card
        if (this.currentStep === 1 && this.paymentMethod !== "card") {
          this.currentStep++; // Move directly to billing information
        }
        this.isLoading = false;
      }
    },
    prevStep() {
      // Skip back past payment details if not using credit card
      if (this.currentStep === 2 && this.paymentMethod !== "card") {
        this.currentStep -= 2; // Go back to payment method selection
      } else {
        this.currentStep--;
      }
    },
    validateCurrentStep() {
      let isValid = true;
      this.resetErrors();

      if (this.currentStep === 1 && this.paymentMethod === "card") {
        // For card payments, rely on Stripe's validation
        if (!this.cardValid) {
          isValid = false;
          this.errors.cardNumber =
            "Veuillez entrer des informations de carte valides";
        }
        if (!this.payment.cardName.trim()) {
          isValid = false;
          this.errors.cardName = "Le nom sur la carte est requis";
        }
      } else if (this.currentStep === 1 && this.paymentMethod === "bank") {
        if (!this.bankTransferConfirmed) {
          isValid = false;
          this.errors.bankTransfer =
            "Veuillez confirmer avoir effectué le virement";
        }
      }

      // Validate billing information
      if (this.currentStep === 2) {
        if (!this.billing.email || !/\S+@\S+\.\S+/.test(this.billing.email)) {
          isValid = false;
          this.errors.email = "Email invalide";
        }
        if (!this.billing.address.trim()) {
          isValid = false;
          this.errors.address = "L'adresse est requise";
        }
        if (!this.billing.city.trim()) {
          isValid = false;
          this.errors.city = "La ville est requise";
        }
        if (!this.billing.postalCode.trim()) {
          isValid = false;
          this.errors.postalCode = "Le code postal est requis";
        }
        if (!this.billing.country) {
          isValid = false;
          this.errors.country = "Le pays est requis";
        }
      }

      // Validate terms acceptance
      if (this.currentStep === 3 && !this.termsAccepted) {
        isValid = false;
        this.errors.terms = "Vous devez accepter les conditions générales";
      }

      return isValid;
    },
    resetErrors() {
      this.errors = {
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
        email: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        terms: "",
        bankTransfer: "",
      };
    },
    // formatCardNumber() {
    //   // Remove all non-digit characters
    //   let value = this.payment.cardNumber.replace(/\D/g, "");

    //   // Add spaces every 4 digits
    //   value = value.replace(/(\d{4})(?=\d)/g, "$1 ");

    //   // Limit to 16 digits + 3 spaces
    //   if (value.length > 19) {
    //     value = value.substring(0, 19);
    //   }

    //   this.payment.cardNumber = value;
    // },
    formatExpiryDate() {
      // Remove all non-digit characters
      let value = this.payment.expiryDate.replace(/\D/g, "");

      // Add slash after 2 digits
      if (value.length > 2) {
        value = value.substring(0, 2) + "/" + value.substring(2);
      }

      // Limit to 5 characters (MM/YY)
      if (value.length > 5) {
        value = value.substring(0, 5);
      }

      this.payment.expiryDate = value;
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(amount);
    },
    getCountryName(code) {
      const countries = {
        TN: "Tunisie",
        FR: "France",
        BE: "Belgique",
        CH: "Suisse",
        CA: "Canada",
        LU: "Luxembourg",
      };
      return countries[code] || "";
    },
    async submitPayment() {
      if (!this.termsAccepted) {
        this.errors.terms = "Vous devez accepter les conditions générales";
        return;
      }

      this.processingPayment = true;

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      this.formSubmitted = true;
      this.currentStep++;
      this.processingPayment = false;
    },
    async goTo(place) {
      try {
        if (place === "consult") {
          this.isLoadingHome = true;
        }else {
          this.isLoadingResource = true;
        }
        const response = await axios.post(
          "http://localhost:8000/api/subscribeToCourse",
          {
            cours_id: this.$route.params.id,
            etudiant_id: JSON.parse(localStorage.getItem("StudentAccountInfo"))
              .id,
            tuteur_id: JSON.parse(localStorage.getItem("coursDetails"))
              .idTuteur,

              name: JSON.parse(localStorage.getItem("StudentAccountInfo")).fullname,
              email: this.billing.email,
              amount: this.formatCurrency(this.payment.amount),
              payment_method: this.paymentMethod,
              service_fee: 0,
              address: this.billing.address,
              postal_code: this.billing.postalCode,
              country: this.getCountryName(this.billing.country),
              total: this.formatCurrency(this.payment.amount),
          },
          {
            headers: {
              Authorization:
                "Bearer " +
                JSON.parse(localStorage.getItem("StudentAccountInfo")).token,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 201) {
          if (place === "resource") {
            window.location.href = `/DetailsCours/${this.$route.params.id}`;
          } else if (place === "consult") {
            this.$router.push({ name: "ConsultListCours",  });
          }
        } else {
          console.error(
            "Erreur lors de l'inscription au cours:",
            response.data
          );
          this.error = "Erreur lors de l'inscription au cours";
        }
      } catch (error) {
        console.error("Erreur:", error);
        this.error = "Erreur de chargement des cours";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style>
/* Custom input focus style */
input:focus,
select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  outline: none;
}

/* Smooth transitions */
button,
input,
select {
  transition: all 0.2s ease;
}

/* Custom scrollbar for dropdown */
select {
  scrollbar-width: thin;
  scrollbar-color: #3b82f6 #e5e7eb;
}

select::-webkit-scrollbar {
  width: 8px;
}

select::-webkit-scrollbar-track {
  background: #e5e7eb;
}

.stripe-card {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  background-color: white;
}

.error-message {
  color: #ff3860;
  font-size: 0.85rem;
  min-height: 20px;
}

select::-webkit-scrollbar-thumb {
  background-color: #3b82f6;
  border-radius: 4px;
}
</style>
