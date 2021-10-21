import * as React from 'react';
import {useRef} from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Alert, Button} from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import {API_URL, getToken, setToken} from "../api/env";
import { FontAwesome } from '@expo/vector-icons';
//network
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
export default function TabListScreen({ navigation }: RootTabScreenProps<'TabList'>) {
 
  const [listName, setName] = useState('');

  const LogOut = async () => {

  try {
    await AsyncStorage.removeItem('@token').then(
      res =>
      {
        navigation.navigate('Login');
      }
    );

  }
  catch(exception) {
    return false;
}
  }

  const flatlistRef = useRef();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);


  const getLists = async () => {
    try {

    const token = await getToken();
    const urlencoded = new URLSearchParams();  
    const options = {
      method: 'GET',
      //body: urlencoded,
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/json',
        'Authorization': 'Bearer '+token
        
      },

    }

     const response = await fetch(API_URL + '/lists', options);
     const json = await response.json();
     setData(json);
   } catch (error) {
     console.error(error);
   } finally {
     setLoading(false);
   }
 }

 const AddList = async (listName) => {
  try {

  const token = await getToken();
  const options = {
    method: 'POST',
    body: JSON.stringify({
      name:listName
    }),
    headers: {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization': 'Bearer '+token
      
    },

  }

   const response = await fetch(API_URL + '/lists/create', options);
 } catch (error) {
   console.error(error);
 } finally {
   getLists();
   flatlistRef.current.scrollToEnd({animating: true});
   setLoading(false);
 }
}

const DeleteList = async (listId) => {
  try {

  const token = await getToken();
  const options = {
    method: 'DELETE',
    body: ({
      id:listId
    }),
    headers: {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization': 'Bearer '+token
      
    },

  }

   const response = await fetch(API_URL + '/lists/'+listId, options);
 } catch (error) {
   console.error(error);
 } finally {
   getLists();
   setLoading(false);
 }
}

 useEffect(() => {
   getLists();
 }, []);


 //Komponent listy

 const Item = ({ id,title }) => (
  <TouchableOpacity
  onPress={() => navigation.navigate('GetList', {listId: id, name:title})}
  >
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>

    <TouchableOpacity
      onPress={() => {
        
        Alert.alert('Usunięcie listy', 'Potwierdź usunięcie listy: "' +title+'".',
        [
          {
            text: "Usuń",
            onPress: () => DeleteList(id)
          },
          { text: "Anuluj", onPress: () => console.log('Anulowano')}
        ]
        )
        
        }}   
      style={styles.ButtonDelete}
   
      >
      <FontAwesome name="remove" size={32} color="red" />

      </TouchableOpacity>
  </View>
  </TouchableOpacity>
);

const renderItem = ({ item }) => (
  <Item title={item.name} id={item.id} />
);


  return (
    <View style={styles.container}>

      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          ref={flatlistRef}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          extraData={listName}
          // data={data}
          // keyExtractor={item => item.id}
          // renderItem={({ item }) => (

          //   <Text>{item.name},  {item.created_at}</Text>

          // )}
          ListEmptyComponent={<Text>Brak list!</Text>}
        />
      )} 

<View style={styles.addPanel}>
<TextInput
        style={styles.addInput}
        placeholder="Dodaj produkt ..."
        onChangeText={listName => setName(listName)}
        defaultValue={listName}       
 />
      <TouchableOpacity
      disabled = { listName ? '' : true }
      onPress={() => {AddList(listName); setName('');}}   
      style={styles.ButtonAdd}
   

      >
      <FontAwesome name="plus-circle" size={55} color="green" />

      </TouchableOpacity>
 </View>




    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    flex:6,
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  item: {
    backgroundColor: '#b3ffb3',
    padding: 20,
    marginVertical: 4,
    borderRadius: 10,
    flexDirection:"row"
  
  },
  addInput: {
    backgroundColor: "#f2f2f2",
    width: "90%",
    borderRadius:20,
    borderWidth:1,
    borderColor:"#d9d9d9",
    height:35,
   

  },
  ButtonAdd: {

    marginLeft:5,

  },
  ButtonDelete:{
    flex:0
    

  },
  addPanel: {
    flexDirection:"row",
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
