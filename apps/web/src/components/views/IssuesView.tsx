import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import type { Issue, Project, IssueStatus, IssuePriority } from '../../types';
import { Plus, LayoutGrid, List, X, LayoutTemplate, ChevronDown, ChevronRight, Trash2, Folder, Flag, CircleDashed, Calendar } from 'lucide-react';
import { KanbanBoard } from './KanbanBoard';
import { CalendarView } from './CalendarView';

export interface IssuesViewRef {
  openCreate: () => void;
}

interface IssuesViewProps {
  title: string;
  subtitle?: string;
  hideHeader?: boolean;
  viewMode?: 'board' | 'list' | 'calendar';
  onViewModeChange?: (mode: 'board' | 'list' | 'calendar') => void;
  issues: Issue[];
  projects: Project[];
  onCreateIssue: (title: string, description: string, projectId: string, priority: IssuePriority, status: IssueStatus, dueDate?: string) => void;
  onUpdateIssue: (id: string, updates: Partial<Issue>) => void;
  onDeleteIssue: (id: string) => void;
  onCreateProject?: () => void;
}

const COLUMNS: IssueStatus[] = ['Todo', 'In Progress', 'Done', 'Canceled'];
const PRIORITIES: IssuePriority[] = ['No Priority', 'Low', 'Medium', 'High', 'Urgent'];

