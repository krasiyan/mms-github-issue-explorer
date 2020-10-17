import React from "react";

export const useStickyState = <T extends unknown>(
  localStorageKey: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const localStorageValue = localStorage.getItem(localStorageKey);
  const initialValue = localStorageValue
    ? (JSON.parse(localStorageValue) as T)
    : defaultValue;

  const [value, setValue] = React.useState<T>(initialValue);

  const storeValueInLocalStorage = (): void =>
    localStorage.setItem(localStorageKey, JSON.stringify(value));

  React.useEffect(storeValueInLocalStorage, [value]);

  return [value, setValue];
};
