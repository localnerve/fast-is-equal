import { describe, it } from 'node:test';
import assert from 'node:assert';
import { fastIsEqual } from '../index.ts';

describe('fastIsEqual', () => {
  describe('Primitive Types', () => {
    describe('Basic primitives', () => {
      it('should return true for identical primitives', () => {
        assert.strictEqual(fastIsEqual(1, 1), true);
        assert.strictEqual(fastIsEqual('a', 'a'), true);
        assert.strictEqual(fastIsEqual(true, true), true);
      });

      it('should return false for different primitives', () => {
        assert.strictEqual(fastIsEqual(1, 2), false);
        assert.strictEqual(fastIsEqual('a', 'b'), false);
        assert.strictEqual(fastIsEqual(true, false), false);
      });

      it('should return false for different types', () => {
        assert.strictEqual(fastIsEqual(1, '1'), false);
        assert.strictEqual(fastIsEqual({}, []), false);
        assert.strictEqual(fastIsEqual(new Map(), new Set()), false);
      });

      it('should handle number comparison with non-number efficiently', () => {
        assert.strictEqual(fastIsEqual(42, '42'), false);
        assert.strictEqual(fastIsEqual(NaN, 'NaN'), false);
      });

      it('should efficiently handle primitive type mismatches', () => {
        assert.strictEqual(fastIsEqual('string', true), false);
        assert.strictEqual(fastIsEqual(true, 42), false);
        assert.strictEqual(fastIsEqual(() => { }, 'function'), false);
      });
    });

    describe('Special numeric values', () => {
      it('should return true for NaN and NaN', () => {
        assert.strictEqual(fastIsEqual(NaN, NaN), true);
      });

      it('should handle -0 and +0', () => {
        assert.strictEqual(fastIsEqual(-0, +0), true);
      });

      it('should handle -0 === +0 correctly', () => {
        assert.strictEqual(fastIsEqual(-0, +0), true);
        assert.strictEqual(fastIsEqual(-0, 0), true);
      });

      it('should handle Infinity', () => {
        assert.strictEqual(fastIsEqual(Infinity, Infinity), true);
        assert.strictEqual(fastIsEqual(-Infinity, -Infinity), true);
        assert.strictEqual(fastIsEqual(Infinity, -Infinity), false);
      });
    });

    describe('Null and undefined', () => {
      it('should return true for null and null', () => {
        assert.strictEqual(fastIsEqual(null, null), true);
      });

      it('should return true for undefined and undefined', () => {
        assert.strictEqual(fastIsEqual(undefined, undefined), true);
      });

      it('should return false for null and undefined', () => {
        assert.strictEqual(fastIsEqual(null, undefined), false);
      });
    });

    describe('Symbols', () => {
      it('should return true for identical symbols', () => {
        const sym = Symbol('test');
        assert.strictEqual(fastIsEqual(sym, sym), true);
      });

      it('should return false for different symbols', () => {
        const sym1 = Symbol('test');
        const sym2 = Symbol('test');
        assert.strictEqual(fastIsEqual(sym1, sym2), false);
      });

      it('should handle objects with symbol properties', () => {
        const sym = Symbol('test');
        const obj1 = { [sym]: 'value' };
        const obj2 = { [sym]: 'value' };
        assert.strictEqual(fastIsEqual(obj1, obj2), true);
      });
    });

    describe('BigInt', () => {
      it('should handle BigInt values', () => {
        assert.strictEqual(fastIsEqual(BigInt(123), BigInt(123)), true);
        assert.strictEqual(fastIsEqual(BigInt(123), BigInt(124)), false);
        assert.strictEqual(fastIsEqual(BigInt(123), 123), false);
      });
    });
  });

  describe('Objects', () => {
    describe('Plain objects', () => {
      it('should return true for empty objects', () => {
        const obj1 = {};
        const obj2 = {};
        assert.strictEqual(fastIsEqual(obj1, obj2), true);
      });

      it('should return true for identical objects', () => {
        const obj = { a: 1, b: { c: 2 } };
        assert.strictEqual(fastIsEqual(obj, obj), true);
      });

      it('should return true for deeply equal objects', () => {
        const obj1 = { a: 1, b: { c: 2 } };
        const obj2 = { a: 1, b: { c: 2 } };
        assert.strictEqual(fastIsEqual(obj1, obj2), true);
      });

      it('should return false for objects with different keys', () => {
        const obj1 = { a: 1 };
        const obj2 = { b: 1 };
        assert.strictEqual(fastIsEqual(obj1, obj2), false);
      });

      it('should return false for objects with different numbers of keys', () => {
        const obj1 = { a: 1 };
        const obj2 = { a: 1, b: 2 };
        assert.strictEqual(fastIsEqual(obj1, obj2), false);
      });

      it('should return false for objects with different values', () => {
        const obj1 = { a: 1 };
        const obj2 = { a: 2 };
        assert.strictEqual(fastIsEqual(obj1, obj2), false);
      });

      it('should return true for objects with matching NaN values', () => {
        const obj1 = { a: NaN };
        const obj2 = { a: NaN };
        assert.strictEqual(fastIsEqual(obj1, obj2), true);
      });

      it('should handle objects with numeric string keys correctly', () => {
        const obj1 = { '0': 'a', '1': 'b', '2': 'c' };
        const obj2 = { '2': 'c', '0': 'a', '1': 'b' };
        assert.strictEqual(fastIsEqual(obj1, obj2), true);
      });

      it('should handle objects with exactly 8 properties', () => {
        const obj1 = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 };
        const obj2 = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 };
        assert.strictEqual(fastIsEqual(obj1, obj2), true);
      });

      it('should return false comparing object to a symbol', () => {
        const sym = Symbol('test');
        const obj = {};
        assert.strictEqual(fastIsEqual(obj, sym), false);
      });
    });

    describe('Objects with special prototypes', () => {
      it('should handle objects with null prototype', () => {
        const obj1 = Object.create(null);
        obj1.a = 1;
        const obj2 = Object.create(null);
        obj2.a = 1;
        assert.strictEqual(fastIsEqual(obj1, obj2), true);
      });

      it('should handle null prototype objects with symbols', () => {
        const sym = Symbol('test');
        const obj1 = Object.create(null);
        obj1[sym] = { nested: true };
        const obj2 = Object.create(null);
        obj2[sym] = { nested: true };
        assert.strictEqual(fastIsEqual(obj1, obj2), true);
      });
    });

    describe('Objects with symbol properties', () => {
      it('should handle empty objects with only symbol properties', () => {
        const sym = Symbol('test');
        const obj1 = { [sym]: 'value' };
        const obj2 = { [sym]: 'value' };
        assert.strictEqual(fastIsEqual(obj1, obj2), true);
      });

      it('should correctly handle objects with only non-enumerable symbol properties', () => {
        const sym1 = Symbol('test');
        const sym2 = Symbol('test2');

        const obj1 = {};
        Object.defineProperty(obj1, sym1, { value: 'a', enumerable: false });
        Object.defineProperty(obj1, sym2, { value: 'b', enumerable: false });

        const obj2 = {};
        Object.defineProperty(obj2, sym1, { value: 'a', enumerable: false });
        Object.defineProperty(obj2, sym2, { value: 'b', enumerable: false });

        assert.strictEqual(fastIsEqual(obj1, obj2), true);
      });
    });

    describe('Objects with property descriptors', () => {
      it('should handle non-enumerable properties', () => {
        const obj1 = {};
        Object.defineProperty(obj1, 'hidden', { value: 'secret', enumerable: false });
        const obj2 = {};
        Object.defineProperty(obj2, 'hidden', { value: 'secret', enumerable: false });
        assert.strictEqual(fastIsEqual(obj1, obj2), true);
      });
    });
  });

  describe('Arrays', () => {
    describe('Basic arrays', () => {
      it('should return true for identical arrays, same ref', () => {
        const arr = [1, 2, 3];
        assert.strictEqual(fastIsEqual(arr, arr), true);
      });

      it('should return true for identical arrays', () => {
        const arr1 = [1, 2, 3];
        const arr2 = [1, 2, 3];
        assert.strictEqual(fastIsEqual(arr1, arr2), true);
      });

      it('should return true for deeply equal arrays', () => {
        const arr1 = [1, [2, 3]];
        const arr2 = [1, [2, 3]];
        assert.strictEqual(fastIsEqual(arr1, arr2), true);
      });

      it('should return false for arrays with different lengths', () => {
        const arr1 = [1, 2];
        const arr2 = [1, 2, 3];
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('should return false for arrays with different elements', () => {
        const arr1 = [1, 2];
        const arr2 = [1, 3];
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('should return true for empty arrays', () => {
        const arr1 = new Array();
        const arr2 = new Array();
        assert.strictEqual(fastIsEqual(arr1, arr2), true);
      });
    });

    describe('Special cases small arrays', () => {
      it('should return true for two NaNs in a small array', () => {
        const arr1 = [1, 2, NaN, 3];
        const arr2 = [1, 2, NaN, 3];
        assert.strictEqual(fastIsEqual(arr1, arr2), true);
      });

      it('should return false for different symbols, different content', () => {
        const arr1 = [Symbol('one')];
        const arr2 = [Symbol('two')];
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('should return false for different symbols, same content', () => {
        const arr1 = [Symbol('one')];
        const arr2 = [Symbol('one')];
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('should return false if it contains mismatching nullish', () => {
        const arr1 = [1, 2, null, 3];
        const arr2 = [1, 2, undefined, 3];
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('should return true if it contains matching nullish', () => {
        const arr1 = [1, 2, undefined, 3];
        const arr2 = [1, 2, undefined, 3];
        const arr3 = [1, 2, null, 3];
        const arr4 = [1, 2, null, 3];
        assert.strictEqual(fastIsEqual(arr1, arr2), true);
        assert.strictEqual(fastIsEqual(arr3, arr4), true);
      });

      it('should return false if it contains mismatching types', () => {
        const arr1 = [1, 2, Symbol('test'), 3];
        const arr2 = [1, 2, {}, 3];
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('should return true for contained empty arrays', () => {
        const arr1 = [[]];
        const arr2 = [[]];
        assert.strictEqual(fastIsEqual(arr1, arr2), true);
      });
    });

    describe('Special cases arrays n > 8', () => {
      it('should return false if it contains mismatching nullish', () => {
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, null, 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, undefined, 10];
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('should return true if it contains matching nullish', () => {
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, undefined, 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, undefined, 10];
        const arr3 = [1, 2, 3, 4, 5, 6, 7, 8, null, 10];
        const arr4 = [1, 2, 3, 4, 5, 6, 7, 8, null, 10];
        assert.strictEqual(fastIsEqual(arr1, arr2), true);
        assert.strictEqual(fastIsEqual(arr3, arr4), true);
      });

      it('should return false if it contains mismatching types', () => {
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, Symbol('test'), 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, {}, 10];
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('should return false for contained array length mismatch', () => {
        const arr1 = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]];
        const arr2 = [[1, 2, 3, 4, 5, 6, 7, 8, 9]];
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('shoulld return true for matching contained sparse arrays', () => {
        const arr1 = [[1, , 3, , 5, , 7, , 9, , 11, , 13, , 15]];
        const arr2 = [[1, , 3, , 5, , 7, , 9, , 11, , 13, , 15]];
        assert.strictEqual(fastIsEqual(arr1, arr2), true);
      });

      it('shoulld return false for different contained sparse arrays', () => {
        const arr1 = [[1, , 3, , 5, , 7, , 9, , 11, , 13, , 15]];
        const arr2 = [[1, , 3, , 5, , 7, , 9, , 11, 12, 13, , 15]];
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('should return true for two NaNs', () => {
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, NaN, 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, NaN, 10];
        assert.strictEqual(fastIsEqual(arr1, arr2), true);
      });

      it('should return false for different symbols, different content', () => {
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, Symbol('one'), 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, Symbol('two'), 10];
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('should return true for matching dates', () => {
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, new Date('2023-01-01'), 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, new Date('2023-01-01'), 10];
        assert.strictEqual(fastIsEqual(arr1, arr2), true);
      });

      it('should return false for different dates', () => {
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, new Date('2023-01-01'), 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, new Date('2023-01-02'), 10];
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('should return true for matching regular expressions', () => {
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, /^[\d]+$/, 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, /^[\d]+$/, 10];
        assert.strictEqual(fastIsEqual(arr1, arr2), true);
      });

      it('should return false for different regular expressions', () => {
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, /^[\d]+$/, 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, /^[\d]*$/, 10];
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('should return false for objects with different symbol keys, different descriptions', () => {
        const symb1 = Symbol('one');
        const symb2 = Symbol('two');
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, { [symb1]: 'one' }, 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, { [symb2]: 'two' }, 10];
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('should return false for objects with different symbol keys, same descriptions', () => {
        const symb1 = Symbol('one');
        const symb2 = Symbol('one');
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, { [symb1]: 'one' }, 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, { [symb2]: 'one' }, 10];
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('should return true for objects with the same symbol properties', () => {
        const symb1 = Symbol('one');
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, { [symb1]: 'one' }, 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, { [symb1]: 'one' }, 10];
        assert.strictEqual(fastIsEqual(arr1, arr2), true);
      });

      it('should return false for objects with the mismatching symbol properties', () => {
        const symb1 = Symbol('one');
        const symb2 = Symbol('one');
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, { [symb1]: 'one' }, 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, { [symb1]: 'one', [symb2]: 'two' }, 10];
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('should return true for objects with the same symbol properties, same content, and other props', () => {
        const symb1 = Symbol('one');
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, { [symb1]: 'one', hello: 'world' }, 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, { [symb1]: 'one', hello: 'world' }, 10];
        assert.strictEqual(fastIsEqual(arr1, arr2), true);
      });

      it('should return false for objects with different symbol properties and matching other props', () => {
        const symb1 = Symbol('one');
        const symb2 = Symbol('one');
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, { hello: 'world', [symb1]: 'one' }, 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, { hello: 'world', [symb2]: 'one' }, 10];
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('should return false for objects with same symbol properties, but too many, matching other props', () => {
        const symb1 = Symbol('one');
        const symb2 = Symbol('one');
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, { hello: 'world', [symb1]: 'one' }, 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, { hello: 'world', [symb1]: 'one', [symb2]: 'one' }, 10];
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });
    });

    describe('Arrays with objects', () => {
      it('should return true with equal objects', () => {
        const arr1 = [1, 2, { one: 'two' }, 3];
        const arr2 = [1, 2, { one: 'two' }, 3];
        assert.strictEqual(fastIsEqual(arr1, arr2), true);
      });

      it('should return false with equal objects but different other values', () => {
        const arr1 = [1, 2, { one: 'two' }, 3];
        const arr2 = [1, 2, { one: 'two' }, 4];
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('should return false with different objects', () => {
        const arr1 = [1, 2, { one: 'two' }, 3];
        const arr2 = [1, 2, { one: 'three' }, 3];
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('should return true with equal objects at the end', () => {
        const arr1 = [1, 2, { one: 'two' }, 3, { four: 'five' }];
        const arr2 = [1, 2, { one: 'two' }, 3, { four: 'five' }];
        assert.strictEqual(fastIsEqual(arr1, arr2), true);
      });

      it('should return false with different objects at the end', () => {
        const arr1 = [1, 2, { one: 'two' }, 3, { four: 'five' }];
        const arr2 = [1, 2, { one: 'two' }, 3, { four: 'six' }];
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });
    });

    describe('Array optimization boundaries', () => {
      it('should handle arrays of exactly 8 elements (boundary case)', () => {
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8];
        assert.strictEqual(fastIsEqual(arr1, arr2), true);
      });

      it('should early exit on first few elements difference in large arrays', () => {
        const arr1 = new Array(1000).fill(1);
        const arr2 = new Array(1000).fill(1);
        arr2[2] = 2;
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });
    });

    describe('Sparse arrays', () => {
      it('should handle sparse arrays correctly', () => {
        const arr1 = [1, , 3]; // sparse array with hole
        const arr2 = [1, undefined, 3];
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('should handle sparse arrays in small array optimization path', () => {
        const arr1 = [1, , 3, , 5];
        const arr2 = [1, , 3, , 5];
        assert.strictEqual(fastIsEqual(arr1, arr2), true);
      });
    });

    describe('Arrays with circular references', () => {
      it('should handle arrays with circular references', () => {
        const arr1: any = [1, 2];
        const arr2: any = [1, 2];
        arr1.push(arr1);
        arr2.push(arr2);
        assert.strictEqual(fastIsEqual(arr1, arr2), true);
      });

      it('should handle deeply nested circular references', () => {
        const arr1: any = [1, { a: [] }];
        arr1[1].a.push(arr1);
        arr1.push(arr1[1]);

        const arr2: any = [1, { a: [] }];
        arr2[1].a.push(arr2);
        arr2.push(arr2[1]);

        assert.strictEqual(fastIsEqual(arr1, arr2), true);
      });
    });
  });

  describe('Built-in Objects', () => {
    describe('Date objects', () => {
      it('should return true for identical dates', () => {
        const date = new Date();
        assert.strictEqual(fastIsEqual(date, date), true);
      });

      it('should return true for dates with the same timestamp', () => {
        const date1 = new Date('2023-01-01');
        const date2 = new Date('2023-01-01');
        assert.strictEqual(fastIsEqual(date1, date2), true);
      });

      it('should return false for dates with different timestamps', () => {
        const date1 = new Date('2023-01-01');
        const date2 = new Date('2023-01-02');
        assert.strictEqual(fastIsEqual(date1, date2), false);
      });
    });

    describe('RegExp objects', () => {
      it('should return true for identical regexes', () => {
        const regex = /a/g;
        assert.strictEqual(fastIsEqual(regex, regex), true);
      });

      it('should return true for regexes with the same pattern and flags', () => {
        const regex1 = /a/g;
        const regex2 = /a/g;
        assert.strictEqual(fastIsEqual(regex1, regex2), true);
      });

      it('should return false for regexes with different patterns', () => {
        const regex1 = /a/g;
        const regex2 = /b/g;
        assert.strictEqual(fastIsEqual(regex1, regex2), false);
      });

      it('should return false for regexes with different flags', () => {
        const regex1 = /a/g;
        const regex2 = /a/i;
        assert.strictEqual(fastIsEqual(regex1, regex2), false);
      });
    });

    describe('Error objects', () => {
      it('should return true for identical Error instances', () => {
        const err = new Error('test');
        assert.strictEqual(fastIsEqual(err, err), true);
      });

      it('should return false for different Error instances with same message', () => {
        const err1 = new Error('test');
        const err2 = new Error('test');
        assert.strictEqual(fastIsEqual(err1, err2), false);
      });
    });

    describe('Promise objects', () => {
      it('should return false for different promises', () => {
        const p1 = Promise.resolve(1);
        const p2 = Promise.resolve(1);
        assert.strictEqual(fastIsEqual(p1, p2), false);
      });

      it('should handle promises with additional properties', () => {
        const p1 = Promise.resolve(1);
        const p2 = Promise.resolve(1);
        (p1 as any).customProp = 'test';
        (p2 as any).customProp = 'test';
        assert.strictEqual(fastIsEqual(p1, p2), false);
      });
    });

    describe('Function objects', () => {
      it('should return true for the same function reference', () => {
        const func = () => { };
        assert.strictEqual(fastIsEqual(func, func), true);
      });

      it('should return false for different functions', () => {
        const func1 = () => { };
        const func2 = () => { };
        assert.strictEqual(fastIsEqual(func1, func2), false);
      });

      it('should handle functions with properties', () => {
        const func1 = () => { };
        func1.customProp = 'value';
        const func2 = () => { };
        func2.customProp = 'value';
        assert.strictEqual(fastIsEqual(func1, func2), false);
      });
    });
  });

  describe('Collections', () => {
    describe('Map objects', () => {
      it('should return true for identical maps', () => {
        const map = new Map([['a', 1]]);
        assert.strictEqual(fastIsEqual(map, map), true);
      });

      it('should return true for maps with the same key-value pairs', () => {
        const map1 = new Map([['a', 1]]);
        const map2 = new Map([['a', 1]]);
        assert.strictEqual(fastIsEqual(map1, map2), true);
      });

      it('should return false for maps with different key-value pairs', () => {
        const map1 = new Map([['a', 1]]);
        const map2 = new Map([['a', 2]]);
        assert.strictEqual(fastIsEqual(map1, map2), false);
      });

      it('should return false for maps with different sizes', () => {
        const map1 = new Map([['a', 1]]);
        const map2 = new Map([['a', 1], ['b', 2]]);
        assert.strictEqual(fastIsEqual(map1, map2), false);
      });

      it('should handle empty maps', () => {
        assert.strictEqual(fastIsEqual(new Map(), new Map()), true);
      });

      it('should handle maps with object keys', () => {
        const key1 = { id: 1 };
        const key2 = { id: 1 };
        const map1 = new Map([[key1, 'value']]);
        const map2 = new Map([[key2, 'value']]);
        assert.strictEqual(fastIsEqual(map1, map2), true);
      });

      it('should handle maps with NaN keys', () => {
        const map1 = new Map([[NaN, 'value']]);
        const map2 = new Map([[NaN, 'value']]);
        assert.strictEqual(fastIsEqual(map1, map2), true);
      });

      it('should handle maps with undefined values', () => {
        const map1 = new Map([['key', undefined]]);
        const map2 = new Map([['key', undefined]]);
        assert.strictEqual(fastIsEqual(map1, map2), true);
      });

      it('should handle maps with circular references between keys and values', () => {
        const key1: any = { id: 1 };
        const value1 = { data: key1 };
        key1.ref = value1;

        const key2: any = { id: 1 };
        const value2 = { data: key2 };
        key2.ref = value2;

        const map1 = new Map([[key1, value1]]);
        const map2 = new Map([[key2, value2]]);

        assert.strictEqual(fastIsEqual(map1, map2), true);
      });

      it('should return false for maps with completely disperate objects, primitive keys', () => {
        const map1 = new Map([['one', { name: 'test' }]]);
        const map2 = new Map([['two', { last: 12 }]]);
        assert.strictEqual(fastIsEqual(map1, map2), false);
      });

      it ('should return true for maps with matching objects, primitive keys', () => {
        const map1 = new Map([['one', { name: 'test' }]]);
        const map2 = new Map([['one', { name: 'test' }]]);
        assert.strictEqual(fastIsEqual(map1, map2), true);
      });

      it('should return false for maps with completely disperate objects, object keys', () => {
        const map1 = new Map([[{ key: 'one' }, { name: 'test' }]]);
        const map2 = new Map([[{ key: 'two' }, { last: 12 }]]);
        assert.strictEqual(fastIsEqual(map1, map2), false);
      });

      it('should return true for maps with matching objects, object keys', () => {
        const map1 = new Map([[{ key: 'one' }, { name: 'test' }]]);
        const map2 = new Map([[{ key: 'one' }, { name: 'test' }]]);
        assert.strictEqual(fastIsEqual(map1, map2), true);
      });
    });

    describe('Set objects', () => {
      it('should return true for identical sets', () => {
        const set = new Set<number>([1, 2]);
        assert.strictEqual(fastIsEqual(set, set), true);
      });

      it('should return true for sets with the same elements', () => {
        const set1 = new Set<number>([1, 2]);
        const set2 = new Set<number>([1, 2]);
        assert.strictEqual(fastIsEqual(set1, set2), true);
      });

      it('should return false for sets with different elements', () => {
        const set1 = new Set<number>([1, 2]);
        const set2 = new Set<number>([1, 3]);
        assert.strictEqual(fastIsEqual(set1, set2), false);
      });

      it('should return false for sets with different sizes', () => {
        const set1 = new Set<number>([1, 2]);
        const set2 = new Set<number>([1]);
        assert.strictEqual(fastIsEqual(set1, set2), false);
      });

      it('should return true for sets with equal objects', () => {
        const obj1 = { a: 1 };
        const obj2 = { a: 1 };
        const set1 = new Set([obj1]);
        const set2 = new Set([obj2]);
        assert.strictEqual(fastIsEqual(set1, set2), true);
      });

      it('should handle sets with nested structures', () => {
        const set1 = new Set([{ a: { b: 1 } }, [1, 2]]);
        const set2 = new Set([[1, 2], { a: { b: 1 } }]);
        assert.strictEqual(fastIsEqual(set1, set2), true);
      });

      it('should handle sets with mixed primitive and complex values', () => {
        const obj1 = { a: 1 };
        const obj2 = { a: 1 };
        const set1 = new Set([1, 'hello', obj1, true]);
        const set2 = new Set([true, obj2, 1, 'hello']);
        assert.strictEqual(fastIsEqual(set1, set2), true);
      });

      it('should handle sets where >70% are primitives (optimization path)', () => {
        const set1 = new Set([1, 2, 3, 4, 5, 6, 7, { a: 1 }, { b: 2 }]);
        const set2 = new Set([7, 6, 5, 4, 3, 2, 1, { b: 2 }, { a: 1 }]);
        assert.strictEqual(fastIsEqual(set1, set2), true);
      });

      it('should handle sets with duplicate-looking but different objects', () => {
        const obj1a = { x: { y: 1 } };
        const obj1b = { x: { y: 1 } };
        const obj2a = { x: { y: 1 } };
        const obj2b = { x: { y: 1 } };

        const set1 = new Set([obj1a, obj1b]);
        const set2 = new Set([obj2a, obj2b]);

        assert.strictEqual(fastIsEqual(set1, set2), true);
      });

      it('should handle sets containing self-referential objects', () => {
        const obj1: any = { name: 'test' };
        obj1.self = obj1;
        const obj2: any = { name: 'test' };
        obj2.self = obj2;

        const set1 = new Set([obj1, 'primitive']);
        const set2 = new Set(['primitive', obj2]);

        assert.strictEqual(fastIsEqual(set1, set2), true);
      });

      it('should handle sets with many similar objects efficiently', () => {
        const createObj = (n: number) => ({ a: 1, b: 2, c: 3, id: n });
        const set1 = new Set(Array.from({ length: 100 }, (_, i) => createObj(i)));
        const set2 = new Set(Array.from({ length: 100 }, (_, i) => createObj(i)));

        assert.strictEqual(fastIsEqual(set1, set2), true);
      });

      it('should return false for one empty set', () => {
        const set1 = new Set();
        const set2 = new Set<number>([1, 2, 3]);
        assert.strictEqual(fastIsEqual(set1, set2), false);
      });

      it('should return true for matching empty sets', () => {
        const set1 = new Set();
        const set2 = new Set();
        assert.strictEqual(fastIsEqual(set1, set2), true);
      });

      it('should handle sets of completely disperate objects', () => {
        const set1 = new Set([{ name: 'test' }]);
        const set2 = new Set([{ last: 12 }]);
        assert.strictEqual(fastIsEqual(set1, set2), false);
      });
    });
  });

  describe('Binary Data Types', () => {
    describe('ArrayBuffer', () => {
      it('should return true for empty ArrayBuffers', () => {
        const buffer1 = new ArrayBuffer();
        const buffer2 = new ArrayBuffer();
        assert.strictEqual(fastIsEqual(buffer1, buffer2), true);
      });

      it('should return false for ArrayBuffers of different lengths', () => {
        const buffer1 = new ArrayBuffer(4);
        const buffer2 = new ArrayBuffer(3);
        assert.strictEqual(fastIsEqual(buffer1, buffer2), false);
      });

      it('should return false for different TypedArray views', () => {
        const arr1 = new Uint8Array([1, 2, 3]);
        const arr2 = new Uint16Array([1, 2, 3]);
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('should return false for different array buffers', () => {
        const arr1 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        const arr2 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, -11, -12]);
        assert.strictEqual(fastIsEqual(arr1.buffer, arr2.buffer), false);
      });

      it('should return false for different larger array buffers', () => {
        const arr1 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
        const arr2 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, -16, 17]);
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('should return false for different larger array buffers > 16', () => {
        const arr1 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
        const arr2 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, -17]);
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('should return true for matching larger array buffers > 16', () => {
        const arr1 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
        const arr2 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
        assert.strictEqual(fastIsEqual(arr1, arr2), true);
      });

      it('should handle ArrayBuffer comparison', () => {
        const buffer1 = new ArrayBuffer(8);
        const buffer2 = new ArrayBuffer(8);
        new Uint8Array(buffer1).set([1, 2, 3, 4]);
        new Uint8Array(buffer2).set([1, 2, 3, 4]);
        assert.strictEqual(fastIsEqual(buffer1, buffer2), true);
      });

      it('should handle ArrayBuffer with non-4-byte-aligned size', () => {
        const buffer1 = new ArrayBuffer(33); // 8 * 4 + 1
        const buffer2 = new ArrayBuffer(33);
        new Uint8Array(buffer1).fill(42);
        new Uint8Array(buffer2).fill(42);
        assert.strictEqual(fastIsEqual(buffer1, buffer2), true);
      });

      it('should handle small ArrayBuffer (< 32 bytes)', () => {
        const buffer1 = new ArrayBuffer(16);
        const buffer2 = new ArrayBuffer(16);
        new Uint8Array(buffer1).set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        new Uint8Array(buffer2).set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        assert.strictEqual(fastIsEqual(buffer1, buffer2), true);
      });

      it('should handle ArrayBuffer of exactly 32 bytes', () => {
        const buffer1 = new ArrayBuffer(32);
        const buffer2 = new ArrayBuffer(32);
        const view1 = new Uint8Array(buffer1);
        const view2 = new Uint8Array(buffer2);

        for (let i = 0; i < 32; i++) {
          view1[i] = i;
          view2[i] = i;
        }

        assert.strictEqual(fastIsEqual(buffer1, buffer2), true);
      });

      it('should handle ArrayBuffer with different views correctly', () => {
        const buffer1 = new ArrayBuffer(8);
        const view1 = new DataView(buffer1);
        view1.setInt32(0, 42);
        view1.setInt32(4, 100);

        const buffer2 = new ArrayBuffer(8);
        const view2 = new DataView(buffer2);
        view2.setInt32(0, 42);
        view2.setInt32(4, 200);

        assert.strictEqual(fastIsEqual(buffer1, buffer2), false);
      });
    });

    describe('TypedArrays', () => {
      it('should return true for empty TypedArrays', () => {
        const arr1 = new Uint8Array([]);
        const arr2 = new Uint8Array([]);
        assert.strictEqual(fastIsEqual(arr1, arr2), true);
      });

      it('should return false for different TypedArray lengths', () => {
        const arr1 = new Uint8Array([1, 2, 3]);
        const arr2 = new Uint8Array([1, 2]);
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('should return true for identical TypedArrays', () => {
        const arr1 = new Uint8Array([1, 2, 3]);
        const arr2 = new Uint8Array([1, 2, 3]);
        assert.strictEqual(fastIsEqual(arr1, arr2), true);
      });

      it('should return false for TypedArrays with different values', () => {
        const arr1 = new Uint8Array([1, 2, 3]);
        const arr2 = new Uint8Array([1, 2, 4]);
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('should return false for different TypedArray types', () => {
        const arr1 = new Uint8Array([1, 2, 3]);
        const arr2 = new Int8Array([1, 2, 3]);
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('should return false for different TypedArray constructors with same values', () => {
        const arr1 = new Uint16Array([1, 2, 3]);
        const arr2 = new Uint32Array([1, 2, 3]);
        assert.strictEqual(fastIsEqual(arr1, arr2), false);
      });

      it('should handle typed arrays with length exactly 16', () => {
        const arr1 = new Float32Array(16).fill(3.14);
        const arr2 = new Float32Array(16).fill(3.14);
        assert.strictEqual(fastIsEqual(arr1, arr2), true);
      });

      it('should handle typed arrays with non-multiple-of-4 length', () => {
        const arr1 = new Int32Array([1, 2, 3, 4, 5, 6, 7]);
        const arr2 = new Int32Array([1, 2, 3, 4, 5, 6, 7]);
        assert.strictEqual(fastIsEqual(arr1, arr2), true);
      });

      it('should handle TypedArrays with different buffer offsets', () => {
        const buffer = new ArrayBuffer(16);
        const arr1 = new Uint8Array(buffer, 4, 4);
        const arr2 = new Uint8Array(buffer, 8, 4);
        arr1.set([1, 2, 3, 4]);
        arr2.set([1, 2, 3, 4]);
        assert.strictEqual(fastIsEqual(arr1, arr2), true);
      });
    });

    describe('DataView', () => {
      it('should handle DataView comparison', () => {
        const buffer1 = new ArrayBuffer(8);
        const view1 = new DataView(buffer1);
        view1.setInt32(0, 42);
        view1.setFloat32(4, 3.14);

        const buffer2 = new ArrayBuffer(8);
        const view2 = new DataView(buffer2);
        view2.setInt32(0, 42);
        view2.setFloat32(4, 3.14);

        assert.strictEqual(fastIsEqual(view1, view2), true);
      });

      it('should handle DataView with different values', () => {
        const view1 = new DataView(new ArrayBuffer(8));
        const view2 = new DataView(new ArrayBuffer(8));
        view1.setInt32(0, 42);
        view2.setInt32(0, 43);

        assert.strictEqual(fastIsEqual(view1, view2), false);
      });

      it('should handle DataView with different byte lengths', () => {
        const view1 = new DataView(new ArrayBuffer(8));
        const view2 = new DataView(new ArrayBuffer(16));

        assert.strictEqual(fastIsEqual(view1, view2), false);
      });
    });
  });

  describe('Circular References', () => {
    it('should return true for circular references', () => {
      const obj1: any = {};
      obj1.self = obj1;
      const obj2: any = {};
      obj2.self = obj2;
      assert.strictEqual(fastIsEqual(obj1, obj2), true);
    });

    it('should return false for different circular references', () => {
      const obj1: any = {};
      obj1.self = obj1;
      const obj2 = { self: {} };
      assert.strictEqual(fastIsEqual(obj1, obj2), false);
    });

    it('should handle mutual circular references', () => {
      const obj1: any = { a: {} };
      const obj2: any = { a: {} };
      obj1.a.b = obj1;
      obj2.a.b = obj2;
      assert.strictEqual(fastIsEqual(obj1, obj2), true);
    });

    it('should handle different circular reference structures', () => {
      const obj1: any = { a: { b: {} } };
      obj1.a.b.c = obj1.a;
      const obj2: any = { a: { b: {} } };
      obj2.a.b.c = obj2;
      assert.strictEqual(fastIsEqual(obj1, obj2), false);
    });
  });
});