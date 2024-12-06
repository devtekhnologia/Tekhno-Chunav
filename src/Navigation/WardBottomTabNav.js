import { Dimensions, Pressable, StyleSheet, Text } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import LogOut from '../ReusableCompo/LogOut';
import WardUserMainStack from './WardUserMainStack';
import WardProfile from '../Ward/WardProfile';
import WardBooths from '../Ward/WardBooths';
import WardBoothVoters from '../Ward/WardBoothVoters';
import WLocationWise from '../Ward/WLocationWise';
import Wardvoterlist from '../Ward/Wardvoterlist';
import { LanguageContext } from '../ContextApi/LanguageContext';
import { useContext } from 'react';

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();
const { height } = Dimensions.get('window');


const TabBarIcon = ({ focused, name, IconComponent }) => (
    <IconComponent name={name} size={height * 0.033} color={focused ? '#3C4CAC' : 'black'} />
);


const VotersStack = () => {
    const navigation = useNavigation();
    const { language, toggleLanguage } = useContext(LanguageContext);
    return (
        <Stack.Navigator initialRouteName=''>
            <Stack.Screen name='Ward Voters' component={Wardvoterlist}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerTitle: language === 'en' ? "Voter List" : 'मतदार यादी',
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
            <Stack.Screen name='Booths' component={WardBooths}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22,
                    },
                    headerTitle: language === 'en' ? "Booths" : 'बूथ यादी',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialIcons name="keyboard-backspace" size={30} color="black" />
                        </Pressable>
                    ),
                    headerRight: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.navigate('Location Wise Voters')}  >
                            <MaterialIcons name="sort" size={30} color="black" />
                        </Pressable>
                    ),
                }}
            />

            <Stack.Screen name='Booth Voters' component={WardBoothVoters}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitle: language === 'en' ? "Booth Voter" : 'बूथ मतदार यादी',
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

            <Stack.Screen name='Location Wise Voters' component={WLocationWise}
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
                    headerRight: () => (
                        <Pressable style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialIcons name="keyboard-backspace" size={30} color="black" />
                        </Pressable>
                    ),
                    // <MaterialIcons name="sort" size={scaleFontSize(28)} color="black" />
                }}
            />
        </Stack.Navigator>
    )
}

const ProfileStack = () => {
    const { language, toggleLanguage } = useContext(LanguageContext);

    return (
        <Stack.Navigator initialRouteName='Profile'>
            <Stack.Screen name='Profile' component={WardProfile} options={{ headerShown: false }} />
            <Stack.Screen name='LogOut' component={LogOut} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}


const WardBottomTabNav = () => (
    <Tab.Navigator
        initialRouteName='Dashboard'
        activeColor="#3C4CAC"
        barStyle={styles.tabBar}
        shifting={false}
    >
        <Tab.Screen name='Town Dashboard' component={WardUserMainStack}
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



export default WardBottomTabNav;
