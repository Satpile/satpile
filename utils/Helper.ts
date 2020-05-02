export function convertSatoshiToString(satoshi){
    return Math.round(satoshi).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function generateUid(size=30){
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uid = "";
    for(let i = 0; i<size; i++){
        uid += chars.charAt(Math.floor(Math.random() * size))
    }

    return uid;
}
