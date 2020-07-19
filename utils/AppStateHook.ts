import {DependencyList, useCallback, useEffect, useRef, useState} from "react";
import {AppState, AppStateStatus} from "react-native";

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}

export const useAppState = () => {
    const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
    const lastAppState = usePrevious(appState);

    useEffect(() => {
        AppState.addEventListener("change", _handleAppStateChange);
        return () => {
            AppState.removeEventListener("change", _handleAppStateChange);
        };
    }, []);

    const _handleAppStateChange = (state) => {
        setAppState(state)
    }

    return [lastAppState, appState];
}
export const useAppStateEffect = (effect: (appState: AppStateStatus, lastAppState?: AppStateStatus) => (void | (() => void | undefined)), dependencyList: DependencyList = []) => {
    const [lastAppState, appState] = useAppState();
    const effectCallback = useCallback(effect, dependencyList);

    useEffect(() => {
        return effectCallback(appState, lastAppState);
    }, [...dependencyList, appState, effectCallback]);
}
