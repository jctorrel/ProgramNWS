// src/api.js
export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("access_token");

  // 👉 Si pas de token, on ne contacte pas le backend
  if (!token) {
    console.warn("Aucun token trouvé, redirection vers /login");
    window.location.href = "/login";
    throw new Error("not_authenticated");
  }

  const headers = new Headers(options.headers || {});

  headers.set("Authorization", `Bearer ${token}`);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error((data && data.error) || "Erreur API");
  }

  // Erreur autorisation
  if (res.status === 401) {
    if (data && data.error === "token_expired") {
      // Token expiré
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      throw new Error("token_expired");
    }

    throw new Error((data && data.error) || "Unauthorized");
  }
  return data;
}
