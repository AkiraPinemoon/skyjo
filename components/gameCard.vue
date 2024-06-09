<template>
    <div @click="emit('click')">
        <div class="h-[20svmin] w-[13svmin] perspective-800 group select-none">
            <div class="transform backface-hidden transition-transform duration-500 absolute w-full h-full border-white border-[.5cqmin] rounded-[.8cqmin] text-[7.5cqmin] flex place-items-center justify-center"
                :class="(props.cardValue == null ? '' : props.cardValue < 0 ? 'bg-teal-600' : props.cardValue == 0 ? 'bg-cyan-600' : props.cardValue < 5 ? 'bg-lime-600' : props.cardValue < 9 ? 'bg-yellow-600' : 'bg-red-600') + ' ' + (facingUp ? 'rotate-y-0' : 'rotate-y-180')">
                {{ props.cardValue }}</div>
            <div class="transform backface-hidden transition-transform duration-500 absolute w-full h-full bg-gradient-to-br from-red-600 via-pink-600 to-purple-600 border-white border-[.5cqmin] rounded-[.8cqmin]"
                :class="facingUp ? '-rotate-y-180' : 'rotate-y-0'">
                <span class="flex h-full place-items-center justify-center text-[5cqmin] -rotate-60 uppercase">Skyjo</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

const emit = defineEmits<{
    click: [],
}>()

const props = defineProps<{
    cardValue?: number,
    facingUp: boolean,
}>()

</script>
