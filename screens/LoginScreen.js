import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Input, Image } from 'react-native-elements';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from '../firebase'
const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, []);
    const auth = getAuth(app);
    const signIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // ...
            }).then(() => {
                // Profile updated successfully
                // You can access the username later using user.displayName
                navigation.navigate("BottomTab");
            }).catch((error) => {
                // An error occurred
                console.log(error.message);
            })
            .catch((error) => {
                Alert.alert(error.message);
            });
    };

    return (
        <View style={styles.main}>
            <Text style={styles.heading}>Login</Text>
            <View style={styles.inputContainer}>

                <Input
                    placeholder='Email'
                    type="email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    placeholderTextColor='white'
                    inputStyle={{ color: '#FFFFFF' }}
                />

                <Input
                    placeholder='Password'
                    secureTextEntry
                    type="password"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    placeholderTextColor='white'
                    inputStyle={{ color: '#FFFFFF' }}
                />

                <TouchableOpacity activeOpacity={0.5} style={styles.button} onPress={signIn}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <Text style={{ color: '#fff', textAlign: 'center', fontSize: 16, marginVertical: 10 }}>Or</Text>
                <TouchableOpacity activeOpacity={0.5} style={styles.button2} onPress={() => navigation.navigate('RegisterScreen')}>
                    <Text style={styles.buttonText} >Create an Account</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#080808',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    heading: {
        color: '#FFFFFF',
        fontSize: 28,
        textAlign: 'center',
        marginVertical: 20
    },
    inputContainer: {
        width: 350,
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#faad14',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        borderRadius: 50,
        width: 300,
        marginTop: 20
    },
    buttonText: {
        fontWeight: '700',
        color: '#000000',
        fontSize: 17
    },
    button2: {
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        width: 270,
        height: 40,
        borderRadius: 50
    }
})