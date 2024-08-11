import { useRouter } from "@tanstack/react-router";
import { useState, useRef, useLayoutEffect } from "react";

type ProgressOptions = {
    tickAmount: number | (() => number);
    tickInterval: number;
};

const useLoadingProgress = ({ tickAmount, tickInterval }: ProgressOptions) => {
    const [progress, setProgress] = useState<number>(0);
    const [inProgress, setInProgress] = useState<boolean>(false);


    const interval = useRef<NodeJS.Timeout>();

    const getAmount = () => typeof tickAmount === "function" ? tickAmount() : tickAmount;

    function start() {
        setProgress(getAmount());
        setInProgress(true);

        interval.current = setInterval(() => {
            setProgress(prev => Math.max(0, Math.min(prev + getAmount(), 90)));
        }, tickInterval);
    }

    function complete() {
        setProgress(100);
        setInProgress(false);
        clearInterval(interval.current);
    }

    return { start, complete, progress, inProgress } as const;
};

let subscribed = false;
export function ProgressBar() {

    const router = useRouter();
    const { start, complete, progress, inProgress } = useLoadingProgress({
        tickInterval: 500,
        tickAmount: () => ~~(Math.random() * 10),
    });

    useLayoutEffect(() => {
        if (subscribed) return;

        router.subscribe("onBeforeLoad", ({ pathChanged }) => {
            pathChanged && start();
        });
        router.subscribe("onLoad", () => complete());
        subscribed = true;
    }, []);

    return (
        <div className={"fixed inset-x-0 top-0 z-[999] h-[3px] text-red-600 shadow-md transition-opacity delay-150"} style={{ opacity: +inProgress }}>
            <div className={"h-full bg-current transition-[width]"} style={{ width: progress + "%" }}></div>
        </div>
    );
}