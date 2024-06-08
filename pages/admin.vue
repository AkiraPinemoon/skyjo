<template>
    <div class="w-full h-full flex flex-col place-items-center">
        <div class="h-16"></div>
        <h1 class="uppercase text-3xl">Admin Tools</h1>
        <div class="h-16"></div>
        <button @click="clean"
            class="uppercase text-xs flex place-items-center place-content-center border-4 border-slate-900 shadow shadow-slate-800 bg-slate-950 rounded-full px-6 py-2 transition-all hover:scale-105">Clear
            DB
        </button>
    </div>
</template>

<script lang="ts" setup>

async function clean() {
    await fetch("/api/admin/clean");
}

</script>
