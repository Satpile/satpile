import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  TouchableOpacity,
  View,
} from "react-native";
import { i18n } from "../translations/i18n";
import {
  Appbar,
  Headline,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import QRCodeButton from "../components/QRCodeButton";
import { MainTitle } from "../components/DynamicTitle";
import {
  addAddressToFolder,
  addDerivedAddresses,
  addFolder,
  removeFolder,
} from "../store/actions";
import { QRCodeScanner } from "../components/QRCodeScanner";
import BalanceFetcher from "../utils/BalanceFetcher";
import { Toast } from "../components/Toast";
import { AddingEnum, Folder, FolderType } from "../utils/Types";
import { generateUid, isAddressValid, isSeedValid } from "../utils/Helper";
import {
  initializeAddressesDerivation,
  STARTING_DERIVATION_PATH,
} from "../utils/XPubAddresses";
import { DerivationPathSelector } from "../components/DerivationPathSelector";
import { useTypedDispatch } from "../store/store";
import { generateMnemonic, generateZpubFromMnemonic } from "../utils/Seed";
import { validateMnemonic } from "bip39";
import { useI18n } from "../utils/Settings";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

type ParamsList = {
  AddScreen: { folder?: Folder; seed?: boolean };
};

export default function AddScreen() {
  const route = useRoute<RouteProp<ParamsList, "AddScreen">>();

  const navigation = useNavigation();
  const dispatch = useTypedDispatch();
  const theme = useTheme();
  const [showScanner, setShowScanner] = useState(false);
  const [saving, setSaving] = useState(false);
  const [addressInput, setAddressInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [derivationStartingPath, setDerivationStartingPath] = useState(
    STARTING_DERIVATION_PATH
  );
  const [passphraseInput, setPassphraseInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [seedType, setSeedType] = useState<"generate" | "import" | null>(null);
  const [seed, setSeed] = useState("");

  const addingType = useMemo(() => {
    if (route.params.folder) {
      return AddingEnum.ADDRESS;
    }
    if (route.params.seed) {
      return AddingEnum.XPUB_WALLET_WITH_SEED;
    }
    return AddingEnum.XPUB_WALLET;
  }, [route]);

  const startScan = () => {
    setShowScanner(true);
  };

  const onScan = (result: string) => {
    if (addingType === AddingEnum.XPUB_WALLET_WITH_SEED) {
      setSeed(result);
    } else {
      setAddressInput(result);
    }
    setShowScanner(false);
  };

  const saveAddress = async () => {
    if (saving) {
      return;
    }
    try {
      if (
        isAddressValid(addressInput, addingType) &&
        isSeedValid(seed, addingType)
      ) {
        setSaving(true);

        let address = addressInput;
        let name = nameInput;

        if (addingType === AddingEnum.ADDRESS && route.params.folder) {
          dispatch(
            addAddressToFolder(
              { name: name, address: address },
              route.params.folder
            )
          );
          BalanceFetcher.filterAndFetchBalances(false);
          Toast.showToast({
            type: "top",
            message: i18n.t("success_added"),
            duration: 1500,
          });
          navigation.goBack();
          return true;
        }

        let seedPassphrase: string | undefined = undefined;
        if (addingType === AddingEnum.XPUB_WALLET_WITH_SEED) {
          if (passphraseInput.length > 0) {
            seedPassphrase = passphraseInput;
          }
          address = await generateZpubFromMnemonic(seed, seedPassphrase);
        }

        const newFolder: Folder = {
          uid: generateUid(),
          version: "v2",
          name: name,
          addresses: [],
          totalBalance: 0,
          orderAddresses: "custom",
          type: FolderType.XPUB_WALLET,
          address: address,
          xpubConfig: {
            branches: derivationStartingPath
              .split(",")
              .map((path) => ({ nextPath: path, addresses: [] })),
          },
          seed,
        };

        dispatch(addFolder(newFolder));
        setLoading(true);
        setTimeout(() => {
          //Wrap in settimeout to update the UI first
          try {
            newFolder.xpubConfig!.branches!.forEach((branch) => {
              const firstAddresses = initializeAddressesDerivation(
                newFolder,
                branch
              );
              if (firstAddresses && firstAddresses.length > 0) {
                dispatch(
                  addDerivedAddresses(newFolder, branch, firstAddresses)
                );
              }
            });

            BalanceFetcher.filterAndFetchBalances(false);
            Toast.showToast({
              type: "top",
              message: i18n.t("success_added"),
              duration: 1500,
            });
            navigation.goBack();

            setTimeout(() => {
              navigation.navigate("FolderContent", { folder: newFolder });
            }, 300);
          } catch (e) {
            dispatch(removeFolder(newFolder));
            Toast.showToast({
              type: "top",
              message: i18n.t("error_added"),
              duration: 2000,
            });
          } finally {
            setLoading(false);
          }
        }, 0);

        return true;
      }

      if (addingType === AddingEnum.XPUB_WALLET_WITH_SEED) {
        Alert.alert(i18n.t("error"), i18n.t("invalid_seed"));
        return false;
      }
      Alert.alert(i18n.t("error"), i18n.t("invalid_address"));
      return false;
    } catch (e) {
      Alert.alert(i18n.t("error"), e?.toString());
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <MainTitle title={i18n.t("add")} />,
      headerLeft: () => (
        <Appbar.BackAction
          color={"white"}
          onPress={() => navigation.goBack()}
        />
      ),
      headerRight: () =>
        isAddressValid(addressInput, addingType) &&
        isSeedValid(seed, addingType) && (
          <TouchableOpacity
            onPress={() => saveAddress()}
            disabled={loading || saving}
          >
            <Text
              style={{
                color: "white",
                fontSize: 20,
                paddingLeft: 15,
                paddingRight: 15,
              }}
            >
              {i18n.t("done")}
            </Text>
          </TouchableOpacity>
        ),
    });
  }, [i18n, saveAddress, navigation]);

  const isSeedError = useMemo(() => {
    return (
      addingType === AddingEnum.XPUB_WALLET_WITH_SEED &&
      seedType === "import" &&
      !!seed &&
      !validateMnemonic(seed)
    );
  }, [addingType, seedType, seed]);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 20,
        backgroundColor: theme.colors.background,
        flexDirection: "column",
      }}
    >
      <TextInput
        style={styles.textInput}
        label={i18n.t("name")}
        onChangeText={(text) => {
          setNameInput(text);
        }}
        value={nameInput}
      />

      {addingType === AddingEnum.XPUB_WALLET_WITH_SEED && (
        <View
          style={{
            flexDirection: "column",
            gap: 20,
          }}
        >
          <SeedChoices
            choiceType={seedType}
            onChoiceChange={async (seedChoice) => {
              setSeed("");
              setSeedType(seedChoice);
              if (seedChoice === "generate") {
                const mnemonic = await generateMnemonic();
                setSeed(mnemonic);
              }
            }}
          />
          {seedType === "generate" ? (
            <View
              style={{
                padding: 10,
              }}
            >
              {seed ? null : <ActivityIndicator />}
            </View>
          ) : null}
          {seedType === "import" ? (
            <View style={{ flexDirection: "column" }}>
              <View style={{}}>
                <TextInput
                  multiline
                  style={{
                    height: 100,
                  }}
                  label={"Seed"}
                  onChangeText={(text) => {
                    setSeed(text);
                  }}
                  value={seed}
                />
                <HelperText type="error" visible={!!seed && isSeedError}>
                  Invalid seed
                </HelperText>
              </View>
              <QRCodeButton
                label={i18n.t("scan_seedqr")}
                onPress={() => {
                  !saving && startScan();
                }}
              />
            </View>
          ) : null}
          {seedType ? (
            <TextInput
              secureTextEntry
              label={i18n.t("passphrase")}
              onChangeText={(text) => {
                setPassphraseInput(text);
              }}
              value={passphraseInput}
            />
          ) : null}
        </View>
      )}

      {addingType !== AddingEnum.XPUB_WALLET_WITH_SEED && (
        <>
          <View>
            <TextInput
              style={{ ...styles.textInput, justifyContent: "flex-start" }}
              onChangeText={(text) => {
                setAddressInput(text);
              }}
              value={addressInput}
              label={i18n.t("address")}
            />
            <HelperText
              type="error"
              visible={
                !isAddressValid(addressInput, addingType) &&
                addressInput.length > 0
              }
            >
              {i18n.t("invalid_address")}
            </HelperText>
          </View>

          <View>
            <QRCodeButton
              onPress={() => {
                !saving && startScan();
              }}
            />
          </View>
        </>
      )}

      {loading && (
        <View
          style={{
            padding: 20,
          }}
        >
          <ActivityIndicator size="small" />
        </View>
      )}
      {addingType === AddingEnum.XPUB_WALLET && (
        <View
          style={{
            paddingHorizontal: 25,
            marginTop: 25,
          }}
        >
          <View style={{ marginBottom: 10 }}>
            <Headline>{i18n.t("advanced_users_only")}</Headline>
            <Text>{i18n.t("should_not_change")}</Text>
          </View>
          <DerivationPathSelector
            onChange={(value) => setDerivationStartingPath(value)}
            value={derivationStartingPath}
          />
        </View>
      )}
      <Modal
        visible={showScanner}
        animated={true}
        animationType={"slide"}
        onDismiss={() => setShowScanner(false)}
        onRequestClose={() => setShowScanner(false)}
      >
        <QRCodeScanner
          onAddressScanned={(result) => onScan(result)}
          onCancel={() => {
            setShowScanner(false);
          }}
          scanningType={addingType}
        />
      </Modal>
    </View>
  );
}

const SeedChoices = ({
  choiceType,
  onChoiceChange,
}: {
  choiceType: null | "generate" | "import";
  onChoiceChange: (choice: "generate" | "import") => void;
}) => {
  const { t } = useI18n();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        padding: 10,
      }}
    >
      <Choice
        title={t("generate_seed")}
        selected={choiceType === "generate"}
        onPress={() => {
          onChoiceChange("generate");
        }}
      />
      <Choice
        selected={choiceType === "import"}
        title={t("import_seed")}
        onPress={() => {
          onChoiceChange("import");
        }}
      />
    </View>
  );
};

const Choice = ({
  title,
  onPress,
  selected,
}: {
  title: string;
  onPress: () => void;
  selected: boolean;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderRadius: 10,
        borderWidth: 5,
        borderColor: selected ? "#f47c1c7F" : "rgba(0,0,0,0)",
        flex: 1,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          borderWidth: 2,
          borderRadius: 10 - 5,
          padding: 10,
          height: 70,
          borderColor: "#ccc",
        }}
      >
        <Text>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  textInput: {
    marginBottom: 7,
  },
};
