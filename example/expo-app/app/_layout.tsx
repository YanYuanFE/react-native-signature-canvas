import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { StyleSheet, View, Image } from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";
import Sign from "./Sign";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [signature, setSign] = useState(null);
  const [value, onChangeText] = useState("Useless Placeholder");
  const [desc, setDesc] = useState("Please Sign");

  const handleSignature = (signature) => {
    console.log(signature);
    setSign(signature);
    setDesc("sign success");
    // const path = FileSystem.cacheDirectory + 'sign.png';
    // FileSystem.writeAsStringAsync(path, signature.replace('data:image/png;base64,', ''), {encoding: FileSystem.EncodingType.Base64}).then(res => {
    //   console.log(res);
    //   FileSystem.getInfoAsync(path, {size: true, md5: true}).then(file => {
    //     console.log(file);
    //   })
    // }).catch(err => {
    //   console.log("err", err);
    // })
  };

  const handleEmpty = () => {
    console.log("Empty");
  };

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, paddingTop: 40 }}>
        <View style={styles.preview}>
          {signature ? (
            <Image
              resizeMode={"contain"}
              style={{ width: 750, height: 100 }}
              source={{ uri: signature }}
            />
          ) : null}
        </View>
        <Sign onOK={handleSignature} text={desc} />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  preview: {
    height: 50,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    flex: 1,
  },
  previewText: {
    color: "#FFF",
    fontSize: 14,
    height: 40,
    lineHeight: 40,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#69B2FF",
    width: 120,
    textAlign: "center",
    marginTop: 10,
  },
});
