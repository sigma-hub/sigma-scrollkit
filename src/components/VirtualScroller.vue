<script setup lang="ts">
import uniqueId from '@/utils/uniqueId';
import {ref, computed, nextTick, watch, onMounted, onBeforeUnmount} from 'vue';
import type {Ref} from 'vue';

type ElementResizeCallback = (entry: ResizeObserverEntry) => void;

interface VirtualEntryItem {
  [key: string]: unknown;
}

export interface VirtualEntry {
  id: number | string;
  type: string;
  height: number;
  rowGap: number;
  columnGap: number;
  items: VirtualEntryItem[];
  [key: string]: unknown;
}

interface ScrollEmitValue {
  event: UIEvent;
  scrollOffsetY: number;
  scrollDelta: number;
  scrollDirection: 'up' | 'down';
  scrollSpeed: number;
}

interface Props {
  virtualEntries: VirtualEntry[];
  scrollerId: string;
  layoutType: 'list' | 'grid';
  minColumnWidth?: number;
  bufferItemCount?: number;
  calcExtraInfo?: boolean;
}

interface Emits {
  (event: 'viewport-mounted', value: {viewport: Ref<HTMLElement | null>; selector: string}): void;
  (event: 'scroll', value: ScrollEmitValue): void;
  (event: 'scrolling', value: boolean): void;
  (event: 'is-scrollable', value: boolean): void;
  (event: 'top-reached', value: boolean): void;
  (event: 'bottom-reached', value: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  virtualEntries: () => ([]),
  layoutType: 'list',
  bufferItemCount: 2,
  minColumnWidth: 200,
  calcExtraInfo: false
});

const emit = defineEmits<Emits>();

defineExpose({scrollTop, scrollToItem, scrollToIndex});

const virtualScrollerSelector = ref<string>('');
const transformedVirtualEntries = ref<VirtualEntry[]>(props.virtualEntries);
const maxColumns = ref<number>(1);
const rootElementRef = ref<HTMLElement | null>(null);
const rootElementHeight = ref<number>(500);
const rootElementWidth = ref<number>(500);
const rootElementRenderedHeight = ref<number>(1000);
const itemHeights = ref<number[]>([]);
const renderedItemHeights = ref<number[]>([]);
const totalItemHeight = ref<number>(0);
const scrolling = ref<boolean>(false);
const scrollStopTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const scrollOffsetY = ref<number>(0);
const scrollPreviousOffsetY = ref<number>(0);
const scrollDirection = ref<'up' | 'down'>('down');
const scrollDelta = ref<number>(0);
const scrollSpeed = ref<number>(0);
const scrollSpeedHistorySize = ref<number>(10);
const scrollSpeedHistory = ref<number[]>([]);

onMounted(() => {
  init();
  window.addEventListener('resize', windowResizeHandler);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', windowResizeHandler);
});

const renderedItems = computed(() => (
  transformedVirtualEntries.value.slice(scrolledItemsCount.value, scrolledItemsCount.value + renderedItemsCount.value)
));

const isTopReached = computed(() => (
  scrollOffsetY.value === 0
));

const isBottomReached = computed(() => (
  Math.ceil(scrollOffsetY.value + rootElementHeight.value) >= totalItemHeight.value
));

const viewportOffsetY = computed(() => (
  itemHeights.value
    .slice(0, scrolledItemsCount.value)
    .reduce((accumulator, current) => accumulator + (current || 0), 0)
));

const virtualScrollerStyle = computed(() => ({
  height: `${totalItemHeight.value}px`
}));

const viewportStyle = computed(() => ({
  transform: `translateY(${viewportOffsetY.value}px)`
}));

const scrolledItemsCount = computed(() => {
  let itemHeightSum = 0;
  let counter = 0;
  itemHeights.value.forEach(height => {
    if (itemHeightSum <= scrollOffsetY.value) {
      itemHeightSum += height;
      counter += 1;
    }
  });
  return counter - 1;
});

