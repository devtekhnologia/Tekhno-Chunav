import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Dimensions } from 'react-native';

import CustomDrawerContent from './CustomDrawerContent';
import StackNavigation from './StackNavigation';
import About from '../../About';
import Help from '../../Help';
import ContactUs from '../../ContactUs';

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
                    headerRightContainerStyle: {
                        paddingRight: 20,
                    },
                    headerShown: false,
                    headerTitleAlign: 'center',

                })}
            >
                <Drawer.Screen name='Home' component={StackNavigation} />
                <Drawer.Screen name='About Us' component={About} />
                <Drawer.Screen name='Contact Us' component={ContactUs} />
                <Drawer.Screen name='Help' component={Help} />
            </Drawer.Navigator>
        </>
    );
}

export default DrawerNavigationComp;
