import React from "react";

export const readKeyFromLocalStorage = <T>(
  localStorageKey: string,
  defaultValue: T
): T => {
  const localStorageValue = localStorage.getItem(localStorageKey);
  return localStorageValue
    ? (JSON.parse(localStorageValue) as T)
    : defaultValue;
};

export const useStickyState = <T>(
  localStorageKey: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const initialValue = readKeyFromLocalStorage(localStorageKey, defaultValue);

  const [value, setValue] = React.useState<T>(initialValue);

  const storeValueInLocalStorage = (): void =>
    localStorage.setItem(localStorageKey, JSON.stringify(value));

  React.useEffect(storeValueInLocalStorage, [value]);

  return [value, setValue];
};