const renderedItemsCount = computed(() => {
  let itemHeightSum = 0;
  let itemsNeededToFitRootContainer = 0;
  itemHeights.value.forEach(height => {
    if (itemHeightSum < rootElementHeight.value) {
      itemHeightSum += height;
      itemsNeededToFitRootContainer += 1;
    }
  });
  return itemsNeededToFitRootContainer + props.bufferItemCount;
});

watch(
  () => props.virtualEntries,
  () => {
    update();
    updateLazy();
    nextTick(() => {
      updateLazy();
    });
  },
  {
    deep: true,
    immediate: true
  }
);

watch(isTopReached, newValue => {
  emit('top-reached', newValue);
});

watch(isBottomReached, newValue => {
  emit('bottom-reached', newValue);
});

function init() {
  virtualScrollerSelector.value = `.sigma-scrollkit[scroller-index="${props.scrollerId}"]`;

  update();
  updateLazy();
  nextTick(() => {
    emit('viewport-mounted', {viewport: rootElementRef, selector: virtualScrollerSelector.value});
    initRootElementResizeObserver();
  });
}

function setVirtualScrollerSelector() {
  virtualScrollerSelector.value = `.sigma-scrollkit[scroller-index="${props.scrollerId}"]`;
}

function transformItems() {
  transformedVirtualEntries.value = entriesToRows();
}

function entriesToRows(): VirtualEntry[] {
  if (props.virtualEntries.length === 0) {
    return [];
  }

  let newRows: VirtualEntry[] = [];
  if (props.layoutType === 'grid') {
    maxColumns.value = Math.floor(rootElementWidth.value / props.minColumnWidth);
  } else {
    maxColumns.value = 1;
  }
  props.virtualEntries.forEach(row => {
    const newItems = chunkArray(row.items, maxColumns.value);
    newItems.forEach(chunk => {
      row.id = uniqueId();
      newRows.push({
        ...row,
        items: chunk
      });
    });
  });
  return newRows;
}

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  if (chunkSize <= 0) {
    chunkSize = 1;
  }

  const result: T[][] = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }

  return result;
}

function update () {
  if (!rootElementRef.value || transformedVirtualEntries.value.length === 0) {
    return;
  }

  scrollOffsetY.value = rootElementRef.value.scrollTop;

  nextTick(() => {
    setRenderedItemHeights();
  });
}

function updateLazy () {
  setVirtualScrollerSelector();
  setRootElementRenderedHeight();
  setRootElementHeight();
  transformItems();
  setItemHeights();
  emit('is-scrollable', isScrollable());
}

function initRootElementResizeObserver() {
  const element = getVirtualScrollerElement()?.parentElement;
  if (!element) {
    return;
  }
  observeRootElementResize(element, rootElementResizeHandler);
}

function observeRootElementResize(element: HTMLElement, callback: ElementResizeCallback) {
  const observer = new ResizeObserver(entries => {
    for (const entry of entries) {
      if (entry.target === element) {
        callback(entry);
      }
    }
  });
  observer.observe(element);
  return observer;
}

function rootElementResizeHandler() {
  update();
  updateLazy();
}

function windowResizeHandler() {
  update();
  updateLazy();
}

function isScrollable() {
  if (!rootElementRef.value) {
    return false;
  }
  return rootElementRef.value.scrollHeight > rootElementRef.value.clientHeight;
}

function scrollHandler (event: UIEvent) {
  handleScrollStart();
  handleScrollStop();
  setScrollStatus(rootElementRef.value);
  update();
  emit('scroll', {
    event: event satisfies UIEvent,
    scrollOffsetY: scrollOffsetY.value,
    scrollDelta: scrollDelta.value,
    scrollDirection: scrollDirection.value,
    scrollSpeed: scrollSpeed.value
  });
}

function handleScrollStart () {
  scrolling.value = true;
  emit('scrolling', true);
}

