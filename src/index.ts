class trie_node<T> {
  public terminal: boolean;
  public value: T;
  public children: { [key: string]: trie_node<T> };

  constructor() {
    this.terminal = false;
    this.children = {};
  }
}

export class trie<T> {
  private root: trie_node<T>;

  constructor() {
    this.root = new trie_node<T>();
  }

  public get(key: string): T | null {
    const node = this.get_node(key);
    if (node) {
      return node.value;
    }
    return null;
  }

  public contains(key: string): boolean {
    const node = this.get_node(key);
    return !!node;
  }

  public insert(key: string, value: T): void {
    let node = this.root;
    for (let i = 0; i < key.length; i += 1) {
      if (!node.children[key[i]]) {
        node.children[key[i]] = new trie_node<T>();
      }
      node = node.children[key[i]];
    }
    node.terminal = true;
    node.value = value;
  }

  public remove(key: string): void {
    const node = this.get_node(key);
    if (node) {
      node.terminal = false;
    }
  }

  public map(prefix: string, func: (key: string, value: T) => any): any[] {
    const mapped = [];
    const node = this.get_node(prefix);
    const stack: [string, trie_node<T>][] = [];
    if (node) {
      stack.push([prefix, node]);
    }
    while (stack.length) {
      const [key, node] = stack.pop();
      if (node.terminal) {
        mapped.push(func(key, node.value));
      }
      for (const c in node.children) {
        stack.push([key + c, node.children[c]]);
      }
    }
    return mapped;
  }

  private get_node(key: string): trie_node<T> | null {
    let node = this.root;
    for (let i = 0; i < key.length; i += 1) {
      node = node.children[key[i]];
      if (!node) {
        break;
      }
    }
    return !!node && node.terminal ? node : null;
  }
}
