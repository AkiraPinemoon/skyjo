<template>
    <div v-if="game?.phase == 'SETUP'" class="p-4 flex flex-col place-items-center justify-center">
        <div class="h-[30vh] w-1/2 flex flex-col gap-2 p-2 border border-slate-800 rounded-lg">
            <div class="border border-slate-800 rounded-full h-16 w-full flex place-items-center gap-4 pr-5">
                <img src="https://www.svgrepo.com/show/532363/user-alt-1.svg"
                    class="h-full border border-slate-800 bg-white rounded-full" />
                <span>👑{{ game.owner.username }}</span>
            </div>
            <div v-for="player of game?.players"
                class="border border-slate-800 rounded-full h-16 w-full flex place-items-center gap-4 pr-5">
                <img src="https://www.svgrepo.com/show/532363/user-alt-1.svg"
                    class="h-full border border-slate-800 bg-white rounded-full" />
                <span>{{ player.username }}</span>
            </div>
            <div class="grow"></div>
            <button v-if="game.owner.socketId == socket?.id" @click="socket.emit('start_game')"
                class="uppercase text-md flex place-items-center place-content-center border-4 border-slate-900 shadow shadow-slate-800 bg-lime-600 rounded-full px-6 py-2 transition-all hover:scale-105">
                Start Game
            </button>
        </div>
    </div>

    <div v-else class="p-4">
        <div class="flex place-items-center justify-center gap-10 max-w-full">
            <Playfields @card_selected="selectCard" />

            <div class="flex flex-col gap-10">
                <Scoreboard />
                <div class="flex gap-2">
                    <GameStack :top-card-value="3" :facing-up="false" />
                    <GameStack :top-card-value="3" :facing-up="true" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

const game = useGame();
const socket = useSocket();

const playfieldData = computed(() => {
    if (!game.value) return;
    if (!game.value.data) return;

    return [game.value.owner].concat(game.value.players).map((player) => {
        return {
            player,
            playfield: game.value?.data?.playfields[player.socketId as keyof typeof game.value.data.playfields],
        }
    });
});

const carousel = ref();

socket.value?.on("patch", (patch) => {
    game.value = { ...game.value, ...patch }
    setTimeout(() => {
        const idx = playfieldData.value?.findIndex((item) => item.player.socketId == game.value?.data?.currentPlayerId);
        carousel.value.select(idx ? idx + 1 : 1);
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