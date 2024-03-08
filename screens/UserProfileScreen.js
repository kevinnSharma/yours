import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const UserProfileScreen = ({ navigation, route }) => {
  const [userProfile, setUserProfile] = useState(null);
  const defaultProfileImage = 'https://th.bing.com/th/id/OIP.RpahWNi7KifKy3COEQYxbwAAAA?w=240&h=240&rs=1&pid=ImgDetMain';

  useEffect(() => {
    if (route.params && route.params.user) {
      setUserProfile(route.params.user);
    }

    navigation.setOptions({
      headerShown: false
    });
  }, [route.params]);

  const handleChatPress = () => {
    navigation.navigate('ChatScreen', { user: userProfile });
  };

  return (
    <View style={styles.container}>
      {userProfile && (
        <>
          <View style={styles.header}>
            <Image
              source={{ uri: userProfile.photoURL || defaultProfileImage }}
              style={styles.profileImage}
            />
            <View style={styles.headerContent}>
              <Text style={styles.displayName}>{userProfile.username}</Text>
            </View>
          </View>
          <View style={styles.credentials}>
            <Text style={styles.credentialsHeading}>Email</Text>
            <Text style={styles.email}>{userProfile.email}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} activeOpacity={0.5} onPress={handleChatPress}>
              <Text style={styles.buttonText}>Chat with {userProfile.username}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} activeOpacity={0.5} onPress={() => {navigation.navigate('Home')}}>
              <Text style={styles.buttonText}>Go to Home</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  headerContent: {
    marginLeft: 20,
    flexDirection: 'column',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 75,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  credentials: {
    padding: 20,
  },
  credentialsHeading: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold'
  },
  email: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#faad14',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center'
  },
});

export default UserProfileScreen;
