import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TableColumn {
  key: string;
  title: string;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  emptyText?: string;
  onRowClick?: (row: any) => void;
  selectedRows?: string[];
  onSelectRow?: (id: string) => void;
  onSelectAll?: () => void;
  selectKey?: string;
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  emptyText = '暂无数据',
  onRowClick,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  selectKey = 'id',
}) => {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortOrder]);

  const allSelected = data.length > 0 && data.every((row) => selectedRows.includes(row[selectKey]));

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#F8F9FA]">
            {onSelectRow && (
              <th className="px-4 py-3 text-left w-10">
                <input
                  type="checkbox"
                  checked={allSelected && data.length > 0}
                  onChange={onSelectAll}
                  className="w-4 h-4 rounded border-[#DEE2E6] text-[#4263EB] focus:ring-[#4263EB]"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left text-sm font-semibold text-[#212529] ${col.width || ''}`}
              >
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSort(col.key)}
                >
                  {col.title}
                  {sortKey === col.key && (
                    sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (onSelectRow ? 1 : 0)}
                className="px-4 py-12 text-center text-[#868E96]"
              >
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-12 h-12 text-[#DEE2E6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <span>{emptyText}</span>
                </div>
              </td>
            </tr>
          ) : (
            sortedData.map((row, index) => (
              <tr
                key={row[selectKey] || index}
                className={`
                  border-b border-[#DEE2E6] transition-colors
                  ${onRowClick ? 'cursor-pointer hover:bg-[#F1F3FF]' : ''}
                  ${selectedRows.includes(row[selectKey]) ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'}
                `}
                onClick={() => onRowClick?.(row)}
              >
                {onSelectRow && (
                  <td className="px-4 py-3 w-10" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row[selectKey])}
                      onChange={() => onSelectRow(row[selectKey])}
                      className="w-4 h-4 rounded border-[#DEE2E6] text-[#4263EB] focus:ring-[#4263EB]"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-sm text-[#212529]">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};