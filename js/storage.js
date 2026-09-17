(() => {
  const key = 'museumBowGame';
  const valid = new Set(MuseumData.items.map(item => item.id));
  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(value) ? [...new Set(value.filter(id => valid.has(id)))] : [];
    } catch { return []; }
  }
  function acquire(id) {
    if (!valid.has(id)) return { ok: false };
    const collected = read();
    const isNew = !collected.includes(id);
    if (isNew) collected.push(id);
    try { localStorage.setItem(key, JSON.stringify(collected)); }
    catch { return { ok: false }; }
    return { ok: true, isNew, complete: collected.length === valid.size };
  }
  function reset() {
    try { localStorage.removeItem(key); return true; } catch { return false; }
  }
  window.GameStorage = { key, read, acquire, reset, isComplete: () => read().length === valid.size };
})();
