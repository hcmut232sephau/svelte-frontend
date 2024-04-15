/**
 * @template T
 * @param {T | undefined | null} a 
 * @returns {T}
 */
export function nonNullAssert(a) {
    // @ts-ignore
    return a;
}

/**
 * @template T, Z
 * @param {T} a 
 * @returns {Z}
 */
export function reinterpretCast(a) {
    // @ts-ignore
    return a;
}

/**
 * @template T, Z
 * @param {T[]} a 
 * @param {Z} b
 * @returns {boolean}
 */
export function typelessIncludes(a, b) {
    // @ts-ignore
    return a.includes(b);
}