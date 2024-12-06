import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { Dimensions, Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import KDash from '../Karyakarta/KDash';
import TotalVoters from '../Karyakarta/TotalVoters';
import KVoted from '../Karyakarta/KVoted';
import KNVoted from '../Karyakarta/KNVoted';
import ProfileButton from '../Karyakarta/ProfileButton';
import KProfile from '../Karyakarta/KProfile';
import LogOut from '../ReusableCompo/LogOut';
import { useContext } from 'react';
import { LanguageContext } from '../ContextApi/LanguageContext';

const Stack = createNativeStackNavigator();
const { height, width } = Dimensions.get('screen')

const KUserMainStack = () => {
    const { language } = useContext(LanguageContext)
    const navigation = useNavigation();

    return (

        <Stack.Navigator initialRouteName='Dashboard' screenOptions={{ headerShown: true }}>
            <Stack.Screen name='Dashboard' component={KDash}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerShadowVisible: false,
                    headerTitle: language === 'en' ? "Dashboard" : 'डॅशबोर्ड',
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={30} color="black"
                            style={{ marginLeft: 5 }}
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                    headerRight: () => (<ProfileButton />)
                }}
            />

            <Stack.Screen name='Total Voters' component={TotalVoters}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerShadowVisible: false,
                    headerTitle: language === 'en' ? "Total Voters" : 'एकूण मतदार',
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={30} color="black"
                            style={{ marginLeft: 5 }}
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                }}
            />

            <Stack.Screen name='KVoted' component={KVoted}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerTitle: language === 'en' ? "Total Voted" : 'एकूण मतदान',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={30} color="black"
                            style={{ marginLeft: 5 }}
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                }}
            />


            <Stack.Screen name='KNVoted' component={KNVoted}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerTitle: language === 'en' ? "Total Not Voted" : 'एकूण मतदान न झालेले',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={30} color="black"
                            style={{ marginLeft: 5 }}
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                }}
            />

            <Stack.Screen name='Profile' component={KProfile}
                options={{
                    headerShown: false,
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={30} color="black"
                            style={{ marginLeft: 5 }}
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                }}
            />

            <Stack.Screen name='LogOut' component={LogOut}
                options={{
                    headerShown: false,
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={30} color="black"
                            style={{ marginLeft: 5 }}
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                }}
            />


        </Stack.Navigator>
    )
}

export default KUserMainStack