<template>
    <div class="h-[30vh] w-full flex flex-col gap-2 p-2 border border-slate-800 rounded-lg">
        <div v-for="player of data" class="border border-slate-800 rounded-full h-16 w-full flex place-items-center gap-4 pr-5">
            <img src="https://www.svgrepo.com/show/532363/user-alt-1.svg"
                class="h-full border border-slate-800 bg-white rounded-full" />
            <span class="grow">{{ player.username }}</span>
            <span>{{ player.points }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>

const game = useGame();
const data = computed(() => {
    if (!game.value) return;
    if (!game.value.data) return;

    const unsorted = [game.value.owner].concat(game.value.players).map((player) => {
        const playfield = game.value?.data?.playfields[player.socketId as keyof typeof game.value.data.playfields] as unknown as { value: number; isVisible: boolean }[][];

        const points = playfield
            .flat()
            .map((slot) => slot.isVisible ? slot.value : 0)
            .reduce((a, b) => a + b, 0);

        return {
            ...player,
            points,
        }
    });

    return unsorted.sort((a, b) => a.points - b.points);
});

</script>
