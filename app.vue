<template>
  <div>
    <h1>User</h1>
    <p>name: {{ user?.name }}</p>
    <p>id: {{ user?.id }}</p>
    <p>secret: {{ user?.secret }}</p>
  </div>
  <NuxtPage />
</template>

<script lang="ts" setup>

const user = useUser()

</script>
