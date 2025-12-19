export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("access_token");

  const BASE = import.meta.env.BASE_URL || "/";

  let finalUrl = url;

  const isAbsolute = /^https?:\/\//i.test(url);

  if (!isAbsolute) {
    if (url.startsWith("/api/")) {
      finalUrl = `${BASE}api/${url.slice("/api/".length)}`;
    } else if (url === "/api") {
      finalUrl = `${BASE}api`;
    } else if (url.startsWith("/")) {
      finalUrl = url;
    } else {
      if (url.startsWith("api/")) {
        finalUrl = `${BASE}${url}`;
      }
    }
  }

  // 👉 Si pas de token, redirige vers la page login de l'app courante
  if (!token) {
    console.warn("Aucun token trouvé, redirection vers login");
    window.location.href = `${BASE}login`;
    throw new Error("not_authenticated");
  }

  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${token}`);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(finalUrl, {
    ...options,
    headers,
  });

  // ✅ évite le piège HTML -> json()
  const contentType = res.headers.get("content-type") || "";
  const raw = await res.text();

  let data = null;
  if (raw && contentType.includes("application/json")) {
    try {
      data = JSON.parse(raw);
    } catch {
      // JSON invalide
      throw new Error("Réponse JSON invalide de l’API");
    }
  } else if (raw) {
    // HTML / texte → donne un extrait utile
    throw new Error(`Réponse non-JSON (${res.status}): ${raw.slice(0, 120)}`);
  }

  if (res.status === 401) {
    if (data && data.error === "token_expired") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = `${BASE}login`;
      throw new Error("token_expired");
    }
    throw new Error((data && data.error) || "Unauthorized");
  }

  if (!res.ok) {
    throw new Error((data && (data.error || data.message)) || `Erreur API (${res.status})`);
  }

  return data;
}
