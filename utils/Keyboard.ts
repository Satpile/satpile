import {
  Keyboard,
  KeyboardEventListener,
  LayoutAnimation,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";

export function useKeyBoardHeight(defaultHeight = 0) {
  if (Platform.OS === "ios") {
    useEffect(() => {
      const subs = [
        Keyboard.addListener("keyboardWillShow", _keyboardWillShow),
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide),
      ];

      // cleanup function
      return () => {
        subs.forEach((sub) => sub.remove());
      };
    }, []);

    const _keyboardWillShow: KeyboardEventListener = (event) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      updateKeyboardHeight(event.endCoordinates.height);
    };

    const _keyboardDidHide: KeyboardEventListener = (event) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      updateKeyboardHeight(defaultHeight);
    };
  }

  const [keyboardHeight, updateKeyboardHeight] = useState(defaultHeight);

  return keyboardHeight;
}
