import AboutUs from '../ReusableCompo/AboutUs'
import ContactUs from '../ReusableCompo/ContactUs/ContactUs'
import CustomDrawerContent from '../Navigation/CustomDrawerContent'
import { Dimensions } from 'react-native';
import Help from '../ReusableCompo/Help'
import React from 'react';
import StackNavigation from './StackNavigation';
import { StatusBar } from 'expo-status-bar';
import { createDrawerNavigator } from '@react-navigation/drawer';

const DrawerNavigationComp = () => {
    const Drawer = createDrawerNavigator();
    const drawerWidth = Dimensions.get('window').width * 0.6;

    return (
        <>
            <StatusBar style="auto" />
            <Drawer.Navigator
                initialRouteName='Home'
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={({ navigation }) => ({
                    drawerStyle: {
                        width: drawerWidth,
                        borderTopRightRadius: 20,
                        borderBottomRightRadius: 20
                    },
                    headerRight: () => <ProfileButton />,
                    headerRightContainerStyle: {
                        paddingRight: 20,
                    },
                    headerShown: false,
                    headerTitleAlign: 'center',

                })}
            >
                <Drawer.Screen name='Home' component={StackNavigation} />
                <Drawer.Screen name='About Us' component={AboutUs} />
                <Drawer.Screen name='Contact Us' component={ContactUs} />
                <Drawer.Screen name='Help' component={Help} />
            </Drawer.Navigator>
        </>
    );
}

export default DrawerNavigationComp;
