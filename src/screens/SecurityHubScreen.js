import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SecurityHubScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Security Hub</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 20,
  },
});
