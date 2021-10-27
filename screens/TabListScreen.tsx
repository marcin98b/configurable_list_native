import * as React from 'react';
import {useRef} from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Alert, Button} from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import {API_URL, getToken, setToken} from "../api/env";
import { FontAwesome } from '@expo/vector-icons';
import {Keyboard} from 'react-native'

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

//FUNKCJA WCZYTUJĄCA LISTY
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


//FUNKCJA DODAJĄCA NOWĄ LISTĘ
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
   setLoading(false);
 }
}

//FUNKCJA USUWAJĄCĄ LISTĘ O DANYM ID
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

//FUNKCJA DUPLIKUJĄCĄ LISTĘ O DANYM ID
const DuplicateList = async (listId) => {
  try {

  const token = await getToken();
  const options = {
    method: 'POST',
    // body: 
    headers: {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization': 'Bearer '+token
      
    },

  }

   const response = await fetch(API_URL + '/lists/'+ listId + '/duplicate', options);
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



 //GRAFICZNY KOMPONENT LISTY
 const Item = ({ id,title }) => (
  <TouchableOpacity
  onPress={() => navigation.navigate('GetList', {listId: id, name:title})}
  >
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>


{/* BUTTON DUPLICATE */}
<TouchableOpacity
      onPress={() => {
      
        Alert.alert('Duplikacja listy', 'Czy chcesz zduplikować listę: "' +title+'".',
        [
          {
            text: "Tak",
            onPress: () => DuplicateList(id)
          },
          { text: "Nie", onPress: () => console.log('Anulowano')}
        ]
        )

        }}   
      style={styles.ButtonDuplicate}
   
      >
      <FontAwesome name="files-o" size={28} color="green" />

      </TouchableOpacity>


{/* BUTTON EDIT */}
    <TouchableOpacity
      onPress={() => {

        }}   
      style={styles.ButtonEdit}
   
      >
      <FontAwesome name="edit" size={32} color="orange" />

      </TouchableOpacity>
{/* BUTTON DELETE */}
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



//RENDER
const renderItem = ({ item }) => (
  <Item title={item.name} id={item.id} />
);

//VIEW
  return (
    <View style={styles.container}>


<View style={styles.addPanel}>
<TextInput
        style={styles.addInput}
        placeholder="Dodaj listę ..."
        onChangeText={listName => setName(listName)}
        defaultValue={listName}       
 />
      <TouchableOpacity
      disabled = { listName ? '' : true }
      onPress={() => {
        AddList(listName); 
        setName('');
        Keyboard.dismiss();
      }}   
      style={styles.ButtonAdd}
   

      >
      <FontAwesome name="plus-circle" size={55} color={listName ? "green" : "gray"} />

      </TouchableOpacity>
 </View>



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





    </View>
    
  );
}

//STYLE
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
    backgroundColor: '#F0F0F0',
    padding: 20,
    marginVertical: 4,
    borderRadius: 10,
    borderColor: '#CCCCCC',
    borderWidth: 2,
    flexDirection:"row"
  
  },
  addInput: {
    backgroundColor: "#FAFAFA",
    paddingLeft:15,
    width: "100%",
    borderRadius:20,
    borderWidth:1,
    borderColor:"#d9d9d9",
    height:55,
   

  },
  ButtonAdd: {

    marginLeft:5,
    position: 'absolute',
    right: 12,
    bottom:15
  },
  ButtonDelete:{
   
    flex:0
    
  },
  ButtonEdit:{
    
    paddingRight:5,
    position:"relative",
    top:2,

  },
  ButtonDuplicate:{
    
    position:"relative",
    top:2,
    paddingRight:8,
    

  },
  addPanel: {
    flexDirection:"row",
    paddingTop:5,
    paddingBottom:15,
    paddingLeft:15,
    paddingRight:15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
