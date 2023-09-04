# Sigma ScrollKit

Advanced virtual scrolling module for Vue 3.

Originally created for the parent project: Sigma File Manager v2.

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
