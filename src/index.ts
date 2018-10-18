class trie_node<T> {
  public terminal: boolean;
  public value: T;
  public children: Map<string, trie_node<T>>;

  constructor() {
    this.terminal = false;
    this.children = new Map();
  }
}

export class trie<T> {
  private root: trie_node<T>;
  private elements: number;

  constructor() {
    this.root = new trie_node<T>();
    this.elements = 0;
  }

  public get length(): number {
    return this.elements;
  }

  public get(key: string): T | null {
    const node = this.getNode(key);
    if (node) {
      return node.value;
    }
    return null;
  }

  public contains(key: string): boolean {
    const node = this.getNode(key);
    return !!node;
  }

  public insert(key: string, value: T): void {
    let node = this.root;
    let remaining = key;
    while (remaining.length > 0) {
      let child: trie_node<T> = null;
      for (const childKey of node.children.keys()) {
        const prefix = this.commonPrefix(remaining, childKey);
        if (!prefix.length) {
          continue;
        }
        if (prefix.length === childKey.length) {
          // enter child node
          child = node.children.get(childKey);
          remaining = remaining.slice(childKey.length);
          break;
        } else {
          // split the child
          child = new trie_node<T>();
          child.children.set(
            childKey.slice(prefix.length),
            node.children.get(childKey)
          );
          node.children.delete(childKey);
          node.children.set(prefix, child);
          remaining = remaining.slice(prefix.length);
          break;
        }
      }
      if (!child && remaining.length) {
        child = new trie_node<T>();
        node.children.set(remaining, child);
        remaining = "";
      }
      node = child;
    }
    if (!node.terminal) {
      node.terminal = true;
      this.elements += 1;
    }
    node.value = value;
  }

  public remove(key: string): void {
    const node = this.getNode(key);
    if (node) {
      node.terminal = false;
      this.elements -= 1;
    }
  }

  public map<U>(prefix: string, func: (key: string, value: T) => U): U[] {
    const mapped = [];
    const node = this.getNode(prefix);
    const stack: [string, trie_node<T>][] = [];
    if (node) {
      stack.push([prefix, node]);
    }
    while (stack.length) {
      const [key, node] = stack.pop();
      if (node.terminal) {
        mapped.push(func(key, node.value));
      }
      for (const c of node.children.keys()) {
        stack.push([key + c, node.children.get(c)]);
      }
    }
    return mapped;
  }

  private getNode(key: string): trie_node<T> | null {
    let node = this.root;
    let remaining = key;
    while (node && remaining.length > 0) {
      let child = null;
      for (let i = 1; i <= remaining.length; i += 1) {
        child = node.children.get(remaining.slice(0, i));
        if (child) {
          remaining = remaining.slice(i);
          break;
        }
      }
      node = child;
    }
    return remaining.length === 0 && node && node.terminal ? node : null;
  }

  private commonPrefix(a: string, b: string): string {
    const shortest = Math.min(a.length, b.length);
    let i = 0;
    for (; i < shortest; i += 1) {
      if (a[i] !== b[i]) {
        break;
      }
    }
    return a.slice(0, i);
  }
}
