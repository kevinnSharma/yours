import { StyleSheet, Text, View, useColorScheme } from 'react-native'
import React, { useEffect } from 'react'
import DevNews from '../components/DevNews';
import NewsList from '../components/NewsList';

const DevSceen = ({navigation}) => {
  const colorScheme = useColorScheme();
  useEffect(() =>{
    navigation.setOptions({
      headerShown: true,
      title: 'Developer News',
      headerStyle: {
        backgroundColor: colorScheme === 'dark' ? 'black' : 'white'
      },
      headerTitleStyle: {
        color: colorScheme === 'dark' ? 'white' : 'black',
      },
    });
  },[])
  return (
    <View
    style={[
      styles.container,
      {backgroundColor: colorScheme === 'dark' ? 'black' : 'white'},
    ]}>
    <NewsList />
    </View>
  )
}

export default DevSceen

const styles = StyleSheet.create({
  container:{
    flex: 1,
  }
})