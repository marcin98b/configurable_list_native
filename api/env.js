import AsyncStorage from '@react-native-async-storage/async-storage'

export const API_URL = 'https://listak.pl/api';

export const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem('@token');
    if (value !== null) {
      return value;
    }
  } catch (e) {
    return null;
  }
};

export const setToken = async (token) => {
    try {
      await AsyncStorage.setItem('@token', token);
    } catch (e) {
      return null;
    }
  };