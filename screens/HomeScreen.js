import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  useColorScheme,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
} from 'react-native'; // Add Button to imports
import Header from '../components/Header';
import UserSearch from '../components/UserSearch';
import {getAuth} from 'firebase/auth';
import DevNews from '../components/DevNews';
import NewsList from '../components/NewsList';

const HomeScreen = ({navigation, userId}) => {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);
  const auth = getAuth();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handleAdminButtonClick = () => {
    // Handle the action for the admin button (e.g., navigate to admin screen)
    // This example just logs a message
    console.log('Admin button clicked');
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Header />
        <UserSearch navigation={navigation} />
        <DevNews navigation={navigation} />
        <NewsList />
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
  });
};
