import * as React from 'react';
import { StyleSheet, Button, TouchableOpacity, TextInput, Linking } from 'react-native';
import { onChange } from 'react-native-reanimated';

import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {API_URL, setToken} from "../../api/env";
import AsyncStorage from '@react-native-async-storage/async-storage'



export default function LoginScreen({ navigation }: RootTabScreenProps<'TabList'>) {



const [login, setLogin] = useState('');
const [password, setPassword] = useState('');


const CheckCredentials = () => {


if(login && password) { 
  
  //definicja struktury żądania - pola w ciele (body) żądania
  const request = {
        "email": login,
        "password": password
    }
  
  //wykonanie żądania post zasobu "listak.pl/api/login" - w ciele przesłane zostaną 
  //pola email oraz password (request)
    axios.post(API_URL + '/login', request)
    .then(
        async response => { //jesli poprawna odpowiedz serwera ustaw token
            await setToken(response.data.token)
            .then(
                response => { //nastepnie przenieś użytkownika do aplikacji
                    navigation.replace('Root');
                }
            );
        }, //w przypadku zlych danych - alert
        err => {
            alert("Błędne dane logowania!");
        }
    )


   } else alert('Uzupełnij dane logowania!');
}

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      
     <Text style={styles.Listak_header}>ListaK</Text>

     <Text >E-mail:</Text>
      <TextInput
        autoCompleteType="email"
        style={styles.TextInput}
        placeholder="Podaj swój e-mail"
        onChangeText={login => setLogin(login)}
        defaultValue={login}       
      />

      <Text style={{paddingTop: 15}} >Hasło:</Text>
      <TextInput
        autoCompleteType="password"
        style={styles.TextInput}
        placeholder="Podaj swoje hasło"
        onChangeText={password => setPassword(password)}
        defaultValue={password}    
        secureTextEntry
      />

<TouchableOpacity
      onPress={() => {Linking.openURL('https://listak.pl/forgot-password')}}
      style={{
        position:'relative',
        right:110,
        top:10,
        paddingTop:5,
      }}
      >
        <Text style={{
          fontWeight:'bold'
        }}>
            Nie pamiętasz hasła?
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
      onPress={() => CheckCredentials()}
      style={styles.Button}


      >
        <Text style={styles.ButtonText}>
            Zaloguj się
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
      onPress={() => navigation.navigate('Register')}     
      style={styles.ButtonRegister}


      >
        <Text style={styles.ButtonText}>
            Zarejestruj się
        </Text>

      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  TextInput: {

    backgroundColor: "#FAFAFA",
    width: "90%",
    borderRadius:5,
    borderWidth:1,
    borderColor:"#d9d9d9",
    height:45,
    padding:15

  },

  Listak_header: {

    fontSize: 48,
    paddingBottom: 24,
    fontWeight: 'bold'

  },

  Button: {
    marginTop:25,
    backgroundColor: "#9fff80",
    width: "50%",
    height:45,
    borderRadius: 10
  },

  ButtonText: {
      textAlign:"center",
      color:"black",
      paddingTop: 10,
      fontWeight: "bold",
      fontSize:18,
      

  },

  ButtonRegister: {
    marginTop:10,
    backgroundColor: "#adadeb",
    width: "50%",
    height:45,
    borderRadius: 10
  },

});
