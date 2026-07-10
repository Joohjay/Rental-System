import { useState } from 'react';

export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit) || 1;

  const goToPage = (p) => setPage(Math.max(1, Math.min(p, totalPages)));
  const nextPage = () => goToPage(page + 1);
  const prevPage = () => goToPage(page - 1);

  const changeLimit = (l) => {
    setLimit(l);
    setPage(1);
  };

  return {
    page, setPage, limit, setLimit: changeLimit,
    total, setTotal, totalPages,
    goToPage, nextPage, prevPage,
  };
};
