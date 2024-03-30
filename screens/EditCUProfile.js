import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAuth, updateProfile } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
const EditCUProfile = ({navigation}) => {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);
  const [newUsername, setNewUsername] = useState('');
  const auth = getAuth();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    setNewUsername(auth.currentUser.displayName || '');
  }, []);

  const handleSaveUsername = async () => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: newUsername,
      });
      Alert.alert('Username Updated', `New Username: ${newUsername}`);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async doc => {
        const userDocRef = doc.ref;
        await updateDoc(userDocRef, {
          username: newUsername,
        });
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.main}>
        <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name="arrow-left" color={colorScheme === 'dark' ? 'white' : 'black'} size={30} style={{ marginVertical: 15, marginHorizontal: 10 }} />
      </TouchableOpacity>
          <Text style={styles.headingText}>Modify Account</Text>
          <View style={styles.usernameContainer}>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.usernameInput}
                value={newUsername}
                onChangeText={setNewUsername}
                placeholder="Enter New Username"
                placeholderTextColor={colorScheme === 'dark' ? 'gray' : '#888'}
                maxLength={25}
                autoCapitalize="none"
              />
              <Text style={styles.placeholderText}>Change Username</Text>
            </View>
            <TouchableOpacity onPress={handleSaveUsername}>
              <MaterialCommunityIcons
                name="check"
                color={colorScheme === 'dark' ? 'white' : 'black'}
                size={30}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.listContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('ChangePassword')}>
              <View style={styles.listItem}>
                <Text style={styles.listText}>Change Password</Text>
                <MaterialCommunityIcons
                  name="arrow-right"
                  color={colorScheme === 'dark' ? 'white' : 'black'}
                  size={30}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EditCUProfile;

const getStyles = colorScheme => {
  return StyleSheet.create({
    main: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
    },
    container: {
      marginHorizontal: 10,
    },
    headingText: {
      color: colorScheme === 'dark' ? 'white' : 'black',
      marginHorizontal: 6,
      marginVertical: 9,
      fontSize: 24,
      letterSpacing: 6,
      fontWeight: 'bold',
      textAlign: 'center',
      borderBottomWidth: 1,
      borderColor: 'white',
      paddingVertical: 10,
    },
    listContainer: {
      width: '100%',
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderColor: 'white',
      marginVertical: 4,
      padding: 10,
      width: '100%',
    },
    listText: {
      color: 'white',
      fontSize: 16,
    },
    textInputContainer:{
      marginVertical: 10,
      width: '90%',
    },
    usernameInput: {
      borderBottomWidth: 1,
      borderColor: 'white',
      color: 'white',
      paddingHorizontal: 10,
      paddingVertical: 5,
      fontSize: 24,
      letterSpacing: 2,
    },
    saveButton: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
      letterSpacing: 2,
      marginVertical: 10,
      alignSelf: 'center',
    },
    usernameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    placeholderText:{
      color: 'white',
      marginVertical: 2,
      marginHorizontal: 5
    }
  });
};
