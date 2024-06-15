<template>
    <UProgress :value="phaseId" :max="['Wait for host to press start', 'Click on a face-down card to reveal it', 'Draw from draw or discard pile by selecting it', 'Click on dicard pile to discar the card or a playfield card to replace it', 'Click on a playfield card to replace it', 'Select a face-down playfield card to reveal it', 'Game ended']" />
</template>

<script lang="ts" setup>

const game = useGame();
const phaseId = computed(() => {
    if (!game.value) return;

    switch (game.value.phase) {
        case "SETUP":
            return 0;
        case "INITIALREVEAL":
            return 1;
        case "DRAW":
            return 2;
        case "DECIDE":
            return 3;
        case "REPLACE":
            return 4;
        case "REVEAL":
            return 5;
        case "END":
            return 6;
        default:
            return -1;
    }
});

</script>