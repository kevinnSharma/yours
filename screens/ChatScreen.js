import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { collection, addDoc, query, where, orderBy, limit, onSnapshot, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

const ChatScreen = ({ route, navigation }) => {
  const { user } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const auth = getAuth();
  const currentUserId = auth.currentUser.uid;
  const currentUserName = auth.currentUser.displayName;
  const [lastMessageDate, setLastMessageDate] = useState(null);
  const [shouldUpdateLastMessageDate, setShouldUpdateLastMessageDate] = useState(false);
  const flatListRef = React.useRef(null);

  useEffect(() => {
    navigation.setOptions({
      title: user.username,
      headerRight: () => (
        <TouchableOpacity style={styles.deleteButton} onPress={deleteChat}>
          <Text style={styles.deleteButtonText}>Delete Chat</Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: 'black'
      }
    });
    if (!currentUserId) return;

    const unsubscribe = onSnapshot(
      query(
        collection(db, 'messages'),
        where('sender', 'in', [currentUserId, user.uid]),
        where('receiver', 'in', [currentUserId, user.uid]),
        orderBy('createdAt', 'asc'),
        limit(50)
      ),
      (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => doc.data());
        setMessages(newMessages);
        if (newMessages.length > 0) {
          setLastMessageDate(newMessages[newMessages.length - 1].createdAt.toDate());
        }
      }
    );

    return () => unsubscribe();
  }, [user, currentUserId]);

  useEffect(() => {
    if (shouldUpdateLastMessageDate && messages.length > 0) {
      setLastMessageDate(messages[messages.length - 1].createdAt.toDate());
      setShouldUpdateLastMessageDate(false);
    }
  }, [shouldUpdateLastMessageDate, messages]);

  const sendMessage = async () => {
    if (message.trim() === '') {
      return;
    }

    try {
      await addDoc(collection(db, 'messages'), {
        sender: currentUserId,
        receiver: user.uid,
        message: message,
        senderName: currentUserName,
        createdAt: new Date(),
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const deleteChat = async () => {
    try {
      const messagesQuery = query(
        collection(db, 'messages'),
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
    return date1.getMinutes() === date2.getMinutes() && date1.getHours() === date2.getHours();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={100}
      contentContainerStyle={{ flex: 1 }}
    >
      <KeyboardAwareFlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          const itemDate = item.createdAt.toDate();
          const isSameDayAsLastMessage = lastMessageDate && lastMessageDate.toDateString() === itemDate.toDateString();
          const prevMessage = messages[index - 1];

          if (prevMessage && prevMessage.sender === item.sender && isSameMinute(prevMessage.createdAt.toDate(), itemDate)) {
            return (
              <View style={[
                styles.messageContainer,
                item.sender === currentUserId ? styles.sentMessage : styles.receivedMessage,
                { marginTop: 2, marginBottom: 2 }
              ]}>
                <Text style={styles.message}>{item.message}</Text>
              </View>
            );
          }

          if (!isSameDayAsLastMessage) {
            setShouldUpdateLastMessageDate(true);
          }

          return (
            <View>
              {!isSameDayAsLastMessage && (
                <Text style={styles.date}>{formatDate(itemDate)}</Text>
              )}
              <View style={styles.sendNameAndTimeStamp}>
                <Text style={[styles.sender, { textAlign: item.sender === currentUserId ? 'right' : 'left' }]}>
                  {item.senderName}
                </Text>
              </View>
              <Text style={[styles.timestamp, { textAlign: item.sender === currentUserId ? 'right' : 'left' }]}>
                {item.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <View style={[
                styles.messageContainer,
                item.sender === currentUserId ? styles.sentMessage : styles.receivedMessage
              ]}>
                <Text style={styles.message}>{item.message}</Text>
              </View>
            </View>
          );
        }}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
      />


      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          color={'white'}
          fontSize={16}
          placeholderTextColor={'gray'}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
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
    borderColor: 'grey',
    width: '80%',
    padding: 10
  },
  sendButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  sendButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  messageContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    maxWidth: '80%',
    alignSelf: 'flex-end',
    backgroundColor: 'black',
    color: 'white',
    paddingHorizontal: 10,
    position: 'relative',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'black',
    color: 'white',
    borderWidth: 2,
    borderRadius: 20,
    borderColor: 'white'
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'black',
    borderWidth: 2,
    borderRadius: 20,
    borderColor: 'white'
  },
  sender: {
    flex: 1, // Take up remaining space
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  message: {
    fontSize: 16,
    color: 'white'
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
    marginVertical: 5,
  },
  date: {
    fontSize: 12,
    color: 'gray',
    alignSelf: 'center',
    marginBottom: 10,
  },
  sendNameAndTimeStamp: {
    flexDirection: 'row'
  }
});