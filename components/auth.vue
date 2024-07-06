<template>
  <UModal v-model="auth.isOpen">
    <div class="h-64 w-34 flex place-content-center place-items-center">
      <div v-if="socket" class="w-64 h-34 p-4 flex flex-col gap-3 place-content-center rounded">
        <button @click="logout"
          class="uppercase text-md flex place-items-center place-content-center border-4 border-slate-900 shadow shadow-slate-800 bg-lime-600 rounded-full px-6 py-2 transition-all hover:scale-105">Disconnect</button>
      </div>
      <div v-else class="w-64 h-34 p-4 flex flex-col gap-3 place-content-center rounded">
        <input placeholder="Username" v-model="username" class="rounded p-1 text-black px-2 bg-white" />
        <button @click="login"
          class="uppercase text-md flex place-items-center place-content-center border-4 border-slate-900 shadow shadow-slate-800 bg-lime-600 rounded-full px-6 py-2 transition-all hover:scale-105">Authenticate</button>
      </div>
    </div>
  </UModal>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { Socket, io } from 'socket.io-client';

const auth = useAuth();
const player = usePlayer()
const socket = useSocket()

const username = ref("")

async function login() {
  const newPlayer = await axios.post("/api/player", {
    username: username.value,
  }).then(res => res.data);

  player.value = newPlayer;

  socket.value = io({ auth: player.value! }) as Socket & {
    auth: {
      playerId: string,
      secret: string,
    }
  };

  navigateTo("/selectGame")
  auth.value.isOpen = false;
}

function logout() {
  player.value = null;
  socket.value?.disconnect();
  socket.value = null;

  navigateTo("/")
}

onBeforeMount(() => {
  if (player.value && !socket.value) {
    socket.value = io({ auth: player.value! }) as Socket & {
      auth: {
        playerId: string,
        secret: string,
      }
    };
    setTimeout(() => { if (!socket.value?.connected) player.value = null }, 500);
  }
})

</script>