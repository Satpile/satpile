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
    no_address: "This folder is empty.\nTap + button to start watching an address",
    no_folder: "Click + button to create a new folder.\nThen, tap this folder to start watching new addresses.",
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
        lock: "App lock",
        enable_lock: "Enable app lock",
        lock_type: {
            biometric: "FaceID / TouchID",
            passphrase: "Custom Passphrase"
        }
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
    goto_settings: "Go to settings"
};
