<template>
    <UCarousel v-slot="{ item }" :items="data" :ui="{
        item: 'w-full', indicators: {
            wrapper: 'relative bottom-0 mt-2'
        }
    }" indicators ref="carousel" class="w-1/2">
        <div class="flex flex-col place-items-center gap-2 p-2 mx-auto">
            <div class="border border-slate-800 rounded-full h-16 w-52 flex place-items-center gap-4">
                <img src="https://www.svgrepo.com/show/532363/user-alt-1.svg"
                    class="h-full border border-slate-800 bg-white rounded-full" />
                {{ item.player.username }}
            </div>
            <Playfield :playfield="item.playfield"
                @card_selected="(column, row) => { if (item.player.id == player?.playerId) emit('card_selected', column, row) }" />
        </div>
    </UCarousel>
</template>

<script lang="ts" setup>

const game = useGame();
const player = usePlayer();

const data = computed(() => {
    if (!game.value) return;
    if (!game.value.data) return;
    if (!game.value.data.playfields) return;

    return [game.value.owner].concat(game.value.players).map((player) => {
        return {
            player,
            playfield: game.value?.data?.playfields[player.id as keyof typeof game.value.data.playfields],
        }
    });
});

const emit = defineEmits<{
    "card_selected": [column: number, row: number],
}>();

const carousel = ref();

watch(game, (x) => {
    setTimeout(() => {
        const idx = data.value?.findIndex((item) => item.player.id == game.value?.data?.currentPlayerId);
        carousel.value.select(idx ? idx + 1 : 1);
    }, 1000);
});

function select(playerId: string) {
    const idx = data.value?.findIndex((item) => item.player.id == playerId);
    carousel.value.select(idx ? idx + 1 : 1);
}

defineExpose({
    select,
})

</script>
