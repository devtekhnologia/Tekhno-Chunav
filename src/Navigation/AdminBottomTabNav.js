import { AntDesign, MaterialIcons, MaterialCommunityIcons, FontAwesome5, Octicons } from 'react-native-vector-icons';
import { Dimensions, Platform, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import LogOut from '../ReusableCompo/LogOut';
import AdminMainStack from './AdminMainStack';
import Profile from '../Admin/Profile/Profile';
import Booths from '../Admin/Booth/Booths';
import BoothVoters from '../Admin/Booth/BoothVoters';
import Towns from '../Admin/Towns/Towns';
import TownVoters from '../Admin/Towns/TownVoters';
import Ward from '../Admin/Ward/Ward';
import WardVoters from '../Admin/Ward/WardVoters';
import ContactUs from '../ReusableCompo/ContactUs/ContactUs';
import { useContext } from 'react';
import { LanguageContext } from '../ContextApi/LanguageContext';
import { KeyboardAvoidingView } from 'react-native-web';


const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();
const { height, width } = Dimensions.get('window');


const TabBarIcon = ({ focused, name, IconComponent }) => (
    <IconComponent name={name} size={height * 0.033} color={focused ? '#3C4CAC' : 'black'} />
);

const TownStack = () => {
    const navigation = useNavigation();
    const { language, toggleLanguage } = useContext(LanguageContext);

    return (
        <Stack.Navigator initialRouteName='Towns'>
            <Stack.Screen name='Towns' component={Towns}
                options={{
                    headerShown: false, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: height * 0.02,
                    },
                    headerTitle: language === 'en' ? "Towns" : 'शहरे',
                    headerShadowVisible: false, headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <Octicons name="chevron-left" size={width * 0.05} color="black" />
                        </Pressable>
                    ),
                }} />
            <Stack.Screen name='Town Voters' component={TownVoters}
                options={({ route }) => ({
                    headerShown: false,
                    headerTitleAlign: 'center', headerShadowVisible: false,
                    headerTitle: language === 'en' ? route.params.townId ? `Voters in Town : ${route.params.townId}  ` : 'Town Voters' : route.params.townId ? `शहरातील मतदार : ${route.params.townId}  ` : 'शहरातील मतदार',
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={width * 0.05} color="black"
                            //style={{ marginLeft: 10 }}
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                })}
            />
        </Stack.Navigator>
    )
}

const BoothStack = () => {
    const navigation = useNavigation();
    const { language, toggleLanguage } = useContext(LanguageContext);

    return (
        <Stack.Navigator initialRouteName='Booths'>
            <Stack.Screen name='Booths' component={Booths}
                options={{
                    headerShown: false, headerTitleAlign: 'center', headerShadowVisible: false,
                    headerTitleStyle: {
                        fontSize: height * 0.02,
                    },
                    headerTitle: language === 'en' ? "Booths" : 'बूथ',
                    headerShadowVisible: false, headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <Octicons name="chevron-left" size={width * 0.05} color="black" />
                        </Pressable>
                    ),
                }}
            />
            <Stack.Screen name='Booth Voters' component={BoothVoters}
                options={({ route }) => ({
                    headerShown: false,
                    headerTitleAlign: 'center', headerShadowVisible: false,
                    headerTitle: route.params.boothId ? `Voters in Booth : ${route.params.boothId}  ` : 'Booth Voters',
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={width * 0.05} color="black"
                            //style={{ marginLeft: 10 }}
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                })}
            />
        </Stack.Navigator>
    )
}

const WardStack = () => {
    const navigation = useNavigation();
    const { language, toggleLanguage } = useContext(LanguageContext);

    return (
        <Stack.Navigator initialRouteName='Wards'>
            <Stack.Screen name='Wards' component={Ward}
                options={{
                    headerShown: false, headerTitleAlign: 'center', headerShadowVisible: false,
                    headerTitle: language === 'en' ? "Wards list" : 'प्रभाग यादी',
                    headerTitleStyle: { fontSize: 20, fontWeight: '600', color: 'black' },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialCommunityIcons name="keyboard-backspace" size={width * 0.09} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen name='Ward Voters' component={WardVoters}
                options={({ route }) => ({
                    headerShown: false,
                    headerTitleAlign: 'center', headerShadowVisible: false,
                    headerTitle: route.params.boothId ? `Voters in Ward : ${route.params.boothId}  ` : 'Ward Voters',
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={width * 0.05} color="black"
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                })}
            />

            <Stack.Screen name='Booth Voters' component={BoothVoters}
                options={({ route }) => ({
                    headerShown: false,
                    headerTitleAlign: 'center', headerShadowVisible: false,
                    headerTitle: route.params.boothId ? `Voters in Booth : ${route.params.boothId}  ` : 'Booth Voters',
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={width * 0.05} color="black"
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                })}
            />
        </Stack.Navigator>
    )
}

const ProfileStack = () => {
    return (
        <Stack.Navigator initialRouteName='Profile'>
            <Stack.Screen name='Profile' component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name='ContactUs' component={ContactUs} options={{ headerShown: false }} />
            <Stack.Screen name='LogOut' component={LogOut} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}


const AdminBottomTabNav = () => (
    // <KeyboardAvoidingView
    //     style={{ flex: 1 }}
    //     behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    // >
    <Tab.Navigator
        initialRouteName='Dashboard'
        activeColor="#3C4CAC"
        barStyle={styles.tabBar}
        shifting={false}
    >
        <Tab.Screen name='Dashboard Tab' component={AdminMainStack}
            options={{
                tabBarLabel: "Dashboard",
                tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="home" IconComponent={AntDesign} />,
            }}
        />

        <Tab.Screen name='Towns Tab' component={TownStack}
            options={{
                tabBarLabel: 'Towns',
                tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="city-variant-outline" IconComponent={MaterialCommunityIcons} />,
            }}

        />

        <Tab.Screen name='Booths Tab' component={BoothStack}
            options={{
                tabBarLabel: "Booths",
                tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="person-booth" IconComponent={FontAwesome5} />,
            }}
        />

        <Tab.Screen name='Wards Tab' component={WardStack}
            options={{
                tabBarLabel: "Wards",
                tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="page-next-outline" IconComponent={MaterialCommunityIcons} />,
            }}
        />


        <Tab.Screen name='Profile Tab' component={ProfileStack}
            options={{
                tabBarLabel: "Profile",
                tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="person" IconComponent={MaterialIcons} />,
            }}
        />
    </Tab.Navigator>
    // {/* </KeyboardAvoidingView> */ }
);

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: 'white',
        height: height * 0.1,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    tabItem: {
        alignItems: 'center',
        marginTop: 8
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



export default AdminBottomTabNav;







