export type HTMLProps<T extends HTMLElement> = React.DetailedHTMLProps<React.HTMLAttributes<T>, T>;

export type Nullable<T, N = null | undefined> = T | N;