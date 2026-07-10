import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiCommand } from 'react-icons/fi';
import { COMMANDS } from '../utils/constants';
import { getCompanies, getProperties, getBuildings, getUnits } from '../api/allApi';

const SEARCH_ENDPOINTS = [
  { key: 'companies', label: 'Companies', icon: '🏢', fetcher: (q) => getCompanies({ search: q, limit: 3 }) },
  { key: 'properties', label: 'Properties', icon: '📍', fetcher: (q) => getProperties({ search: q, limit: 3 }) },
  { key: 'buildings', label: 'Buildings', icon: '🏗', fetcher: (q) => getBuildings({ search: q, limit: 3 }) },
  { key: 'units', label: 'Units', icon: '🚪', fetcher: (q) => getUnits({ search: q, limit: 3 }) },
];

const CommandPalette = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('commands');
  const [results, setResults] = useState({ commands: [], ...Object.fromEntries(SEARCH_ENDPOINTS.map((e) => [e.key, []])) });
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setMode('commands');
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const flatResults = useCallback(() => {
    const items = [];
    if (results.commands.length > 0) {
      items.push({ type: 'header', label: 'Commands' });
      results.commands.forEach((c) => items.push({ ...c, type: 'command' }));
    }
    for (const key of SEARCH_ENDPOINTS.map((e) => e.key)) {
      if (results[key]?.length > 0) {
        items.push({ type: 'header', label: SEARCH_ENDPOINTS.find((e) => e.key === key)?.label });
        results[key].forEach((r) => items.push({ ...r, type: 'result', category: key }));
      }
    }
    return items;
  }, [results]);

  useEffect(() => {
    if (!query.trim()) {
      const filtered = COMMANDS.filter((c) => !query || c.label.toLowerCase().includes(query.toLowerCase()) || c.keywords.toLowerCase().includes(query.toLowerCase()));
      setResults({ commands: filtered, ...Object.fromEntries(SEARCH_ENDPOINTS.map((e) => [e.key, []])) });
      return;
    }

    const q = query.toLowerCase();
    const filtered = COMMANDS.filter((c) => c.label.toLowerCase().includes(q) || c.keywords.toLowerCase().includes(q));
    setResults((prev) => ({ ...prev, commands: filtered }));
    setMode(q.startsWith('>') ? 'commands' : 'all');
    setLoading(true);

    const promises = SEARCH_ENDPOINTS.map(async (ep) => {
      try {
        const { data } = await ep.fetcher(query);
        return { key: ep.key, data: (data.data || []).map((item) => ({ id: item.id, label: item.name || item.label || item.unit_name, path: `/${ep.key}/${item.id}/edit` })) };
      } catch { return { key: ep.key, data: [] }; }
    });

    Promise.all(promises).then((allResults) => {
      const update = {};
      allResults.forEach(({ key, data }) => { update[key] = data; });
      setResults((prev) => ({ ...prev, ...update }));
      setLoading(false);
    });
  }, [query]);

  const items = flatResults();

  const handleSelect = (item) => {
    onClose();
    if (item.path) navigate(item.path);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx((i) => Math.min(i + 1, items.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx((i) => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && items[selectedIdx] && items[selectedIdx].type !== 'header') {
      handleSelect(items[selectedIdx]);
    }
    if (e.key === 'Escape') onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/60 dark:bg-black/70 animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-scale-in">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <FiSearch size={18} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search commands, companies, properties..."
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base outline-none"
          />
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 font-mono">↑↓</kbd>
            <span>navigate</span>
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 font-mono">↵</kbd>
            <span>select</span>
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 font-mono">esc</kbd>
            <span>close</span>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto py-2">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
              No results found for "{query}"
            </div>
          )}

          {!loading && items.map((item, idx) => {
            if (item.type === 'header') {
              return (
                <div key={item.label} className="px-5 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {item.label}
                </div>
              );
            }
            return (
              <button
                key={item.id || item.label}
                onClick={() => handleSelect(item)}
                className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm text-left transition-colors ${
                  idx === selectedIdx
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className="w-5 text-center text-base">
                  {item.type === 'command' ? '⚡' : SEARCH_ENDPOINTS.find((e) => e.key === item.category)?.icon || '•'}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.type === 'command' && (
                  <span className="text-[10px] text-gray-400 font-mono">Go to page</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
