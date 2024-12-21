import { StatusBar } from 'expo-status-bar';
import DrawerNavigationComp from './Admin/Navigation/DrawerNavigationComp';
import StackNavigation from './Admin/Navigation/StackNavigation';
import { LanguageProvider } from './LanguageContext';
import { WashimVoterProvider } from './Admin/Context_Api/WashimVoterContext';

export default function AdminMain() {
  return (
    <>
      <StatusBar style="light" translucent={true} />
      <LanguageProvider>
        <DrawerNavigationComp >
          <StackNavigation />
        </DrawerNavigationComp>
      </LanguageProvider>
    </>
  );
}
