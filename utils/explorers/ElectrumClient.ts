import {SOCKS5Client} from "../SOCKS5Client";

interface ElectrumClientOption{
    socks5?: {host: string, port: number},
    address: string,
    port: number,
    useTlS: boolean
}

const net = require("net");
const tls = require("tls");

export class ElectrumClient {

    public transportSocket: typeof net.Socket;
    public secureSocket: typeof tls.TLSSocket;

    private id = 0;
    private requests: Map<number, (data: any) => any> = new Map();

    constructor(public options: ElectrumClientOption) {}

    async connect(){
        if(this.options.socks5){
            const proxySocket = new SOCKS5Client(
                this.options.socks5.host,
                this.options.socks5.port,
                this.options.address,
                this.options.port
            );
            this.transportSocket = await proxySocket.connect();
            console.log("Connected to proxified tcp");
        }else{
            this.transportSocket = net.connect({
                host: this.options.address,
                port: this.options.port,
            });
            await new Promise(resolve => {
                this.transportSocket.on('connect', resolve);
            });
            console.log("Connected to regular tcp");
        }

        if(this.options.useTlS){
            await this.connectTLS();
            this.setupListeners(this.secureSocket);
        }else{
            this.setupListeners(this.transportSocket);
        }

        await this.serverPing(); //Check that connection is indeed working

    }

    private setupListeners(socket: ElectrumClient['secureSocket'] | ElectrumClient['transportSocket']) {
        let fullData = "";
        socket.on("data", (data) => {
            fullData += data.toString();
            if(fullData.endsWith("\n")){
                fullData.trim().split("\n").forEach(text => this.processResponse(text));
                fullData = "";
            }
        });

        const interval = setInterval(() => {
            this.serverPing().catch();
        }, 5000);

        socket.on("close", (_) => {
            clearInterval(interval);
        })


    }

    private processResponse(text: string){
        try{
            const parsed = JSON.parse(text);
            if("id" in parsed){
                const callback = this.requests.get(parsed.id);
                if(callback){
                    this.requests.delete(parsed.id);
                    callback(parsed);
                }
            }
        }catch(e){
            //noop ?
        }
    }

    private async connectTLS(){
        await new Promise((resolve, reject) => {
            const handleError = (err) => {
                reject(err);
            }
            this.secureSocket = tls.connect({
                servername: this.options.address,
                socket: this.transportSocket
            }, () => {
                this.secureSocket.off("error", handleError);
                resolve();
            });
            this.secureSocket.on("error", handleError);
        });
    }

    private write(data: typeof Buffer | string): boolean{

        if(this.options.useTlS) {
            return this.secureSocket.write(data);
        }else{
            return this.transportSocket.write(data);
        }
    }

    public async request(method: string, params: string[]){
        const id = this.id++;
        const req = {
            id,
            method,
            params
        };
        if(this.write(JSON.stringify(req) + "\n")){
            return new Promise<any | any[]>((resolve, reject) => {
                const onResponse = (data: { result: any | any[] } | {error: any}) => {
                    clearTimeout(timeout);
                    if("error" in data){
                        reject(data.error);
                    }else{
                        resolve(data.result);
                    }
                };

                const onTimeout = () => {
                    this.requests.delete(id);
                    reject("No response after 5000ms");
                }

                const timeout = setTimeout(onTimeout, 5000); //TODO: put in options or constant
                this.requests.set(id, onResponse);
            });
        }else{
            throw new Error("Write returned false");
        }
    }

    serverPing() {
        return this.request('server.ping', []);
    }

    close(){
        try{
            this.transportSocket.end();
        }catch(e){

        }
    }

}
