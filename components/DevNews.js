import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {getAuth} from 'firebase/auth';
const DevNews = ({navigation}) => {
  const auth = getAuth();
  return (
    <View style={styles.container}>
      {auth.currentUser.uid === 'QM4geYQsLSZ5NPTG9W7BU5GVxlL2' && (
        <TouchableOpacity
          style={styles.PbuttonBody}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('PublishDevNews')}>
          <Text style={styles.Pbutton}>Publish Dev News</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DevNews;

const styles = StyleSheet.create({
  PbuttonBody: {
    backgroundColor: '#faad14',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '40vw',
  },
  Pbutton: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  heading: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'white',
    textAlign: 'center',
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 1,
    marginVertical: 5,
    padding: 5,
  },
});
