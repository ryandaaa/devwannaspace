import React from 'react';

interface KbdHintProps {
  children: React.ReactNode;
}

export const KbdHint: React.FC<KbdHintProps> = ({ children }) => {
  return (
    <kbd
      style={{
        fontFamily: 'var(--mono)',
        fontSize: '11px',
        fontWeight: 500,
        color: 'var(--ink-subtle)',
        backgroundColor: 'var(--surface-2)',
        border: '1px solid var(--hairline-strong)',
        borderBottom: '2px solid var(--hairline-strong)',
        borderRadius: '4px',
        padding: '2px 6px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '20px',
        lineHeight: 1.2,
        userSelect: 'none',
        boxShadow: '0 1px 0 rgba(0,0,0,0.1)'
      }}
    >
      {children}
    </kbd>
  );
};
