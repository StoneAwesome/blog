export function setToArray<T>(set: Set<T>) {
  const result: T[] = [];
  set.forEach((i) => result.push(i));
  return result;
}

export function toDictionary<T>(items: T[], getKey: (item: T) => string) {
  const dictionary: NodeJS.Dict<T> = {};
  items.forEach((i) => (dictionary[getKey(i)] = i));
  return dictionary;
}
