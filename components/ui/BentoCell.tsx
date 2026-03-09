// BentoCell — configurable grid cell for bento-style layouts, accepts column and row span props.
import React, { ReactNode } from 'react';

interface BentoCellProps {
  children: ReactNode;
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6;
  rowSpan?: 1 | 2 | 3;
  className?: string;
}

const colSpanClass: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
};

const rowSpanClass: Record<number, string> = {
  1: 'row-span-1',
  2: 'row-span-2',
  3: 'row-span-3',
};

const BentoCell: React.FC<BentoCellProps> = ({
  children,
  colSpan = 1,
  rowSpan = 1,
  className = '',
}) => {
  const spanClasses = [
    colSpanClass[colSpan] ?? 'col-span-1',
    rowSpanClass[rowSpan] ?? 'row-span-1',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={spanClasses}>{children}</div>;
};

export default BentoCell;
