<template>
    <UProgress :value="phaseId" :max="['SETUP', 'INITIALREVEAL', 'DRAW', 'DECIDE', 'REPLACE', 'REVEAL', 'END']" />
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