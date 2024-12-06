import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { TownUserContext } from '../ContextApi/TownUserProvider';
import LaunchScreen from '../ReusableCompo/LaunchScreen';
import ProfileChooser from '../ReusableCompo/ProfileChooser';
import TownUserLogin from '../ReusableCompo/Logins/TownUserLogin';
import BoothUserLogin from '../ReusableCompo/Logins/BoothUserLogin';
import AdminLogin from '../ReusableCompo/Logins/AdminLogin';
import { BoothUserContext } from '../ContextApi/BuserContext';
import TownBottomTabNav from './TownBottomTabNav';
import BoothBottomTabNav from './BoothBottomTabNav';
import AdminBottomTabsNav from '../Navigation/AdminBottomTabNav';
import { AuthenticationContext } from '../ContextApi/AuthenticationContext';
import WarduserLogin from '../ReusableCompo/Logins/WarduserLogin';
import { WardUserContext } from '../ContextApi/WardUserContext';
import WardBottomTabNav from './WardBottomTabNav';
import KUserLogin from '../ReusableCompo/Logins/KUserLogin';
import { KaryakartaContext } from '../ContextApi/KaryakartaContext';
import KUserMainStack from './KUserMainStack';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
    const { isAuthenticated } = useContext(AuthenticationContext);
    const { isWarduserAuthenticated } = useContext(WardUserContext)
    const { isTuserAuthenticated } = useContext(TownUserContext);
    const { isBuserAuthenticated } = useContext(BoothUserContext)
    const { isKaryakartaAuthenticated } = useContext(KaryakartaContext)
    return (
        <Stack.Navigator
            initialRouteName={"Launch Screen"}
            screenOptions={{
                headerShown: false,
            }}
        >
            {
                (isAuthenticated) ? (
                    // <Stack.Screen name="Admin" component={AdminMainStack} />
                    <Stack.Screen name="Admin" component={AdminBottomTabsNav} />
                ) : (isWarduserAuthenticated) ? (
                    // <Stack.Screen name="WardUser" component={WardUserMainStack} />
                    <Stack.Screen name="WardUser" component={WardBottomTabNav} />
                ) : (isTuserAuthenticated) ? (
                    // <Stack.Screen name="TownUser" component={TownUserMainStack} />
                    <Stack.Screen name="TownUser" component={TownBottomTabNav} />
                ) : (isBuserAuthenticated) ? (
                    <Stack.Screen name="BoothUser" component={BoothBottomTabNav} />
                ) : (isKaryakartaAuthenticated) ? (
                    <Stack.Screen name="KaryakartaUser" component={KUserMainStack} />
                ) : (

                    <>
                        <Stack.Screen name="Launch Screen" component={LaunchScreen} />
                        <Stack.Screen name="ProfileChooser" component={ProfileChooser} />
                        <Stack.Screen name="AdminLogin" component={AdminLogin} />
                        <Stack.Screen name="WardUserLogin" component={WarduserLogin} />
                        <Stack.Screen name="TownUserLogin" component={TownUserLogin} />
                        <Stack.Screen name="BoothUserLogin" component={BoothUserLogin} />
                        <Stack.Screen name="KUserLogin" component={KUserLogin} />

                    </>
                )
            }
        </Stack.Navigator >
    );
};

export default StackNavigation;
