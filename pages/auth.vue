<template>
    <div class="h-full w-full flex place-content-center place-items-center">
        <div v-if="isConnected"
            class="w-64 h-34 p-4 flex flex-col gap-3 place-content-center border border-slate-800 rounded">
            <button @click="logout"
                class="uppercase text-md flex place-items-center place-content-center border-4 border-slate-900 shadow shadow-slate-800 bg-lime-600 rounded-full px-6 py-2 transition-all hover:scale-105">Disconnect</button>
        </div>
        <div v-else class="w-64 h-34 p-4 flex flex-col gap-3 place-content-center border border-slate-800 rounded">
            <input placeholder="Username" v-model="username" class="rounded p-1 text-black px-2 bg-white" />
            <button @click="auth"
                class="uppercase text-md flex place-items-center place-content-center border-4 border-slate-900 shadow shadow-slate-800 bg-lime-600 rounded-full px-6 py-2 transition-all hover:scale-105">Authenticate</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { Socket, io } from 'socket.io-client';

const player = usePlayer()
const socket = useSocket()

const isConnected = ref(false);
const username = ref("")

function onConnect() {
    isConnected.value = true;
}

function onDisconnect() {
    isConnected.value = false;
}

async function auth() {
    const newPlayer = await axios.post("/api/player", {
        username: username.value,
    }).then(res => res.data);

    player.value = newPlayer;

    socket.value = io({ auth: player.value }) as Socket & {
        auth: {
            playerId: string,
            secret: string,
        }
    };
    socket.value.on("connect", onConnect);
    socket.value.on("disconnect", onDisconnect);

    setTimeout(() => { if (socket.value?.connected) navigateTo("/selectGame") }, 1000);
}

function logout() {
    player.value = null;
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