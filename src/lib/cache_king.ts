/**
 * Will return a function that when called will wait {time} before executing. If
 * it's invoked again before {time} the timer will reset before being called. Only
 * last invokation will succeed.
 * @param func Handler to actually execute specified parameters when called
 * @param time Timeout in MS
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  time: number
): (...funcArgs: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, time);
  };
}

type PR<T> = (value?: T | PromiseLike<T>) => void;

export function createSimpleCache<TItem>(
  wait: number,
  getKey: (i: TItem) => string,
  fetchItems: (key: string) => Promise<TItem>
) {
  const k = createCacheFetcher(wait, getKey, async (items) => {
    const v = await fetchItems(items[0]);
    return [v];
  });

  return {
    getItem: (key: string, force: boolean = false) => k.getItem(key, force),
    remove: k.remove,
    clear: k.clear,
    addItem: k.addItem,
  };
}

export function createCacheFetcher<TItem>(
  wait: number,
  getKey: (i: TItem) => string,
  fetchItems: (items: string[]) => Promise<TItem[]>
) {
  const cache: IDictionary<TItem> = {};
  const pendingItems: string[] = [];
  const pendingProms: {
    ids: string[];
    prom: PR<TItem[]>;
  }[] = [];

  const tryGrabItems = debounce(async () => {
    //-- Only fetch items we need.
    const toFetch = pendingItems.filter((pi) => !cache[pi]);

    const values = toFetch.length === 0 ? [] : await fetchItems(toFetch);

    values.forEach((item) => {
      cache[getKey(item)] = item;
    });

    pendingItems.splice(0, pendingItems.length);

    pendingProms.forEach((pp) => {
      const results = pp.ids.map((id) => cache[id]);
      pp.prom(results);
    });

    pendingProms.splice(0, pendingItems.length);

    return values;
  }, wait);

  const getMany = async (ids: string[], force: boolean = false) => {
    if (force) {
      const results = await fetchItems(ids);
      results.forEach((r) => {
        cache[getKey(r)] = r;
      });
      return results;
    }
    ids.forEach((i) => {
      if (!pendingItems.some((pi) => pi === i)) {
        pendingItems.push(i);
      }
    });

    const prom = new Promise<TItem[]>((r) => {
      pendingProms.push({
        ids,
        prom: r as any, //-- Not sure where undefined is coming from
      });
      tryGrabItems();
    });

    return await prom;
  };

  const remove = (key: string) => {
    delete cache[key];
  };

  return {
    getMany,
    getItem: async (id: string, force: boolean = false) => {
      const result = await getMany([id], force);

      return result?.[0];
    },
    exists: (key: string) => {
      cache[key] !== undefined;
    },
    addItem: (item: TItem) => {
      cache[getKey(item)] = item;
    },
    remove,
    clear: () => {
      Object.keys(cache).map((ck) => remove(ck));
    },
  };
}
