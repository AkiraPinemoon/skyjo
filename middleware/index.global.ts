
export default defineNuxtRouteMiddleware((to, from) => {
    if(to.path == "/selectGame" || to.path == "/play") {
        if(useSocket().value == null) {
            useAuth().value.isOpen = true;
            return abortNavigation()
        }
    }
})
