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
import {collection, addDoc, serverTimestamp} from 'firebase/firestore';
import {db} from '../firebase';
import {getAuth} from 'firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const PublishDevNews = ({navigation}) => {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);
  const [heading, setHeading] = useState('');
  const [content, setContent] = useState('');
  const auth = getAuth();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handlePublish = async () => {
    try {
      if (!heading.trim() || !content.trim()) {
        Alert.alert('Error', 'Heading and content cannot be empty');
        return;
      }

      await addDoc(collection(db, 'devNews'), {
        heading: heading.trim(),
        content: content.trim(),
        timestamp: serverTimestamp(),
        uploadedBy: {
          userId: auth.currentUser.uid,
          username: auth.currentUser.displayName,
          userPhotoURL: auth.currentUser.photoURL,
        },
      });

      Alert.alert('Success', 'Dev news published successfully');
      setHeading('');
      setContent('');
    } catch (error) {
      Alert.alert('Error publishing news:', error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
        <Text style={styles.headingText}>Publish Developer News</Text>
        <Text style={styles.label}>Heading</Text>
        <TextInput
          style={styles.input}
          value={heading}
          onChangeText={setHeading}
          placeholder="Enter Heading"
          placeholderTextColor={'white'}
          fontWeight={'bold'}
        />
        <Text style={styles.label}>Content</Text>
        <TextInput
          style={[styles.input, {height: 200, fontSize: 16}]}
          value={content}
          onChangeText={setContent}
          placeholder="Enter Content"
          placeholderTextColor={'white'}
          multiline
        />
        <TouchableOpacity
          style={styles.PbuttonBody}
          activeOpacity={0.5}
          onPress={handlePublish}>
          <Text style={styles.Pbutton}>Publish</Text>
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
      padding: 20,
      alignItems: 'center',
    },
    headingText: {
      color: colorScheme === 'dark' ? 'white' : 'black',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    label: {
      color: colorScheme === 'dark' ? 'white' : 'black',
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
      color: colorScheme === 'dark' ? 'white' : 'black',
      width: '95%',
    },
    PbuttonBody: {
      height: 45,
      width: '90%',
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 50,
      backgroundColor: '#faad14',
    },
    Pbutton: {
      fontSize: 18,
      color: 'black',
      fontWeight: 'bold',
    },
  });
};

export default PublishDevNews;
