import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, useColorScheme, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native'; // Add useColorScheme to imports
import { Input } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../components/Header';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const HomeScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme); // Define colorScheme using useColorScheme

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
    }, 500); // Set a timeout to debounce the search

    return () => clearTimeout(timer); // Clear the timeout if the searchQuery changes before the timeout finishes
  }, [searchQuery]);
  useEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

      <View style={styles.container}>
        <Header />
        <View style={styles.searchContainer}>
          <Input
            containerStyle={styles.input}
            placeholder="Search users"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            inputStyle={{ color: colorScheme === 'dark' ? 'white' : 'black' }}
            rightIcon={<MaterialCommunityIcons name="magnify" color={colorScheme === 'dark' ? 'white' : 'black'} size={30} />}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            placeholderTextColor={colorScheme === 'dark' ? 'white' : 'black'}
          />
        </View>

        <FlatList
          data={searchResults}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate('UserProfileScreen', { user: item })}
            >
              <Text style={styles.text}>{item.username}</Text>
              <Text style={styles.textemail}>{item.email}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default HomeScreen;

const getStyles = (colorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 20,
    },
    input: {
      width: '100%',
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
      backgroundColor: colorScheme === 'dark' ? '#282828' : '#e0e0e0',
      padding: 20,
      marginVertical: 8,
      borderRadius: 5,
      width: 300,
    },
    text: {
      color: colorScheme === 'dark' ? 'white' : 'black',
      fontSize: 16,
    },
    searchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: 20,
    },
  });
};