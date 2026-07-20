import React, { useState } from 'react';
import type { Project, Issue, Page, IssuePriority, IssueStatus } from '../../types';
import { IssuesView } from './IssuesView';
import { ConfirmModal } from '../modals/ConfirmModal';
import { LayoutGrid, FileText, List, Plus, CircleDashed, Link, Search, MoreHorizontal, Pencil, Trash2, Calendar } from 'lucide-react';
import type { IssuesViewRef } from './IssuesView';
import { PageIcon } from '../ui/PageIcon';

interface ProjectDashboardViewProps {
  project: Project;
  issues: Issue[];
  pages: Page[];
  projects: Project[];
  onCreateIssue: (title: string, description: string, projectId: string, priority: IssuePriority, status: IssueStatus, dueDate?: string) => void;
  onUpdateIssue: (id: string, updates: Partial<Issue>) => void;
  onDeleteIssue: (id: string) => void;
  onSelectPage: (id: string) => void;
  allPages: Page[];
  onUpdatePage: (id: string, updates: Partial<Page>) => void;
  onCreatePage: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectDashboardView: React.FC<ProjectDashboardViewProps> = ({
  project, issues, pages, projects, onCreateIssue, onUpdateIssue, onDeleteIssue, onSelectPage,
  allPages, onUpdatePage, onCreatePage, onEditProject, onDeleteProject
}) => {
  const [activeTab, setActiveTab] = useState<'issues' | 'pages'>('issues');
  const [viewMode, setViewMode] = useState<'board' | 'list' | 'calendar'>('board');
  const issuesRef = React.useRef<IssuesViewRef>(null);

  const [linkMenuOpen, setLinkMenuOpen] = useState(false);
  const [pageSearch, setPageSearch] = useState('');
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const unlinkedPages = allPages.filter(p => p.projectId !== project?.id);
  const searchResults = pageSearch.trim() ? unlinkedPages.filter(p => (p.title || 'Untitled').toLowerCase().includes(pageSearch.toLowerCase())) : unlinkedPages.slice(0, 8);

  if (!project) return null;

  return (
    <div className="view-animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      
      {/* Project Header */}
      <div style={{
        padding: '32px 40px 0', borderBottom: '1px solid var(--hairline)',
        display: 'flex', flexDirection: 'column', gap: 24, background: 'var(--main-panel)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Title and meta */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: project.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Project
                </div>
                <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--ink-tertiary)' }} />
                <div style={{ fontSize: 12, color: 'var(--ink-subtle)' }}>
                  Created {new Date(project.createdAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)', margin: 0, letterSpacing: '-0.5px' }}>
                  {project.name}
                </h1>
                
                {/* Project Menu */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setProjectMenuOpen(!projectMenuOpen)}
                    style={{
                      background: 'transparent', border: 'none', color: 'var(--ink-tertiary)', cursor: 'pointer', padding: 4,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-2)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <MoreHorizontal size={20} />
                  </button>
                  {projectMenuOpen && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, marginTop: 4,
                      width: 160, backgroundColor: 'var(--surface-1)',
                      border: '1px solid var(--hairline-strong)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
                      zIndex: 50, padding: 4
                    }}>
                      <button
                        onClick={() => { onEditProject(project); setProjectMenuOpen(false); }}
                        style={{
                          width: '100%', padding: '8px 12px', textAlign: 'left',
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: 13, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8,
                          borderRadius: 'var(--radius-sm)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-2)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Pencil size={14} /> Edit Project
                      </button>
                      <button
                        onClick={() => {
                          setIsDeleteModalOpen(true);
                          setProjectMenuOpen(false);
                        }}
                        style={{
                          width: '100%', padding: '8px 12px', textAlign: 'left',
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: 13, color: 'var(--tag-red)', display: 'flex', alignItems: 'center', gap: 8,
                          borderRadius: 'var(--radius-sm)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-2)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Trash2 size={14} /> Delete Project
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Stats row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 4, paddingBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-subtle)', fontSize: 13 }}>
              <LayoutGrid size={14} />
              <span><strong>{issues.length}</strong> Total Issues</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-subtle)', fontSize: 13 }}>
              <CircleDashed size={14} />
              <span><strong>{issues.filter(i => i.status !== 'Done' && i.status !== 'Canceled').length}</strong> Active</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-subtle)', fontSize: 13 }}>
              <FileText size={14} />
              <span><strong>{pages.length}</strong> Associated Pages</span>
            </div>
          </div>
        </div>

        {/* Tabs Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: 24 }}>
            <button
              onClick={() => setActiveTab('issues')}
              style={{
                background: 'transparent', border: 'none', padding: '0 0 12px 0',
                color: activeTab === 'issues' ? 'var(--ink)' : 'var(--ink-subtle)',
                fontSize: 14, fontWeight: 500, cursor: 'pointer',
                borderBottom: activeTab === 'issues' ? '2px solid var(--ink)' : '2px solid transparent',
                display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s ease'
              }}
            >
              <LayoutGrid size={16} /> Issues
            </button>
            <button
              onClick={() => setActiveTab('pages')}
              style={{
                background: 'transparent', border: 'none', padding: '0 0 12px 0',
                color: activeTab === 'pages' ? 'var(--ink)' : 'var(--ink-subtle)',
                fontSize: 14, fontWeight: 500, cursor: 'pointer',
                borderBottom: activeTab === 'pages' ? '2px solid var(--ink)' : '2px solid transparent',
                display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s ease'
              }}
            >
              <FileText size={16} /> Pages
            </button>
          </div>

          {activeTab === 'issues' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12 }}>
              <div style={{ display: 'flex', background: 'var(--surface-1)', padding: 4, borderRadius: 'var(--radius-md)', border: '1px solid var(--hairline)' }}>
                <button
                  onClick={() => setViewMode('board')}
                  style={{
                    background: viewMode === 'board' ? 'var(--surface-3)' : 'transparent',
                    color: viewMode === 'board' ? 'var(--ink)' : 'var(--ink-subtle)',
                    border: 'none', padding: '4px 8px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', transition: 'all 0.2s ease'
                  }}
                  title="Board View"
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    background: viewMode === 'list' ? 'var(--surface-3)' : 'transparent',
                    color: viewMode === 'list' ? 'var(--ink)' : 'var(--ink-subtle)',
                    border: 'none', padding: '4px 8px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', transition: 'all 0.2s ease'
                  }}
                  title="List View"
                >
                  <List size={14} />
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  style={{
                    background: viewMode === 'calendar' ? 'var(--surface-3)' : 'transparent',
                    color: viewMode === 'calendar' ? 'var(--ink)' : 'var(--ink-subtle)',
                    border: 'none', padding: '4px 8px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', transition: 'all 0.2s ease'
                  }}
                  title="Calendar View"
                >
                  <Calendar size={14} />
                </button>
              </div>
              <button
                onClick={() => issuesRef.current?.openCreate()}
                style={{
                  background: 'var(--primary)', color: '#fff', border: 'none',
                  padding: '6px 12px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                  boxShadow: '0 2px 8px rgba(94, 106, 210, 0.2)', transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--primary)'}
              >
                <Plus size={14} /> New Issue
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {activeTab === 'issues' && (
          <div style={{ position: 'absolute', inset: 0 }}>
            <IssuesView
              ref={issuesRef}
              title=""
              hideHeader={true}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              issues={issues}
              projects={projects}
              onCreateIssue={onCreateIssue}
              onUpdateIssue={onUpdateIssue}
              onDeleteIssue={onDeleteIssue}
            />
          </div>
        )}
        {activeTab === 'pages' && (
          <div style={{ position: 'absolute', inset: 0, padding: '24px 40px', overflowY: 'auto' }}>
            <div style={{ maxWidth: 800 }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>Project Pages</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setLinkMenuOpen(!linkMenuOpen)}
                      style={{
                        background: 'transparent', color: 'var(--ink)', border: '1px solid var(--hairline-strong)',
                        padding: '6px 12px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <Link size={14} /> Link Existing
                    </button>
                    {linkMenuOpen && (
                      <div style={{
                        position: 'absolute', top: '100%', right: 0, marginTop: 4,
                        width: 280, backgroundColor: 'var(--surface-1)',
                        border: '1px solid var(--hairline-strong)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
                        zIndex: 50, display: 'flex', flexDirection: 'column'
                      }}>
                        <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--hairline)' }}>
                          <div style={{ position: 'relative' }}>
                            <Search size={14} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-tertiary)' }} />
                            <input
                              autoFocus
                              value={pageSearch}
                              onChange={(e) => setPageSearch(e.target.value)}
                              placeholder="Search pages to link..."
                              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: 13, padding: '4px 8px 4px 28px', color: 'var(--ink)' }}
                            />
                          </div>
                        </div>
                        <div style={{ maxHeight: 200, overflowY: 'auto', padding: 4 }}>
                          {searchResults.length === 0 ? (
                            <div style={{ padding: '12px', textAlign: 'center', fontSize: 12, color: 'var(--ink-tertiary)' }}>No unlinked pages found.</div>
                          ) : (
                            searchResults.map(p => (
                              <button
                                key={p.id}
                                onClick={() => { onUpdatePage(p.id, { projectId: project.id }); setLinkMenuOpen(false); setPageSearch(''); }}
                                style={{
                                  width: '100%', padding: '8px 12px', textAlign: 'left',
                                  background: 'none', border: 'none', cursor: 'pointer',
                                  fontSize: 13, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8,
                                  borderRadius: 'var(--radius-sm)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-2)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, flexShrink: 0 }}>
                                  <PageIcon name={p.icon} size={16} color="var(--ink-subtle)" />
                                </span>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title || 'Untitled'}</span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={onCreatePage}
                    style={{
                      background: 'var(--primary)', color: '#fff', border: 'none',
                      padding: '6px 12px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                      boxShadow: '0 2px 8px rgba(94, 106, 210, 0.2)', transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'var(--primary)'}
                  >
                    <Plus size={14} /> New Page
                  </button>
                </div>
              </div>

              {pages.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', border: '1px dashed var(--hairline-strong)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ color: 'var(--ink-subtle)', marginBottom: 16, fontSize: 14 }}>No pages associated with this project yet.</p>
                  <button
                    onClick={onCreatePage}
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--hairline)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--ink)', fontSize: 13, fontWeight: 500 }}
                  >
                    Create your first page
                  </button>
                </div>
              ) : (
                pages.map(page => (
                  <div key={page.id} onClick={() => onSelectPage(page.id)} style={{
                    padding: '12px 16px', background: 'var(--surface-1)', border: '1px solid var(--hairline)',
                    borderRadius: 'var(--radius-md)', marginBottom: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                    transition: 'border 0.2s ease, box-shadow 0.2s ease'
                  }} onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--hairline-strong)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                  }} onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--hairline)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, flexShrink: 0 }}>
                      <PageIcon name={page.icon} size={18} color="var(--ink-subtle)" />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{page.title || 'Untitled'}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => onDeleteProject(project.id)}
        title="Delete Project"
        message={`Are you sure you want to delete the project "${project.name}"? This will delete all associated issues. Pages will be kept but unlinked.`}
        confirmText="Delete Project"
        isDestructive={true}
      />
    </div>
  );
};
