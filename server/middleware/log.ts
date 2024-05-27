export default defineEventHandler((event) => {
    console.log('request: ' + getRequestURL(event))
})
