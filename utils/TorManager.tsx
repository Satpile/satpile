import React, {useContext, useEffect, useMemo, useState} from "react";
import Tor from "react-native-tor";

const client = {};// Tor();

export enum TorStatusType {
    DISCONNECTED =  "DISCONNECTED",
    CONNECTED = "CONNECTED",
    CONNECTING = "CONNECTING"
}

type TorContextType = {
    state: TorStatusType;
    client: typeof client;
}

const defaultTorContext: TorContextType = {
    state: TorStatusType.DISCONNECTED,
    client
};

const TorContext = React.createContext<TorContextType>(defaultTorContext);

export function TorContextProvider({children}) {
    const [torState, setTorState] = useState<TorStatusType>(defaultTorContext.state);

    const context = useMemo(() => ({
        client,
        state: torState
    }), [torState])

    useEffect(() => {
        const interval = setInterval(async () => {
            //const status = await client.getDaemonStatus();
            let ourStatus;
            // switch (status.toUpperCase().replace(/"/g,"")){
            //     case 'NOTINIT': ourStatus = TorStatusType.DISCONNECTED;
            //     break;
            //     case 'STARTING': ourStatus = TorStatusType.CONNECTING;
            //     break;
            //     case 'DONE': ourStatus = TorStatusType.CONNECTED;
            //     break;
            //     default: ourStatus = TorStatusType.DISCONNECTED;
            //     break;
            // }
            // setTorState(ourStatus);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return <TorContext.Provider value={context}>
        {children}
    </TorContext.Provider>

}


export function useTorContext(){
    return useContext(TorContext);
}
export {client as torClient};
