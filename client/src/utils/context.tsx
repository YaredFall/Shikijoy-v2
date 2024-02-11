import React from "react";

export function createContext<ContextValueType extends object | null>(
    rootComponentName: string,
    defaultContext?: ContextValueType,
) {
    const Context = React.createContext<ContextValueType | undefined>(defaultContext);

    function Provider(
        props: ContextValueType & { children: React.ReactNode; },
    ) {
        const { children, ...context } = props;
        // Only re-memoize when prop values change
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const value = React.useMemo(() => context, Object.values(context)) as ContextValueType;
        return <Context.Provider value={value}>{children}</Context.Provider>;
    }

    function useContext<T = ContextValueType>(consumerName: string): T {
        const context = React.useContext(Context);
        if (context) return context as T;
        if (defaultContext !== undefined) return defaultContext as unknown as T;
        // if a defaultContext wasn't specified, it's a required context.
        throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }

    Provider.displayName = rootComponentName + "Provider";
    return [useContext, Provider] as const;
}