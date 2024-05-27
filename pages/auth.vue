<template>
    <input placeholder="Username" v-model="username" />
    <button @click="login">Login</button>
</template>

<script lang="ts" setup>
import axios from "axios"

const username = ref("")

async function login() {
    useUser().value = await axios.post("api/user", {
        name: username.value,
    }).then(res => res.data)
    
    navigateTo("/selectGame")
}

</script>