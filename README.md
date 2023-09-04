# Sigma ScrollKit

Advanced virtual scrolling module for Vue 3.

Originally created for Sigma File Manager v2.

<img src="https://github.com/sigma-hub/sigma-scrollkit/blob/main/.github/assets/main.png">

## Features

- List view
- Grid view
- Arbitrary item height
- Spacers
- Dividers
- Support for custom scrollbars
- Events
- Slots

## Installation

```
npm install sigma-scrollkit
```

## VirtualScroller | Props

### `virtualEntries`
- Required: `true`
- Type: `VirtualEntry[]`

### `scrollerId`
- Required: `true`
- Type: `string`

### `layoutType`
- Required: `true`
- Type: `'list' | 'grid'`

### `minColumnWidth`
- Required: `false`
- Type: `number`

### `bufferItemCount`
- Required: `false`
- Type: `number`

### `calcExtraInfo`
- Required: `false`
- Type: `boolean`
- Description: if `true`, extra data properties will be calculated and emited in the `scroll` event:
  - `scrollSpeed`: current scroll speed

## VirtualScroller | Events

### `viewport-mounted` 
- Type: `{viewport: Ref<HTMLElement | null>; selector: string}`

### `scroll` 
- Type: `ScrollEmitValue`

### `scrolling` 
- Type: `boolean`

### `is-scrollable` 
- Type: `boolean`

### `top-reached` 
- Type: `boolean`

### `bottom-reached` 
- Type: `boolean`

## VirtualScrollerRow | Props

### `virtualEntry`

- Required: `true`
- Type: `VirtualEntry`

### `maxColumns`

- Required: `true`
- Type: `number`
