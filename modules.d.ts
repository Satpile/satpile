//declare module "@photon-sdk/rn-electrum-client"

import { QRCodeProps as InitialQRCodeProps } from "react-native-qrcode-svg";

declare module "react-native-qrcode-svg" {
  export interface QRCodeProps extends InitialQRCodeProps {
    value?:
      | string
      | { data: string; mode: "numeric" | "alphanumeric" | "byte" }[];
  }
}
