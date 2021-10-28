import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, View } from './components/Themed';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import FlashMessage from "react-native-flash-message";


export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();


  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        
        <Navigation colorScheme={colorScheme} /> 

        <StatusBar />
        {/* GLOBAL FLASH MESSAGE COMPONENT INSTANCE */}
        <FlashMessage position="bottom" duration={Number(1000)} floating  /> 
      </SafeAreaProvider>
    );
  }
}
