import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  useColorScheme,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
  RefreshControl,
} from 'react-native';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAuth } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';

const NewsList = () => {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);
  const [news, setNews] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const auth = getAuth();

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const q = query(
        collection(db, 'devNews'),
        orderBy('timestamp', 'desc'),
        limit(10),
      );
      const querySnapshot = await getDocs(q);
      const newsData = [];
      querySnapshot.forEach(doc => {
        newsData.push({ id: doc.id, ...doc.data() });
      });
      setNews(newsData);
    } catch (error) {
      Alert.alert('Error refreshing news:', error.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    onRefresh();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'devNews', id));
      setNews(prevNews => prevNews.filter(item => item.id !== id));
      Alert.alert('Success', 'News deleted successfully');
    } catch (error) {
      Alert.alert('Error refreshing news:', error.message);
    }
  };

  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  const renderTextWithLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => handleLinkPress(part)}
          >
            <Text style={styles.link}>{part}</Text>
          </TouchableOpacity>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={news}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.newsItem}>
            <Text style={styles.newsHeading}>{item.heading}</Text>
            <Text style={styles.newsContent}>
              {renderTextWithLinks(item.content)}
            </Text>
            <View style={styles.uploadedbyContainer}>
              <Image
                source={{
                  uri: item.uploadedBy.userPhotoURL,
                }}
                style={styles.userPhotoURL}
              />
              <Text style={styles.newsTimestamp}>
                {item.uploadedBy.username} at{' '}
                {item.timestamp && item.timestamp.toDate().toLocaleString()}
              </Text>
              {auth.currentUser.uid === 'QM4geYQsLSZ5NPTG9W7BU5GVxlL2' && (
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <MaterialCommunityIcons
                    name="delete"
                    color={colorScheme === 'dark' ? 'white' : 'black'}
                    size={20}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colorScheme === 'dark' ? 'black' : 'white']}
          />
        }
        style={{ flex: 1 }}
      />
    </View>
  );
};

const getStyles = colorScheme => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
      marginVertical: 2,
    },
    newsItem: {
      borderBottomWidth: 1,
      borderColor: colorScheme === 'dark' ? 'white' : 'black',
      padding: 10,
    },
    newsHeading: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? 'white' : 'black',
      textAlign: 'center',
      marginVertical: 5,
    },
    newsContent: {
      fontSize: 16,
      color: colorScheme === 'dark' ? 'white' : 'black',
    },
    newsTimestamp: {
      fontSize: 14,
      color: colorScheme === 'dark' ? 'gray' : '#888',
    },
    uploadedbyContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    userPhotoURL: {
      height: 40,
      width: 40,
      borderRadius: 50,
      marginRight: 10,
      marginVertical: 8,
    },
    link: {
      color: '#baaced',
      textDecorationLine: 'underline',
    },
  });
};

export default NewsList;
