import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Header = () => {
    return (
        <View>
            <Text style={styles.logo}>RPI</Text>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    logo:{
        color: '#FFFFFF',
        marginHorizontal: 6,
        marginVertical: 9,
        fontSize: 24,
        letterSpacing: 20,
        fontWeight: 'bold' 
    }
})