import AgewiseVoters from '../Admin/Filter/AgewiseVoters'
import BoothUser_ActivityLog from '../Admin/Booth/BoothUser_ActivityLog'
import BoothUsers from '../Admin/Booth/BoothUser'
import BoothVoters from '../Admin/Booth/BoothVoters'
import Booths from '../Admin/Booth/Booths'
import Dashboard from '../Admin/Dashboard/Dashboard'
import LogOut from '../ReusableCompo/LogOut'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Profile from '../Admin/Profile/Profile'
import React, { useContext, useRef } from 'react'
import TownUserReg from '../Admin/Filter/TownUserReg'
import TownUsers from '../Admin/Towns/TownUsers'
import Towns from '../Admin/Towns/Towns'
import Totalvoters from '../Admin/Voters/TotalVoters'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Animated, Dimensions, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Voted from '../Admin/Voters/Voted'
import Nvoted from '../Admin/Voters/Nvoted'
import ProfileButton from '../Admin/Filter/ProfileButton'
import ReligionCasteList from '../Admin/Filter/ReligionCasteList'
import TBVotersPDF from '../Admin/Voters/TBVotersPdf'
import TownVoters from '../Admin/Towns/TownVoters'
import GenderWise from '../Admin/Filter/GenderWise'
import BoothAscending from '../Admin/Filter/BoothAscending'
import TownAscending from '../Admin/Filter/TownAscending'
import { FontAwesome5 } from '@expo/vector-icons'

import RuralTowns from '../Admin/Filter/RuralTowns'
import UrbanTowns from '../Admin/Filter/UrbanTowns'
import { LanguageContext } from '../ContextApi/LanguageContext'
import LocationWise from '../Admin/Filter/LocationWise'
import WardUsers from '../Admin/Ward/WardUsers'
import WardUserRegistration from '../Admin/Filter/WardUserRegistration'
import TownBooths from '../Admin/Filter/TownBooths'
import Favours from '../Admin/Filter/Favours'
import Surname from '../Admin/Filter/Surname'



const Stack = createNativeStackNavigator();
const { height, width } = Dimensions.get('screen')

