export default defineNuxtRouteMiddleware((to) => {
  const nuxtApp = useNuxtApp();

  // If Firebase isn't ready yet, skip check
  if (!nuxtApp.$auth) return;

  // Not logged in? Redirect to home
  if (!nuxtApp.$auth.currentUser && to.path === "/dashboard") {
    return navigateTo("/");
  }
});
