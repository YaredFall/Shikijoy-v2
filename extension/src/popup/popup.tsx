import "./index.css";
import { Switch, SwitchThumb } from "../components/switch";
import { useEffect, useLayoutEffect, useState } from "react";
import { cn } from "../lib/utils";

export default function Popup() {

    useLayoutEffect(() => {
        if (!chrome.runtime) {
            document.documentElement.classList.add("h-full");
        }
    }, []);

    const [isExtensionEnabled, setIsExtensionEnabled] = useState<boolean>();
    const [isPlayerFixesEnabled, setIsPlayerFixesEnabled] = useState<boolean>();

    useLayoutEffect(() => {

        if (!chrome.runtime) {
            setIsExtensionEnabled(true);
            setIsPlayerFixesEnabled(true);
        } else {
            chrome.storage.local.get("enabled").then((result) => {
                setIsExtensionEnabled(result.enabled);
            });

            chrome.storage.local.get("usePlayersFixes").then((result) => {
                setIsPlayerFixesEnabled(result.usePlayersFixes);
            });
        }
    }, []);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isLoading && isExtensionEnabled !== undefined && isPlayerFixesEnabled !== undefined) {
            setTimeout(() => {
                setIsLoading(false);
            }, 100);
        }
    });

    return (
        <main className={"w-full h-full flex items-center justify-center bg-neutral-50 p-4 text-base"}>
            <div>
                <header className={"text-xl font-medium"}>Shikijoy v2</header>
                <br />
                <div className={"flex gap-2 items-baseline justify-between"}>
                    <span>Использовать расширение</span>
                    <Switch
                        checked={isExtensionEnabled}
                        onCheckedChange={(checked) => {
                            setIsExtensionEnabled(checked);
                            chrome.storage?.local.set({ enabled: checked });
                        }}
                    >
                        <SwitchThumb className={cn(isLoading && "transition-none")} />
                    </Switch>
                </div>
                <br />
                <div className={"flex gap-2 items-baseline justify-between"}>
                    <span>
                        <span>Фиксы плееров</span>
                        <span className={"text-xs text-neutral-500"}> *экспериментально</span>
                    </span>
                    <Switch
                        checked={isPlayerFixesEnabled}
                        onCheckedChange={(checked) => {
                            setIsPlayerFixesEnabled(checked);
                            chrome.storage?.local.set({ usePlayersFixes: checked });
                        }}
                    >
                        <SwitchThumb className={cn(isLoading && "transition-none")} />
                    </Switch>
                </div>
                <div className={"text-sm text-neutral-500"}>чинят взаимодействие плееров с клавиатурой</div>
                <br />
                <button
                    className={"border border-neutral-300 bg-neutral-100 hover:bg-transparent rounded px-3 py-0.5 transition-colors"}
                    onClick={() => {
                        chrome.runtime?.reload();
                    }}
                >
                    Перезагрузить
                </button>
            </div>
        </main>
    );
}