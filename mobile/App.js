import React from 'react';
import { StyleSheet, View, LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CompetitionDetailsScreen from './src/screens/CompetitionDetailsScreen';
import { COLORS } from './src/constants/theme';

// Ignore known upstream react-native-web internal deprecation notices
LogBox.ignoreLogs([
  'props.pointerEvents is deprecated',
  'SafeAreaView has been deprecated',
  '"shadow*" style props are deprecated',
]);

if (typeof console !== 'undefined') {
  const ignorePatterns = [
    'pointerEvents is deprecated',
    'shadow* style props are deprecated',
    'SafeAreaView has been deprecated',
  ];
  const filterConsole = (origFn) => (...args) => {
    const text = args
      .map((a) => (typeof a === 'string' ? a : (a && a.message) || ''))
      .join(' ');
    if (ignorePatterns.some((p) => text.includes(p))) {
      return;
    }
    origFn.apply(console, args);
  };
  console.warn = filterConsole(console.warn);
  console.error = filterConsole(console.error);
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        <StatusBar style="dark" />
        <CompetitionDetailsScreen />
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
