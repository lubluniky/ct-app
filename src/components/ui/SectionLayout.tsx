import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionLayoutProps {
  number: string;
  title: string;
  children: ReactNode;
  className?: string;
  id?: string;
}

export const SectionLayout = ({ number, title, children, className, id }: SectionLayoutProps) => {
  return (
    <section id={id} className={cn("py-24 px-6 md:px-12", className)}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-baseline gap-4 mb-16 border-b border-border pb-6">
          <span className="text-sm font-mono text-muted-foreground">/{number}</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{title}</h2>
        </div>
        
        {children}
      </div>
    </section>
  );
};
