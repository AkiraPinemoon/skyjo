<template>
    <div v-if="game?.phase == 'SETUP'" class="p-4">
        <h1 class="text-lg">SETUP</h1>
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
        <button v-if="game.owner.socketId == socket?.id" @click="socket.emit('start_game')"
            class="uppercase text-xs flex place-items-center place-content-center border-4 border-slate-900 shadow shadow-slate-800 bg-lime-600 rounded-full px-6 py-2 transition-all hover:scale-105">
            Start Game
        </button>
    </div>

    <div v-else if="game?.phase == 'INITIALREVEAL'" class="p-4">
        <h1 class="text-lg">INITIALREVEAL</h1>
        <UCarousel v-slot="{ item }" :items="playfieldData" :ui="{ item: 'w-full' }" ref="carousel" class="w-full">
            <div class="flex flex-col place-items-center gap-2 p-2 mx-auto">
                <div class="border border-slate-800 rounded-full h-16 w-52 flex place-items-center gap-4">
                    <img src="https://www.svgrepo.com/show/532363/user-alt-1.svg"
                        class="h-full border border-slate-800 bg-white rounded-full" />
                    {{ item.player.username }}
                </div>
                <Playfield :playfield="item.playfield"
                    @card_selected="(column, row) => { if (item.player.socketId == socket?.id) selectCard(column, row); }" />
            </div>
        </UCarousel>
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

const playfieldData = computed(() => {
    if (!game.value) return;
    if (game.value.data == undefined) return;

    return [game.value.owner].concat(game.value.players).map((player) => {
        return {
            player,
            playfield: game.value.data.playfields[player.socketId],
        }
    });
});

const carousel = ref();

socket.value?.on("patch", (patch) => {
    game.value = { ...game.value, ...patch }
    setTimeout(() => {
        carousel.value.select(playfieldData.value?.findIndex((item) => item.player.socketId == game.value.data.currentPlayerId) + 1);
    }, 1000);
});

const lastevent = ref<{ event: string, args: any[] }>({ event: "N/A", args: [] });
socket.value?.prependAny((event: string, ...args: any[]) => {
    lastevent.value = { event, args };
})

function selectCard(column: number, row: number) {
    socket.value?.emit("card_selected", column, row);
}

</script>