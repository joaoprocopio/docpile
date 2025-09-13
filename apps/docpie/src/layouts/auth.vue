<template>
    <div class="bg-auth">
        <slot />
    </div>
</template>

<style>
.bg-auth {
    @apply h-full;

    background: linear-gradient(
        in oklch to bottom,
        var(--color-gray-2) -24%,
        var(--color-background) 42%
    );
}
</style>
