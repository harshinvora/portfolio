import { useState, useEffect } from 'react';
import { fetchTable } from './supabase.js';

export function useSupabaseData(table, { orderBy = 'sort_order' } = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchTable(table, { orderBy })
      .then(rows => {
        setData(rows || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [table]);

  return { data, loading, error };
}
