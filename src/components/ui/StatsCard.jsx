import { useEffect, useRef, useState } from 'react';

const StatsCard = ({ icon, label, value, color = 'blue', prefix = '', suffix = '', delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const numericValue = typeof value === 'number' ? value : parseInt(value) || 0;
    if (hasAnimated.current) { setDisplayValue(numericValue); return; }
    const timer = setTimeout(() => {
      hasAnimated.current = true;
      let start = 0; const end = numericValue; const duration = 1500; const startTime = performance.now();
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime; const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.round(start + (end - start) * easeOut));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  const formatValue = (val) => {
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
    return val.toLocaleString();
  };

  return (
    <div className={`stats-card ${color}`}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
          <h3 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{prefix}{formatValue(displayValue)}{suffix}</h3>
        </div>
        <div className={`stats-card-icon ${color}`}>{icon}</div>
      </div>
    </div>
  );
};

export default StatsCard;
