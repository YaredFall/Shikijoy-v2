import { createContext, useCallback, useContext, useId, useLayoutEffect, useRef, useState } from "react";
import { HTMLProps } from "../../types/utils";

interface PopoverContext {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (newValue: boolean) => void;
  id?: string;
}

const popoverContext = createContext<PopoverContext>(
  undefined as never
);
popoverContext.displayName = "PopoverContext";

const PopoverContextProvider = popoverContext.Provider;


interface PopoverProps extends React.PropsWithChildren<PopoverContext>, HTMLProps<HTMLDivElement> { }

function Popover({ defaultOpen = false, open = false, onOpenChange, onKeyDown, ...other }: PopoverProps) {

  const [_open, set_open] = useState<boolean>(defaultOpen);

  const setOpen = (open: boolean) => {
    set_open(open);
    onOpenChange && onOpenChange(open);
  };

  useLayoutEffect(() => {
    set_open(open);
  }, [open]);

  const uid = useId();

  const nodeRef = useRef<HTMLDivElement>(null);
  
  //! Causes buggy behavior of child listbox 
  // const pointerDownHandler = useCallback((e: PointerEvent) => {
  //   if (_open && !nodeRef.current?.contains(e.target as Node)) {
  //     set_open(false);
  //   }
  // }, [_open]);

  // useLayoutEffect(() => {
  //   document.addEventListener("pointerdown", pointerDownHandler);

  //   return () => {
  //     document.removeEventListener("pointerdown", pointerDownHandler);
  //   };
  // }, [pointerDownHandler]);

  const keyDownHandler = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown && onKeyDown(e);
    switch (e.code) {
      case "Escape":
        _open && set_open(!_open);
        break;
      default:
        break;
    }
  }, [_open, onKeyDown]);

  return (
    <PopoverContextProvider value={{ open: _open, defaultOpen, onOpenChange: setOpen, id: uid }}>
      <div ref={nodeRef} onKeyDown={keyDownHandler} {...other} />
    </PopoverContextProvider>
  );
}

interface TriggerProps extends HTMLProps<HTMLButtonElement> { }

function Trigger({ onPointerDown, onKeyDown, ...other }: TriggerProps) {

  const { open, onOpenChange, id } = useContext(popoverContext);

  const pointerDownHandler = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    onPointerDown && onPointerDown(e);
    onOpenChange && onOpenChange(!open);
  }, [onOpenChange, open, onPointerDown]);

  const keyDownHandler = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown && onKeyDown(e);
    switch (e.code) {
      case "Space" || "Enter":
        onOpenChange && onOpenChange(!open);
        break;
      default:
        break;
    }
  }, [onKeyDown, open, onOpenChange]);

  return (
    <button
      role="button"
      aria-expanded={open}
      aria-controls={id}
      onPointerDown={pointerDownHandler}
      onKeyDown={keyDownHandler}
      {...other}
    />
  );
}

interface ContentProps extends HTMLProps<HTMLDivElement> { }

function Content({ ...other }: ContentProps) {

  const { open, onOpenChange, id } = useContext(popoverContext);

  if (!open) return null;

  return (
    <div id={id} {...other} />
  );
}


Popover.Trigger = Trigger;
Popover.Content = Content;

export default Popover;