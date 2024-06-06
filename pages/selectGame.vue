<template>
    <div>
        <h1>Available Games:</h1>
        <button @click="refresh()" class="border rounded-lg p-1">refresh</button>
        <button v-for="game in data" @click="join(game.id)" class="block border rounded-lg p-1">
            <p>{{ game.owner.username }}'s Game</p>
            <p>{{ game.playercount }} {{ game.playercount > 1 ? "players" : "player" }}</p>
        </button>
        <button @click="host" class="border rounded-lg p-1">Host Game</button>
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