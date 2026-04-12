const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function fetchTable(table, { orderBy = 'sort_order', filter } = {}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;

  let url = `${SUPABASE_URL}/rest/v1/${table}?order=${orderBy}.asc`;
  if (filter) url += `&${filter}`;

  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data?.length ? data : null;
}
