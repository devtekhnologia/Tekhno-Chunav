import { Dimensions, Pressable, StyleSheet, Text } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import TownBooths from '../TownUser/Booths/TownBooths';
import TownProfile from '../TownUser/Profile/TownProfile';
import TownVoters from '../TownUser/Voters/TownVoters';
import BoothVoters from '../TownUser/Booths/BoothVoters';
import TownUserMainStack from './TownUserMainStack';
import LogOut from '../ReusableCompo/LogOut';
import { LanguageContext } from '../ContextApi/LanguageContext';
import { useContext } from 'react';

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();
const { height, width } = Dimensions.get('window');


const TabBarIcon = ({ focused, name, IconComponent }) => (
    <IconComponent name={name} size={height * 0.033} color={focused ? '#3C4CAC' : 'black'} />
);


const VotersStack = () => {
    const navigation = useNavigation();
    const { language, toggleLanguage } = useContext(LanguageContext);

    return (
        <Stack.Navigator initialRouteName=''>
            <Stack.Screen name='Town Voters' component={TownVoters}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerTitle: language === 'en' ? 'Total Voters' : 'एकूण मतदार',
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


const BoothsStack = () => {
    const navigation = useNavigation();
    const { language, toggleLanguage } = useContext(LanguageContext);

    return (
        <Stack.Navigator initialRouteName='Booths'>
            <Stack.Screen name='Booths' component={TownBooths}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22,
                    },
                    headerTitle: language === 'en' ? 'Booths' : 'बूथ यादी',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialIcons name="keyboard-backspace" size={30} color="black" />
                        </Pressable>
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

const ProfileStack = () => {
    const { language, toggleLanguage } = useContext(LanguageContext);

    return (
        <Stack.Navigator initialRouteName='Profile'>
            <Stack.Screen name='Profile' component={TownProfile} options={{ headerShown: false }} />
            <Stack.Screen name='LogOut' component={LogOut} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}


const TownBottomTabNav = () => (
    <Tab.Navigator
        initialRouteName='Dashboard'
        activeColor="#3C4CAC"
        barStyle={styles.tabBar}
        shifting={false}
    >
        <Tab.Screen name='Town Dashboard' component={TownUserMainStack}
            options={{
                tabBarLabel: "Dashboard",
                tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="home" IconComponent={AntDesign} />,
            }}
        />

        <Tab.Screen name='Voters' component={VotersStack}
            options={{
                tabBarLabel: 'Voters',
                tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="list-alt" IconComponent={FontAwesome} />,
            }}

        />

        <Tab.Screen name='Booths Tab' component={BoothsStack}
            options={{
                tabBarLabel: "Booths",
                tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="building-user" IconComponent={FontAwesome6} />,
            }}
        />

        <Tab.Screen name='Town Profile' component={ProfileStack}
            options={{
                tabBarLabel: "Profile",
                tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="person" IconComponent={MaterialIcons} />,
            }}
        />
    </Tab.Navigator>
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



export default TownBottomTabNav;
