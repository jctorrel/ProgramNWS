// src/components/admin/ProgramKeySelector.jsx
import { ANNEES, FILIERES } from './../../utils/constants';

function ProgramKeySelector({ year, filiere, onChange, generatedKey }) {
    const handleYearChange = (newYear) => {
        onChange({
            year: newYear,
            filiere: newYear === '1' ? '' : filiere
        });
    };

    const handleFiliereChange = (newFiliere) => {
        onChange({
            year,
            filiere: newFiliere
        });
    };

    return (
        <div style={styles.container}>
            <div style={styles.row}>
                <div style={styles.field}>
                    <label style={styles.label}>
                        Année *
                        <select
                            value={year}
                            onChange={(e) => handleYearChange(e.target.value)}
                            style={styles.select}
                            required
                        >
                            <option value="">Sélectionner une année</option>
                            {ANNEES.map(a => (
                                <option key={a.value} value={a.value}>
                                    {a.label}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <div style={styles.field}>
                    <label style={styles.label}>
                        Filière {year !== '1' && '*'}
                        <select
                            value={filiere}
                            onChange={(e) => handleFiliereChange(e.target.value)}
                            style={{
                                ...styles.select,
                                ...(year === '1' ? styles.selectDisabled : {})
                            }}
                            required={year !== '1'}
                            disabled={year === '1'}
                        >
                            <option value="">
                                {year === '1' ? 'Pas de filière en Année 1' : 'Sélectionner une filière'}
                            </option>
                            {FILIERES.map(f => (
                                <option key={f.code} value={f.code}>
                                    {f.label} [{f.code}]
                                </option>
                            ))}
                        </select>
                    </label>
                    {year === '1' && (
                        <p style={styles.hint}>
                            ℹ️ L'année 1 n'a pas de filière spécifique
                        </p>
                    )}
                </div>
            </div>

            {generatedKey && (
                <div style={styles.keyDisplay}>
                    <span style={styles.keyLabel}>Clé générée :</span>
                    <code style={styles.keyCode}>{generatedKey}</code>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        marginBottom: '1rem',
    },
    row: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '0.5rem',
    },
    field: {
        flex: 1,
    },
    label: {
        display: 'block',
        fontSize: '0.85rem',
        fontWeight: 500,
        color: '#374151',
        marginBottom: '0.4rem',
    },
    select: {
        width: '100%',
        padding: '0.6rem',
        marginTop: '0.3rem',
        borderRadius: '0.5rem',
        border: '1px solid #d1d5db',
        fontSize: '0.9rem',
        background: 'white',
        cursor: 'pointer',
        transition: 'border-color 0.2s',
    },
    selectDisabled: {
        background: '#f3f4f6',
        color: '#9ca3af',
        cursor: 'not-allowed',
    },
    hint: {
        margin: '0.5rem 0 0 0',
        fontSize: '0.75rem',
        color: '#0284c7',
        fontStyle: 'italic',
    },
    keyDisplay: {
        padding: '0.8rem 1rem',
        background: '#e0f2fe',
        border: '1px solid #7dd3fc',
        borderRadius: '0.5rem',
        marginTop: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
    },
    keyLabel: {
        fontSize: '0.85rem',
        fontWeight: 500,
        color: '#0369a1',
    },
    keyCode: {
        padding: '0.3rem 0.6rem',
        background: '#0284c7',
        color: 'white',
        borderRadius: '0.3rem',
        fontSize: '0.9rem',
        fontWeight: 600,
    },
};

export default ProgramKeySelector;