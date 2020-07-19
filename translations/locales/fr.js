module.exports = {
    current_language: 'Français',
    language: 'Langue',
    home: 'Satpile',
    add: 'Ajouter',
    name: 'Nom',
    address: 'Adresse',
    addresses: 'Adresses',
    scan_qr_code: 'Scanner le QRcode',
    cancel: 'Annuler',
    done: 'Valider',
    invalid_address: 'Addresse non valide',
    success_added: 'Adresse ajoutée avec succés',
    address_copied: 'Adresse copiée dans le presse-papier',
    delete: 'Supprimer',
    delete_address_sure: 'Retirer cette adresse de la liste ?',
    delete_folder_sure: 'Retirer ce dossier de la liste ?',
    error: 'Erreur',
    success: 'Fait',
    new_folder: 'Nouveau dossier',
    enter_folder_name: 'Saisissez le nom du dossier',
    folder_name: 'Nom du dossier',
    add_folder: 'Ajouter le dossier',
    close: 'Fermer',
    copy: 'Copier',
    export: 'Exporter',
    from: 'De',
    to: 'Vers',
    date: {
        formats: {short: "%d %b %Y", long: '%d %b %Y %H:%M:%S'},
        abbr_day_names: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
        day_names: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
        abbr_month_names: [null, "Janv", "Févr", "Mars", "Avr", "Mai", "Juin", "Juill", "Août", "Sept", "Oct", "Nov", "Déc"],
        month_names: [null, "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
    },
    no_network: "Erreur, réseau injoignable",
    no_address: "Ce dossier est vide.\n Cliquez sur + pour ajouter une addresse",
    no_folder: "Vous n'avez pas encore créé de dossier. Cliquez sur + pour en ajouter un",
    rename_folder: "Renommer le dossier",
    successfully_deleted: "Dossier supprimé avec succés.",
    tap_reload: "Appuyez pour mettre à jour",
    last_update: "Dernière MAJ :",
    dont_trust_verify: "Don't trust. Verify:",
    links_will_open: "(Les liens s'ouvriront dans le navigateur)",
    minutes: 'minutes',
    settings: {
        title: 'Paramètres',
        refresh_every: 'Intervalle de rafraichissement',
        refresh: 'Intervalle de rafraichissement',
        refresh_manual: 'Manuel',
        locale: 'Langue',
        dark_mode: 'Mode sombre',
        icloud: 'Sauvegarde iCloud',
        feedback: 'Envoyer un retour',
        rate: 'Noter cette App',
        twitter: 'Suivez-nous sur Twitter',
        about: 'À propos',
        legal: 'Mentions légales',
        version: 'Version',
        copyright: 'Copyright',
        clear_data: 'Effacer les données',
        clear_data_sure: 'Êtes-vous sûr de vouloir supprimer toutes les données ?',
        security: {
            title: "Sécurité",
            warning: "Lorsque la passphrase est activée, vous devez la saisir à chaque ouverture de Satpile. Attention, vous ne pouvez pas la récuperer en cas d'oubli.",
            enable_faceid: "Activer FaceID",
            enable_touchid: "Activer TouchID",
            passphrase: "Passphrase",
            use_passphrase: "Utiliser une passphrase",
            error_match: "Les passphrases sont différentes",
            create_passphrase: "Créez la passphrase que vous utiliserez pour accéder à Satpile",
            confirm_passphrase: "Confirmez la passphrase",
            wrong_passphrase: "Mauvaise passphrase. Merci de réessayer.",
            unlock: "Déverrouiller",
            enter_passphrase: "Saisissez la passphrase :"
        },
        explorer: 'Explorer API'
    },
    share_qrcode:'Exporter le QRCode',
    notification: {
        increase: {
            title: "La balance a augmenté",
            diff: "A été crédité: %{amount}",
        },
        decrease: {
            title: "La balance a diminué",
            diff: "A été débité: %{amount}"
        },
        folder: "Dans le dossier: %{folder}",
        total: "Nouveau total: %{total}"
    },
    permission:{
        camera: "L'accès à la Camera est désactivé. Pour scanner des QRCode, merci d'autoriser la caméra dans Paramètres > Satpile.",
        notification: "Vous devez autoriser les notifications pour que le rafraichissement en arrière plan fonctionne."
    },
    goto_settings: "Accéder aux paramètres"
};