const AdminMainStack = () => {
    const navigation = useNavigation();
    const scaleValue = useRef(new Animated.Value(1)).current;
    const { language } = useContext(LanguageContext);


    return (
        <Stack.Navigator initialRouteName='Dashboard'>
            <Stack.Screen name="Dashboard" component={Dashboard}
                options={{
                    headerShown: true, headerTitleAlign: 'center',
                    headerTitle: language === 'en' ? "Dashboard" : 'डैशबोर्ड',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={30} color="black"
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                    headerRight: () => (<ProfileButton />)
                }}
            />


            <Stack.Screen name='Total Voters' component={Totalvoters}
                options={{
                    headerShown: true, headerTitleAlign: 'center', headerShadowVisible: false,
                    headerTitle: language === 'en' ? "Total Voters" : 'एकूण मतदार',
                    headerLeft: () => (
                        <TouchableOpacity style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen name='Towns' component={Towns}
                options={{
                    headerShown: false, headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: height * 0.02,
                    },
                    headerShadowVisible: false, headerLeft: () => (
                        <TouchableOpacity style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }} />
            <Stack.Screen name='Town Voters' component={TownVoters}
                options={({ route }) => ({
                    headerShown: false,
                    headerTitleAlign: 'center', headerShadowVisible: false,
                    headerTitle: route.params.townName ? `Voters in Town : ${route.params.townName}  ` : 'Town Voters',
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={30} color="black"
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                })}
            />

            <Stack.Screen name='Booths' component={Booths}
                options={{
                    headerShown: false, headerTitleAlign: 'center', headerShadowVisible: false,
                    headerTitle: language === 'en' ? "Booths" : 'बॉथ',
                    headerTitleStyle: { fontSize: 20, fontWeight: '600', color: 'black' },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => navigation.goBack()}  >
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity style={{ width: 35, borderRadius: 30, alignItems: 'center', padding: 5 }}
                            onPress={() => handlePDFClick()}>
                            <FontAwesome5 name="file-pdf" size={24} color="black" />
                        </TouchableOpacity>
                    )
                }}
            />
            <Stack.Screen name='Booth Voters' component={BoothVoters}
                options={({ route }) => ({
                    headerShown: false,
                    headerTitleAlign: 'center', headerShadowVisible: false,
                    headerTitle: route.params.boothId ? `Voters in Booth : ${route.params.boothId}  ` : 'Booth Voters',
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={30} color="black"
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                })}
            />

            <Stack.Screen name='Voted' component={Voted}
                options={{
                    headerShown: true, headerTitleAlign: 'center', headerShadowVisible: false,
                    headerTitle: language === 'en' ? "Voted" : 'मतदान केले',
                    headerTitleStyle: { fontSize: 22, fontWeight: '600' },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()}  >
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen name='Nvoted' component={Nvoted}
                options={{
                    headerShown: true, headerTitleAlign: 'center', headerShadowVisible: false,
                    headerTitle: language === 'en' ? "Not Voted" : 'मतदान केले नाही',
                    headerTitleStyle: { fontSize: 22, fontWeight: '600' },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()}  >
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />



            <Stack.Screen name='Family' component={TBVotersPDF}
                options={{
                    headerShown: true, headerTitleAlign: 'center', headerShadowVisible: false,
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerTitle: language === 'en' ? "Family" : 'कुटुंब',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()}  >
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen name='Urban Towns' component={UrbanTowns}
                options={{
                    headerShown: true, headerTitleAlign: 'center', headerShadowVisible: false,
                    headerTitleStyle: { textAlign: 'center', fontSize: 22, fontWeight: '600' },
                    headerTitle: language === 'en' ? 'Urban Towns' : 'शहरी यादी',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()}  >
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }} />

            <Stack.Screen name="Rural Towns" component={RuralTowns}
                options={{
                    headerShown: true, headerTitleAlign: 'center', headerShadowVisible: false,
                    headerTitleStyle: { textAlign: 'center', fontSize: 22, fontWeight: '600' },
                    headerTitle: language === 'en' ? 'Rural Towns' : 'ग्रामीण यादी',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()}  >
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen name='Town Booths' component={TownBooths}
                options={{
                    headerShown: false, headerTitleAlign: 'center', headerShadowVisible: false,
                    headerTitleStyle: { textAlign: 'center', fontSize: 22, fontWeight: '600' },
                    headerTitle: language === 'en' ? 'Town Booths' : 'गाव/शहरातील बूथ',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()}  >
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen name='Towns Users' component={TownUsers} options={{
                headerShown: false, headerTitleAlign: 'center', headerShadowVisible: false,
            }} />

            <Stack.Screen name='Booth Users' component={BoothUsers} options={{
                headerShown: false, headerTitleAlign: 'center', headerShadowVisible: false,
            }} />

            <Stack.Screen name='Updated Voters' component={BoothUser_ActivityLog}
                options={{
                    headerShown: true, headerTitleAlign: 'center', headerShadowVisible: false,
                    headerTitle: language === 'en' ? 'Updated Voters' : 'अपडेट केलेले मतदार',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()}  >
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen name='Age Wise Voters' component={AgewiseVoters}
                options={{
                    headerShown: true, headerTitleAlign: 'center', headerShadowVisible: false,
                    headerTitle: language === 'en' ? 'Age Wise Voters' : 'वयानुसार मतदार',
                    headerTitleStyle: { fontSize: 20, fontWeight: '600' },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()}  >
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen name='Castwise' component={ReligionCasteList}
                options={{
                    headerShown: false, headerTitleAlign: 'center', headerShadowVisible: false,
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerShadowVisible: false, headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()}  >
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />


            <Stack.Screen name='GenderWise' component={GenderWise}
                options={{
                    headerShown: true, headerTitleAlign: 'center', headerShadowVisible: false,
                    headerTitle: language === 'en' ? 'Gender Wise Voters' : 'लिंगानुसार मतदार',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()}  >
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen name='Favours' component={Favours}
                options={{
                    headerShown: true, headerTitleAlign: 'center', headerShadowVisible: false,
                    headerTitle: language === 'en' ? 'Favours' : 'अनुकूलतेने',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()}  >
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen name='Surname' component={Surname}
                options={{
                    headerShown: true, headerTitleAlign: 'center', headerShadowVisible: false,
                    headerTitle: language === 'en' ? 'Surname' : 'आडनाव',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()}  >
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen name='Booth Analysis' component={BoothAscending}
                options={{
                    headerShown: true, headerTitleAlign: 'center', headerShadowVisible: false,
                    headerTitle: language === 'en' ? 'Booth Analysis' : 'बूथ विश्लेषण',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()}  >
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen name='Town Analysis' component={TownAscending}
                options={{
                    headerShown: true, headerTitleAlign: 'center', headerShadowVisible: false,
                    headerTitle: language === 'en' ? 'Town Analysis' : 'गाव/शहराचे विश्लेषण',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()}  >
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />


            <Stack.Screen name='LocationWise Voters' component={LocationWise}
                options={{
                    headerShown: false, headerTitleAlign: 'center', headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()}  >
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Stack.Screen name='Ward Users' component={WardUsers}
                options={{
                    headerShown: false, headerTitleAlign: 'center', headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()}  >
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />


            <Stack.Screen name='Registration' component={TownUserReg} options={{ headerShown: false }} />
            <Stack.Screen name='WardUser Register' component={WardUserRegistration}
                options={{
                    headerShown: false, headerTitleAlign: 'center', headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()}  >
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen name='Profile' component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name='LogOut' component={LogOut} options={{ headerShown: false }} />
        </Stack.Navigator>

    )
}

export default AdminMainStack
