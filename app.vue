<template>
  <div class="font-mono font-bold bg-slate-900 text-white flex flex-col min-w-screen min-h-screen">
    <header class="border border-slate-800 relative p-6">
      <div class="w-full h-full uppercase flex place-items-center justify-center text-xl">Skyjo online</div>
      <NuxtLink to="/" class="absolute left-2 top-0 text-6xl font-normal px-2 h-full flex place-items-center">🃍</NuxtLink>
      <NuxtLink to="/auth" class="absolute right-2 top-0 text-lg font-normal px-2 h-full flex place-items-center">
        {{ socket ? 'Hello ' + socket.auth.username : "login" }}
      </NuxtLink>
    </header>


    <NuxtPage class="grow max-w-full" />
  </div>
</template>

<script lang="ts" setup>

const socket = useSocket();

</script>
