import React, { useState } from 'react';
import type { Page, Project } from '../../types';
import { PageIcon } from '../ui/PageIcon';
import { FileText, Clock, Star } from 'lucide-react';

interface PagesListViewProps {
  title: string;
  subtitle?: string;
  pages: Page[];
  projects?: Project[];
  onSelectPage: (id: string) => void;
  onCreatePage: () => void;
}

export const PagesListView: React.FC<PagesListViewProps> = ({ title, subtitle, pages, projects = [], onSelectPage, onCreatePage: _onCreatePage }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'favorites' | 'unassigned'>('all');

  const filteredPages = React.useMemo(() => {
    let result = pages;
    
    if (activeFilter === 'favorites') {
      result = result.filter(p => p.isFavorite);
    } else if (activeFilter === 'unassigned') {
      result = result.filter(p => !p.projectId);
    }
    
    return result;
  }, [pages, activeFilter]);

  const recentPages = React.useMemo(() => {
    return [...pages].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 4);
  }, [pages]);



  return (
    <div className="view-animate-fade-in" style={{ padding: '40px 64px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, maxWidth: 1200, margin: '0 auto 32px' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--ink)', margin: 0, letterSpacing: '-0.5px' }}>{title}</h1>
          {subtitle && <div style={{ fontSize: 14, color: 'var(--ink-subtle)', marginTop: 4 }}>{subtitle}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-1)', padding: 4, borderRadius: 'var(--radius-md)', border: '1px solid var(--hairline-strong)' }}>
          {(['all', 'favorites', 'unassigned'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                background: activeFilter === filter ? 'var(--surface-2)' : 'transparent',
                color: activeFilter === filter ? 'var(--ink)' : 'var(--ink-subtle)',
                border: 'none', padding: '4px 12px', borderRadius: 'var(--radius-sm)',
                fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s ease',
                textTransform: 'capitalize'
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>



      {recentPages.length > 0 && (
        <div style={{ marginBottom: 40, maxWidth: 1200, margin: '0 auto 40px' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-subtle)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recently Edited</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {recentPages.map(page => (
              <div 
                key={`recent-${page.id}`}
                onClick={() => onSelectPage(page.id)}
                style={{ 
                  height: 140, padding: 20, background: 'var(--surface-1)', border: '1px solid var(--hairline-strong)',
                  borderRadius: 'var(--radius-lg)', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                  transition: 'all 0.2s ease', boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                  position: 'relative', overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--hairline-stronger)';
                  e.currentTarget.style.backgroundColor = 'var(--surface-2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--hairline-strong)';
                  e.currentTarget.style.backgroundColor = 'var(--surface-1)';
                }}
              >
                {page.coverColor && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: page.coverColor }} />
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, marginTop: page.coverColor ? 4 : 0 }}>
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, background: 'var(--surface-3)', borderRadius: '8px' }}>
                    <PageIcon name={page.icon} size={20} color="var(--ink)" />
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {page.title || 'Untitled'}
                  </span>
                </div>
                <div style={{ marginTop: 'auto', fontSize: 12, color: 'var(--ink-subtle)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={12} style={{ color: 'var(--ink-subtle)' }} />
                  Accessed {new Date(page.updatedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, maxWidth: 1200, margin: '0 auto 16px' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
          Page Directory
        </h2>
      </div>

      <div style={{ border: '1px solid var(--hairline-strong)', borderRadius: 'var(--radius-lg)', background: 'var(--surface-1)', overflow: 'hidden', maxWidth: 1200, margin: '0 auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--hairline-strong)', color: 'var(--ink-subtle)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px', background: 'var(--surface-2)' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Title</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, width: 200 }}>Project</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, width: 160 }}>Created</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, width: 160 }}>Updated</th>
            </tr>
          </thead>
          <tbody className="view-animate-stagger">
            {filteredPages.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '48px 0', color: 'var(--ink-tertiary)' }}>
                  <FileText size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                  <p style={{ margin: 0, fontSize: 14 }}>
                    No pages found.
                  </p>
                </td>
              </tr>
            ) : (
              filteredPages.map(page => (
                <tr 
                  key={page.id} 
                  onClick={() => onSelectPage(page.id)}
                  style={{ 
                    borderBottom: '1px solid var(--hairline)', cursor: 'pointer', transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, background: 'var(--surface-2)', borderRadius: 4 }}>
                        <PageIcon name={page.icon} size={14} color="var(--ink-subtle)" />
                      </span>
                      {page.title || 'Untitled'}
                      {page.isFavorite && <Star size={12} style={{ color: '#EBCB8B', fill: '#EBCB8B' }} />}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--ink-tertiary)' }}>
                    {(() => {
                      if (!page.projectId) return <span style={{ color: 'var(--ink-muted)' }}>-</span>;
                      const proj = projects.find(p => p.id === page.projectId);
                      if (!proj) return <span style={{ color: 'var(--ink-muted)' }}>-</span>;
                      return (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--surface-2)', padding: '2px 8px', borderRadius: 12, border: '1px solid var(--hairline)' }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: proj.color }} />
                          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-subtle)' }}>{proj.name}</span>
                        </div>
                      );
                    })()}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--ink-subtle)' }}>
                    {new Date(page.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={12} style={{ color: 'var(--ink-subtle)' }} />
                    {new Date(page.updatedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
