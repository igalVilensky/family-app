<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
    <nav class="bg-white/80 backdrop-blur-md border-b border-gray-200/60">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <div
              class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center"
            >
              <i class="fas fa-home text-white text-lg"></i>
            </div>
            <span
              class="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent"
            >
              FamilySpace
            </span>
          </NuxtLink>
          <NuxtLink
            to="/help"
            class="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            Back to Help
          </NuxtLink>
        </div>
      </div>
    </nav>

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8">
        <div class="text-center mb-8">
          <div
            class="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <i class="fas fa-user-plus text-white text-xl"></i>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-4">
            Inviting Family Members
          </h1>
          <p class="text-gray-600">How to invite members to your family</p>
        </div>

        <div class="prose prose-lg max-w-none">
          <p class="text-gray-600 text-center">
            Complete guide to inviting family members is coming soon.
          </p>

          <div
            class="mt-8 p-6 bg-purple-50 rounded-xl border border-purple-200"
          >
            <div class="flex items-center gap-3">
              <i class="fas fa-share-alt text-purple-600 text-xl"></i>
              <div>
                <h3 class="font-semibold text-purple-900">
                  Invitation Methods
                </h3>
                <p class="text-purple-700 text-sm mt-1">
                  • Generate invite links<br />
                  • Share via email or messaging<br />
                  • Set expiration dates for security<br />
                  • Manage pending invitations
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-center">
          <NuxtLink
            to="/help"
            class="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
          >
            <i class="fas fa-arrow-left"></i>
            Back to Help Center
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
useHead({
  title: "Inviting Members - FamilySpace Guides",
});
</script>
