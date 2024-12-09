import { Dimensions, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import LogOut from '../ReusableCompo/LogOut';
import BuserProfile from '../BoothUser/Profile/BuserProfile';
import Prediction from '../BoothUser/Prediction/Prediction';
import CasteList from '../BoothUser/Cast/CasteList';
import BoothDashbord from '../BoothUser/Dashboard/BoothDashbord';
import BoothNVoted from '../BoothUser/Dashboard/BoothNVoted';
import BoothVotedList from '../BoothUser/Dashboard/BoothVotedList';
import BoothVoters from '../BoothUser/Voters/BoothVoters';
import ExitPoll from '../BoothUser/Prediction/ExitPoll';
import FilterVoterByRelations from '../BoothUser/Voters/FilterVotersByRelations';
import BoothRightMenu from '../BoothUser/Dashboard/BoothRightMenu';
import Family from '../BoothUser/Dashboard/Family';
import Familylist from '../BoothUser/Dashboard/Familylist';
import { LanguageContext } from '../ContextApi/LanguageContext';
import { useContext } from 'react';
import AddVoter from '../BoothUser/Dashboard/Addvoter';
import BLocationWise from '../BoothUser/Dashboard/BLocationWise';

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();
const { height, width } = Dimensions.get('window');


const TabBarIcon = ({ focused, name, IconComponent }) => (
    <IconComponent name={name} size={height * 0.033} color={focused ? '#3C4CAC' : 'black'} />
);


const DashboardStack = () => {
    const navigation = useNavigation();
    const { language, toggleLanguage } = useContext(LanguageContext);
    return (
        <Stack.Navigator initialRouteName=''>
            <Stack.Screen name='Dashboard' component={BoothDashbord}
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
                    headerRight: () => (
                        <BoothRightMenu />
                    )
                }}
            />

            <Stack.Screen name='Voters List' component={BoothVoters}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitle: language === 'en' ? "Voter List" : 'मतदार यादी',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialIcons name="keyboard-backspace" size={30} color="black" />
                        </Pressable>
                    ),
                }}
            />

            <Stack.Screen name="Non Voted" component={BoothNVoted}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerTitle: language === 'en' ? "Non Voted" : 'मतदान न केलेले',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialIcons name="keyboard-backspace" size={30} color="black" />
                        </Pressable>
                    ),
                }}
            />
            <Stack.Screen name="Voted" component={BoothVotedList}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerTitle: language === 'en' ? "Voted" : 'मतदान केलेले',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialIcons name="keyboard-backspace" size={30} color="black" />
                        </Pressable>
                    ),
                }}
            />

            <Stack.Screen name="Relational Voters" component={FilterVoterByRelations}
                options={{
                    headerShown: false, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialIcons name="keyboard-backspace" size={30} color="black" />
                        </Pressable>
                    ),
                }}
            />

            <Stack.Screen name="Family" component={Family}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitle: language === 'en' ? 'Create Family' : 'कुटुंब तयार करा',
                    headerTitleStyle: { fontSize: 22 },

                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialIcons name="keyboard-backspace" size={30} color="black" />
                        </Pressable>
                    ),
                }}
            />

            <Stack.Screen name="Familylist" component={Familylist}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerTitle: language === 'en' ? 'Family List' : 'कुटुंब सूची',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialIcons name="keyboard-backspace" size={30} color="black" />
                        </Pressable>
                    ),
                }}
            />

            <Stack.Screen name="Add Voters" component={AddVoter}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerTitle: language === 'en' ? 'Add Voters' : 'मतदार जोडा',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialIcons name="keyboard-backspace" size={30} color="black" />
                        </Pressable>
                    ),
                }}
            />

            <Stack.Screen name="Locationwise Voters" component={BLocationWise}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerTitle: language === 'en' ? 'Locationwise Voters' : 'स्थानानुसार मतदार',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialIcons name="keyboard-backspace" size={30} color="black" />
                        </Pressable>
                    ),
                }}
            />

            <Stack.Screen name='LogOut' component={LogOut} options={{ headerShown: false }} />

        </Stack.Navigator>
    )
}

