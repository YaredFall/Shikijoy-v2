import { ReactNode, RefObject, createContext, createRef, forwardRef, useContext, useLayoutEffect, useMemo, useRef, useState } from "react";
import { HTMLProps } from "../../types/utils";


interface ListboxContext<T> {
  value?: T;
  defaultValue?: T;
  onValueChange?: (newValue: T) => void;
}

const listboxContext = createContext<ListboxContext<any>>(
  undefined as never
);
listboxContext.displayName = "ListboxContext";

const ListboxContextProvider = listboxContext.Provider;

interface ListboxProps<T> extends Omit<HTMLProps<HTMLDivElement>, "defaultValue">, ListboxContext<T> { }

function ListboxFn<T>({ children, value, defaultValue, onValueChange, tabIndex, onFocus, ...otherProps }: ListboxProps<T>, ref?: RefObject<HTMLDivElement> | null) {

  const [_value, set_value] = useState(defaultValue ?? value);

  const setValue = (value: T) => {
    set_value(value);
    onValueChange && onValueChange(value);
  };

  useLayoutEffect(() => {
    set_value(value);
  }, [value]);

  const nodeRef = useMemo(() => ref ?? createRef<HTMLDivElement>(), [ref]);

  // const [hasFocusInside, setHasFocusInside] = useState(false);

  return (
    <ListboxContextProvider value={{ value: _value, defaultValue, onValueChange: setValue }}>
      <div
        role="listbox"
        ref={nodeRef}
        tabIndex={tabIndex ?? _value !== undefined ? -1 : 0}
        // onFocus={(e) => {
        //   onFocus && onFocus(e);
        //   setHasFocusInside(true);
        //   if (e.target !== nodeRef.current) return;
        //   console.log(e);
        //   if (!_value) {
        //     nodeRef.current?.querySelector<HTMLElement>('[role="option"]')?.focus();
        //   } else {
        //     nodeRef.current?.querySelector<HTMLElement>('[role="option"][aria-selected="true"]')?.focus();
        //   }
        // }}
        // onBlur={(e) => {
        //   setHasFocusInside(false);
        // }}
        {...otherProps}
      >
        {children}
      </div >
    </ListboxContextProvider>
  );
}

interface GroupProps extends HTMLProps<HTMLUListElement> {

}

function Group({ children, ...otherProps }: GroupProps) {
  return (
    <ul
      role="group"
      {...otherProps}
    >
      {children}
    </ul>
  );
}

interface OptionProps<T> extends Omit<HTMLProps<HTMLLIElement>, "children"> {
  value: T;
  children?: ReactNode | ((isSelected: boolean) => ReactNode);
}
function Option<T>({ children, value, onClick, onKeyDown, ...otherProps }: OptionProps<T>) {

  const { value: _value, defaultValue, onValueChange } = useContext(listboxContext);

  const isSelected = _value && (value === _value);
  const renderChildren = typeof children === "function" ? children(isSelected) : children;

  const nodeRef = useRef<HTMLLIElement>(null);

  return (
    <li
      ref={nodeRef}
      tabIndex={isSelected ? 0 : -1}
      aria-selected={isSelected}
      onClick={(e) => {
        onClick && onClick(e);
        onValueChange && onValueChange(value);
      }}
      onKeyDown={(e) => {
        onKeyDown && onKeyDown(e);
        if (e.code === "Space" || e.code === "Enter") {
          e.preventDefault();
          onValueChange && onValueChange(value);
        }
        if (e.code === "ArrowDown") {
          e.preventDefault();
          const next = (nodeRef.current?.nextElementSibling as HTMLElement | null | undefined);
          // while (next?.getAttribute("aria-selected") === "true") {
          //   next = (next.nextElementSibling as HTMLElement | null | undefined);
          // }
          next?.focus?.();
        }
        if (e.code === "ArrowUp") {
          e.preventDefault();
          const prev = (nodeRef.current?.previousElementSibling as HTMLElement | null | undefined);
          // while (prev?.getAttribute("aria-selected") === "true") {
          //   prev = (prev.previousElementSibling as HTMLElement | null | undefined);
          // }
          prev?.focus?.();
        }
      }}
      role="option"
      {...otherProps}
    >
      {renderChildren}
    </li>
  );
}

const ForwardedListbox = forwardRef(ListboxFn as any) as <T>(
  props: ListboxProps<T> & { ref?: RefObject<HTMLDivElement>; }
) => ReturnType<typeof ListboxFn>;
const Listbox = Object.assign(ForwardedListbox, { Option, Group });

export default Listbox;

