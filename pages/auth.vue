<template>
    <div class="h-screen w-full flex place-content-center place-items-center">
        <div v-if="isConnected"
            class="w-64 h-34 p-4 flex flex-col gap-3 place-content-center border border-slate-800 rounded">
            <button @click="logout"
                class="uppercase text-md flex place-items-center place-content-center border-4 border-slate-900 shadow shadow-slate-800 bg-lime-600 rounded-full px-6 py-2 transition-all hover:scale-105">Disconnect</button>
        </div>
        <div v-else class="w-64 h-34 p-4 flex flex-col gap-3 place-content-center border border-slate-800 rounded">
            <input placeholder="Username" v-model="username" class="rounded p-1 text-black px-2" />
            <button @click="auth"
                class="uppercase text-md flex place-items-center place-content-center border-4 border-slate-900 shadow shadow-slate-800 bg-lime-600 rounded-full px-6 py-2 transition-all hover:scale-105">Authenticate</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Socket, io } from 'socket.io-client';

const socket = useSocket()

const isConnected = ref(false);
const username = ref("")

function onConnect() {
    isConnected.value = true;
}

function onDisconnect() {
    isConnected.value = false;
}

function auth() {
    socket.value = io({ auth: { "username": username.value } }) as Socket & {
        auth: {
            username: string,
        }
    };
    socket.value.on("connect", onConnect);
    socket.value.on("disconnect", onDisconnect);
    navigateTo("/selectGame")
}

function logout() {
    socket.value?.disconnect();
    socket.value = null;
}

if (socket.value?.connected) {
    onConnect();
}

socket.value?.on("connect", onConnect);
socket.value?.on("disconnect", onDisconnect);

onBeforeUnmount(() => {
    socket.value?.off("connect", onConnect);
    socket.value?.off("disconnect", onDisconnect);
});

</script>