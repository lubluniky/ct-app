import { cn } from "@/lib/utils";

interface CornerBracketsProps {
  className?: string;
  children?: React.ReactNode;
}

export const CornerBrackets = ({ className, children }: CornerBracketsProps) => {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-primary" />
      <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-primary" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-primary" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-primary" />
      {children}
    </div>
  );
};
