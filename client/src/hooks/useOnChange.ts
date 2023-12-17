import { usePreviousState } from "./usePrevState";
import { useEffect } from "react";

export const useOnChange = <T>(value: T, callback: () => void) => {
  const prevValue = usePreviousState(value);

  useEffect(() => {
    if (value !== prevValue) {
      callback();
    }
  }, [callback, prevValue, value]);
};