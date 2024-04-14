import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import {db} from '../firebase';
import {getAuth} from 'firebase/auth';

const UserProfileScreen = ({navigation, route}) => {
  const {user} = route.params;
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const defaultProfileImage =
    'https://th.bing.com/th/id/OIP.RpahWNi7KifKy3COEQYxbwAAAA?w=240&h=240&rs=1&pid=ImgDetMain';
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);
  const auth = getAuth();

  useEffect(() => {
    if (user) {
      setUserProfile(user);
      setLoading(false);
    }

    navigation.setOptions({
      headerShown: false,
    });
  }, [user]);

  const handleChatPress = async () => {
    if (!userProfile) return;
    const currentUserId = auth.currentUser.uid;
    const chatId =
      currentUserId < userProfile.uid
        ? `${currentUserId}-${userProfile.uid}`
        : `${userProfile.uid}-${currentUserId}`;
    const chatRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatRef);
    if (!chatDoc.exists()) {
      await setDoc(chatRef, {
        createdAt: new Date(),
        users: [currentUserId, userProfile.uid],
      });
    }
    navigation.reset({
      routes: [{name: 'ChatScreen', params: {chatId, user: userProfile}}],
    });
  };
  let statusText = '';
  if (userProfile) {
    if (userProfile.online) {
      statusText = 'Online Now';
    } else if (userProfile.lastSeen) {
      const lastSeenDate = new Date(userProfile.lastSeen.seconds * 1000);
      statusText = `Last seen ${lastSeenDate.toLocaleString()}`;
    }
  }
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colorScheme === 'dark' ? 'white' : 'black'}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => navigation.navigate('BottomTab')}>
        <MaterialCommunityIcons
          name="arrow-left"
          color={colorScheme === 'dark' ? 'white' : 'black'}
          size={30}
          style={{marginVertical: 15, marginHorizontal: 10}}
        />
      </TouchableOpacity>
      {userProfile && (
        <>
          <View style={styles.header}>
            <Image
              source={{uri: userProfile.photoURL || defaultProfileImage}}
              style={styles.profileImage}
            />
            <View style={styles.headerContent}>
              <Text style={styles.displayName}>{userProfile.username}</Text>
              <Text style={styles.email}>{statusText}</Text>
            </View>
          </View>
          <View style={styles.credentials}>
            <Text style={styles.credentialsHeading}>Email</Text>
            <Text style={styles.email}>{userProfile.email}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.5}
              onPress={() => {
                navigation.navigate('BottomTab');
              }}>
              <Text style={styles.buttonText}>Go to Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.5}
              onPress={handleChatPress}>
              <Text style={styles.buttonText}>Send Message</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const getStyles = colorScheme => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
    },
    header: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerContent: {
      marginVertical: 20,
      flexDirection: 'column',
      alignItems: 'center',
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 75,
    },
    displayName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? 'white' : 'black',
    },
    credentials: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: 20,
    },
    credentialsHeading: {
      color: colorScheme === 'dark' ? 'white' : 'black',
      fontSize: 22,
      fontWeight: 'bold',
    },
    email: {
      color: colorScheme === 'dark' ? 'white' : 'black',
      fontSize: 18,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    button: {
      backgroundColor: '#faad14',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      width: '40vw',
    },
    buttonText: {
      color: 'black',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
};

export default UserProfileScreen;
