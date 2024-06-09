<template>
  <div class="w-full h-full flex flex-col place-items-center">
    <div class="h-28"></div>
    <h1 class="uppercase text-xl">welcome to</h1>
    <h1 class="uppercase text-9xl">skyjo</h1>
    <h1 class="uppercase text-5xl">online</h1>
    <div class="h-16"></div>
    <div class="flex flex-row gap-2">
      <NuxtLink to="/selectGame"
        class="uppercase text-md flex place-items-center place-content-center border-4 border-slate-900 shadow shadow-slate-800 bg-lime-600 rounded-full px-6 py-2 transition-all hover:scale-105">
        Play now</NuxtLink>
      <NuxtLink to="/rules"
        class="uppercase text-xs flex place-items-center place-content-center border-4 border-slate-900 shadow shadow-slate-800 bg-slate-950 rounded-full px-6 py-2 transition-all hover:scale-105">
        Rules</NuxtLink>
    </div>
    <div class="h-28"></div>

    <hr class="w-11/12 border-slate-800" />

    <div class="h-28"></div>
    <p class="p-3 w-2/3 max-w-3xl text-justify">
      This site is a online multiplayer implementation of the popular Skyjo cardgame.
      You begin by picking a username. Then you can either join a gameroom or host a new one.
      If you don't know the rules of the game yet, please click the rules button above to see them.
    </p>
    <p class="p-3 w-2/3 max-w-3xl text-justify">
      Skyjo online was programmed by Akira Pinemoon and is open source.
      Click below to see the code on Github.
    </p>
    <div class="h-4"></div>
    <a target="_blank" rel="noopener noreferrer" href="https://github.com/AkiraPinemoon/skyjo"
      class="uppercase text-xs flex place-items-center place-content-center border-4 border-slate-900 shadow shadow-slate-800 bg-slate-950 rounded-full px-6 py-2 transition-all hover:scale-105">
      See Github repository
    </a>
  </div>
</template>
