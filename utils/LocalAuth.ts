import * as LocalAuthentication from "expo-local-authentication";
import {AuthenticationType} from "expo-local-authentication";
import Constants from 'expo-constants';
import {i18n} from "../translations/i18n";

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
            cancelLabel: i18n.t('cancel'),
            disableDeviceFallback: true,
            //Disable device fallback on standalone app; (can't disable on expo because crash (may be related to ios14, TODO: investigate))
        }, ).then(value => {
            return value.success ? AuthResult.SUCCESS : AuthResult.FAIL;
        }).catch(e => {
            return AuthResult.FAIL;
        });
    }

    static CACHED_AVAILABLE_BIOMETRIC: AuthenticationType | null = null;

    static async getAvailableBiometric() {
        const available = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if(available.includes(AuthenticationType.FACIAL_RECOGNITION)){
            this.CACHED_AVAILABLE_BIOMETRIC = AuthenticationType.FACIAL_RECOGNITION;
        } else if(available.includes(AuthenticationType.FINGERPRINT)){
            this.CACHED_AVAILABLE_BIOMETRIC = AuthenticationType.FINGERPRINT;
        }else{
            return null;
        }

        return this.CACHED_AVAILABLE_BIOMETRIC;
    }

}

