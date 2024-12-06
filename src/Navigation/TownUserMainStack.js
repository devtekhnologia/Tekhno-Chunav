import { Dimensions, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import BuserRegisteration from '../TownUser/Profile/BuserRegisteration'
import LogOut from '../ReusableCompo/LogOut';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import RightManuBtn from '../TownUser/Dashboard/RightManuBtn';
import TboothUsers from '../TownUser/Filter/TboothUsers';
import TotalNonVoted from '../TownUser/Voters/TotalNonVoted'
import TotalVoted from '../TownUser/Voters/TotalVoted'
import TownDashboard from '../TownUser/Dashboard/TuserDashboard';
import ApprovalScreen from '../TownUser/Voters/ApprovalScreen';
import TownBooths from '../TownUser/Booths/TownBooths';
import BoothVoters from '../TownUser/Booths/BoothVoters';
import TownProfile from '../TownUser/Profile/TownProfile';
import CastWiseVoters from '../TownUser/Filter/CastWiseVoters';
import TownVoters from '../TownUser/Voters/TownVoters';
import { LanguageContext } from '../ContextApi/LanguageContext';
import { useContext } from 'react';

const Stack = createNativeStackNavigator();
const TownUserMainStack = () => {
    const navigation = useNavigation();
    const { language, toggleLanguage } = useContext(LanguageContext);

    return (
        <Stack.Navigator initialRouteName='Dashboard'>
            <Stack.Screen name='Dashboard' component={TownDashboard}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerTitle: language === 'en' ? "Dashboard" : 'डॅशबोर्ड',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={30} color="black"
                            style={{ marginLeft: 5 }}
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                    headerRight: () => (<RightManuBtn />)
                }}
            />

            <Stack.Screen name='Voters List' component={TownVoters}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerTitle: language === 'en' ? 'Total Voters' : 'एकूण मतदार',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <Octicons name="arrow-left" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen name='Total Booths' component={TownBooths}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerTitle: language === 'en' ? 'Total Booths' : 'एकूण बूथ',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <Octicons name="arrow-left" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen name='Approval Voters' component={ApprovalScreen}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerTitle: language === 'en' ? 'Approval Voters' : 'मंजूरी मतदार',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <Octicons name="arrow-left" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen name='Booth Users' component={TboothUsers}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22,
                    },
                    headerTitle: language === 'en' ? 'Booth Users' : 'बूथ कार्यकर्ता',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <Octicons name="arrow-left" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />


            <Stack.Screen name='Total Voted' component={TotalVoted}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitle: language === 'en' ? 'Total Voted' : 'एकूण मतदान केलेले',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <Octicons name="arrow-left" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen name='Total Non Voted' component={TotalNonVoted}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerTitle: language === 'en' ? 'Total Non Voted' : 'एकूण मतदान न झालेले',
                    headerShadowVisible: false, headerLeft: () => (
                        <TouchableOpacity style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <Octicons name="arrow-left" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />


            <Stack.Screen name='Castwise Voters' component={CastWiseVoters}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerTitle: language === 'en' ? 'Castwise Voters' : 'जात नुसार',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5, }}
                            onPress={() => navigation.goBack()}  >
                            <Octicons name="arrow-left" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen name='Booth Voters' component={BoothVoters}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerTitle: language === 'en' ? 'Booth Voters' : 'बूथ मतदार',
                    headerShadowVisible: false, headerLeft: () => (
                        <TouchableOpacity style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <Octicons name="arrow-left" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />


            <Stack.Screen name='Registeration' component={BuserRegisteration} options={{ headerShown: false }} />
            <Stack.Screen name='Profile' component={TownProfile} options={{ headerShown: false }} />
            <Stack.Screen name='LogOut' component={LogOut} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

export default TownUserMainStack








