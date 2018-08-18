import { trie } from "../trie";
import * as assert from "assert";
import { describe, it } from "mocha";

describe("trie", () => {
  describe("contains", () => {
    it("should return false if empty string not found", () => {
      const t = new trie<number>();
      assert.equal(false, t.contains(""));
    });
    it("should return false if key not found", () => {
      const t = new trie<number>();
      assert.equal(false, t.contains("hello"));
    });
    it("should return false if prefix match", () => {
      const t = new trie<number>();
      t.insert("hello", 99);
      assert.equal(false, t.contains("hell"));
    });
    it("should return false if substring match", () => {
      const t = new trie<number>();
      t.insert("hello", 99);
      assert.equal(false, t.contains("hello,world"));
    });
    it("should return true if exact match", () => {
      const t = new trie<number>();
      t.insert("hello", 99);
      assert.equal(true, t.contains("hello"));
    });
  });

  describe("get", () => {
    it("should return null if key not found", () => {
      const t = new trie<number>();
      assert.equal(null, t.get("abc"));
    });
    it("should return value if key found", () => {
      const t = new trie<number>();
      t.insert("abc", 99);
      assert.equal(99, t.get("abc"));
    });
  });

  describe("insert", () => {
    it("should handle empty key", () => {
      const t = new trie<number>();
      t.insert("", 99);
      assert.equal(true, t.contains(""));
      assert.equal(99, t.get(""));
    });
    it("should handle common prefix", () => {
      const t = new trie<number>();
      t.insert("", 1);
      t.insert("abc", 2);
      t.insert("abcdef", 3);
      assert.equal(1, t.get(""));
      assert.equal(2, t.get("abc"));
      assert.equal(3, t.get("abcdef"));
    });
  });

  describe("remove", () => {
    it("should handle empty key", () => {
      const t = new trie<number>();
      t.insert("", 99);
      t.remove("");
      assert.equal(false, t.contains(""));
    });
    it("should handle common prefix", () => {
      const t = new trie<number>();
      t.insert("", 1);
      t.insert("abc", 2);
      t.insert("abcdef", 3);
      t.remove("abc");
      assert.equal(true, t.contains(""));
      assert.equal(false, t.contains("abc"));
      assert.equal(true, t.contains("abcdef"));
    });
  });
  describe("map", () => {
    it("should callback with correct keys and values", () => {
      let calls = 0;
      const t = new trie<number>();
      t.insert("", 0);
      t.insert("a", 1);
      t.insert("ab", 2);
      const keys = [];
      const values = t.map("", (key, value) => {
        calls += 1;
        keys.push(key);
        return value;
      });
      assert.equal(3, calls);
      assert.deepEqual(["","a","ab"], keys);
      assert.deepEqual([0,1,2], values);
    });
    it("should not callback if no matches", () => {
      let calls = 0;
      const t = new trie<number>();
      t.map("", (key, value) => {
        calls += 1;
      });
      assert.equal(0, calls);
    });
    it("should handle matching root node", () => {
      let calls = 0;
      const t = new trie<number>();
      t.insert("", 99);
      t.map("", (key, value) => {
        calls += 1;
        assert.equal(99, value);
      });
      assert.equal(1, calls);
    });
    it("should handle multiple matches", () => {
      const t = new trie<number>();
      t.insert("", 0);
      t.insert("a", 1);
      t.insert("ab", 2);
      t.insert("abc", 3);

      let calls = 0;
      const values = [];
      t.map("ab", (key, value) => {
        calls += 1;
        values.push(value);
      });
      assert.equal(2, calls);
      assert.deepEqual([2,3], values);
    });
    it("should handle multiple forks", () => {
      const t = new trie<number>();
      t.insert("", 0);
      t.insert("a", 1);
      t.insert("ab", 2);
      t.insert("ae", 3);
      t.insert("abc", 4);
      t.insert("abd", 5);

      let calls = 0;
      const values = [];
      t.map("", (key, value) => {
        calls += 1;
        values.push(value);
      });
      assert.equal(6, calls);
      assert.deepEqual([0,1,2,3,4,5], values.sort());
    });
    it("should handle remove during iteration", () => {
      const t = new trie<number>();
      t.insert("", 0);
      t.insert("a", 1);
      t.insert("ab", 2);
      t.insert("abc", 3);

      let calls = 0;
      const values = [];
      t.map("", (key, value) => {
        t.remove("ab");
        calls += 1;
        values.push(value);
      });
      assert.equal(3, calls);
      assert.deepEqual([0,1,3], values);
    });
  });
});
