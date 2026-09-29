self.onmessage = async (e) => {
  const { nombre, url } = e.data;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} al cargar ${url}`);
    const arrayBuffer = await res.arrayBuffer();
    self.postMessage({ nombre, arrayBuffer, ok: true }, [arrayBuffer]);
  } catch (err) {
    self.postMessage({ nombre, ok: false, error: err.message });
  }
};
