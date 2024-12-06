import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from './src/Navigation/StackNavigation';
import DrawerNavigationComp from './src/Navigation/DrawerNavigationComp'
import { TownUserProvider } from './src/ContextApi/TownUserProvider';
import { BoothUserProvider } from './src/ContextApi/BuserContext';
import { LanguageProvider } from './src/ContextApi/LanguageContext';
import { AuthenticationProvider } from './src/ContextApi/AuthenticationContext';
import { WardUserProvider } from './src/ContextApi/WardUserContext';
import { KaryakartaProvider } from './src/ContextApi/KaryakartaContext';

export default function App() {
  return (
    <>
      <StatusBar style="light" translucent={true} />
      <LanguageProvider>
        <AuthenticationProvider>
          <WardUserProvider>
            <TownUserProvider>
              <BoothUserProvider>
                <KaryakartaProvider>
                  <NavigationContainer>
                    <DrawerNavigationComp>
                      <StackNavigation />
                    </DrawerNavigationComp>
                  </NavigationContainer>
                </KaryakartaProvider>
              </BoothUserProvider>
            </TownUserProvider>
          </WardUserProvider>
        </AuthenticationProvider>
      </LanguageProvider>
    </>
  );
}
