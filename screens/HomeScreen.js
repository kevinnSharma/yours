import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  useColorScheme,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity
} from 'react-native'; // Add Button to imports
import Header from '../components/Header';
import UserSearch from '../components/UserSearch';
import {getAuth} from 'firebase/auth';
import DevNews from '../components/DevNews';
import NewsList from '../components/NewsList';
import LiveRooms from '../components/LiveRooms';

const HomeScreen = ({navigation, userId}) => {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);
  const auth = getAuth();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Header />
        <UserSearch navigation={navigation} />
        <View style={styles.button}>
            <TouchableOpacity
              style={styles.editButton}
              activeOpacity={0.5}
              onPress={() => navigation.navigate('CreateRoomScreen')}>
              <Text style={styles.editButtonText}>Create Room</Text>
            </TouchableOpacity>
          </View>
        <LiveRooms navigation={navigation} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default HomeScreen;

const getStyles = colorScheme => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
    },
    button: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      marginVertical: 5,
    },
    editButton: {
      backgroundColor: '#faad14',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      width: '90%',
    },
    editButtonText: {
      color: 'black',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
};