const CustomSelect = ({ 
  value, onChange, options, label, icon, getColor, searchable, onCreateNew, createNewText 
}: { 
  value: string, onChange: (v: string) => void, options: {value: string, label: string, color?: string}[], 
  label: string, icon?: React.ReactNode, getColor?: (val: string) => string, searchable?: boolean,
  onCreateNew?: () => void, createNewText?: string 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const selectedOption = options.find(o => o.value === value);
  const selectedLabel = selectedOption?.label || value;

  const filteredOptions = searchable ? options.filter(o => o.label.toLowerCase().includes(searchQuery.toLowerCase())) : options;

  const handleOpen = () => {
    setSearchQuery('');
    setIsOpen(true);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--hairline)' }}>
      <div style={{ width: 90, fontSize: 13, color: 'var(--ink-subtle)', display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon}
        {label}
      </div>
      <div style={{ position: 'relative', flex: 1 }}>
        <button
          type="button"
          onClick={handleOpen}
          style={{
            width: '100%', background: 'transparent', border: 'none', textAlign: 'left', display: 'block',
            outline: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: getColor ? getColor(value) : 'var(--ink)',
            padding: '4px 24px 4px 8px', borderRadius: 'var(--radius-sm)', transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-2)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {selectedOption?.color && <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: selectedOption.color }} />}
            {selectedLabel}
          </div>
        </button>
        <ChevronDown size={14} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--ink-tertiary)' }} />
        
        {isOpen && (
          <>
            <div 
              style={{ position: 'fixed', inset: 0, zIndex: 90 }} 
              onClick={() => setIsOpen(false)} 
            />
            <div className="view-animate-fade-in" style={{
              position: 'absolute', top: '100%', left: 0, width: '100%', zIndex: 100,
              background: 'var(--surface-1)', border: '1px solid var(--hairline-strong)',
              borderRadius: 'var(--radius-md)', padding: 4, marginTop: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 2,
              maxHeight: 250
            }}>
              {searchable && (
                <div style={{ padding: '4px 4px 8px' }}>
                  <input
                    autoFocus
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%', background: 'var(--surface-2)', border: '1px solid var(--hairline)',
                      padding: '6px 8px', borderRadius: 'var(--radius-sm)', fontSize: 13, color: 'var(--ink)',
                      outline: 'none'
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>
              )}
              <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {filteredOptions.length === 0 ? (
                  <div style={{ padding: '8px', fontSize: 12, color: 'var(--ink-tertiary)', textAlign: 'center' }}>No results</div>
                ) : (
                  filteredOptions.map(o => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => { onChange(o.value); setIsOpen(false); }}
                      style={{
                        textAlign: 'left', background: value === o.value ? 'var(--surface-3)' : 'transparent', border: 'none',
                        padding: '6px 12px', fontSize: 13, color: getColor ? getColor(o.value) : 'var(--ink)', cursor: 'pointer',
                        borderRadius: 'var(--radius-sm)', transition: 'background 0.1s ease',
                        fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-3)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = value === o.value ? 'var(--surface-3)' : 'transparent'}
                    >
                      {o.color && <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: o.color }} />}
                      {o.label}
                    </button>
                  ))
                )}
              </div>
              {onCreateNew && (
                <div style={{ padding: '4px', borderTop: '1px solid var(--hairline)', marginTop: 2 }}>
                  <button
                    type="button"
                    onClick={() => { setIsOpen(false); onCreateNew(); }}
                    style={{
                      width: '100%', textAlign: 'left', background: 'transparent', border: 'none',
                      padding: '6px 8px', fontSize: 13, color: 'var(--ink-subtle)', cursor: 'pointer',
                      borderRadius: 'var(--radius-sm)', transition: 'background 0.1s ease',
                      fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--ink)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--ink-subtle)'; }}
                  >
                    <Plus size={14} />
                    {createNewText || 'Create new'}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const FilterPill = ({ 
  value, onChange, options, prefix 
}: { 
  value: string, onChange: (v: string) => void, options: {value: string, label: string}[], prefix?: string 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label || value;

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: value !== 'all' ? 'var(--surface-3)' : 'var(--surface-2)', 
          border: '1px solid var(--hairline)', borderRadius: 'var(--radius-sm)',
          padding: '4px 8px', color: 'var(--ink)', fontSize: 12, outline: 'none', cursor: 'pointer',
          fontWeight: value !== 'all' ? 500 : 400
        }}
      >
        {prefix && <span style={{ color: 'var(--ink-subtle)' }}>{prefix}:</span>}
        {selectedLabel}
        <ChevronDown size={12} style={{ color: 'var(--ink-tertiary)' }} />
      </button>
      {isOpen && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={() => setIsOpen(false)} />
          <div className="view-animate-fade-in" style={{
            position: 'absolute', top: '100%', left: 0, zIndex: 100, minWidth: 150,
            background: 'var(--surface-1)', border: '1px solid var(--hairline-strong)',
            borderRadius: 'var(--radius-md)', padding: 4, marginTop: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 2,
            maxHeight: 250, overflowY: 'auto'
          }}>
            {options.map(o => (
              <button
                key={o.value}
                onClick={() => { onChange(o.value); setIsOpen(false); }}
                style={{
                  textAlign: 'left', background: value === o.value ? 'var(--surface-3)' : 'transparent', border: 'none',
                  padding: '6px 12px', fontSize: 12, color: 'var(--ink)', cursor: 'pointer',
                  borderRadius: 'var(--radius-sm)', transition: 'background 0.1s ease',
                  fontWeight: value === o.value ? 500 : 400
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-3)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = value === o.value ? 'var(--surface-3)' : 'transparent'}
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const IssuesView = forwardRef<IssuesViewRef, IssuesViewProps>(({ 
  title, subtitle, hideHeader, viewMode: externalViewMode, onViewModeChange, 
  issues, projects, onCreateIssue, onUpdateIssue, onDeleteIssue, onCreateProject
}, ref) => {
  const [internalViewMode, setInternalViewMode] = useState<'board' | 'list' | 'calendar'>('board');
  const viewMode = externalViewMode || internalViewMode;
  const setViewMode = (onViewModeChange || setInternalViewMode) as any;
  
  const [activePanel, setActivePanel] = useState<'none' | 'create' | 'edit'>('none');
  const [editingIssueId, setEditingIssueId] = useState<string | null>(null);
  
  // Filter & Sort States
  const [filterProject, setFilterProject] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterDueDate, setFilterDueDate] = useState<string>('all'); // 'all', 'overdue', 'today', 'no-date'
  const [sortBy, setSortBy] = useState<'createdAt' | 'dueDate' | 'priority'>('createdAt');

  const filteredIssues = React.useMemo(() => {
    return issues.filter(issue => {
      // Project filter
      if (filterProject !== 'all' && issue.projectId !== filterProject) return false;
      // Priority filter
      if (filterPriority !== 'all' && issue.priority !== filterPriority) return false;
      // Due Date filter
      if (filterDueDate !== 'all') {
        if (filterDueDate === 'no-date') {
          if (issue.dueDate) return false;
        } else {
          if (!issue.dueDate) return false;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const d = new Date(issue.dueDate);
          d.setHours(0, 0, 0, 0);
          if (filterDueDate === 'overdue' && (d >= today || issue.status === 'Done')) return false;
          if (filterDueDate === 'today' && d.getTime() !== today.getTime()) return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'createdAt') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'priority') {
        const priorityWeight = { 'Urgent': 4, 'High': 3, 'Medium': 2, 'Low': 1, 'No Priority': 0 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return 0;
    });
  }, [issues, filterProject, filterPriority, filterDueDate, sortBy]);
  
  useImperativeHandle(ref, () => ({
    openCreate: () => {
      setActivePanel('create');
      setEditingIssueId(null);
    }
  }));
  const [showCanceled, setShowCanceled] = useState(false);
  const [panelWidth, setPanelWidth] = useState(360);
  const [isResizingPanel, setIsResizingPanel] = useState(false);

  React.useEffect(() => {
    if (!isResizingPanel) return;
    const handleMouseMove = (e: MouseEvent) => {
      // panel is on the right, so calculate width from the right edge
      const newWidth = Math.max(300, Math.min(document.body.clientWidth - e.clientX, 800));
      setPanelWidth(newWidth);
    };
    const handleMouseUp = () => setIsResizingPanel(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingPanel]);

  // Form state for creating issue
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newProjId, setNewProjId] = useState(projects.length > 0 ? projects[0].id : '');
  const [newPrio, setNewPrio] = useState<IssuePriority>('No Priority');
  const [newStatus, setNewStatus] = useState<IssueStatus>('Todo');
  const [newDueDate, setNewDueDate] = useState<string>('');
  const dateInputRef = React.useRef<HTMLInputElement>(null);

  const titleRef = React.useRef<HTMLTextAreaElement>(null);
  React.useEffect(() => {
    if (titleRef.current && (activePanel === 'create' || activePanel === 'edit')) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
    }
  }, [newTitle, activePanel]);

  const handleOpenCreate = (initialStatus?: IssueStatus, initialDate?: string) => {
    setNewTitle('');
    setNewDesc('');
    setNewProjId(projects.length > 0 ? projects[0].id : '');
    setNewPrio('No Priority');
    setNewStatus(initialStatus || 'Todo');
    setNewDueDate(initialDate || '');
    setActivePanel('create');
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newProjId) return;
    
    if (activePanel === 'create') {
      onCreateIssue(newTitle, newDesc, newProjId, newPrio, newStatus, newDueDate || undefined);
    } else if (activePanel === 'edit' && editingIssueId) {
      onUpdateIssue(editingIssueId, {
        title: newTitle,
        description: newDesc,
        projectId: newProjId,
        priority: newPrio,
        status: newStatus,
        dueDate: newDueDate || undefined,
      });
    }
    setActivePanel('none');
    setEditingIssueId(null);
  };

  const handleOpenEdit = (issue: Issue) => {
    setEditingIssueId(issue.id);
    setNewTitle(issue.title);
    setNewDesc(issue.description);
    setNewProjId(issue.projectId);
    setNewPrio(issue.priority);
    setNewStatus(issue.status);
    setNewDueDate(issue.dueDate ? issue.dueDate.split('T')[0] : '');
    setActivePanel('edit');
  };

  const handleDelete = () => {
    if (!editingIssueId) return;
    onDeleteIssue(editingIssueId);
    setActivePanel('none');
    setEditingIssueId(null);
  };

  const getProject = (id: string) => projects.find(p => p.id === id);

  const getPriorityColor = (priority: IssuePriority) => {
    switch (priority) {
      case 'Urgent': return 'var(--tag-red)';
      case 'High': return 'var(--tag-orange)';
      case 'Medium': return 'var(--tag-yellow)';
      case 'Low': return 'var(--tag-green)';
      default: return 'var(--ink-tertiary)';
    }
  };

  const renderLayoutToggles = () => (
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
  );

  const renderNewIssueButton = () => (
    <button
      onClick={() => handleOpenCreate()}
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
  );

  return (
    <div className="view-animate-fade-in" style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      
      {/* LEFT SIDE: MAIN BOARD/LIST */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0, transition: 'all 0.3s ease' }}>
        
        {/* Click-outside Overlay */}
        {activePanel !== 'none' && (
          <div 
            onClick={() => { setActivePanel('none'); setEditingIssueId(null); }}
            style={{ position: 'absolute', inset: 0, zIndex: 40, cursor: 'default' }}
          />
        )}
        {/* Header */}
        {!hideHeader && (
          <div style={{
            padding: title ? '32px 40px 24px' : '16px 40px 16px', 
            borderBottom: title ? '1px solid var(--hairline)' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            {title ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--ink)', margin: 0, letterSpacing: '-0.3px' }}>
                  {title}
                </h1>
                {subtitle && (
                  <span style={{ fontSize: 14, color: 'var(--ink-subtle)' }}>
                    {subtitle}
                  </span>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {renderLayoutToggles()}
                {renderNewIssueButton()}
              </div>
            )}
            
            {title && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {renderLayoutToggles()}
                {renderNewIssueButton()}
              </div>
            )}
          </div>
        )}

        {/* Filter & Sort Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 40px',
          borderBottom: '1px solid var(--hairline)',
          backgroundColor: 'var(--surface-1)',
          gap: 16,
          flexWrap: 'wrap'
        }}>
          {/* Left: Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'var(--ink-tertiary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Filter</span>
            
            {/* Project Filter select */}
            <FilterPill
              value={filterProject}
              onChange={setFilterProject}
              options={[{ value: 'all', label: 'All Projects' }, ...projects.map(p => ({ value: p.id, label: p.name }))]}
            />

            {/* Priority Filter select */}
            <FilterPill
              value={filterPriority}
              onChange={setFilterPriority}
              options={[{ value: 'all', label: 'All Priorities' }, ...PRIORITIES.map(p => ({ value: p, label: p }))]}
            />

            {/* Due Date Filter select */}
            <FilterPill
              value={filterDueDate}
              onChange={setFilterDueDate}
              options={[
                { value: 'all', label: 'Any Due Date' },
                { value: 'today', label: 'Due Today' },
                { value: 'overdue', label: 'Overdue' },
                { value: 'no-date', label: 'No Due Date' }
              ]}
            />
            
            {(filterProject !== 'all' || filterPriority !== 'all' || filterDueDate !== 'all') && (
              <button 
                onClick={() => { setFilterProject('all'); setFilterPriority('all'); setFilterDueDate('all'); }}
                style={{
                  background: 'none', border: 'none', color: 'var(--primary)', fontSize: 12,
                  fontWeight: 500, cursor: 'pointer', padding: '4px 8px'
                }}
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Right: Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--ink-tertiary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sort By</span>
            <FilterPill
              value={sortBy}
              onChange={(v) => setSortBy(v as any)}
              options={[
                { value: 'createdAt', label: 'Date Created' },
                { value: 'dueDate', label: 'Due Date' },
                { value: 'priority', label: 'Priority' }
              ]}
            />
          </div>
        </div>

      {/* Content */}
      <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto', padding: '24px 24px' }}>
        {viewMode === 'board' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
            <KanbanBoard
              issues={filteredIssues.filter(i => i.status !== 'Canceled')}
              projects={projects}
              onUpdateIssue={onUpdateIssue}
              onOpenEdit={handleOpenEdit}
              onOpenCreate={handleOpenCreate}
            />
            
            {/* ROW 2: Canceled (Collapsible) */}
            <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
              <div 
                onClick={() => setShowCanceled(!showCanceled)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                  padding: '8px 0', color: 'var(--ink-subtle)', fontSize: 13, fontWeight: 500,
                  borderTop: '1px solid var(--hairline)', paddingTop: 16
                }}
              >
                {showCanceled ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <span>Canceled <span style={{ color: 'var(--ink-tertiary)', marginLeft: 8 }}>{filteredIssues.filter(i => i.status === 'Canceled').length}</span></span>
              </div>
              
              {showCanceled && (
                <div className="view-animate-fade-in" style={{ 
                  display: 'flex', gap: 16, marginTop: 16, overflowX: 'auto', paddingBottom: 16
                }}>
                  {filteredIssues.filter(i => i.status === 'Canceled').map(issue => {
                    const project = getProject(issue.projectId);
                    return (
                      <div key={issue.id} onClick={() => handleOpenEdit(issue)} style={{
                        background: 'var(--surface-1)', border: '1px solid var(--hairline-strong)',
                        borderRadius: 'var(--radius-md)', padding: '12px 16px', minWidth: 260, maxWidth: 300,
                        cursor: 'pointer', transition: 'border 0.2s ease, box-shadow 0.2s ease',
                        display: 'flex', flexDirection: 'column', gap: 12, opacity: 0.7
                      }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '1';
                          e.currentTarget.style.borderColor = 'var(--hairline-tertiary)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '0.7';
                          e.currentTarget.style.borderColor = 'var(--hairline-strong)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.4, textDecoration: 'line-through' }}>
                          {issue.title}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {project && (
                              <span style={{
                                fontSize: 11, fontWeight: 500, padding: '2px 6px', borderRadius: 'var(--radius-sm)',
                                background: 'var(--surface-2)', color: project.color, display: 'flex', alignItems: 'center', gap: 4
                              }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: project.color }} />
                                {project.name}
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: 11, color: getPriorityColor(issue.priority), fontWeight: 500 }}>
                            {issue.priority}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        ) : viewMode === 'calendar' ? (
          <CalendarView
            issues={filteredIssues}
            projects={projects}
            onOpenEdit={handleOpenEdit}
            onOpenCreate={handleOpenCreate}
          />
        ) : (
          <div className="view-animate-stagger" style={{ maxWidth: 800 }}>
            {filteredIssues.length === 0 ? (
              <p style={{ color: 'var(--ink-tertiary)' }}>No issues found.</p>
            ) : (
              filteredIssues.map(issue => {
                const project = getProject(issue.projectId);
                return (
                  <div key={issue.id} onClick={() => handleOpenEdit(issue)} style={{
                    display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0',
                    borderBottom: '1px solid var(--hairline)', cursor: 'pointer',
                    transition: 'background 0.2s ease'
                  }}>
                    <span style={{ fontSize: 13, color: 'var(--ink-subtle)', width: 80 }}>{issue.status}</span>
                    <span style={{ fontSize: 14, color: 'var(--ink)', flex: 1, fontWeight: 500 }}>{issue.title}</span>
                    {project && (
                      <span style={{ fontSize: 12, color: project.color, width: 120 }}>{project.name}</span>
                    )}
                    <span style={{ fontSize: 12, color: getPriorityColor(issue.priority), width: 80, textAlign: 'right' }}>{issue.priority}</span>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>

    {/* RIGHT SIDE: SPACER (pushes main content) */}
      <div style={{ 
        width: activePanel !== 'none' ? panelWidth : 0, 
        flexShrink: 0,
        transition: isResizingPanel ? 'none' : 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }} />

      {/* RIGHT SIDE: FIXED PANEL (Portaled to avoid transform containing blocks) */}
      {createPortal(
        <div style={{ 
          position: 'fixed',
          top: 56, /* Height of TopBar */
          right: 0,
          bottom: 0,
          width: activePanel !== 'none' ? panelWidth : 0, 
          borderLeft: activePanel !== 'none' ? '1px solid var(--hairline)' : 'none', 
          background: 'var(--main-panel)',
          zIndex: 50,
          transition: isResizingPanel ? 'none' : 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
          overflow: 'hidden',
          opacity: activePanel !== 'none' ? 1 : 0
        }}>
          {/* Resizer Handle */}
          {activePanel !== 'none' && (
            <div 
              onMouseDown={(e) => { e.preventDefault(); setIsResizingPanel(true); }}
              style={{
                position: 'absolute', top: 0, left: 0, width: 6, height: '100%',
                cursor: 'col-resize', zIndex: 100,
                backgroundColor: isResizingPanel ? 'var(--primary)' : 'transparent',
                transition: 'background-color 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
              onMouseLeave={(e) => { if (!isResizingPanel) e.currentTarget.style.backgroundColor = 'transparent' }}
            />
          )}
          <div style={{ width: panelWidth, display: 'flex', flexDirection: 'column', height: '100%' }}>
            {(activePanel === 'create' || activePanel === 'edit') && (
              <>
              <div style={{
                padding: '20px 32px 20px', borderBottom: '1px solid var(--hairline)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink)' }}>
                  <LayoutTemplate size={16} style={{ color: 'var(--primary)' }} />
                  <h2 style={{ fontSize: 16, fontWeight: 500, margin: 0, letterSpacing: '-0.2px' }}>
                    {activePanel === 'create' ? 'New Issue' : 'Edit Issue'}
                  </h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {activePanel === 'edit' && (
                    <button
                      onClick={handleDelete}
                      title="Delete issue"
                      style={{ background: 'none', border: 'none', color: 'var(--tag-red)', cursor: 'pointer', padding: 4, display: 'flex' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => { setActivePanel('none'); setEditingIssueId(null); }}
                    style={{ background: 'none', border: 'none', color: 'var(--ink-tertiary)', cursor: 'pointer', padding: 4, display: 'flex' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
                <form id="issue-form" onSubmit={submitForm} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <textarea
                    ref={titleRef}
                    autoFocus
                    placeholder="Issue title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    rows={1}
                    onInput={(e) => {
                      e.currentTarget.style.height = 'auto';
                      e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                    }}
                    style={{
                      width: '100%', background: 'transparent', border: 'none',
                      fontSize: 24, fontWeight: 600, color: 'var(--ink)', outline: 'none', padding: 0,
                      letterSpacing: '-0.4px', resize: 'none', overflow: 'hidden',
                      lineHeight: 1.3
                    }}
                  />
                  <textarea
                    placeholder="Add description..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows={4}
                    style={{
                      width: '100%', background: 'transparent', border: 'none',
                      fontSize: 15, color: 'var(--ink)', outline: 'none', padding: 0, resize: 'none', fontFamily: 'inherit',
                      lineHeight: 1.5
                    }}
                  />
                  
                  {/* Selectors */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 24 }}>
                    <CustomSelect
                      label="Project"
                      icon={<Folder size={14} />}
                      value={newProjId}
                      onChange={setNewProjId}
                      options={projects.map(p => ({ value: p.id, label: p.name, color: p.color }))}
                      searchable
                      onCreateNew={onCreateProject}
                      createNewText="Create new project..."
                    />
                    <CustomSelect
                      label="Status"
                      icon={<CircleDashed size={14} />}
                      value={newStatus}
                      onChange={(v) => setNewStatus(v as IssueStatus)}
                      options={COLUMNS.map(s => ({ value: s, label: s }))}
                    />
                    <CustomSelect
                      label="Priority"
                      icon={<Flag size={14} />}
                      value={newPrio}
                      onChange={(v) => setNewPrio(v as IssuePriority)}
                      options={PRIORITIES.map(p => ({ value: p, label: p }))}
                      getColor={(val) => getPriorityColor(val as IssuePriority)}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--hairline)' }}>
                      <div style={{ width: 90, fontSize: 13, color: 'var(--ink-subtle)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Calendar size={14} />
                        Due Date
                      </div>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1 }}>
                        <button
                          type="button"
                          onClick={() => {
                            if (dateInputRef.current && 'showPicker' in HTMLInputElement.prototype) {
                              try { dateInputRef.current.showPicker(); } catch (e) { dateInputRef.current.focus(); }
                            } else if (dateInputRef.current) {
                              dateInputRef.current.focus();
                            }
                          }}
                          style={{
                            width: '100%', background: 'transparent', border: 'none', textAlign: 'left',
                            fontSize: 13, fontWeight: 500, color: newDueDate ? 'var(--ink)' : 'var(--ink-tertiary)',
                            padding: '4px 24px 4px 8px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 6,
                            transition: 'background 0.2s', position: 'relative', zIndex: 2
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-2)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          {newDueDate ? new Date(newDueDate).toLocaleDateString() : 'Set date...'}
                        </button>
                        <input
                          ref={dateInputRef}
                          type="date"
                          value={newDueDate}
                          onChange={(e) => setNewDueDate(e.target.value)}
                          style={{
                            position: 'absolute', inset: 0, opacity: 0, pointerEvents: 'none', width: '100%', height: '100%', zIndex: 1
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div style={{
                padding: '16px 32px', background: 'var(--surface-1)', borderTop: '1px solid var(--hairline)',
                display: 'flex', justifyContent: 'flex-end', gap: 12
              }}>
                <button
                  type="button" onClick={() => { setActivePanel('none'); setEditingIssueId(null); }}
                  style={{ background: 'transparent', color: 'var(--ink)', border: '1px solid var(--hairline-strong)', padding: '8px 16px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit" form="issue-form"
                  disabled={!newTitle.trim() || !newProjId}
                  style={{
                    background: 'var(--primary)', color: '#fff', border: 'none',
                    padding: '8px 16px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500,
                    cursor: (!newTitle.trim() || !newProjId) ? 'not-allowed' : 'pointer', opacity: (!newTitle.trim() || !newProjId) ? 0.5 : 1
                  }}
                >
                  {activePanel === 'create' ? 'Create Issue' : 'Save Changes'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>,
      document.body
    )}
  </div>
);
});
