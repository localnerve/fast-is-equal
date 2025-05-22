# fast-is-equal

> A fork of JairajJangle/fast-is-equal that works with modern bundlers without plugins (full ESNext)

Blazing-fast equality checks, minus the baggage. A lean, standalone alternative to Lodash’s `isEqual` - because speed matters.

![](https://img.shields.io/npm/v/@localnerve/fast-is-equal/latest.svg)
![](https://github.com/localnerve/fast-is-equal/workflows/Verify/badge.svg)
![](https://img.shields.io/npm/dt/@localnerve/fast-is-equal.svg)
![](https://img.shields.io/npm/l/@localnerve/fast-is-equal.svg)


## Installation

Using npm:

```bash
npm install fast-is-equal
```

## Usage
```typescript
import { fastIsEqual } from 'fast-is-equal';

console.log(fastIsEqual(1, 1)); // true
console.log(fastIsEqual({ a: 1 }, { a: 1 })); // true
console.log(fastIsEqual([1, 2], [1, 3])); // false
```

## Features
- Lightweight and dependency-free.
- Handles primitives, objects, arrays, Maps, Sets, circular references, and more.
- Optimized for performance (see benchmarks).

## Benchmarks
`fast-is-equal` outperforms Lodash’s `isEqual` in most cases. Run `npm run benchmark` locally to compare:
```bash
Performance Comparison: fastIsEqual vs Lodash isEqual
Iterations per test case: 1000000
----------------------------------------
Test Case 1: Numbers
  fastIsEqual: 0.000002 ms
  Lodash isEqual: 0.000005 ms
  Difference (fastIsEqual - Lodash): -0.000002 ms
  fastIsEqual is 2.07x faster than Lodash
----------------------------------------
Test Case 2: Strings
  fastIsEqual: 0.000004 ms
  Lodash isEqual: 0.000005 ms
  Difference (fastIsEqual - Lodash): -0.000000 ms
  fastIsEqual is 1.06x faster than Lodash
----------------------------------------
Test Case 3: Booleans
  fastIsEqual: 0.000004 ms
  Lodash isEqual: 0.000004 ms
  Difference (fastIsEqual - Lodash): 0.000000 ms
  fastIsEqual is 0.95x faster than Lodash
----------------------------------------
Test Case 4: NaN
  fastIsEqual: 0.000005 ms
  Lodash isEqual: 0.000010 ms
  Difference (fastIsEqual - Lodash): -0.000005 ms
  fastIsEqual is 1.98x faster than Lodash
----------------------------------------
Test Case 5: Simple Object (equal)
  fastIsEqual: 0.000084 ms
  Lodash isEqual: 0.000234 ms
  Difference (fastIsEqual - Lodash): -0.000150 ms
  fastIsEqual is 2.79x faster than Lodash
----------------------------------------
Test Case 6: Simple Object (unequal)
  fastIsEqual: 0.000094 ms
  Lodash isEqual: 0.000237 ms
  Difference (fastIsEqual - Lodash): -0.000142 ms
  fastIsEqual is 2.51x faster than Lodash
----------------------------------------
Test Case 7: Nested Object (equal)
  fastIsEqual: 0.000159 ms
  Lodash isEqual: 0.000755 ms
  Difference (fastIsEqual - Lodash): -0.000596 ms
  fastIsEqual is 4.75x faster than Lodash
----------------------------------------
Test Case 8: Nested Object (unequal)
  fastIsEqual: 0.000167 ms
  Lodash isEqual: 0.000743 ms
  Difference (fastIsEqual - Lodash): -0.000576 ms
  fastIsEqual is 4.46x faster than Lodash
----------------------------------------
Test Case 9: Array of Primitives (equal)
  fastIsEqual: 0.000014 ms
  Lodash isEqual: 0.000087 ms
  Difference (fastIsEqual - Lodash): -0.000073 ms
  fastIsEqual is 6.05x faster than Lodash
----------------------------------------
Test Case 10: Array of Primitives (unequal)
  fastIsEqual: 0.000013 ms
  Lodash isEqual: 0.000094 ms
  Difference (fastIsEqual - Lodash): -0.000081 ms
  fastIsEqual is 7.37x faster than Lodash
----------------------------------------
Test Case 11: Array of Objects (equal)
  fastIsEqual: 0.000071 ms
  Lodash isEqual: 0.000563 ms
  Difference (fastIsEqual - Lodash): -0.000492 ms
  fastIsEqual is 7.95x faster than Lodash
----------------------------------------
Test Case 12: Circular Reference
  fastIsEqual: 0.000083 ms
  Lodash isEqual: 0.000451 ms
  Difference (fastIsEqual - Lodash): -0.000369 ms
  fastIsEqual is 5.46x faster than Lodash
----------------------------------------
Test Case 13: Map (equal)
  fastIsEqual: 0.000067 ms
  Lodash isEqual: 0.001185 ms
  Difference (fastIsEqual - Lodash): -0.001117 ms
  fastIsEqual is 17.58x faster than Lodash
----------------------------------------
Test Case 14: Map (unequal)
  fastIsEqual: 0.000061 ms
  Lodash isEqual: 0.001097 ms
  Difference (fastIsEqual - Lodash): -0.001036 ms
  fastIsEqual is 17.99x faster than Lodash
----------------------------------------
Test Case 15: Set (equal)
  fastIsEqual: 0.000062 ms
  Lodash isEqual: 0.000770 ms
  Difference (fastIsEqual - Lodash): -0.000708 ms
  fastIsEqual is 12.43x faster than Lodash
----------------------------------------
Test Case 16: Set (unequal)
  fastIsEqual: 0.000061 ms
  Lodash isEqual: 0.000758 ms
  Difference (fastIsEqual - Lodash): -0.000697 ms
  fastIsEqual is 12.39x faster than Lodash
----------------------------------------
Test Case 17: Empty Object vs Array
  fastIsEqual: 0.000008 ms
  Lodash isEqual: 0.000030 ms
  Difference (fastIsEqual - Lodash): -0.000021 ms
  fastIsEqual is 3.53x faster than Lodash
----------------------------------------
Test Case 18: Map vs Set
  fastIsEqual: 0.000017 ms
  Lodash isEqual: 0.000401 ms
  Difference (fastIsEqual - Lodash): -0.000384 ms
  fastIsEqual is 23.69x faster than Lodash
----------------------------------------
Average Performance:
  fastIsEqual: 0.000054 ms
  Lodash isEqual: 0.000413 ms
  fastIsEqual is on average 7.60x faster than Lodash
```

## License
MIT
```
MIT License

Copyright (c) 2025 Jairaj Jangle

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
