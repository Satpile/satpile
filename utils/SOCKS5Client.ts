const net = require("net");

const connectErrors = {
    [0x00]: "request granted",
    [0x01]: "general failure",
    [0x02]: "connection not allowed by ruleset",
    [0x03]: "network unreachable",
    [0x04]: "host unreachable",
    [0x05]: "connection refused by destination host",
    [0x06]: "TTL expired",
    [0x07]: "command not supported / protocol error",
    [0x08]: "address type not supported",
};

export class SOCKS5Client {
    private socket: typeof net.Socket = null;

    private state: "noinit"|"greeting"|"connecting"|"connected" = "noinit";


    constructor(public proxyAddress: string, public proxyPort: number, public serverAddress: string, public serverPort: number) {
        this.socket = new net.Socket();
    }

    private sendGreeting(){
        this.state = "greeting";
        const greeting = new Buffer([0x05, 0x01, 0x00]);
        return this.socket.write(greeting);
    }

    private sendConnect(){
        this.state = "connecting";

        const ver_cmd_rsv = [0x05, 0x01, 0x00];
        const dstaddr = [0x03, this.serverAddress.length, ...this.serverAddress.split("").map(c => c.charCodeAt(0))];
        const dstport = [this.serverPort>>8, this.serverPort];

        const data = new Buffer([...ver_cmd_rsv, ...dstaddr, ...dstport]);
        return this.socket.write(data);
    }

    async connect(){
        return new Promise<SOCKS5Client['socket']>((resolve, reject) => {

            this.socket.on('connect', () => {
                console.log("connected to proxy");
                this.sendGreeting();
            });

            const onData = (data) => {
                switch (this.state){
                    case "greeting":
                        if(data.length === 2 && data[0] === 0x05 && data[1] === 0x00) {
                            this.sendConnect();
                        }else{
                            reject(`Received ${data.toString()}`);
                        }
                        break;

                    case "connecting":
                        const response = Uint8Array.from(data);
                        if(response[1] === 0x00){
                            this.state = "connected";

                            this.socket.off("error", onError);
                            this.socket.off("close", onError);
                            this.socket.off("data", onData);

                            resolve(this.socket);
                            console.log("Connected to remote server through proxy 😎");
                            console.log(this.serverAddress, this.serverPort);

                        }else{
                            reject(connectErrors[response[1]]);
                        }
                        break;

                    case "connected":
                        break;
                    case "noinit":
                    default:
                        reject(this.state);
                }
            };

            const onError = (err) => {
                reject(err);
            }
            this.socket.on("close", onError);
            this.socket.on("error", onError);
            this.socket.on("data", onData);
            this.socket.connect(this.proxyPort, this.proxyAddress);
        });
    }
}
