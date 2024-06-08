<template>
    <div class="flex justify-center gap-2">
        <div v-for="[cpos, column] in playfield.entries()" class="flex flex-col gap-2">
            <GameCard v-for="[rpos, card] in column.entries()" :card-value="card.value" :facing-up="card.isVisible"
                @click="emit('card_selected', cpos, rpos)" />
        </div>
    </div>
</template>

<script lang="ts" setup>

const props = defineProps<{
    playfield: [[{
        value: number | undefined,
        isVisible: boolean,
    }]]
}>();

const emit = defineEmits<{
    "card_selected": [column: number, row: number],
}>();

</script>