const VotersStack = () => {
    const navigation = useNavigation();
    const { language, toggleLanguage } = useContext(LanguageContext);

    return (
        <Stack.Navigator initialRouteName='Voters List'>
            <Stack.Screen name='Voters List' component={BoothVoters}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitle: language === 'en' ? "Voter List" : 'मतदार यादी',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialIcons name="keyboard-backspace" size={30} color="black" />
                        </Pressable>
                    ),
                }}
            />
        </Stack.Navigator>
    )
}

const CastStack = () => {
    const navigation = useNavigation();
    const { language, toggleLanguage } = useContext(LanguageContext);

    return (
        <Stack.Navigator initialRouteName='CasteList'>
            <Stack.Screen name='Caste-wise Voters' component={CasteList}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22,
                    },
                    headerTitle: language === 'en' ? 'Caste-wise Voters' : 'जातीनुसार मतदार',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialIcons name="keyboard-backspace" size={30} color="black" />
                        </Pressable>
                    ),
                }}
            />
        </Stack.Navigator>
    )
}

const PredictionStack = () => {
    const navigation = useNavigation();
    const { language, toggleLanguage } = useContext(LanguageContext);

    return (
        <Stack.Navigator initialRouteName='Prediction'>
            <Stack.Screen name='Prediction' component={Prediction}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22,
                    },
                    headerTitle: language === 'en' ? 'Prediction' : 'संभाव्यता',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialIcons name="keyboard-backspace" size={30} color="black" />
                        </Pressable>
                    ),
                }}
            />

            <Stack.Screen name='Exit Poll' component={ExitPoll}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22,
                    },
                    headerTitle: language === 'en' ? 'Exit Poll' : 'एक्झिट पोल',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.navigate('Prediction')}  >
                            <MaterialIcons name="keyboard-backspace" size={30} color="black" />
                        </Pressable>
                    ),
                }}
            />

            <Stack.Screen name='Total Voters' component={BoothVoters}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerTitle: language === 'en' ? 'Total Voters' : 'एकूण मतदार',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.navigate('Prediction')}  >
                            <MaterialIcons name="keyboard-backspace" size={30} color="black" />
                        </Pressable>
                    ),
                }}
            />

            <Stack.Screen name="Relational Voters" component={FilterVoterByRelations}
                options={{
                    headerShown: false, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.navigate('Prediction')}  >
                            <MaterialIcons name="keyboard-backspace" size={30} color="black" />
                        </Pressable>
                    ),
                }}
            />
        </Stack.Navigator>
    )
}

const ProfileStack = () => {
    const { language, toggleLanguage } = useContext(LanguageContext);

    return (
        <Stack.Navigator initialRouteName='Profile'>
            <Stack.Screen name='Profile' component={BuserProfile} options={{ headerShown: false }} />
            <Stack.Screen name='LogOut' component={LogOut} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}


const BoothBottomTabNav = () => (
    <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
        <Tab.Navigator
            initialRouteName='Dashboard'
            activeColor="#3C4CAC"
            barStyle={styles.tabBar}
            shifting={false}
        >
            <Tab.Screen name='Booth Dashboard Tab' component={DashboardStack}
                options={{
                    tabBarLabel: "Dashboard",
                    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="home" IconComponent={AntDesign} />,
                }}
            />

            <Tab.Screen name='Voters Tab' component={VotersStack}
                options={{
                    tabBarLabel: 'Voters',
                    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="list-alt" IconComponent={FontAwesome} />,
                }}

            />

            <Tab.Screen name='Cast-Wise Tab' component={CastStack}
                options={{
                    tabBarLabel: "Cast-Wise",
                    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="sort" IconComponent={MaterialIcons} />,
                }}
            />

            <Tab.Screen name='Prediction Tab' component={PredictionStack}
                options={{
                    tabBarLabel: "Prediction",
                    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="poll" IconComponent={MaterialIcons} />,
                }}
            />


            <Tab.Screen name='Town Profile Tab' component={ProfileStack}
                options={{
                    tabBarLabel: "Profile",
                    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="person" IconComponent={MaterialIcons} />,
                }}
            />
        </Tab.Navigator>
    </KeyboardAvoidingView>
);

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: 'white',
        height: height * 0.1,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        // marginBottom: 10
    },
    tabItem: {
        alignItems: 'center',
        // marginTop: 5
    },
    activeTab: {
        width: 55,
        height: 55,
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(173, 216, 230, 0.5)',
        borderRadius: 100,
        marginBottom: 30,
        alignItems: 'center'
    },
});



export default BoothBottomTabNav;







