<template>
    <div @click="emit('click')" class="mt-3 ml-3">
        <div v-if="!props.isEmpty" class="h-[20svmin] w-[13svmin] perspective-800 group select-none">
            <div class="absolute w-full h-full shadow shadow-black bg-white rounded-[.8cqmin]"></div>
            <div
                class="absolute w-full h-full shadow shadow-black bg-white rounded-[.8cqmin] -translate-x-1 -translate-y-1">
            </div>
            <div
                class="absolute w-full h-full shadow shadow-black bg-white rounded-[.8cqmin] -translate-x-2 -translate-y-2">
            </div>
            <div class="-translate-x-3 -translate-y-3 transform backface-hidden transition-transform duration-500 absolute w-full h-full shadow shadow-black border-white border-[.5cqmin] rounded-[.8cqmin] text-[7.5cqmin] flex place-items-center justify-center"
                :class="(props.topCardValue == null ? '' : props.topCardValue < 0 ? 'bg-teal-600' : props.topCardValue == 0 ? 'bg-cyan-600' : props.topCardValue < 5 ? 'bg-lime-600' : props.topCardValue < 9 ? 'bg-yellow-600' : 'bg-red-600') + ' ' + (facingUp ? 'rotate-y-0' : 'rotate-y-180')">
                {{ props.topCardValue }}</div>
            <div class="-translate-x-3 -translate-y-3 transform backface-hidden transition-transform duration-500 absolute w-full h-full shadow shadow-black bg-gradient-to-br from-red-600 via-pink-600 to-purple-600 border-white border-[.5cqmin] rounded-[.8cqmin]"
                :class="facingUp ? '-rotate-y-180' : 'rotate-y-0'">
                <span
                    class="flex h-full place-items-center justify-center text-[5cqmin] -rotate-60 uppercase">Skyjo</span>
            </div>
        </div>
        <div v-else class="h-[20svmin] w-[13svmin] border-[.5cqmin] rounded-[.8cqmin] border-slate-800"></div>
    </div>
</template>

<script lang="ts" setup>

const emit = defineEmits<{
    click: [],
}>()

const props = defineProps<{
    topCardValue?: number,
    facingUp: boolean,
    isEmpty: boolean,
}>()

</script>
