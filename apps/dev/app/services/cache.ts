type Node<K, V> = {
  key: K;
  value: V;
  prev?: Node<K, V>;
  next?: Node<K, V>;
};

export class LRUCache<K, V> {
  private capacity: number;
  private map: Map<K, Node<K, V>>;
  private head?: Node<K, V>;
  private tail?: Node<K, V>;

  constructor(capacity: number) {
    if (capacity <= 0) throw new Error("Capacity must be greater than 0");
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key: K): V | undefined {
    const node = this.map.get(key);
    if (!node) return undefined;
    this.moveToHead(node);
    return node.value;
  }

  put(key: K, value: V): void {
    let node = this.map.get(key);
    if (node) {
      node.value = value;
      this.moveToHead(node);
    } else {
      node = { key, value };
      this.map.set(key, node);
      this.addToHead(node);
      if (this.map.size > this.capacity) {
        this.removeLRU();
      }
    }
  }

  private moveToHead(node: Node<K, V>): void {
    if (node === this.head) return;
    this.removeNode(node);
    this.addToHead(node);
  }

  private addToHead(node: Node<K, V>): void {
    node.prev = undefined;
    node.next = this.head;
    if (this.head) this.head.prev = node;
    this.head = node;
    if (!this.tail) this.tail = node;
  }

  private removeNode(node: Node<K, V>): void {
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
    if (node === this.head) this.head = node.next;
    if (node === this.tail) this.tail = node.prev;
    node.prev = undefined;
    node.next = undefined;
  }

  private removeLRU(): void {
    if (!this.tail) return;
    this.map.delete(this.tail.key);
    this.removeNode(this.tail);
  }

  has(key: K): boolean {
    return this.map.has(key);
  }

  delete(key: K): boolean {
    const node = this.map.get(key);
    if (!node) return false;
    this.removeNode(node);
    return this.map.delete(key);
  }

  clear(): void {
    this.map.clear();
    this.head = undefined;
    this.tail = undefined;
  }

  get size(): number {
    return this.map.size;
  }
}

export type AppCache = {
  configId: string;
  images: string[];
  fieldData: object;
};

export const appCache = new LRUCache<string, AppCache>(100);
