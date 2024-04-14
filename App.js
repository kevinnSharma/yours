import React, {useEffect} from 'react';
import {AppState} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {getAuth} from 'firebase/auth';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {db} from './firebase';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import BottomTab from './screens/BottomTab';
import ChatScreen from './screens/ChatScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import LaunchScreen from './screens/LaunchScreen';
import EditCUProfile from './screens/EditCUProfile';
import ChangePassword from './screens/ChangePassword';
import PublishDevNews from './screens/PublishDevNews';
import CreateRoomScreen from './screens/CreateRoomScreen';
import ScheduleRoom from './screens/ScheduleRoom';
import JoinRoomScreen from './screens/JoinRoomScreen';

const Stack = createNativeStackNavigator();
const globalScreenOptions = {
  headerStyle: {backgroundColor: '#2C6BED'},
  headerTitleStyle: {color: 'white'},
  headerTintColor: 'white',
};
const App = () => {
  const auth = getAuth();
  useEffect(() => {
    const handleAppStateChange = async nextAppState => {
      const user = auth.currentUser;
      if (user) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('uid', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async doc => {
          const userDocRef = doc.ref;
          try {
            await updateDoc(userDocRef, {
              online: nextAppState === 'active',
              lastSeen: nextAppState === 'active' ? null : serverTimestamp(),
            });
          } catch (error) {}
        });
      }
    };

    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        <Stack.Screen name="LaunchScreen" component={LaunchScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="BottomTab" component={BottomTab} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
        <Stack.Screen name="EditCUProfile" component={EditCUProfile} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="PublishDevNews" component={PublishDevNews} />
        <Stack.Screen name="CreateRoomScreen" component={CreateRoomScreen} />
        <Stack.Screen name="ScheduleRoom" component={ScheduleRoom} />
        <Stack.Screen name="JoinRoomScreen" component={JoinRoomScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
