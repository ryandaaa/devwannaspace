import React, { useEffect, useState } from 'react';
import { Minus, Square, X, Maximize2 } from 'lucide-react';

export const DesktopTitleBar: React.FC = () => {
  const [isWails, setIsWails] = useState(false);
  const [controlsStyle, setControlsStyle] = useState<'mac' | 'windows'>(() => {
    return (localStorage.getItem('windowControlsStyle') as 'mac' | 'windows') || 'mac';
  });
  const [macHover, setMacHover] = useState(false);

  useEffect(() => {
    // Poll until Wails runtime is injected (can take a few ms after window mount)
    const check = () => {
      if ((window as any).runtime) {
        setIsWails(true);
        return;
      }
      setTimeout(check, 50);
    };
    check();

    const handleStyleChange = () => {
      setControlsStyle((localStorage.getItem('windowControlsStyle') as 'mac' | 'windows') || 'mac');
    };
    window.addEventListener('windowControlsChanged', handleStyleChange);
    return () => window.removeEventListener('windowControlsChanged', handleStyleChange);
  }, []);

  const runtime = () => (window as any).runtime;

  const quit = () => runtime()?.Quit();
  const minimise = () => runtime()?.WindowMinimise();
  const toggleMax = () => runtime()?.WindowToggleMaximise();

  if (!isWails) return null;

  return (
    <div 
      className="wails-titlebar"
      onDoubleClick={(e) => {
        if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('.wails-no-drag')) return;
        toggleMax();
      }}
      style={{
        height: controlsStyle === 'mac' ? 36 : 32,
        width: '100%',
        backgroundColor: 'var(--canvas)',
        display: 'flex',
        alignItems: 'center',
        WebkitAppRegion: 'drag', 
        '--wails-draggable': 'drag',
        flexShrink: 0,
        zIndex: 9999,
        borderBottom: '1px solid var(--hairline)',
        position: 'relative',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        cursor: 'default',
      } as any}>
      
      {/* Mac Traffic Lights (Left) */}
      {controlsStyle === 'mac' && (
        <div 
          className="wails-no-drag"
          style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 16, height: '100%', WebkitAppRegion: 'no-drag', '--wails-draggable': 'no-drag' } as any}
          onMouseEnter={() => setMacHover(true)}
          onMouseLeave={() => setMacHover(false)}
        >
          <TrafficLightBtn 
            color="#ff5f56" 
            hoverColor="#e0443e"
            icon={<X size={8} color="#4c0000" style={{ opacity: macHover ? 1 : 0, transition: 'opacity 0.1s' }} strokeWidth={3.5} />}
            onClick={quit} 
          />
          <TrafficLightBtn 
            color="#ffbd2e" 
            hoverColor="#dea123"
            icon={<Minus size={8} color="#5a3e00" style={{ opacity: macHover ? 1 : 0, transition: 'opacity 0.1s' }} strokeWidth={4} />}
            onClick={minimise} 
          />
          <TrafficLightBtn 
            color="#27c93f" 
            hoverColor="#1aab29"
            icon={<Maximize2 size={7} color="#004d00" style={{ opacity: macHover ? 1 : 0, transition: 'opacity 0.1s' }} strokeWidth={3.5} />}
            onClick={toggleMax} 
          />
        </div>
      )}

      {/* Centered Title */}
      <div style={{ 
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 12, 
        fontWeight: 600, 
        color: 'var(--ink-subtle)', 
        pointerEvents: 'none',
        letterSpacing: '0.2px'
      }}>
        devwannaspace
      </div>

      {/* Windows Controls (Right) */}
      {controlsStyle === 'windows' && (
        <div 
          className="wails-no-drag"
          style={{ display: 'flex', height: '100%', WebkitAppRegion: 'no-drag', '--wails-draggable': 'no-drag', marginLeft: 'auto' } as any}>
          <WindowBtn 
            icon={<Minus size={14} />} 
            onClick={minimise} 
          />
          <WindowBtn 
            icon={<Square size={12} />} 
            onClick={toggleMax} 
          />
          <WindowBtn 
            icon={<X size={16} />} 
            onClick={quit} 
            isClose
          />
        </div>
      )}
    </div>
  );
};

const TrafficLightBtn = ({ color, hoverColor, onClick, icon }: { color: string, hoverColor: string, onClick: () => void, icon: React.ReactNode }) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: 12, height: 12,
        borderRadius: '50%',
        backgroundColor: color,
        border: 'none', cursor: 'pointer',
        padding: 0,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
        transition: 'background-color 0.1s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = hoverColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = color;
      }}
    >
      {icon}
    </button>
  );
}

const WindowBtn = ({ icon, onClick, isClose = false }: { icon: React.ReactNode, onClick: () => void, isClose?: boolean }) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: 46, height: '100%',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        background: 'none', border: 'none', color: 'var(--ink-subtle)', cursor: 'pointer',
        transition: 'background 0.1s ease, color 0.1s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isClose ? '#e81123' : 'var(--surface-3)';
        e.currentTarget.style.color = isClose ? '#ffffff' : 'var(--ink)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = 'var(--ink-subtle)';
      }}
    >
      {icon}
    </button>
  );
}
