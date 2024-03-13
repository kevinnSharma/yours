import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {getAuth, signOut, updateProfile} from 'firebase/auth';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
const UserProfile = ({navigation}) => {
  const auth = getAuth();
  const [userProfile, setUserProfile] = useState(null);
  const defaultProfileImage =
    'https://th.bing.com/th/id/OIP.RpahWNi7KifKy3COEQYxbwAAAA?w=240&h=240&rs=1&pid=ImgDetMain';
  const [greeting, setGreeting] = useState('');
  const colorScheme = useColorScheme();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserProfile({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
    }
    const now = new Date();
    const hours = now.getHours();
    if (hours < 12) {
      setGreeting('Good morning');
    } else if (hours < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
    navigation.setOptions({
      headerShown: false,
    });
  }, [auth]);
  const uploadPFP = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
      });

      const imageRef = storage().ref(
        `profile_pictures/${auth.currentUser.uid}`,
      );
      await imageRef.putFile(image.path);

      const imageUrl = await imageRef.getDownloadURL();
      await updateProfile(auth.currentUser, {photoURL: imageUrl});

      setUserProfile({...userProfile, photoURL: imageUrl});
    } catch (error) {
      console.error(error);
    }
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Navigate to the authentication screen after logout
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: colorScheme === 'dark' ? 'black' : 'white'},
      ]}>
      {userProfile && (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={uploadPFP}>
              <Image
                source={{uri: userProfile.photoURL || defaultProfileImage}}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text
                style={[
                  styles.greeting,
                  {color: colorScheme === 'dark' ? 'white' : 'black'},
                ]}>
                {greeting},
              </Text>
              <Text
                style={[
                  styles.displayName,
                  {color: colorScheme === 'dark' ? 'white' : 'black'},
                ]}>
                {userProfile.displayName}
              </Text>
            </View>
          </View>
          <View style={styles.credentials}>
            <Text
              style={[
                styles.credentialsHeading,
                {color: colorScheme === 'dark' ? 'white' : 'black'},
              ]}>
              Email
            </Text>
            <Text
              style={[
                styles.email,
                {color: colorScheme === 'dark' ? 'white' : 'black'},
              ]}>
              {userProfile.email}
            </Text>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.editButton}
              activeOpacity={0.5}
              onPress={handleLogout}>
              <Text style={styles.editButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
  },
  headerContent: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 75,
    margin: 20,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  button: {
    alignItems: 'center',
    marginVertical: 20,
  },
  editButton: {
    backgroundColor: '#faad14',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 190,
  },
  editButtonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  credentials: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  credentialsHeading: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 18,
  },
});
