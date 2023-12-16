export interface VirtualEntryItem {
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