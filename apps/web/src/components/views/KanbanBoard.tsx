import React from 'react';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Calendar } from 'lucide-react';
import type { Issue, Project, IssueStatus } from '../../types';

interface KanbanBoardProps {
  issues: Issue[];
  projects: Project[];
  onUpdateIssue: (id: string, updates: Partial<Issue>) => void;
  onOpenEdit: (issue: Issue) => void;
  onOpenCreate: (status: IssueStatus) => void;
}

const IssueCard = React.forwardRef<HTMLDivElement, { issue: Issue, project?: Project, onClick: () => void, style?: React.CSSProperties, attributes?: any, listeners?: any, isDragging?: boolean }>(({ issue, project, onClick, style, attributes, listeners, isDragging }, ref) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'var(--danger)';
      case 'High': return 'var(--tag-orange)';
      case 'Medium': return 'var(--tag-yellow)';
      case 'Low': return 'var(--primary)';
      default: return 'var(--ink-tertiary)';
    }
  };

  const getDueDateInfo = (dateStr?: string) => {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    
    const formatted = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    
    if (d < today && issue.status !== 'Done') {
      return {
        label: formatted,
        color: 'var(--tag-red)',
        bg: 'rgba(235, 87, 87, 0.1)',
        border: '1px solid rgba(235, 87, 87, 0.15)'
      };
    }
    if (d.getTime() === today.getTime() && issue.status !== 'Done') {
      return {
        label: `Today (${formatted})`,
        color: 'var(--tag-orange)',
        bg: 'rgba(242, 153, 74, 0.1)',
        border: '1px solid rgba(242, 153, 74, 0.15)'
      };
    }
    return {
      label: formatted,
      color: 'var(--ink-subtle)',
      bg: 'var(--surface-2)',
      border: '1px solid var(--hairline)'
    };
  };

  const dueDateInfo = getDueDateInfo(issue.dueDate);

  return (
    <div
      ref={ref}
      style={{
        ...style,
        background: 'var(--surface-1)', border: '1px solid var(--hairline-strong)',
        borderRadius: 'var(--radius-md)', padding: '12px 16px',
        cursor: 'grab', transition: isDragging ? 'none' : 'border 0.2s ease, box-shadow 0.2s ease',
        display: 'flex', flexDirection: 'column', gap: 12,
        boxShadow: isDragging ? '0 12px 24px rgba(0,0,0,0.3)' : 'none'
      }}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation();
        if (!isDragging) onClick();
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.4 }}>
        {issue.title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
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
          {dueDateInfo && (
            <span style={{
              fontSize: 10,
              fontWeight: 500,
              padding: '2px 6px',
              borderRadius: 'var(--radius-sm)',
              background: dueDateInfo.bg,
              color: dueDateInfo.color,
              border: dueDateInfo.border,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              <Calendar size={10} />
              {dueDateInfo.label}
            </span>
          )}
        </div>
        <span style={{ fontSize: 11, color: getPriorityColor(issue.priority), fontWeight: 500 }}>
          {issue.priority}
        </span>
      </div>
    </div>
  );
});

const SortableIssueCard = ({ issue, project, onClick }: { issue: Issue, project?: Project, onClick: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: issue.id, data: { type: 'Issue', issue } });
  
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <IssueCard
      ref={setNodeRef}
      issue={issue}
      project={project}
      onClick={onClick}
      style={style}
      attributes={attributes}
      listeners={listeners}
      isDragging={isDragging}
    />
  );
};

const DroppableColumn = ({ status, issues, projects, onOpenEdit, onOpenCreate }: { status: IssueStatus, issues: Issue[], projects: Project[], onOpenEdit: (issue: Issue) => void, onOpenCreate: (status: IssueStatus) => void }) => {
  const { setNodeRef, isOver } = useDroppable({ id: status, data: { type: 'Column', status } });

  return (
    <div ref={setNodeRef} style={{ 
      minWidth: 260, flex: 1, maxWidth: 400, display: 'flex', flexDirection: 'column',
      background: isOver ? 'var(--surface-2)' : 'transparent',
      borderRadius: 'var(--radius-lg)', padding: '12px', margin: '-12px',
      transition: 'background 0.2s ease'
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16, color: 'var(--ink-subtle)', fontSize: 13, fontWeight: 500,
        padding: '0 4px'
      }}>
        <span>{status} <span style={{ color: 'var(--ink-tertiary)', marginLeft: 8 }}>{issues.length}</span></span>
        <button onClick={() => onOpenCreate(status)} style={{ background: 'none', border: 'none', color: 'var(--ink-tertiary)', cursor: 'pointer', padding: 0 }}>
          <Plus size={14} />
        </button>
      </div>
      <SortableContext items={issues.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 150 }}>
          {issues.map(issue => (
            <SortableIssueCard 
              key={issue.id} 
              issue={issue} 
              project={projects.find(p => p.id === issue.projectId)} 
              onClick={() => onOpenEdit(issue)} 
            />
          ))}
          
          <button
            onClick={() => onOpenCreate(status)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px',
              background: 'transparent', border: '1px dashed var(--hairline-strong)',
              borderRadius: 'var(--radius-md)', color: 'var(--ink-tertiary)',
              fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s ease',
              marginTop: issues.length > 0 ? 0 : 8
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--ink)';
              e.currentTarget.style.borderColor = 'var(--ink-subtle)';
              e.currentTarget.style.background = 'var(--surface-1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--ink-tertiary)';
              e.currentTarget.style.borderColor = 'var(--hairline-strong)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <Plus size={14} /> New {status}
          </button>
        </div>
      </SortableContext>
    </div>
  );
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ issues, projects, onUpdateIssue, onOpenEdit, onOpenCreate }) => {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeIssue, setActiveIssue] = React.useState<Issue | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setActiveIssue(event.active.data.current?.issue || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setActiveIssue(null);
    
    const { active, over } = event;
    if (!over) return;

    const activeIdStr = active.id as string;
    const overIdStr = over.id as string;

    if (activeIdStr === overIdStr) return;

    const isActiveIssue = active.data.current?.type === 'Issue';
    const isOverIssue = over.data.current?.type === 'Issue';
    const isOverColumn = over.data.current?.type === 'Column';

    if (isActiveIssue) {
      if (isOverIssue) {
        // Find the status of the over issue
        const overIssueStatus = over.data.current?.issue?.status;
        if (overIssueStatus && activeIssue?.status !== overIssueStatus) {
          onUpdateIssue(activeIdStr, { status: overIssueStatus });
        }
      } else if (isOverColumn) {
        const overStatus = over.data.current?.status;
        if (overStatus && activeIssue?.status !== overStatus) {
          onUpdateIssue(activeIdStr, { status: overStatus });
        }
      }
    }
  };

  const columns: IssueStatus[] = ['Todo', 'In Progress', 'Done'];

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
        <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 0 }}>
          {columns.map(status => (
            <DroppableColumn 
              key={status} 
              status={status} 
              issues={issues.filter(i => i.status === status)} 
              projects={projects} 
              onOpenEdit={onOpenEdit} 
              onOpenCreate={onOpenCreate}
            />
          ))}
        </div>
      </div>
      <DragOverlay dropAnimation={{
        duration: 250,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }}>
        {activeId && activeIssue ? (
          <IssueCard issue={activeIssue} project={projects.find(p => p.id === activeIssue.projectId)} onClick={() => {}} isDragging={true} style={{ width: 300 }} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
