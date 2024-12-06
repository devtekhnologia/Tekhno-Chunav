import { Dimensions, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import LogOut from '../ReusableCompo/LogOut';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import RightManuBtn from '../Ward/WardDash/RightManuBtn';
import WardDash from '../Ward/WardDash/WardDash';
import Wardvoterlist from '../Ward/Wardvoterlist';
import WardBooths from '../Ward/WardBooths';
import WboothUsers from '../Ward/WboothUsers';
import WApprovalScreen from '../Ward/Approval/WApprovalScreen';
import WardVoted from '../Ward/WardVoted';
import WardNvoted from '../Ward/WardNvoted';
import WardBoothVoters from '../Ward/WardBoothVoters';
import WuserwiseLocation from '../Ward/WuserwiseLocation';
import WLocationWise from '../Ward/WLocationWise';
import Wsignup from '../Ward/Wsignup';
import { LanguageContext } from '../ContextApi/LanguageContext';
import { useContext } from 'react';

const Stack = createNativeStackNavigator();
const WardUserMainStack = () => {
    const navigation = useNavigation();
    const { language } = useContext(LanguageContext);

    return (
        <Stack.Navigator initialRouteName='Dashboard'>
            <Stack.Screen name='Dashboard' component={WardDash}
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

            <Stack.Screen name='Voters List' component={Wardvoterlist}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerTitle: language === 'en' ? "Voter List" : 'मतदार यादी',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen name='Total Booths' component={WardBooths}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerTitle: language === 'en' ? "Booth List" : 'बूथ यादी',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),

                    headerRight: () => (
                        <TouchableOpacity style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.navigate('Location Wise Voters')}  >
                            <MaterialIcons name="sort" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen name='Booth Users' component={WboothUsers}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22,
                    },
                    headerTitle: language === 'en' ? "Booth Users" : 'बूथ कार्यकर्ता यादी',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen name='Approve Survey' component={WApprovalScreen}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerTitle: language === 'en' ? "Approve Survey" : 'सर्वेक्षण मंजूर करा',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen name='Total Voted' component={WardVoted}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen name='Total Non Voted' component={WardNvoted}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerShadowVisible: false, headerLeft: () => (
                        <TouchableOpacity style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />


            <Stack.Screen name='Location Wise Voters' component={WuserwiseLocation}
                options={{
                    headerShown: false, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5, }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen name='Location Wise' component={WLocationWise}
                options={{
                    headerShown: false, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5, }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen name='Booth Voters' component={WardBoothVoters}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerTitle: language === 'en' ? "Booth Voters" : 'बूथ मतदार',
                    headerShadowVisible: false, headerLeft: () => (
                        <TouchableOpacity style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />


            <Stack.Screen name='Registeration' component={Wsignup} options={{ headerShown: false }} />
            <Stack.Screen name='LogOut' component={LogOut} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

export default WardUserMainStack








