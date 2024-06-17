<template>
    <div class="h-full w-full p-4 flex flex-col place-items-center justify-center overflow-clip">
        <div v-if="game?.phase == 'SETUP'" class="p-4 flex flex-col place-items-center justify-center w-2/3  max-w-xl">
            <div class="min-h-96 w-full flex flex-col gap-2 p-2 border border-slate-800 rounded-lg">
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
                <button v-if="game.owner.id == player?.playerId" @click="socket?.emit('start_game')"
                    class="uppercase text-md flex place-items-center place-content-center border-4 border-slate-900 shadow shadow-slate-800 bg-lime-600 rounded-full px-6 py-2 transition-all hover:scale-105">
                    Start Game
                </button>
            </div>
        </div>

        <div v-else-if="game?.phase == 'END'"
            class="p-4 w-full h-full grow flex flex-col place-items-center justify-center">
            <div
                class="flex flex-col justify-center place-items-center gap-10 w-1/3 max-w-md portrait:max-w-none portrait:w-full portrait:h-1/4">
                <h1 v-if="getWinnerId() == player?.playerId" class="text-3xl">You won!</h1>
                <h1 v-else class="text-3xl">You lost.</h1>
                <Scoreboard />
            </div>
        </div>

        <div v-else class="p-4 w-full h-full grow flex flex-col place-items-center">
            <PhaseIndicator class="w-2/3 max-w-4xl" />
            <div class="h-full w-full grow flex portrait:flex-col place-items-center justify-center gap-10 p-4">
                <Playfields @card_selected="selectCard" ref="playfields"
                    class="w-2/3 max-w-3xl portrait:w-full portrait:h-3/4" />

                <div
                    class="flex flex-col justify-center gap-10 w-1/3 max-w-md portrait:max-w-none portrait:flex-row portrait:w-full portrait:h-1/4">
                    <Scoreboard @click="showPlayfield" />
                    <div class="flex gap-2 justify-center">
                        <CardPile @click="selectDraw" :top-card-value="undefined" :facing-up="false"
                            :is-empty="false" />
                        <CardPile @click="selectDiscard"
                            :top-card-value="game?.data?.lastcard != null ? game?.data?.lastcard : undefined"
                            :facing-up="true" :is-empty="game?.data?.lastcard == null" />
                    </div>
                </div>
            </div>

            <div class="relative">
                <GameCard :card-value="game?.data?.currentCard != null ? game?.data?.currentCard : undefined"
                    :facing-up="true" class="absolute bottom-0 left-10 transition-all"
                    :class="game?.data?.currentCard != null ? '' : 'translate-y-[150%]'" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

const player = usePlayer();
const game = useGame();
const socket = useSocket();

socket.value?.on("patch", (patch) => {
    game.value = {
        ...game.value,
        ...patch,
        data: {
            ...game.value?.data,
            ...patch.data,
        },
    }
});

// runs when player clicks one of his playfield cards
function selectCard(column: number, row: number) {
    socket.value?.emit("card_selected", column, row);
}

// runs when player clicks drawpile
function selectDraw() {
    socket.value?.emit("draw_selected");
}

// runs when player clicks discardpile
function selectDiscard() {
    socket.value?.emit("discard_selected");
}

// returns winners id
function getWinnerId() {
    if (!game.value) return;
    if (!game.value.data) return;

    const unsorted = [game.value.owner].concat(game.value.players).map((player) => {
        const playfield = game.value?.data?.playfields[player.id as keyof typeof game.value.data.playfields] as unknown as { value: number; isVisible: boolean }[][];

        const points = playfield
            .flat()
            .map((slot) => slot.isVisible ? slot.value : 0)
            .reduce((a, b) => a + b, 0);

        return {
            ...player,
            points,
        }
    });

    return unsorted.sort((a, b) => a.points - b.points)[0].id;
}

const playfields = ref();

function showPlayfield(playerId: string) {
    playfields.value.select(playerId);
}

</script>