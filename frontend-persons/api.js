// api.js  ✅ (must be loaded BEFORE app.js)
(function () {
  function normalizeBaseUrl(url) {
    if (!url) return "";
    return String(url).trim().replace(/\/+$/, "");
  }

  function buildUrl(baseUrl, path) {
    const b = normalizeBaseUrl(baseUrl);
    const p = String(path || "");
    return b + (p.startsWith("/") ? p : "/" + p);
  }

  async function requestJson(url, options = {}) {
    const res = await fetch(url, {
      mode: "cors",
      cache: "no-store",
      headers: { Accept: "application/json" },
      ...options,
    });

    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; }
    catch { data = text; }

    if (!res.ok) {
      const msg = typeof data === "string" ? data : JSON.stringify(data);
      throw new Error(`HTTP ${res.status} — ${msg}`);
    }
    return data;
  }

  async function apiGetAll(baseUrl) {
    return requestJson(buildUrl(baseUrl, "/users/affiche"), { method: "GET" });
  }

  async function apiAdd(baseUrl, age, name) {
    const safeName = encodeURIComponent(String(name).trim());
    return requestJson(buildUrl(baseUrl, `/users/add/${Number(age)}/${safeName}`), { method: "PUT" });
  }

  async function apiUpdate(baseUrl, id, age, name) {
    const safeName = encodeURIComponent(String(name).trim());
    return requestJson(buildUrl(baseUrl, `/users/update/${Number(id)}/${Number(age)}/${safeName}`), { method: "PUT" });
  }

  async function apiDelete(baseUrl, id) {
    return requestJson(buildUrl(baseUrl, `/users/remove/${Number(id)}`), { method: "DELETE" });
  }

  async function apiGetById(baseUrl, id) {
    return requestJson(buildUrl(baseUrl, `/users/getid/${Number(id)}`), { method: "GET" });
  }

  async function apiGetByName(baseUrl, name) {
    const safeName = encodeURIComponent(String(name).trim());
    return requestJson(buildUrl(baseUrl, `/users/getname/${safeName}`), { method: "GET" });
  }

  // ✅ expose globally
  window.PersonApi = {
    normalizeBaseUrl,
    buildUrl,
    apiGetAll,
    apiAdd,
    apiUpdate,
    apiDelete,
    apiGetById,
    apiGetByName,
  };

  console.log("✅ api.js loaded OK", window.PersonApi);
})();
