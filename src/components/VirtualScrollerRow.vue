<script setup lang="ts">
import type {VirtualEntry} from 'types/shared';

interface Props {
  virtualEntry: VirtualEntry;
  maxColumns: number;
}

const props = defineProps<Props>();
</script>

<template>
  <div
    class="sigma-scrollkit-row"
    :style="`
      --columns: ${props.virtualEntry.fullWidth ? 1 : props.maxColumns};
      --row-gap: ${props.virtualEntry.rowGap}px;
      --height: ${props.virtualEntry.height}px;
    `"
  >
    <slot />
  </div>
</template>

<style>
.sigma-scrollkit-row {
  display: grid;
  margin-bottom: var(--row-gap);
  gap: var(--row-gap);
  grid-auto-rows: var(--height);
  grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
}
</style>