import "@/index.css";
import { DocsContainer } from "@storybook/addon-docs";
import type { Preview } from "@storybook/react";
import { themes } from "@storybook/theming";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useDarkMode } from "storybook-dark-mode";

const queryClient = new QueryClient();

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: "^on[A-Z].*" },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        docs: {
            container: (props) => {
                const isDark = useDarkMode();
                const currentProps = { ...props };
                currentProps.theme = isDark ? themes.dark : themes.light;
                return React.createElement(DocsContainer, currentProps);
           },
        }
    },
    decorators: [
        (Story) => (
            <QueryClientProvider client={queryClient}>
                <div className="w-full h-full flex items-center justify-center">
                    <Story />
                </div>
            </QueryClientProvider>
        ),
    ],
};

export default preview;