function handleScrollStop () {
  if (scrollStopTimeout.value) {
    clearTimeout(scrollStopTimeout.value);
  }
  scrollStopTimeout.value = setTimeout(() => {
    scrolling.value = false;
    emit('scrolling', false);
  }, 100);
}

function setScrollStatus (element: HTMLElement | null) {
  scrollPreviousOffsetY.value = scrollOffsetY.value;
  scrollOffsetY.value = element?.scrollTop || 0;
  scrollDelta.value = scrollOffsetY.value - scrollPreviousOffsetY.value;
  scrollDirection.value = scrollDelta.value > 0 ? 'down' : 'up';

  if (props.calcExtraInfo) {
    recordScrollSpeedHistory(scrollDelta.value);
    const speedSum = Math.abs((scrollSpeedHistory.value).reduce((accumulator, current) => accumulator + current, 0));
    scrollSpeed.value = speedSum / scrollSpeedHistory.value.length;
  }
}

function recordScrollSpeedHistory (_scrollSpeed: number) {
  if (scrollSpeedHistory.value.length > scrollSpeedHistorySize.value) {
    scrollSpeedHistory.value.splice(0, 1);
  }
  scrollSpeedHistory.value.push(_scrollSpeed);
}

function setRootElementHeight() {
  const virtualScrollerParentElement = getVirtualScrollerElement()?.parentElement satisfies HTMLElement | undefined | null;

  if (virtualScrollerParentElement) {
    rootElementHeight.value = virtualScrollerParentElement.offsetHeight;
    rootElementWidth.value = virtualScrollerParentElement.offsetWidth;
  }
}

function setRootElementRenderedHeight() {
  const virtualScrollerElement = getVirtualScrollerElement();

  if (virtualScrollerElement) {
    rootElementRenderedHeight.value = virtualScrollerElement.offsetHeight;
  }
}

function getVirtualScrollerElement() {
  return document.querySelector(virtualScrollerSelector.value) satisfies HTMLElement | null;
}

function setRenderedItemHeights() {
  renderedItemHeights.value = renderedItems.value.map(item => item.height + item.rowGap);
}

function setItemHeights () {
  itemHeights.value = transformedVirtualEntries.value.map(item => item.height + item.rowGap);
  totalItemHeight.value = itemHeights.value.reduce((accumulator, current) => accumulator + (current || 0), 0);
}

function scrollTop () {
  rootElementRef?.value?.scrollTo?.({top: 0, behavior: 'smooth'});
}

function scrollToItem(params: { key: string; value: unknown }) {
  const targetItemIndex = transformedVirtualEntries.value.findIndex(
    (virtualEntry: VirtualEntry) =>
      !!virtualEntry.items.find(
        (item: VirtualEntryItem) => item[params.key] === params.value
      )
  );
  if (targetItemIndex !== -1) {
    scrollToIndex(targetItemIndex);
  }
}

function scrollToIndex (index: number) {
  if (rootElementRef.value) {
    rootElementRef.value.scrollTop = getIndexOffsetY(index);
  }
}

function getIndexOffsetY (index: number) {
  return transformedVirtualEntries.value.slice(0, index).reduce((accumulator, current) => accumulator + (current.height + current.rowGap || 0), 0);
}

setVirtualScrollerSelector();
</script>

<template>
  <div
    ref="rootElementRef"
    class="sigma-scrollkit"
    :scroller-index="props.scrollerId"
    @scroll="scrollHandler"
  >
    <div
      class="sigma-scrollkit__viewport-container"
      :style="virtualScrollerStyle"
    >
      <div
        class="sigma-scrollkit__viewport"
        :style="viewportStyle"
      >
        <slot
          name="viewport"
          :rendered-items="renderedItems"
          :scrolling="scrolling"
          :max-columns="maxColumns"
        />
      </div>
    </div>
  </div>
</template>

<style>
.sigma-scrollkit {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>