module.exports = {
    current_language: 'Česky',
    language: 'Jazyk',
    home: 'Satpile',
    add: 'Přidat',
    name: 'Název',
    address: 'Adresa',
    addresses: 'Adresy',
    scan_qr_code: 'Naskenovat QRcode',
    cancel: 'Zrušit',
    done: 'Uložit',
    invalid_address: Neplatná adresa',
    success_added: 'Adresa byla úspěšně přidána',
    error_added: 'Chyba při přidávání adresy',
    address_copied: 'Adresa zkopírovaná do schránky',
    delete: 'Vymazat',
    delete_address_sure: 'Odebrat tuto adresu ze seznamu?',
    delete_folder_sure: 'Odebrat tuto složku ze seznamu?',
    error: 'Chyba',
    success: 'Úspěch',
    new_folder: 'Nová složka',
    enter_folder_name: 'Zadat název nové složky',
    folder_name: 'Název složky',
    add_folder: 'Přidat složku',
    close: 'Zavřít',
    copy: 'Kopírovat',
    export: 'Exportovat',
    from: 'Z',
    to: 'Do',
    date: {
        formats: {short: "%d %b %Y", long: "%d %b %Y %H:%M:%S"},
        abbr_day_names: ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"],
        day_names: ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"],
        abbr_month_names: [null, "Led", "Ún", "Bře", "Dub", "Kvě", "Čer", "Čenec", "Srp", "Zář", "Říj", "Lis", "Pro"],
        month_names: [null, "Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen, "Září", "Říjen", "Listopad", "Prosinec"]
    },
    no_network: "Chyba: Nelze se připojit k síti",
    connection_error: "Nelze se připojit k serveru \n{{server}}",
    connection_success: "Připojeno",
    no_address: "Tato složka je prázdná.\nKlepnutím na tlačítko + zahájiš sledování adresy",
    no_folder: "Klepnutím na tlačítko + vytvoříš novou složku.\nPak klepni na tuto složku a začni sledovat nové adresy.\nMůžeš také přidat XPUB peněženky.",
    rename_folder: "Přejmenovat složku",
    successfully_deleted: "Složka byla úspěšně odstraněna",
    tap_reload: "Klepnutím obnovíte zůstatky",
    last_update: "Poslední aktualizace:",
    dont_trust_verify: "Don't trust. Verify:",
    links_will_open: "(Odkazy se otevřou v prohlížeči)",
    minutes: 'minuty',
    settings: {
        title: 'Nastavení',
        refresh: 'Interval obnovení',
        refresh_every: 'Obnovit každých',
        refresh_manual: 'Manuálně',
        locale: 'Jazyk',
        dark_mode: 'Tmavý režim',
        icloud: 'Zálohovta v iCloud',
        feedback: 'Zaslat zpětnou vazbu',
        rate: 'Ohodnotit tuto aplikaci',
        twitter: 'Sleduj nás na Twitteru',
        about: 'O aplikaci',
        legal: 'Právní stránka',
        version: 'Verze',
        copyright: 'Copyright',
        clear_data: 'Vymazat data',
        clear_data_sure: 'Určitě chceš vymazat všechna data?',
        about_content: [
            "Satpile je bezplatný projekt s otevřeným zdrojovým kódem, vytvořený bitcoinery pro bitcoinery. Satpile nevyžaduje vytvoření účtu.\n" +
            "Nesledujeme tvoji aktivitu ani tvoje údaje. Respektujeme tvoje soukromí.\n" +
            "Pokud je pro tebe tato aplikace užitečná, řekni o ní svým přátelům a zanech recenzi v App Store. Děkujeme!",

            "Napiš nám na twitter",

            "Vážíme si tvé zpětné vazby a komentářů."
        ],
        security: {
            title: "Zabezpečení",
            warning: "Pokud povolíš přístupovou frázi, bude vyžadována při každém otevření aplikace Satpile. Dávej pozor, protože neexistuje žádný způsob, jak ji obnovit.",
            enable_faceid: "Povolit FaceID",
            enable_touchid: "Povolit TouchID",
            passphrase: "Přístupová fráze",
            use_passphrase: "Použít přístupovou frázi",
            error_match: "Přístupové fráze se neshodují",
            create_passphrase: "Vytvoř přístupovou frázi, kterou budeš používat pro přístup k aplikaci Satpile.",
            confirm_passphrase: "Znovu zadat přístupovou frázi",
            wrong_passphrase: "Špatná přístupová fráze. Zkus to prosím znovu.",
            unlock: "Odemknout",
            enter_passphrase: "Zadat přístupovou frázi:"
        },
        explorer: {
            title: "Explorer",
            http_api: "HTTP API Explorer",
            custom: "Vlastní Explorer",
            custom_electrum: "Vlastní Electrum Server",
            hostname: "Hostname/IP",
            enable_ssl: "Povolit TLS/SSL",
            port_number: "Číslo portu",
            test: "Test připojení k serveru"
        },
        website: 'Novinky',
        buy: 'Kup Bitcoin',
        shop: 'Obchod',
        display_unit_btc_sats: "Zobrazit jednotky: sats / ₿",
        hide_empty: "Skrýt prázdné adresy"
    },
    share_qrcode:'Exportovat QRCode',
    notification: {
        increase: {
            title: "Navýšení zůstatku",
            diff: "Bylo připsáno: %{amount}",
        },
        decrease: {
            title: "Snížení zůstatku",
            diff: "Bylo odepsáno: %{amount}"
        },
        folder: "Ve složce: %{folder}",
        total: "Nově celkem: %{total}"
    },
    permission:{
        camera: "Přístup ke kameře je zakázán. Chceš-li naskenovat QR kód, povol přístup k fotoaparátu v Nastavení > Satpile.",
        notification: "Aby fungovalo obnovování na pozadí, je třeba povolit oznámení."
    },
    goto_settings: "Přejít do nastavení",
    rename_address: "Přejmenovat adresu",
    enter_address_name: "Zadat název adresy",
    address_name: "Název adresy",
    edit_derivation_path: "Upravit cestu odvození",
    enter_starting_derivation_path: "Zadej počáteční cestu odvození",
    starting_derivation_path: "Počáteční cesta odvození",
    selected_starting_derivation_path: "Vybraná počáteční cesta odvození:",
    generated_derivation_paths: "Vygenerované další cesty odvození:",
    generate_new_addresses: "Generovat nové adresy",
    info_xpub: "Můžeš přidat XPUB peněženky (xpub/ypub/zpub) a automaticky sledovat její odvozené adresy.",
    advanced_users_only: "Pouze pro pokročilé uživatele",
    should_not_change: "Vše by mělo fungovat i bez úpravy tohoto",
    tor: {
        status: {
            CONNECTED: "Připojeno k TOR daemon",
            CONNECTING: "Připojování k TOR daemon...",
            DISCONNECTED: "Odpojeno od TOR daemon"
        }
    },
    hidden_addresses: {
        one: "1 prázdná adresa byla skryta",
        other: "%{count} prázdných adres bylo skryto"
    }
};

