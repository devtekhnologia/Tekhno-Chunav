import { AntDesign, MaterialIcons, MaterialCommunityIcons, FontAwesome5, Octicons } from 'react-native-vector-icons';
import { Dimensions, Platform, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { LanguageContext } from '../../LanguageContext';
import Booths from '../Booth/Booths';
import BoothVoters from '../Booth/BoothVoters';
import Totalvoters from '../Voters/TotalVoters';

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();
const { height, width } = Dimensions.get('window');

// TabBarIcon should use a dynamic approach for accessing context properly
const TabBarIcon = ({ focused, name, IconComponent }) => (
    <IconComponent name={name} size={25} color={focused ? '#3C4CAC' : 'black'} />
);

const Voters = () => {
    const navigation = useNavigation();
    const { language } = useContext(LanguageContext);

    return (
        <Stack.Navigator initialRouteName='Total voters'>
            <Stack.Screen name='Total voters' component={Totalvoters}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerShadowVisible: false,
                    headerTitle: language === 'en' ? "Total Voters" : "एकूण मतदार",
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={30} color="black"
                            style={{ marginLeft: 10 }}
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                }}
            />
        </Stack.Navigator>
    );
};

const BoothStack = () => {
    const navigation = useNavigation();
    const { language } = useContext(LanguageContext);

    return (
        <Stack.Navigator initialRouteName='Booths'>
            <Stack.Screen name='Booths' component={Booths}
                options={{
                    headerShown: true, headerTitleAlign: 'center', headerShadowVisible: false,
                    headerTitle: language === 'en' ? "Booths" : 'बूथ',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={30} color="black"
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                }}
            />
            <Stack.Screen name='Booth Voters' component={BoothVoters}
                options={({ route }) => ({
                    headerShown: false,
                    headerTitleAlign: 'center', headerShadowVisible: false,
                    headerTitle: route.params.boothId ? `Voters in Booth : ${route.params.boothId}` : 'Booth Voters',
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={30} color="black"
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                })}
            />
        </Stack.Navigator>
    );
};

const AdminBottomTabNav = () => {
    const { language } = useContext(LanguageContext); // Correct usage of context here

    return (
        <Tab.Navigator
            initialRouteName='Dashboard'
            activeColor="#3C4CAC"
            barStyle={styles.tabBar}
            shifting={false}
        >
            <Tab.Screen
                name='Total Voters'
                component={Voters}
                options={{
                    tabBarLabel: language === 'en' ? 'Voters' : 'एकूण मतदार',
                    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="format-list-bulleted" IconComponent={MaterialCommunityIcons} />,
                }}
            />

            <Tab.Screen
                name='Booths Tab'
                component={BoothStack}
                options={{
                    tabBarLabel: language === 'en' ? "Booths" : "बूथ",
                    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="person-booth" IconComponent={FontAwesome5} />,
                }}
            />
        </Tab.Navigator>
    );
};

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
});

export default AdminBottomTabNav;










