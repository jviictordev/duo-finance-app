/** Shared styles for the three auth screens — imported as a string into each component. */
export const AUTH_STYLES = `
  :host { display: block; min-height: 100%; padding: var(--space-6) var(--space-4); background: var(--color-bg); }
  .wrap { max-width: 380px; margin: 8vh auto 0; display: flex; flex-direction: column; gap: var(--space-4); }
  .brand { font-family: var(--font-heading); font-size: 28px; margin: 0; color: var(--color-text); }
  .lede { margin: 0; color: var(--color-neutral-700); font-size: 14px; }
  .field { display: flex; flex-direction: column; gap: 6px; }
  .field-label { font-size: 11.5px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--color-neutral-700); }
  input.text-input {
    min-height: 48px; border: 1px solid var(--color-divider); border-radius: var(--radius-pill);
    background: var(--color-surface); padding: 0 var(--space-4); font-family: var(--font-body);
    font-size: 15px; color: var(--color-text);
  }
  input.text-input:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 1px; }
  button.primary {
    min-height: 50px; border: none; border-radius: var(--radius-pill); background: var(--color-accent);
    color: #fff; font-family: var(--font-heading); font-size: 15px; cursor: pointer;
  }
  button.primary:disabled { opacity: 0.55; }
  button.ghost {
    min-height: 46px; border: 1px solid var(--color-divider); border-radius: var(--radius-pill);
    background: var(--color-surface); color: var(--color-text); font-size: 14px; cursor: pointer;
  }
  .row { display: flex; flex-direction: column; gap: var(--space-2); }
  .switch { text-align: center; font-size: 13.5px; color: var(--color-neutral-700); }
  .switch a { color: var(--color-accent-700); cursor: pointer; text-decoration: underline; }
  .error { color: var(--color-neutral-800); background: var(--color-accent-2-100); border-radius: var(--radius-content-card); padding: var(--space-3); font-size: 13px; margin: 0; }
  .seg { display: flex; gap: var(--space-2); }
  .seg button { flex: 1; }
  .seg button.selected { border-color: var(--color-accent); color: var(--color-accent-700); background: var(--color-accent-100); }
`;
