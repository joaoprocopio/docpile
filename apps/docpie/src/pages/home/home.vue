<script setup lang="ts">
import { Editor } from "~/lib/codex/components/editor"
import { Button } from "~/lib/ui/components/button"
import { testRouteName } from "~/pages/test"
</script>

<template>
    <div>
        <h1 class="font-bold">editor</h1>
        <NuxtLink :to="{ name: testRouteName }">vai pra test</NuxtLink>
        <Button>TESTE</Button>
        <Editor />
    </div>
</template>
