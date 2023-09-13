import VirtualScroller from './components/VirtualScroller.vue';
import VirtualScrollerRow from './components/VirtualScrollerRow.vue';

import type {App} from 'vue';

export default {
  install: (app: App) => {
    app.component('VirtualScroller', VirtualScroller);
    app.component('VirtualScrollerRow', VirtualScrollerRow);
  }
};

export {
  VirtualScroller,
  VirtualScrollerRow
};