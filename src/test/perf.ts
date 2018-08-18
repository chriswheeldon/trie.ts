import { performance, PerformanceObserver } from 'perf_hooks';
import * as fs from 'fs';
import * as readline from 'readline';
import * as assert from 'assert';
import { trie } from '../trie';

const words = []
const t = new trie<number>();

function perf(name: string, func: () => void)
{
  performance.mark('A');
  func();
  performance.mark('B');
  performance.measure(name, 'A', 'B');
}

function insert_all() {
  words.forEach((elem) => {
    t.insert(elem.key, elem.value);
  });
}

function contains_all() {
  words.forEach((elem) => {
    assert(t.contains(elem.key));
  });
}

function remove_all() {
  words.forEach((elem) => {
    t.remove(elem.key);
  });
}

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries()[0];
  console.log(`${entry.name}: ${entry.duration.toFixed(0)}ms`);
  performance.clearMarks();
});
obs.observe({ entryTypes: ['measure'] });

const rl = readline.createInterface({
  input: fs.createReadStream('src/test/words.txt')
});
rl.on('line', (word) => {
  words.push({ key: word, value: words.length })
});
rl.on('close', () => {
  console.log(`dictionary contains ${words.length} words`);
  perf('insert', insert_all);
  perf('contains', contains_all);
  perf('remove', remove_all);
})