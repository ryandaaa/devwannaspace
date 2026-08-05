import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { Issue, Project, IssueStatus } from '../../types';

interface CalendarViewProps {
  issues: Issue[];
  projects: Project[];
  onOpenEdit: (issue: Issue) => void;
  onOpenCreate: (status: IssueStatus, initialDate?: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  issues,
  projects,
  onOpenEdit,
  onOpenCreate
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    // Day of the week (0 = Sunday, 1 = Monday...)
    const firstDayOfWeek = firstDay.getDay();
    // Adjust so Monday is 0, Sunday is 6
    const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const days: Date[] = [];
    const tempDate = new Date(year, month, 1);
    tempDate.setDate(tempDate.getDate() - startOffset);
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(tempDate));
      tempDate.setDate(tempDate.getDate() + 1);
    }
    
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = getCalendarDays(currentDate);
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getIssuesForDate = (date: Date) => {
    return issues.filter(issue => {
      if (!issue.dueDate) return false;
      const d = new Date(issue.dueDate);
      return d.getFullYear() === date.getFullYear() &&
             d.getMonth() === date.getMonth() &&
             d.getDate() === date.getDate();
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'var(--danger)';
      case 'High': return 'var(--tag-orange)';
      case 'Medium': return 'var(--tag-yellow)';
      case 'Low': return 'var(--primary)';
      default: return 'var(--ink-tertiary)';
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: 16 }}>
      {/* Calendar Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
            {currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
          </h2>
          <div style={{ display: 'flex', border: '1px solid var(--hairline)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <button 
              onClick={handlePrevMonth}
              style={{
                background: 'none', border: 'none', color: 'var(--ink-subtle)', 
                padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center'
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={handleNextMonth}
              style={{
                background: 'none', border: 'none', color: 'var(--ink-subtle)', 
                padding: '6px 10px', borderLeft: '1px solid var(--hairline)', cursor: 'pointer', display: 'flex', alignItems: 'center'
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <button 
            onClick={() => setCurrentDate(new Date())}
            style={{
              background: 'var(--surface-2)', border: '1px solid var(--hairline)', borderRadius: 'var(--radius-md)',
              padding: '6px 12px', fontSize: 13, color: 'var(--ink)', cursor: 'pointer', fontWeight: 500
            }}
          >
            Today
          </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, border: '1px solid var(--hairline)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {/* Days of Week */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--hairline)', background: 'var(--surface-2)' }}>
          {weekDays.map(day => (
            <div key={day} style={{ padding: '8px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--ink-tertiary)' }}>
              {day}
            </div>
          ))}
        </div>

        {/* Month Days Grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: 'repeat(6, 1fr)' }}>
          {days.map((date, idx) => {
            const dateIssues = getIssuesForDate(date);
            const activeMonth = isCurrentMonth(date);
            const currentDay = isToday(date);
            
            return (
              <div 
                key={idx}
                style={{
                  borderRight: (idx + 1) % 7 !== 0 ? '1px solid var(--hairline)' : 'none',
                  borderBottom: idx < 35 ? '1px solid var(--hairline)' : 'none',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  minHeight: 0,
                  overflow: 'hidden',
                  background: currentDay ? 'rgba(94, 106, 210, 0.05)' : 'transparent',
                  opacity: activeMonth ? 1 : 0.4
                }}
              >
                {/* Day Number Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: 12,
                    fontWeight: currentDay ? 700 : 500,
                    color: currentDay ? 'var(--primary)' : 'var(--ink)',
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: currentDay ? 'var(--primary-focus)' : 'transparent'
                  }}>
                    {date.getDate()}
                  </span>
                  
                  {activeMonth && (
                    <button 
                      onClick={() => onOpenCreate('Todo', date.toISOString().split('T')[0])}
                      className="cal-add-btn"
                      style={{
                        background: 'none', border: 'none', color: 'var(--ink-tertiary)',
                        cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center',
                        borderRadius: 'var(--radius-sm)'
                      }}
                      title="Add issue for this day"
                    >
                      <Plus size={12} />
                    </button>
                  )}
                </div>

                {/* Day Issues List */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', paddingRight: '2px' }}>
                  {dateIssues.slice(0, 4).map(issue => {
                    const project = projects.find(p => p.id === issue.projectId);
                    return (
                      <div
                        key={issue.id}
                        onClick={() => onOpenEdit(issue)}
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          padding: '3px 6px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--surface-1)',
                          border: '1px solid var(--hairline-strong)',
                          borderLeft: project ? `3px solid ${project.color}` : '1px solid var(--hairline-strong)',
                          color: 'var(--ink)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={issue.title}
                      >
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: getPriorityColor(issue.priority), flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{issue.title}</span>
                      </div>
                    );
                  })}
                  {dateIssues.length > 4 && (
                    <div style={{ fontSize: 10, color: 'var(--ink-tertiary)', paddingLeft: '4px', fontWeight: 600 }}>
                      + {dateIssues.length - 4} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
