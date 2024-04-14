import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import {getAuth, signOut, updateProfile} from 'firebase/auth';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import {
  collection,
  getDocs,
  doc,
  ref,
  query,
  where,
  updateDoc,
} from 'firebase/firestore';
import {db} from '../firebase';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DevNews from '../components/DevNews';
import NewsList from '../components/NewsList';
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

      // Update the profile picture in Firestore
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async doc => {
        const userDocRef = doc.ref;
        await updateDoc(userDocRef, {
          photoURL: imageUrl,
        });
      });
    } catch (error) {
      Alert.alert(error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Navigate to the authentication screen after logout
      navigation.navigate('LoginScreen');
    } catch (error) {
      Alert.alert('Error logging out:', error);
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
            <TouchableOpacity
              onPress={() => navigation.navigate('EditCUProfile')}
              style={styles.editPS}>
              <MaterialCommunityIcons
                name="pencil"
                color={colorScheme === 'dark' ? 'white' : 'black'}
                size={30}
                style={styles.editPSBtn}
              />
            </TouchableOpacity>
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
          <DevNews navigation={navigation} />
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
    justifyContent: 'space-around',
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
    flexWrap: 'wrap', // Allow text to wrap to the next line
    width: 150, // Set a width to limit the text length before wrapping
  },
  button: {
    alignItems: 'center',
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  editButton: {
    backgroundColor: '#faad14',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '40%',
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
  editPS: {
    alignItems: 'flex-end',
    marginHorizontal: 20,
    marginTop: 20,
  },
  editPSBtn: {},
});