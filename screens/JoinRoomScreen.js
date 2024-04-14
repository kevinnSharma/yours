import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const JoinRoomScreen = () => {
  return (
    <View style={{flex: 1, alignContent: 'center',justifyContent: 'center', backgroundColor: 'black'}}>
      <Text style={{color: 'white', fontSize: 14}}>Real Time communication is not ready to use now.</Text>
    </View>
  )
}

export default JoinRoomScreen

const styles = StyleSheet.create({})
/*
import React, { useState, useEffect } from 'react';
import AgoraUIKit, {RtcEngine} from 'agora-rn-uikit';
import { Text } from 'react-native';

const App = ({ route, navigation }) => {
    const { roomName, uid, token } = route.params;
    const [videoCall, setVideoCall] = useState(true);
    const connectionData = {
        appId: '142c4e52f1de47429b1f8340b7bd8b23',
        channel: roomName,
        token: token,
    };

    return videoCall ? (
        <AgoraUIKit connectionData={connectionData} />
    ) : (
        <Text onPress={() => setVideoCall(true)}>Start Call</Text>
    );
};

export default App;
*/
