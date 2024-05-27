
export default defineNuxtRouteMiddleware((to, from) => {
    if(to.path == "/selectGame") {
        if(useUser().value == null) return navigateTo("/auth")
    }
})
