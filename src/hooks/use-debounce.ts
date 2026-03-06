import { useEffect, useState } from "react";

interface UseDebounceOptions<T> {
  value: T,
  delay: number
}

export function useDebounceValue<T>({ value, delay }: UseDebounceOptions<T>): T {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debounceValue;
}

export function useDebounceCallback<T>({ value, delay, callback }: {
  value: T,
  delay: number,
  callback: (value: T) => void
}): void {
  useEffect(() => {
    const handler = setTimeout(() => {
      callback(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, callback]);
}
