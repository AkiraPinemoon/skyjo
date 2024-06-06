<template>
    <div class="p-4">
        <div>
            <p>{{ game?.owner.username }}</p>
        </div>
        <div v-for="player of game?.players" key="player.socketId">
            <p>{{ player.username }}</p>
        </div>
        <p>Last SocketIo event: {{ lastevent }}</p>
    </div>
</template>

<script lang="ts" setup>

const game = useGame();
const socket = useSocket();

socket.value?.on("player_joined", (players) => {
    if (!game.value) return;
    game.value.players = players;
});

socket.value?.on("player_left", (players) => {
    if (!game.value) return;
    game.value.players = players;
});

socket.value?.on("new_owner", (owner) => {
    if (!game.value) return;
    game.value.owner = owner;
});

const lastevent = ref<{ event: string, args: any[] }>({ event: "N/A", args: [] });
socket.value?.prependAny((event: string, ...args: any[]) => {
    lastevent.value = { event, args };
})

</script>