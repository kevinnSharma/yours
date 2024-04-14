import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TextInput,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  collection,
  addDoc,
  serverTimestamp,
  where,
  query,
  getDocs,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import {db} from '../firebase';
import {getAuth} from 'firebase/auth';
import {Picker} from '@react-native-picker/picker';

const CreateRoom = ({navigation}) => {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState('public');
  const [roomNumber, setRoomNumber] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Create Room',
      headerStyle: {
        backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
      },
      headerTitleStyle: {
        color: colorScheme === 'dark' ? 'white' : 'black',
      },
    });
    const generateRoomNumber = () => {
      const randomRoomNumber = Math.floor(100000 + Math.random() * 900000);
      setRoomNumber(randomRoomNumber);
    };
    generateRoomNumber();
  }, []);

  const generateAgoraToken = async (channelName, uid) => {
    try {
      const response = await fetch('https://agora-token-server-e5qk.onrender.com/getToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenType: 'rtc',
          channel: channelName,
          role: 'publisher',
          uid: uid,
          expire: 3600,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      Alert.alert('Error:', error.message);
      return null;
    }
  };
  

  const uid = auth.currentUser.uid;
  // Example usage
  const appId = '142c4e52f1de47429b1f8340b7bd8b23';
  const appCertificate = '7c35314ba312430bbc74005f2684ddbf';
  const channelName = roomName;
  const handleCreateRoom = async () => {
    try {
      if (!roomName.trim()) {
        Alert.alert('Error', 'Room name cannot be empty');
        return;
      }
      const querySnapshot = await getDocs(
        query(collection(db, 'rooms'), where('roomName', '==', roomName)),
      );
      if (!querySnapshot.empty) {
        Alert.alert('Error', 'Room name must be unique');
        return;
      }
      const tokenResponse = await generateAgoraToken(channelName, uid);
      const token = tokenResponse.token;
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1); // Room expires in 1 hour
      const roomRef = await addDoc(collection(db, 'rooms'), {
        roomName: roomName.trim(),
        roomType: roomType,
        hostName: auth.currentUser.displayName,
        hostUid: auth.currentUser.uid,
        roomId: roomNumber,
        creationTime: serverTimestamp(),
        expirationTime: expirationTime,
        token: token,
      });

      Alert.alert('Success', 'Room created successfully');
      setRoomName('');
      setRoomType('public');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.label}>Room Number</Text>
        <TextInput
          style={styles.input}
          value={roomNumber !== null ? roomNumber.toString() : ''}
          editable={false}
        />
        <Text style={styles.label}>Host Name</Text>
        <TextInput
          style={styles.input}
          value={auth.currentUser.displayName}
          editable={false}
        />
        <Text style={styles.label}>Room Name</Text>
        <TextInput
          style={styles.input}
          value={roomName}
          onChangeText={setRoomName}
          placeholder="Enter Room Name"
          placeholderTextColor={colorScheme === 'dark' ? 'gray' : 'black'}
        />
        <Text style={styles.label}>Room Type</Text>
        <Picker
          selectedValue={roomType}
          onValueChange={(itemValue, itemIndex) => setRoomType(itemValue)}
          style={styles.input}>
          <Picker.Item label="Public" value="public" />
          <Picker.Item label="Private" value="private" />
        </Picker>
        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateRoom}
          activeOpacity={0.5}>
          <Text style={styles.buttonText}>Create Room</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const getStyles = colorScheme => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
      alignItems: 'center',
      padding: 20,
    },
    label: {
      fontSize: 18,
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? 'white' : 'black',
      borderRadius: 15,
      padding: 10,
      marginBottom: 16,
      fontSize: 18,
      width: '95%',
    },
    button: {
      backgroundColor: '#faad14',
      borderRadius: 5,
      paddingVertical: 12,
      paddingHorizontal: 24,
      marginTop: 20,
    },
    buttonText: {
      color: 'black',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
};

export default CreateRoom;
