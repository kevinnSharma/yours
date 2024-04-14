import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {collection, query, where, getDocs} from 'firebase/firestore';
import {db} from '../firebase';
import { getAuth } from 'firebase/auth';
const LiveRooms = ({navigation}) => {
  const [rooms, setRooms] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const auth = getAuth();
  const uid = auth.currentUser.uid;
  useEffect(() => {
    fetchRooms();
  });

  const fetchRooms = async () => {
    try {
      const roomRef = collection(db, 'rooms');
      const q = query(roomRef, where('expirationTime', '>', new Date()));

      const querySnapshot = await getDocs(q);
      const roomsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(roomsData);
    } catch (error) {
      Alert.alert('Error fetching rooms:', error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRooms();
  };

  const handleRoomPress = (roomId, roomName, hostName, token) => {
    navigation.navigate('JoinRoomScreen', {roomId, roomName, hostName, token, uid});
  };

  const renderRoomItem = ({item}) => (
    <ScrollView style={styles.roomItem}>
      <View style={styles.credentials}>
        <Text style={styles.name}>{item.roomName}</Text>
        <Text style={styles.host}>by {item.hostName}</Text>
      </View>
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            handleRoomPress(item.id, item.roomName, item.hostName)
          }>
          <Text style={styles.buttonText}>Join Room</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Active Rooms</Text>
      <FlatList
        data={rooms}
        renderItem={renderRoomItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10, // Reduce padding
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  listContainer: {
    flexGrow: 1,
  },
  roomItem: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    padding: 10,
    color: 'white',
    margin: 5,
  },
  button: {
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#faad14',
  },
  buttonText:{
    color: 'black',
    paddingVertical: 6,
    fontWeight: '700',
    fontSize: 16
  },
  name:{
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  host:{
    color: 'white',
    letterSpacing: 2
  }
});

export default LiveRooms;