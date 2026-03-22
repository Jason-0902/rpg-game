import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PanelProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

const Panel = ({ title, subtitle, actions, children, className }: PanelProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className={`panel glass-card noise ${className ?? ''}`}
    >
      <header className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h3 className="panel-title text-base md:text-lg">{title}</h3>
          {subtitle ? <p className="text-xs text-slate-400 md:text-sm">{subtitle}</p> : null}
        </div>
        {actions}
      </header>
      {children}
    </motion.section>
  );
};

export default Panel;
