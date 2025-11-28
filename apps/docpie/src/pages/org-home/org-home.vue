<script setup lang="ts">
import { Editor } from "~/lib/prosemirror/components/editor"
import { SidebarTrigger } from "~/lib/ui/sidebar"
</script>

<template>
    <div>
        <SidebarTrigger />
        <h1 class="font-bold">editor</h1>
        <Editor />
    </div>
</template>
