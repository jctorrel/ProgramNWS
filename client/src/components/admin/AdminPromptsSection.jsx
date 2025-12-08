// src/pages/admin/AdminPromptsSection.jsx
import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";

function AdminPromptsSection() {
  const [prompts, setPrompts] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [selectedKey, setSelectedKey] = useState(null);

  const [form, setForm] = useState({
    key: "",
    label: "",
    type: "",
    content: "",
  });

  // Charger la liste des prompts au montage
  useEffect(() => {
    let cancelled = false;

    async function loadPrompts() {
      setLoadingList(true);
      setError("");
      setSaveMessage("");

      try {
        const data = await apiFetch("/api/admin/prompts");
        if (cancelled) return;

        setPrompts(data || []);
        if (data && data.length > 0) {
          // sélectionne le premier par défaut
          selectPrompt(data[0].key, data);
        }
      } catch (e) {
        if (cancelled) return;
        setError(e?.message || "Erreur lors du chargement des prompts");
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    }

    loadPrompts();

    return () => {
      cancelled = true;
    };
  }, []);

  function selectPrompt(key, list = prompts) {
    setError("");
    setSaveMessage("");
    setSelectedKey(key);

    const found = list.find((p) => p.key === key);
    if (found) {
      setForm({
        key: found.key,
        label: found.label || "",
        type: found.type || "",
        content: found.content || "",
      });
    } else {
      // cas improbable, mais on reset
      setForm({
        key,
        label: "",
        type: "",
        content: "",
      });
    }
  }

  function handleFieldChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.key) {
      setError("Aucune clé de prompt sélectionnée.");
      return;
    }
    if (!form.content.trim()) {
      setError("Le contenu du prompt ne peut pas être vide.");
      return;
    }

    setSaving(true);
    setError("");
    setSaveMessage("");

    try {
      const body = {
        content: form.content,
        label: form.label || undefined,
        type: form.type || undefined,
      };

      const updated = await apiFetch(`/api/admin/prompts/${form.key}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });

      // mise à jour de la liste locale
      setPrompts((prev) =>
        prev.map((p) => (p.key === updated.key ? updated : p))
      );

      setForm({
        key: updated.key,
        label: updated.label || "",
        type: updated.type || "",
        content: updated.content || "",
      });

      setSaveMessage("Prompt sauvegardé ✔");
    } catch (e) {
      setError(e?.message || "Erreur lors de la sauvegarde du prompt");
    } finally {
      setSaving(false);
    }
  }

  if (loadingList) {
    return (
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Prompts</h2>
        <p style={styles.sectionHelp}>Chargement de la liste des prompts…</p>
      </section>
    );
  }

  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>Prompts</h2>
      <p style={styles.sectionHelp}>
        Gère ici les différents prompts utilisés par le mentor. Sélectionne un
        prompt dans la liste, modifie son contenu, puis sauvegarde.
      </p>

      {error && <p style={styles.errorTextSmall}>Erreur : {error}</p>}
      {saveMessage && (
        <p style={styles.successText}>{saveMessage}</p>
      )}

      <div style={styles.layout}>
        <div style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>Liste des prompts</h3>
          {prompts.length === 0 && (
            <p style={styles.sidebarEmpty}>Aucun prompt trouvé.</p>
          )}
          <ul style={styles.promptList}>
            {prompts.map((p) => (
              <li
                key={p.key}
                style={{
                  ...styles.promptItem,
                  ...(p.key === selectedKey ? styles.promptItemActive : {}),
                }}
                onClick={() => selectPrompt(p.key)}
              >
                <div style={styles.promptKey}>{p.key}</div>
                {p.label && (
                  <div style={styles.promptLabel}>{p.label}</div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div style={styles.editor}>
          {selectedKey ? (
            <>
              <h3 style={styles.editorTitle}>
                Édition du prompt : <code>{form.key}</code>
              </h3>

              <form style={styles.form} onSubmit={handleSave}>
                <div style={styles.fieldRow}>
                  <div style={styles.field}>
                    <label style={styles.label} htmlFor="label">
                      Label (optionnel)
                    </label>
                    <input
                      id="label"
                      name="label"
                      type="text"
                      value={form.label}
                      onChange={handleFieldChange}
                      style={styles.input}
                      placeholder="Prompt système mentor…"
                    />
                  </div>
                </div>

                <div style={styles.field}>
                  <label style={styles.label} htmlFor="content">
                    Contenu du prompt
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={form.content}
                    onChange={handleFieldChange}
                    style={styles.textarea}
                    rows={16}
                    spellCheck={false}
                  />
                  <p style={styles.fieldHint}>
                    Utilisez la syntaxe {{variable}} pour insérer des variables dynamiques.
                  </p>
                </div>

                <div style={styles.actions}>
                  <button
                    type="submit"
                    style={styles.buttonPrimary}
                    disabled={saving}
                  >
                    {saving ? "Sauvegarde…" : "Sauvegarder le prompt"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <p style={styles.info}>
              Sélectionne un prompt dans la liste pour l’éditer.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    marginTop: "1.5rem",
    paddingTop: "1.5rem",
    borderTop: "1px solid #e5e7eb",
  },
  sectionTitle: {
    margin: 0,
    marginBottom: "0.5rem",
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#0f172a",
  },
  sectionHelp: {
    margin: 0,
    marginBottom: "1rem",
    fontSize: "0.9rem",
    color: "#6b7280",
  },
  layout: {
    display: "flex",
    gap: "1rem",
    alignItems: "stretch",
  },
  sidebar: {
    width: "260px",
    borderRadius: "1rem",
    border: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
    padding: "0.75rem",
    maxHeight: "400px",
    overflowY: "auto",
  },
  sidebarTitle: {
    margin: "0 0 0.5rem 0",
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#111827",
  },
  sidebarEmpty: {
    margin: 0,
    fontSize: "0.85rem",
    color: "#6b7280",
  },
  promptList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  promptItem: {
    padding: "0.4rem 0.5rem",
    borderRadius: "0.6rem",
    cursor: "pointer",
    marginBottom: "0.25rem",
  },
  promptItemActive: {
    backgroundColor: "#e0f2fe",
  },
  promptKey: {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#0f172a",
  },
  promptLabel: {
    fontSize: "0.75rem",
    color: "#6b7280",
  },
  editor: {
    flex: 1,
    borderRadius: "1rem",
    border: "1px solid #e5e7eb",
    padding: "0.75rem 1rem",
    backgroundColor: "#ffffff",
  },
  editorTitle: {
    margin: 0,
    marginBottom: "0.75rem",
    fontSize: "1rem",
    fontWeight: 600,
    color: "#0f172a",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  fieldRow: {
    display: "flex",
    gap: "0.75rem",
  },
  field: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  label: {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#0f172a",
  },
  input: {
    borderRadius: "0.75rem",
    border: "1px solid #d1d5db",
    padding: "0.4rem 0.6rem",
    fontSize: "0.9rem",
  },
  textarea: {
    borderRadius: "0.75rem",
    border: "1px solid #d1d5db",
    padding: "0.5rem 0.6rem",
    fontSize: "0.85rem",
    resize: "vertical",
    fontFamily: "monospace",
    lineHeight: 1.4,
  },
  fieldHint: {
    margin: 0,
    fontSize: "0.75rem",
    color: "#9ca3af",
  },
  actions: {
    marginTop: "0.25rem",
  },
  buttonPrimary: {
    padding: "0.5rem 1rem",
    borderRadius: "999px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    fontSize: "0.9rem",
    fontWeight: 500,
    cursor: "pointer",
  },
  info: {
    fontSize: "0.9rem",
    color: "#64748b",
  },
  errorTextSmall: {
    marginTop: "0.25rem",
    fontSize: "0.8rem",
    color: "#ef4444",
  },
  successText: {
    marginTop: "0.25rem",
    fontSize: "0.85rem",
    color: "#16a34a",
  },
};

export default AdminPromptsSection;
