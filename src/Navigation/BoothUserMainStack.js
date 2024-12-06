import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { Dimensions, Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Voterlist from '../BoothUser/Voterlist.js'
// import CasteList from '../BoothUser/CasteList.js';
import Polls from '../BoothUser/Polls.js';
import Familylist from '../BoothUser/Familylist.js';
import BoothVotedList from '../BoothUser/BoothVotedList.js';
import BoothNVoted from '../BoothUser/BoothNVoted.js';
import Family from '../BoothUser/Family.js';
import ExitPoll from '../BoothUser/Exit Poll/ExitPoll.js';
import Personal from '../BoothUser/Profile/BuserProfile.js';
import Favour from '../BoothUser/Favour.js';
import Against from '../BoothUser/Nonfavour.js';
import Yellow from '../BoothUser/Yellow.js';
import LogOut from '../ReusableCompo/LogOut.js';
import BoothDashbord from '../BoothUser/Dashboard/BoothDashbord.js';
const Stack = createNativeStackNavigator();
const { height, width } = Dimensions.get('screen')

const BoothUserMainStack = () => {

    const navigation = useNavigation();

    return (

        <Stack.Navigator initialRouteName='Dashboard' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Dashboard' component={BoothDashbord}
                options={{
                    headerShown: false,
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 22
                    },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <MaterialIcons name="menu" size={30} color="black"
                            style={{ marginLeft: 5 }}
                            onPress={() => navigation.toggleDrawer()} />
                    ),
                }}
            />

            {/* <Stack.Screen name="Voterlist" component={Voterlist} />
            <Stack.Screen name="Favour" component={Favour} />
            <Stack.Screen name="Nonfavour" component={Against} />
            <Stack.Screen name="Yellow" component={Yellow} /> */}
            {/* <Stack.Screen name="CasteList" component={CasteList} /> */}
            {/* <Stack.Screen name="Polls" component={Polls} /> */}
            <Stack.Screen name="ExitPoll" component={ExitPoll} />
            {/* <Stack.Screen name="Family" component={Family} />
            <Stack.Screen name="Familylist" component={Familylist} />
            <Stack.Screen name="BoothVotedList" component={BoothVotedList} />
            <Stack.Screen name="BoothNVoted" component={BoothNVoted} /> */}
            <Stack.Screen name="Personal" component={Personal} />
            <Stack.Screen name='LogOut' component={LogOut} />



            {/* <Stack.Screen name="Entry" component={Entry} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Logout" component={Logout} />
            <Stack.Screen name="Changepass" component={Changepass} />
            <Stack.Screen name="Elections" component={Md} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="About" component={About} />
            <Stack.Screen name="Help" component={Help} />
            <Stack.Screen name="Percentage" component={Percentage} />
            <Stack.Screen name="Editinfo" component={Editinfo} />

            <Stack.Screen name="Profileselection" component={Profileselection} />
            <Stack.Screen name="ProgressCircleWithMargin" component={ProgressCircleWithMargin} />
            <Stack.Screen name="ResponsivePoll" component={ResponsivePoll} />
            <Stack.Screen name="AdminMain" component={AdminMain} />

            */}

        </Stack.Navigator>
    )
}

export default BoothUserMainStack