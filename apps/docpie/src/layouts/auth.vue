<template>
    <div class="auth-layout-gradient h-full">
        <slot />
    </div>
</template>

<style lang="css">
/* from-gray-2 h-full bg-gradient-to-b from-0% to-transparent to-35% */

.auth-layout-gradient {
    background: linear-gradient(in oklch to bottom, var(--gray-2) 4%, var(--gray-1) 56%);
}
</style>
