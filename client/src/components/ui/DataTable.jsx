import { FiChevronUp, FiChevronDown, FiChevronsUp, FiChevronsDown } from 'react-icons/fi';

const SortIcon = ({ active, direction }) => {
  if (!active) return <FiChevronsUp size={14} className="text-gray-300 dark:text-gray-600" />;
  return direction === 'asc'
    ? <FiChevronUp size={14} className="text-indigo-600" />
    : <FiChevronDown size={14} className="text-indigo-600" />;
};

const DataTable = ({
  columns, data, keyExtractor = (row) => row.id,
  onRowClick, sortBy, sortDirection, onSort,
  loading, emptyState,
}) => {
  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            {columns.map((_, j) => (
              <div key={j} className="h-6 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return emptyState || (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No data found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${col.sortable ? 'cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-200' : ''}`}
                onClick={() => col.sortable && onSort && onSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && (
                    <SortIcon active={sortBy === col.key} direction={sortDirection} />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30' : 'hover:bg-gray-50/50 dark:hover:bg-gray-700/10'}`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
