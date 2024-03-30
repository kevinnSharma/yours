import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  useColorScheme,
  Alert,
  Keyboard
} from 'react-native';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  deleteDoc,
  getDocs,
  startAfter,
} from 'firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import {db} from '../firebase';
import {getAuth} from 'firebase/auth';

const ChatScreen = ({route, navigation}) => {
  const {user, chatId} = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const auth = getAuth();
  const currentUserId = auth.currentUser.uid;
  const currentUserName = auth.currentUser.displayName;
  const [lastMessageDate, setLastMessageDate] = useState(null);
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  const [shouldUpdateLastMessageDate, setShouldUpdateLastMessageDate] =
    useState(false);
  const [lastVisibleMessage, setLastVisibleMessage] = useState(null);
  const flatListRef = useRef(null);
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);
  const pageSize = 20; // Number of messages to load per page

  const scrollToEnd = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'chats', chatId, 'messages'),
        orderBy('createdAt', 'desc'),
        limit(pageSize),
      ),
      snapshot => {
        const data = [];
        snapshot.forEach(doc => {
          data.unshift({id: doc.id, ...doc.data()}); // Use unshift to prepend new messages
        });
        setMessages(data);
        if (data.length > 0) {
          setLastVisibleMessage(snapshot.docs[data.length - 1]);
        }
      },
    );

    return () => unsubscribe();
  }, [chatId]);

  const loadMoreMessages = async () => {
    if (!lastVisibleMessage || loadingMoreMessages) return;
    setLoadingMoreMessages(true);
  
    try {
      const snapshot = await getDocs(
        query(
          collection(db, 'chats', chatId, 'messages'),
          orderBy('createdAt', 'desc'),
          startAfter(lastVisibleMessage),
          limit(pageSize),
        ),
      );
      const data = [];
      snapshot.forEach(doc => {
        data.unshift({id: doc.id, ...doc.data()}); // Use unshift to prepend new messages
      });
      setMessages(prevMessages => [...data, ...prevMessages]); // Prepend new messages to existing messages
      if (data.length > 0) {
        setLastVisibleMessage(snapshot.docs[data.length - 1]);
      }
    } catch (error) {
      console.error('Error loading more messages:', error);
    } finally {
      setLoadingMoreMessages(false);
    }
  };

  const sendMessage = async () => {
    if (message.trim() === '') {
      return;
    }
    setMessage('');
    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        sender: currentUserId,
        receiver: user.uid,
        message: message,
        senderName: currentUserName,
        createdAt: new Date(),
      });
      scrollToEnd();
    } catch (error) {
      Alert.alert('Error', error);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: user.username,
      headerRight: () => (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={deleteChat}
          activeOpacity={0.5}>
          <MaterialCommunityIcons
            name="delete"
            color={colorScheme === 'dark' ? 'white' : 'black'}
            size={30}
          />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => navigation.navigate('UserProfileScreen', {user: user})}
          activeOpacity={0.5}>
          <MaterialCommunityIcons
            name="arrow-left"
            color={colorScheme === 'dark' ? 'white' : 'black'}
            size={30}
          />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
      },
      headerTitleStyle: {
        color: colorScheme === 'dark' ? 'white' : 'black',
      },
    });
  }, []);

  useEffect(() => {
    if (shouldUpdateLastMessageDate && messages.length > 0) {
      setLastMessageDate(messages[messages.length - 1].createdAt.toDate());
      setShouldUpdateLastMessageDate(false);
    }
  }, [shouldUpdateLastMessageDate, messages]);

  const deleteChat = async () => {
    try {
      const chatRef = collection(db, 'chats', chatId, 'messages');
      const querySnapshot = await getDocs(chatRef);
      querySnapshot.forEach(async doc => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      Alert.alert('Error deleting messages:', error);
    }
  };

  const formatDate = date => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const isSameMinute = (date1, date2) => {
    return (
      date1.getMinutes() === date2.getMinutes() &&
      date1.getHours() === date2.getHours() &&
      date1.toDateString() === date2.toDateString()
    );
  };

  const groupedMessages = messages.reduce((acc, message) => {
    const dateKey = message.createdAt.toDate().toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(message);
    return acc;
  }, {});
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      contentContainerStyle={{
        flex: 1,
        backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
      }}>
      <KeyboardAwareFlatList
        ref={flatListRef}
        data={Object.entries(groupedMessages)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item: [date, messages]}) => (
          <>
            <Text style={styles.date}>{formatDate(new Date(date))}</Text>
            {messages.map((message, index) => {
              const isSameMinuteAsPrevMessage = index > 0 && isSameMinute(messages[index - 1].createdAt.toDate(), message.createdAt.toDate());
              const isFirstMessageInMinute = index === 0 || !isSameMinuteAsPrevMessage;
              return (
                <>
                  {isFirstMessageInMinute && (
                    <Text
                      style={[
                        styles.timestamp,
                        {
                          textAlign:
                            message.sender === currentUserId ? 'right' : 'left',
                        },
                      ]}>
                      {message.createdAt.toDate().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  )}
                  <View
                    style={[
                      styles.messageContainer,
                      message.sender === currentUserId
                        ? styles.sentMessage
                        : styles.receivedMessage,
                    ]}>
                    <Text style={styles.message}>{message.message}</Text>
                  </View>
                </>
              );
            })}
          </>
        )}
        onScroll={({nativeEvent}) => {
          // Check if user has scrolled to the top
          if (
            nativeEvent.contentOffset.y === 0 &&
            messages.length >= pageSize &&
            !loadingMoreMessages
          ) {
            // Load more messages
            loadMoreMessages();
          }
        }}
        getItemLayout={(data, index) => ({
          length: 50,
          offset: 50 * index,
          index,
        })}
        keyboardShouldPersistTaps="handled"
      />
  
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Message..."
          value={message}
          onChangeText={setMessage}
          color={colorScheme === 'dark' ? 'white' : 'black'}
          fontSize={16}
          placeholderTextColor={colorScheme === 'dark' ? 'white' : 'black'}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <MaterialCommunityIcons
            name="send"
            color={colorScheme === 'dark' ? 'white' : 'black'}
            size={30}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
  
};

