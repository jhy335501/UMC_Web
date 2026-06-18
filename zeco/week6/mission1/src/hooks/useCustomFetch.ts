import { useEffect, useState } from 'react';
import axios from 'axios';

interface UseFetchResult<T> {
  data: T | null;
  isPending: boolean;
  isError: boolean;
}

export function useCustomFetch<T>(
  url: string,
  headers?: Record<string, string>,
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      setIsPending(true);
      setIsError(false);
      try {
        const { data: result } = await axios.get<T>(url, headers ? { headers } : undefined);
        setData(result);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { data, isPending, isError };
}
