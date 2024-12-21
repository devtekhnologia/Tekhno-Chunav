import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BoothVoters from '../Booth/BoothVoters';
import Booths from '../Booth/Booths';
import Dashboard from '../Dashboard/Dashboard';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useContext } from 'react';
import Totalvoters from '../Voters/TotalVoters';
import { LanguageContext } from '../../LanguageContext';
import Entry from '../../../src/Entry';
import AdminBottomTabNav from './AdminBottomTabNav';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
    const navigation = useNavigation();

    return (
        <Stack.Navigator initialRouteName={"Entry"} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Entry" component={Entry} />
            <Stack.Screen name="AdminBottomNav" component={AdminBottomTabNav} />
        </Stack.Navigator >
    );
};

export default StackNavigation;
