(() => {
  const makeStorage = () => {
    const values = new Map();
    const methods = { getItem: key => values.get(String(key)) ?? null,
      setItem: (key, value) => { values.set(String(key), String(value)); },
      removeItem: key => { values.delete(String(key)); }, clear: () => values.clear(),
      key: index => [...values.keys()][index] ?? null };
    return new Proxy(methods, {
      get: (target, key) => key === 'length' ? values.size : key in target ? target[key] : values.get(String(key)),
      set: (target, key, value) => { values.set(String(key), String(value)); return true; },
      deleteProperty: (target, key) => { values.delete(String(key)); return true; },
      ownKeys: () => [...values.keys()],
      getOwnPropertyDescriptor: () => ({ configurable: true, enumerable: true })
    });
  };
  for (const key of ['localStorage', 'sessionStorage']) {
    Object.defineProperty(window, key, { configurable: true, value: makeStorage() });
  }
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.addEventListener('pagehide', () => document.querySelectorAll('video,audio').forEach(media => media.pause()));
})();