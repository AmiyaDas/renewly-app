import { Button, Platform, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function HomeScreen() {
  useEffect(() => {
    // Create channel for Android
    console.log("Setting up notification channel");
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  }, []);

  const onDisplayNotification = async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title || "Renewly",
        body: body || "",
      },
      trigger: {
        type: SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 1,
      }, // show after 1 second
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* <Button
        title="Display Notification"
        onPress={() => {
          onDisplayNotification("Hello from app!");
        }}
      /> */}
      <WebView
        source={{ uri: "https://amiyadas.github.io/renewly/" }}
        style={{ flex: 1 }}
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data);
          console.log("Received message from WebView:", data);
          if (data.type === "REGISTER_PUSH") {
            console.log("Register user for push:", data.payload);
            onDisplayNotification(data.payload?.title, data.payload?.body);
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
