import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, useColorScheme, Alert } from 'react-native';
import { collection, addDoc, query, where, orderBy, limit, onSnapshot, deleteDoc, getDocs } from 'firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

const ChatScreen = ({ route, navigation }) => {
  const { user, chatId } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const auth = getAuth();
  const currentUserId = auth.currentUser.uid;
  const currentUserName = auth.currentUser.displayName;
  const [lastMessageDate, setLastMessageDate] = useState(null);
  const [shouldUpdateLastMessageDate, setShouldUpdateLastMessageDate] = useState(false);
  const flatListRef = React.useRef(null);
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);

  useEffect(() => {
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt'),
      limit(500)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setMessages(data);
    });

    return () => unsubscribe();
  }, [chatId]);

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
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: user.username,
      headerRight: () => (
        <TouchableOpacity style={styles.deleteButton} onPress={deleteChat} activeOpacity={0.5}>
          <MaterialCommunityIcons name='delete' color={colorScheme === 'dark' ? 'white' : 'black'} size={30} />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity style={styles.deleteButton} onPress={() => navigation.navigate('UserProfileScreen', { user: user })} activeOpacity={0.5}>
          <MaterialCommunityIcons name='arrow-left' color={colorScheme === 'dark' ? 'white' : 'black'} size={30} />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
      },
      headerTitleStyle:{
        color: colorScheme === 'dark' ? 'white' : 'black'
      }
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
      const messagesQuery = query(
        collection(db, 'chats', chatId, 'messages'),
        where('sender', 'in', [currentUserId, user.uid]),
        where('receiver', 'in', [currentUserId, user.uid])
      );
      const snapshot = await getDocs(messagesQuery);
      snapshot.docs.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      console.error('Error deleting messages:', error);
    }
  };

  const formatDate = (date) => {
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

  return (

    <KeyboardAvoidingView
      style={styles.container}
      contentContainerStyle={{ flex: 1, backgroundColor: colorScheme === 'dark' ? 'black' : 'white' }}
    >
      <KeyboardAwareFlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          const itemDate = item.createdAt.toDate();
          const isSameDayAsLastMessage = lastMessageDate && lastMessageDate.toDateString() === itemDate.toDateString();
          const prevMessage = messages[index - 1];

          const isSameSenderAsPrevMessage = prevMessage && prevMessage.sender === item.sender;
          const isSameMinuteAsPrevMessage = prevMessage && isSameMinute(prevMessage.createdAt.toDate(), itemDate);
          const isFirstMessageInMinute = !isSameMinuteAsPrevMessage || !isSameSenderAsPrevMessage || index === 0;

          if (!isSameDayAsLastMessage) {
            setShouldUpdateLastMessageDate(true);
          }

          return (
            <View>
              {!isSameDayAsLastMessage && (
                <Text style={styles.date}>{formatDate(itemDate)}</Text>
              )}
              <View style={[
                styles.messageContainer,
                item.sender === currentUserId ? styles.sentMessage : styles.receivedMessage
              ]}>
                <Text style={styles.message}>{item.message}</Text>
              </View>
              {isFirstMessageInMinute && (
                <Text style={[styles.timestamp, { textAlign: item.sender === currentUserId ? 'right' : 'left' }]}>
                  {item.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              )}
              {index === messages.length - 1 && isSameMinuteAsPrevMessage && (
                <Text style={[styles.timestamp, { textAlign: item.sender === currentUserId ? 'right' : 'left' }]}>
                  {item.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              )}
            </View>
          );
        }}

        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: false })}
        onLayout={() => flatListRef.current.scrollToEnd({ animated: false })}
      />


      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          color={colorScheme === 'dark' ? 'white' : 'black'}
          fontSize={16}
          placeholderTextColor={colorScheme === 'dark' ? 'white' : 'black'}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <MaterialCommunityIcons name='send' color={colorScheme === 'dark' ? 'white' : 'black'} size={30} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const getStyles = (colorScheme) => {
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
      width: '100%'
    },
    input: {
      height: 50,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? 'white' : 'black',
      width: '89%',
      padding: 10,
      marginVertical: 5
    },
    sendButton: {
    },
    sendButtonText: {
    },
    deleteButton: {
      margin: 10,
    },
    deleteButtonText: {
    },
    messageContainer: {
      padding: 10,
      borderRadius: 5,
      maxWidth: '80%',
      alignSelf: 'flex-end',
      borderColor: colorScheme === 'dark' ? 'white' : 'black',
      backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
      color: colorScheme === 'dark' ? 'white' : 'black',
      position: 'relative',
      marginVertical: 7
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
      color: colorScheme === 'dark' ? 'white' : 'black'
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
