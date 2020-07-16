import * as LocalAuthentication from "expo-local-authentication";
import Constants, {AppOwnership} from "expo-constants";

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
        }).then(value => {
            return value.success ? AuthResult.SUCCESS : AuthResult.FAIL;
        }).catch(e => {
            console.log(e);
            return AuthResult.FAIL;
        });

    }
}

