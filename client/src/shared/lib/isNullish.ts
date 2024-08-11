export default function isNullish<T>(value: T): value is T & (undefined | null) {
    return value === undefined || value === null;
}