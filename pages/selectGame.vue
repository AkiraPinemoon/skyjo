<template>
    <div class="p-4 flex flex-col place-items-center justify-center">
        <div class="w-64 h-34 p-4 flex flex-col gap-3 place-content-center border border-slate-800 rounded">
            <div class="flex justify-between place-items-center">
                <h1>Available Games:</h1>
                <button @click="refresh()"
                    class="text-4xl rounded-full aspect-square transition-all hover:scale-105">🗘</button>
            </div>

            <button v-for="game in data" @click="join(game.id)" class="block border border-slate-800 rounded p-1">
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

const { data, refresh } = useFetch<[{
    owner: {
        username: string,
        socketId: string,
    },
    playercount: number,
    id: string,
}]>("/api/games");

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

</script>