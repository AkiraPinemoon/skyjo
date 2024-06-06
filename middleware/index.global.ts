
export default defineNuxtRouteMiddleware((to, from) => {
    if(to.path == "/selectGame" || to.path == "/play") {
        if(useSocket().value == null) return navigateTo("/auth")
    }
})
