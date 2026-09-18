import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { db } from '../src/database/db';
import { COLORS } from '../src/constants/theme';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await db.init();
      } catch (e) {
        console.warn('Initialization error', e);
      } finally {
        setIsReady(true);
      }
    }
    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar hidden={true} />
      <View style={styles.rootContainer}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background },
            animation: 'slide_from_right',
          }}
        >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="tasks/add"
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="tasks/[id]"
          options={{
            presentation: 'card',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="jobs/add"
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="jobs/[id]"
          options={{
            presentation: 'card',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="reports/[month]"
          options={{
            presentation: 'card',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            presentation: 'card',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{
            presentation: 'card',
            headerShown: false,
          }}
        />
      </Stack>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingTop: 22,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
