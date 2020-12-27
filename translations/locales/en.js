module.exports = {
    current_language: 'English',
    language: 'Language',
    home: 'Satpile',
    add: 'Add',
    name: 'Name',
    address: 'Address',
    addresses: 'Addresses',
    scan_qr_code: 'Scan QRcode',
    cancel: 'Cancel',
    done: 'Save',
    invalid_address: 'Invalid address',
    success_added: 'Successfully added address',
    error_added: 'Error while adding address',
    address_copied: 'Address copied to clipboard',
    delete: 'Delete',
    delete_address_sure: 'Remove this address from the list?',
    delete_folder_sure: 'Remove this folder from the list?',
    error: 'Error',
    success: 'Success',
    new_folder: 'New folder',
    enter_folder_name: 'Enter the new folder name',
    folder_name: 'Folder name',
    add_folder: 'Add folder',
    close: 'Close',
    copy: 'Copy',
    export: 'Export',
    from: 'From',
    to: 'To',
    date: {
        formats: {short: "%b %d %Y", long: "%d %b %Y %l:%M:%S %p"},
        abbr_day_names: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        day_names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        abbr_month_names: [null, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        month_names: [null, "January", "February", "March", "May", "June", "July", "August", "September", "October", "November", "December"]
    },
    no_network: "Error: Can't reach network",
    connection_error: "Can't connect to server \n{{server}}",
    connection_success: "Success",
    no_address: "This folder is empty.\nTap + button to start watching an address",
    no_folder: "Click + button to create a new folder.\nThen, tap this folder to start watching new addresses.\nYou can also add a wallet's XPUB",
    rename_folder: "Rename folder",
    successfully_deleted: "Successfully deleted folder",
    tap_reload: "Tap to refresh balances",
    last_update: "Last update:",
    dont_trust_verify: "Don't trust. Verify:",
    links_will_open: "(Links will open in browser)",
    minutes: 'minutes',
    settings: {
        title: 'Settings',
        refresh: 'Refresh Interval',
        refresh_every: 'Refresh Every',
        refresh_manual: 'Manual',
        locale: 'Language',
        dark_mode: 'Dark mode',
        icloud: 'iCloud backup',
        feedback: 'Send Feedback',
        rate: 'Rate This App',
        twitter: 'Follow us on Twitter',
        about: 'About',
        legal: 'Legal',
        version: 'Version',
        copyright: 'Copyright',
        clear_data: 'Clear data',
        clear_data_sure: 'Are you sure you want to erase all data?',
        about_content: [
            "Satpile is a free, open source project, built by bitcoiners for bitcoiners. Satpile does not require you to create an account.\n" +
            "We do not track your activity nor your data. We respect your privacy.\n" +
            "If you find it useful, please tell your friends, and leave a review in the App Store. Thanks!",

            "Contact us on twitter",

            "We appreciate your feedback and comments."
        ],
        security: {
            title: "Security",
            warning: "When you enable a passphrase, it will be required every time Satpile opens. Be careful as there is no way to recover it.",
            enable_faceid: "Enable FaceID",
            enable_touchid: "Enable TouchID",
            passphrase: "Passphrase",
            use_passphrase: "Use passphrase",
            error_match: "Passphrases do not match",
            create_passphrase: "Create the passphrase you will use to access Satpile",
            confirm_passphrase: "Re-type passphrase",
            wrong_passphrase: "Wrong passphrase. Please try again.",
            unlock: "Unlock",
            enter_passphrase: "Enter passphrase:"
        },
        explorer: {
            title: "Explorer",
            http_api: "HTTP API Explorer",
            custom: "Custom Explorer",
            custom_electrum: "Custom Electrum Server",
            hostname: "Hostname/IP",
            enable_ssl: "Enable TLS/SSL",
            port_number: "Port number",
            test: "Test server connection"
        },
        website: 'News',
        buy: 'Buy Bitcoin',
        shop: 'Shop'
    },
    share_qrcode:'Export QRCode',
    notification: {
        increase: {
            title: "Balance increased",
            diff: "Was credited: %{amount}",
        },
        decrease: {
            title: "Balance decreased",
            diff: "Was debited: %{amount}"
        },
        folder: "In folder: %{folder}",
        total: "New total: %{total}"
    },
    permission:{
        camera: "Camera access is disabled. To scan a QR code, please allow camera access in Settings > Satpile.",
        notification: "You need to allow notifications for background refresh to work."
    },
    goto_settings: "Go to settings",
    rename_address: "Rename address",
    enter_address_name: "Enter address name",
    address_name: "Address name",
    edit_derivation_path: "Edit derivation path",
    enter_starting_derivation_path: "Enter starting derivation path",
    starting_derivation_path: "Starting derivation path",
    selected_starting_derivation_path: "Selected starting derivation path:",
    generated_derivation_paths: "Generated next derivation paths:",
    generate_new_addresses: "Generate new addresses",
    info_xpub: "You can add an XPUB wallet (xpub/ypub/zpub) address and automatically track its derived addresses.",
    advanced_users_only: "Advanced users only",
    should_not_change: "Everything should be working without editing this",
    tor: {
        status: {
            CONNECTED: "Connected to TOR daemon",
            CONNECTING: "Connecting to TOR daemon...",
            DISCONNECTED: "Disconnected from TOR daemon"
        }
    }
};
