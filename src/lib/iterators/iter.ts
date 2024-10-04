export class Iter<T> implements IterableIterator<T> {
    constructor(private iterable: IterableIterator<T>) { }
    [Symbol.iterator]() {
        return this;
    }
    next(...args: [] | [undefined]) {
        return this.iterable.next(...args);
    }
    map<R>(fn: (value: T, index: number) => R): Iter<R> {
        return new Iter(map(this.iterable, fn));
    }
    denseMap<R>(fn: (value: T, index: number) => R): Iter<NonNullable<R>> {
        return new Iter(denseMap(this.iterable, fn));
    }
    filter(predicate: (value: T, index: number) => boolean) {
        return new Iter(filter(this.iterable, predicate));
    }
    reduce<R>(
        reducer: (accumulator: R, currentValue: T) => R,
        initialValue: R
    ) {
        return reduce(this.iterable, reducer, initialValue);
    }
    partition(predicate: (value: T, index: number) => boolean): [Iter<T>, Iter<T>] {
        const result = partition(this.iterable, predicate);
        return [new Iter(result[0]), new Iter(result[1])];
    }
    iterateBySqrt() {
        return new Iter(iterateBySqrt(this.iterable))
    }
    iterateFrom(start: number) {
        const [a, b] = this.partition((_, index) => index >= start);
        return new Iter(concat(b, a));
    }
    concat(...iterators: IterableIterator<T>[]) {
        return new Iter(concat(this.iterable, ...iterators))
    }
    toArray(): T[] {
        return [...this.iterable];
    }
    aggregate<K, V>(): Iter<[K, V[]]> | Iter<T> {
        return new Iter(aggregate(this.iterable));
    }
    reverse() {
        return new Iter(reverse(this.iterable));
    }
}

export function* map<R, T>(iterator: IterableIterator<T>, fn: (value: T, index: number) => R): IterableIterator<R> {
    let index = 0;
    for (let result = iterator.next(); !result.done; result = iterator.next()) {
        yield fn(result.value, index);
        index++;
    }
}

export function* denseMap<R, T>(iterator: IterableIterator<T>, fn: (value: T, index: number) => R): IterableIterator<NonNullable<R>> {
    let index = 0;
    for (let result = iterator.next(); !result.done; result = iterator.next()) {
        const value = fn(result.value, index);
        if (value !== null && value !== undefined) {
            yield value;
        }
        index++;
    }
}

export function* filter<T>(iterator: IterableIterator<T>, predicate: (value: T, index: number) => boolean) {
    let index = 0;
    for (let result = iterator.next(); !result.done; result = iterator.next()) {
        if (predicate(result.value, index)) {
            yield result.value;
        }
        index++;
    }
}

export function reduce<T, R>(
    iterable: IterableIterator<T>,
    reducer: (accumulator: R, currentValue: T) => R,
    initialValue: R
): R {
    let accumulator = initialValue;

    for (const item of iterable) {
        accumulator = reducer(accumulator, item);
    }

    return accumulator;
}

export function partition<T>(iterator: IterableIterator<T>, predicate: (value: T, index: number) => boolean): [IterableIterator<T>, IterableIterator<T>] {
    const truthy: T[] = [];
    const falsy: T[] = [];
    let index = 0;

    for (const item of iterator) {
        if (predicate(item, index)) {
            truthy.push(item);
        } else {
            falsy.push(item);
        }
        index++;
    }

    return [falsy[Symbol.iterator](), truthy[Symbol.iterator]()];
}

export function* aggregate<K, V>(iterator: IterableIterator<[K, V]> | IterableIterator<any>): IterableIterator<[K, V[]]> | IterableIterator<any> {
    const map = new Map<K, V[]>();

    for (const item of iterator) {
        if (!Array.isArray(item) || item.length !== 2) {
            return iterator;
        }

        const [key, value] = item;
        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key)!.push(value);
    }

    for (const [key, values] of map.entries()) {
        yield [key, values];
    }
}

export function* concat<T>(...iterators: IterableIterator<T>[]): IterableIterator<T> {
    for (const iterator of iterators) {
        yield* iterator;
    }
}

export function* iterateBySqrt<T>(iterable: IterableIterator<T>): IterableIterator<T> {
    const array = [...iterable];
    const length = array.length;
    const interval = Math.sqrt(length);

    let index = 0;
    let count = 0;
    while (count < length) {
        yield array[index % length];
        index += interval;
        count++;
        if (!(count % interval)) {
            index++;
        }
    }
}

export function* reverse<T>(iterable: IterableIterator<T>): IterableIterator<T> {
    const items = Array.from(iterable);
    for (let i = items.length - 1; i >= 0; i--) {
        yield items[i];
    }
}
