// HomeScreen.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Input } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../components/Header';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const searchUsers = async () => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '>=', searchQuery), where('username', '<=', searchQuery + '\uf8ff'));

    try {
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => doc.data());
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching for users:', error);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.searchContainer}>
        <Input
          containerStyle={styles.input}
          placeholder="Search users"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onBlur={searchUsers}
          inputStyle={{ color: 'white'}}
          rightIcon={<MaterialCommunityIcons name="magnify" color='grey' size={30} />}
          inputContainerStyle={{ borderBottomWidth: 0 }}
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
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  input: {
    height: 50,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'grey'
  },
  textemail:{
    color: 'white',
    fontSize: 12,
    marginVertical: 2
  },
  item: {
    backgroundColor: '#282828',
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,
    width: 300,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  searchContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  searchIcon:{
    marginHorizontal: 10,
    backgroundColor: '#faad14'
  }
});
