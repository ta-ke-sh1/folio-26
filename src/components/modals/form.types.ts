// --- SHARED INPUT STYLES ---
export const commonInputStyles = {
  input: {
    backgroundColor: "var(--folio-surface)",
    borderColor: "var(--folio-card-border)",
    borderRadius: "3px",
    color: "var(--folio-text)",
    fontFamily: "monospace",
    "&:focus": {
      borderColor: "var(--folio-accent)",
      boxShadow: "0 0 0 1px rgba(255, 119, 0, 0.18)",
    },
  },
  label: {
    color: "var(--folio-muted)",
    fontFamily: "monospace",
    fontSize: "9px",
    letterSpacing: "1px",
    marginBottom: "4px",
  },
};
