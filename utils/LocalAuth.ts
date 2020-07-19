import * as LocalAuthentication from "expo-local-authentication";
import {AuthenticationType} from "expo-local-authentication";
import Constants from 'expo-constants';

export enum AuthResult {
    SUCCESS= "SUCCESS",
    FAIL = "FAIL",
    UNAVAILABLE="UNAVAILABLE"
}

export default class LocalAuth {
    static async promptLocalAuth(): Promise<AuthResult>{
        if(!await LocalAuthentication.hasHardwareAsync() || !await LocalAuthentication.isEnrolledAsync()){
            return AuthResult.UNAVAILABLE;
        }

        return LocalAuthentication.authenticateAsync({
            fallbackLabel: "",
            ...(Constants.appOwnership === "standalone" ? {disableDeviceFallback: true} : {})
            //Disable device fallback on standalone app; (can't disable on expo because crash (may be related to ios14, TODO: investigate))
        }, ).then(value => {
            return value.success ? AuthResult.SUCCESS : AuthResult.FAIL;
        }).catch(e => {
            return AuthResult.FAIL;
        });
    }

    static async getAvailableBiometric() {
        const available = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if(available.includes(AuthenticationType.FACIAL_RECOGNITION)){
            return AuthenticationType.FACIAL_RECOGNITION;
        }

        if(available.includes(AuthenticationType.FINGERPRINT)){
            return AuthenticationType.FACIAL_RECOGNITION;
        }

        return null;
    }

}

