import {
  Modal,
  Platform,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { StyledQRCode } from "./StyledQRCode";
import React from "react";
import ViewShot from "react-native-view-shot";
import { ActionButton } from "./ActionButton";
import { i18n } from "../translations/i18n";
import { Button } from "react-native-paper";
import { useTheme } from "../utils/Theme";
import * as Sharing from "expo-sharing";

export const QRCodeModal = ({ content }: { content: string }) => {
  const [open, setOpen] = React.useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  const theme = useTheme();
  const viewShotRef = React.useRef<ViewShot>(null);
  return (
    <>
      <View
        style={{
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <TouchableOpacity onPress={openModal}>
          <StyledQRCode content={content} size={150} />
        </TouchableOpacity>
      </View>
      <Modal
        visible={open}
        animated={true}
        onDismiss={closeModal}
        onRequestClose={closeModal}
        presentationStyle={"fullScreen"}
        animationType={"slide"}
      >
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.background,
          }}
        >
          <TouchableOpacity onPress={closeModal}>
            <ViewShot
              ref={viewShotRef}
              options={{ format: "png", result: "tmpfile" }}
            >
              <StyledQRCode content={content} size={280} />
            </ViewShot>
          </TouchableOpacity>
          <ActionButton
            text={i18n.t("share_qrcode")}
            style={{ marginTop: 10 }}
            color={"black"}
            icon={"export"}
            onPress={async () => {
              let uri = await viewShotRef.current.capture();
              shareImage(uri);
            }}
          />
          <Button
            style={{ marginBottom: -80, marginTop: 80 }}
            onPress={closeModal}
          >
            {i18n.t("close")}
          </Button>
        </View>
      </Modal>
    </>
  );
};

async function shareImage(uri) {
  switch (Platform.OS) {
    case "android":
      if (await Sharing.isAvailableAsync()) {
        Sharing.shareAsync(uri, {
          mimeType: "image/png",
        });
      }
      break;
    case "ios":
      Share.share(
        {
          title: "QRCode",
          url: uri,
        },
        {
          dialogTitle: "Share QRCode",
        }
      );
      break;
  }
}
