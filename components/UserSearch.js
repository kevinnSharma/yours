import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  Alert,
  Image,
} from 'react-native'; // Add useColorScheme to imports
import {Input} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {collection, query, where, getDocs} from 'firebase/firestore';
import {db} from '../firebase';

const UserSearch = ({navigation}) => {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);
  const defaultProfileImage =
    'https://th.bing.com/th/id/OIP.RpahWNi7KifKy3COEQYxbwAAAA?w=240&h=240&rs=1&pid=ImgDetMain';
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const searchUsers = async () => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', searchQuery));

    try {
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => doc.data());
      setSearchResults(results);
    } catch (error) {
      Alert.alert('Error searching for users:', error);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() !== '') {
        searchUsers();
      } else {
        setSearchResults([]);
      }
    }, 1); // Set a timeout to debounce the search

    return () => clearTimeout(timer); // Clear the timeout if the searchQuery changes before the timeout finishes
  }, [searchQuery]);
  return (
    <View>
      <View style={styles.searchContainer}>
        <Input
          containerStyle={styles.input}
          placeholder="Search users"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          inputStyle={{color: colorScheme === 'dark' ? 'white' : 'black'}}
          rightIcon={
            <MaterialCommunityIcons
              name="magnify"
              color={colorScheme === 'dark' ? 'white' : 'black'}
              size={30}
            />
          }
          inputContainerStyle={{borderBottomWidth: 0}}
          placeholderTextColor={colorScheme === 'dark' ? 'white' : 'black'}
        />
      </View>

      <FlatList
        data={searchResults}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate('UserProfileScreen', {user: item})
            }>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: item.photoURL || defaultProfileImage,
                }}
                style={styles.avatar}
              />
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.text}>{item.username}</Text>
              <Text style={styles.textemail}>{item.email}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default UserSearch;

const getStyles = colorScheme => {
  return StyleSheet.create({
    input: {
      width: '95%',
      backgroundColor: 'transparent',
      color: colorScheme === 'dark' ? 'white' : 'black',
      borderRadius: 20,
      borderWidth: 2,
      borderColor: colorScheme === 'dark' ? 'white' : 'black',
      height: 50,
    },
    textemail: {
      color: colorScheme === 'dark' ? 'white' : 'black',
      fontSize: 12,
      marginVertical: 2,
    },
    item: {
      backgroundColor: colorScheme === 'dark' ? '#181818' : '#e0e0e0',
      padding: 10,
      marginVertical: 6,
      borderRadius: 5,
      width: 'auto',
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      color: colorScheme === 'dark' ? 'white' : 'black',
      fontSize: 16,
    },
    searchContainer: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: 20,
    },
    avatar: {
      height: 60,
      width: 60,
      borderRadius: 50,
      marginHorizontal: 16,
    },
    itemContainer: {
      textAlign: 'left',
    },
  });
};
