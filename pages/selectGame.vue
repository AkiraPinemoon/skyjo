<template>
    <div class="p-4 flex flex-col place-items-center justify-center">
        <div class="w-64 h-34 p-4 flex flex-col gap-3 place-content-center border border-slate-800 rounded">
            <div class="flex justify-between place-items-center">
                <h1>Available Games:</h1>
                <button @click="refresh()" class="text-4xl transition-all hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M5.3 18.025q-1.075-1.2-1.687-2.75T3 12q0-3.75 2.625-6.375T12 3V1l5 3.75l-5 3.75v-2q-2.275 0-3.887 1.613T6.5 12q0 1.15.438 2.15t1.187 1.75zM12 23l-5-3.75l5-3.75v2q2.275 0 3.888-1.612T17.5 12q0-1.15-.437-2.15T15.875 8.1L18.7 5.975q1.075 1.2 1.688 2.75T21 12q0 3.75-2.625 6.375T12 21z">
                        </path>
                    </svg>
                </button>
            </div>

            <button v-for="game of data" @click="join(game.id)" class="block border border-slate-800 rounded p-1">
                <p>{{ game.owner.username }}'s Game</p>
                <p>{{ game.playercount }} {{ game.playercount > 1 ? "players" : "player" }}</p>
            </button>
            <button @click="host"
                class="uppercase text-md flex place-items-center place-content-center border-4 border-slate-900 shadow shadow-slate-800 bg-lime-600 rounded-full px-6 py-2 transition-all hover:scale-105">Host
                Game</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import axios from 'axios';


const { data, refresh } = useFetch<{
    owner: {
        username: string,
        socketId: string,
    },
    playercount: number,
    id: string,
}[]>("/api/games");

const player = usePlayer();
const socket = useSocket();

function join(gameId: string) {
    useSocket().value?.emit("join_game", gameId);
}

function host() {
    useSocket().value?.emit("host_game");
}

useSocket().value?.once("game_joined", (game) => {
    useGame().value = game;
    navigateTo("/play");
})

onBeforeMount(async () => {
    // check if socket is open
    if (useSocket().value == null) {
        useAuth().value.isOpen = true;
        navigateTo("/");
    } else {
        // check if player is in game
        const res = await axios.get("/api/player/" + player.value?.playerId).then(res => res.data);
        if (res.state == "INGAME") {
            navigateTo("/play");
        }
    }
});

</script>