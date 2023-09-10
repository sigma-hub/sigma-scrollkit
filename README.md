# Sigma ScrollKit

Advanced virtual scrolling module for Vue 3.

Originally created for the parent project: Sigma File Manager v2.

<img src="https://raw.githubusercontent.com/sigma-hub/sigma-scrollkit/main/.github/assets/main.png">

## Features

- Supports complex list view.
- Supports complex grid view.
- Programmatic control.
- Grid view generates automatically based on the specified min column width, and adapts to the viewport / window size.
- Supports arbitrary dynamic item height, row and column gaps.
- Allows to build complex virtual scrollers programmatically with spacers, dividers and item groups of different sizes.
- Supports custom scrollbars.
- Emits many useful events, including scroll statuses like `is-scrolling`, `bottom-reached`, etc.
- Scrollbar doesn't jitter when scrolling because the item height is known in advance.

## Supporters

<table>
  <tbody>
    <tr>
      <td>
        <a target="_blank" href="https://patreon.com/sigma_file_manager">
          Your logo here
        </a>
      </td>
    </tr>
  </tbody>
</table>

### Consider supporting my work

<table>
  <thead>
    <tr>
      <th>Platform</th>
      <th>Address</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Patreon (monthly, with rewards)
        <br>By joining, you will get all rewards of the related parent project: 
        <br><a target="_blank" href="https://github.com/aleksey-hoffman/sigma-file-manager">Sigma File Manager</a>
      </td>
      <td width="320px">
        <a target="_blank" href="https://patreon.com/sigma_file_manager">
          <img
            src="https://raw.githubusercontent.com/aleksey-hoffman/sigma-file-manager/main/.github/media/patreon_button.png"
            width="164px"
            style="box-shadow: 0px 6px 24px rgb(255, 66, 77, 0.2); margin: 16px 0"
          />
        </a>
      </td>
    </tr>
    <tr>
      <td>Buymeacoffee</td>
      <td width="320px">
        <a href="https://www.buymeacoffee.com/alekseyhoffman" target="_blank">
          <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" width="164px">
        </a>
      </td>
    </tr>
    <tr>
      <td>BTC</td>
      <td width="320px">
        <code>bc1qv5ujcuwjsk505qjhd3sptcf3xpvjktqjxj0wrc</code>
      </td>
    </tr>
    <tr>
      <td>USDT (Tron TRC-20)</td>
      <td width="320px">
        <code>TN3hFLmjY2eXR149yKMq1qZQotmZbTGV4a</code>
      </td>
    </tr>
  </tbody>
</table>

## Installation

```
npm install sigma-scrollkit
```

## Usage

The module renders a list of virtual rows (virtual entries) in both the `list` and `grid` views. The difference is that in `list` view the column count is always 1.


### [Demo playground](https://stackblitz.com/edit/sigma-scrollkit-demo)


### Interface

```ts
interface VirtualEntryItem {
  [key: string]: unknown;
}

export interface VirtualEntry {
  id: number | string;
  height: number;
  rowGap: number;
  columnGap: number;
  items: VirtualEntryItem[];
  [key: string]: unknown;
}

interface Props {
  virtualEntries: VirtualEntry[];
  scrollerId: string;
  layoutType: "list" | "grid";
  minColumnWidth?: number;
  bufferItemCount?: number;
  calcExtraInfo?: boolean;
  topOffsetTrigger?: number;
  bottomOffsetTrigger?: number;
}
```

### Template structure

```html
<script setup>
import {VirtualScroller, VirtualScrollerRow} from 'sigma-scrollkit'

// ...
</script>

<template>
  <VirtualScroller
    ref="virtualGridRef"
    layout-type="grid"
    :scroller-id="0"
    :virtual-entries="formattedDirEntries"
    :min-column-width="minColumnWidth"
    @viewport-mounted="onViewportMounted"
    @top-reached="onTopReached"
    @bottom-reached="onBottomReached"
    @is-scrollable="onIsScrollable"
  >
    <template #viewport="{ renderedItems, scrolling, maxColumns }">
      <VirtualScrollerRow
        v-for="virtualEntry in renderedItems"
        :key="virtualEntry.id"
        :virtual-entry="virtualEntry"
        :max-columns="maxColumns"
      >
        <Component
          :is="componentReference[virtualEntry.component]"
          v-for="(item, index) in virtualEntry.items"
          :key="index"
          :height="virtualEntry.height"
          :hover-enabled="!scrolling"
          :dir-entry="item"
          layout-type="grid"
          v-bind="'props' in item && item.props"
          :style="`height: ${virtualEntry.height}px`"
        />
      </VirtualScrollerRow>
    </template>
  </VirtualScroller>
</template>
```

## Components

The module exports 2 components:

- `VirtualScroller` - main container component, calculates all the logic and renders virtual list / grid.
- `VirtualScrollerRow` - component needed to wrap each row in the virtual container.

## API

### `VirtualScroller` props:

#### `virtualEntries`
- Required: `true`
- Type: `VirtualEntry[]`

#### `scrollerId`
- Required: `true`
- Type: `string`

#### `layoutType`
- Required: `true`
- Type: `'list' | 'grid'`

#### `minColumnWidth`
- Required: `false`
- Type: `number`

#### `bufferItemCount`
- Required: `false`
- Type: `number`

#### `calcExtraInfo`
- Required: `false`
- Type: `boolean`
- Description: if `true`, extra data properties will be calculated and emited in the `scroll` event:
  - `scrollSpeed`: current scroll speed

### `VirtualScroller` events:

#### `viewport-mounted` 
- Type: `{viewport: Ref<HTMLElement | null>; selector: string}`

#### `scroll` 
- Type: `ScrollEmitValue`

#### `scrolling` 
- Type: `boolean`

#### `is-scrollable` 
- Type: `boolean`

#### `top-reached` 
- Type: `boolean`

#### `bottom-reached` 
- Type: `boolean`

## `VirtualScrollerRow` props:

#### `virtualEntry`

- Required: `true`
- Type: `VirtualEntry`

#### `maxColumns`

- Required: `true`
- Type: `number`
