<template>
    <div class="p-4">
        <h1 class="text-lg">Players</h1>
        <div>
            <p>👑{{ game?.owner.username }}</p>
        </div>
        <div v-for="player of game?.players" key="player.socketId">
            <p>{{ player.username }}</p>
        </div>
    </div>
    <hr />
    <div v-if="game?.phase == 'SETUP'" class="p-4">
        <h1 class="text-lg">SETUP</h1>
        <button v-if="game.owner.socketId == socket?.id" @click="socket.emit('start_game')"
            class="uppercase text-xs flex place-items-center place-content-center border-4 border-slate-900 shadow shadow-slate-800 bg-lime-600 rounded-full px-6 py-2 transition-all hover:scale-105">
            Start Game
        </button>
    </div>
    <div v-if="game?.phase == 'INITIALREVEAL'" class="p-4">
        <h1 class="text-lg">INITIALREVEAL</h1>
        <div class="flex justify-center gap-2">
            <div v-for="[cpos, column] in game.data?.playfields[socket?.id].entries()" class="flex flex-col gap-2">
                <GameCard v-for="[rpos, card] in column.entries()" :card-value="card.value" :facing-up="card.isVisible"
                    @click="selectCard(cpos, rpos)" />
            </div>
        </div>
        <p v-if="game.data?.currentPlayerId == socket?.id">Click on a card to reveal it</p>
    </div>
    <hr />
    <div class="p-4">
        <h1 class="text-lg">Last SocketIo event</h1>
        <p>{{ lastevent }}</p>
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

socket.value?.on("game_started", (patch) => {
    game.value = { ...game.value, ...patch }
});

socket.value?.on("card_revealed", (patch) => {
    game.value = { ...game.value, ...patch }
});

const lastevent = ref<{ event: string, args: any[] }>({ event: "N/A", args: [] });
socket.value?.prependAny((event: string, ...args: any[]) => {
    lastevent.value = { event, args };
})

function selectCard(column: number, row: number) {
    socket.value?.emit("card_selected", column, row);
}

</script>