export default ChatScreen;

const getStyles = colorScheme => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
      padding: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    input: {
      height: 50,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? 'white' : 'black',
      width: '89%',
      padding: 10,
      marginVertical: 5,
      color: colorScheme === 'dark' ? 'white' : 'black', // Set text color
      backgroundColor: colorScheme === 'dark' ? '#111' : '#f9f9f9', // Set background color
    },
    sendButton: {},
    sendButtonText: {},
    deleteButton: {
      margin: 10,
    },
    deleteButtonText: {},
    messageContainer: {
      padding: 10,
      borderRadius: 5,
      maxWidth: '80%',
      alignSelf: 'flex-end',
      borderColor: colorScheme === 'dark' ? 'white' : 'black',
      backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
      color: colorScheme === 'dark' ? 'white' : 'black',
      position: 'relative',
      marginVertical: 7,
    },
    sentMessage: {
      alignSelf: 'flex-end',
      backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
      color: colorScheme === 'dark' ? 'white' : 'black',
      borderWidth: 2,
      borderRadius: 20,
    },
    receivedMessage: {
      alignSelf: 'flex-start',
      backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
      color: colorScheme === 'dark' ? 'white' : 'black',
      borderWidth: 2,
      borderRadius: 20,
    },
    message: {
      fontSize: 16,
      color: colorScheme === 'dark' ? 'white' : 'black',
    },
    timestamp: {
      fontSize: 13,
      color: 'gray',
      marginVertical: 3,
    },
    date: {
      fontSize: 12,
      color: 'gray',
      alignSelf: 'center',
      marginBottom: 10,
    },
  });
};
