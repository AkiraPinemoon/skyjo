<template>
  <div class="font-mono font-bold bg-slate-900 text-white flex flex-col h-screen">
    <header class="border border-slate-800 h-20 flex flex-row justify-between place-items-center py-2 gap-1 divide-x divide-slate-800">
      <NuxtLink to="/" class="text-6xl font-normal px-2 h-full flex place-items-center">🃍</NuxtLink>
      <div class="grow h-full uppercase flex place-items-center justify-center text-xl">Skyjo online</div>
    </header>

    
    <NuxtPage class="grow" />
  </div>
</template>
