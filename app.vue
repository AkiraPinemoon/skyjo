<template>
  <div class="font-mono font-bold bg-slate-900 text-white flex flex-col w-screen h-screen">
    <header class="border border-slate-800 h-20 relative">
      <div class="absolute w-full h-full uppercase flex place-items-center justify-center text-xl">Skyjo online</div>
      <NuxtLink to="/" class="absolute left-0 text-6xl font-normal px-2 h-full flex place-items-center">🃍</NuxtLink>
      <NuxtLink to="/auth" class="absolute right-0 text-lg font-normal px-2 h-full flex place-items-center">
        {{ socket ? 'Hello ' + socket.auth.username : "login" }}
      </NuxtLink>
    </header>


    <NuxtPage class="grow max-w-full max-h-full" />
  </div>
</template>

<script lang="ts" setup>

const socket = useSocket();

</script>
