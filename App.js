import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AdminMain from './src/AdminMain';
import { WashimVoterProvider } from './src/Admin/Context_Api/WashimVoterContext';
import { TotalVoterProvider } from './src/Admin/Context_Api/TotalVoterContext';
import { BoothsProvider } from './src/Admin/Context_Api/BoothContext';


export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TotalVoterProvider>
        <BoothsProvider>
          <WashimVoterProvider>
            <NavigationContainer >
              <AdminMain />
            </NavigationContainer>
          </WashimVoterProvider>
        </BoothsProvider>
      </TotalVoterProvider>
    </GestureHandlerRootView >
  );
}