import React, {useState, useEffect} from 'react';
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
import {
  getAuth,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';

const ChangePassword = ({navigation}) => {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const auth = getAuth();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handleChangePassword = async () => {
    try {
      const user = auth.currentUser;
      // Reauthenticate the user
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await reauthenticateWithCredential(user, credential);
      // Update the password
      await updatePassword(user, newPassword);
      Alert.alert(
        'Password Updated',
        'Your password has been successfully updated.',
      );
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.main}>
        <View style={styles.container}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="arrow-left"
              color={colorScheme === 'dark' ? 'white' : 'black'}
              size={30}
              style={{marginVertical: 15, marginHorizontal: 10}}
            />
          </TouchableOpacity>
          <Text style={styles.headingText}>Change Password</Text>
          <View style={styles.passwordContainer}>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Current Password"
                placeholderTextColor={colorScheme === 'dark' ? 'gray' : '#888'}
                autoCapitalize="none"
                secureTextEntry
              />
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New Password"
                placeholderTextColor={colorScheme === 'dark' ? 'gray' : '#888'}
                autoCapitalize="none"
                secureTextEntry
              />
            </View>
            <TouchableOpacity onPress={handleChangePassword}>
              <MaterialCommunityIcons
                name="check"
                color={colorScheme === 'dark' ? 'white' : 'black'}
                size={30}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChangePassword;

const getStyles = colorScheme => {
  return StyleSheet.create({
    main: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
    },
    container: {
      marginVertical: 10,
      marginHorizontal: 10,
      width: '95%',
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
    passwordContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    textInputContainer: {
      marginVertical: 10,
      width: '90%',
    },
    passwordInput: {
      borderBottomWidth: 1,
      borderColor: 'white',
      color: 'white',
      paddingHorizontal: 10,
      paddingVertical: 5,
      fontSize: 24,
      letterSpacing: 2,
    },
  });
};
