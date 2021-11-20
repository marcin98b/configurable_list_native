import * as React from 'react';
import {useRef} from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Alert, RefreshControl, Button} from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import {API_URL, getToken, setToken} from "../../api/env";
import { FontAwesome } from '@expo/vector-icons';
import {Keyboard} from 'react-native'
import { showMessage, hideMessage } from "react-native-flash-message";

//network
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
export default function TabShopScreen({ navigation }: RootTabScreenProps<'TabList'>) {
 
  const [refreshing, setRefreshing] = useState(false);
  const [shopName, setName] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);


//Odswiezanie sklepow
const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const onRefresh = React.useCallback(() => {
  setRefreshing(true);
  wait(500).then(() => 
  {
  setRefreshing(false);
  getShops();

  });
}, []);


//FUNKCJA WCZYTUJĄCA SKLEPY
  const getShops = async () => {
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

     const response = await fetch(API_URL + '/shops', options);
     const json = await response.json();
     setData(json);
   } catch (error) {
     console.error(error);
   } finally {
     setLoading(false);
   }
 }


//FUNKCJA DODAJĄCA NOWY SKLEP
 const AddShop = async (shopName) => {
  try {

  const token = await getToken();
  const options = {
    method: 'POST',
    body: JSON.stringify({
      name:shopName
    }),
    headers: {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization': 'Bearer '+token
      
    },

  }

   const response = await fetch(API_URL + '/shops/create', options);
 } catch (error) {
   console.error(error);
 } finally {
   getShops();
   showMessage({
    message: 'Pomyślnie dodano sklep "'+shopName+'"!',
    type:"success",
    icon:"success"
   });
   setLoading(false);
 }
}

//FUNKCJA USUWAJĄCĄ SKLEP O DANYM ID
const DeleteShop = async (shopId) => {
  try {

  const token = await getToken();
  const options = {
    method: 'DELETE',
    body: JSON.stringify({
      id:shopId
    }),
    headers: {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization': 'Bearer '+token
      
    },

  }

   const response = await fetch(API_URL + '/shops/'+shopId, options);
 } catch (error) {
   console.error(error);
 } finally {
   getShops();
   showMessage({
    message: "Pomyślnie usunięto sklep!",
    type:"info",
    icon:"success"
   });
   setLoading(false);
 }
}



 useEffect(() => {
   getShops();
 }, []);



 //GRAFICZNY KOMPONENT LISTY
 const Item = ({ id,title}) => (
  <TouchableOpacity
  onPress={() => navigation.navigate('GetShop', {shopId: id.toString(), name:title})}
  >
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>

{/* BUTTON EDIT */}
    <TouchableOpacity
      onPress={() => 

         navigation.navigate('EditShop', 
         {shopId: id.toString(), 
          name:title, 
         })
     
        }
        style={styles.ButtonEdit}
   
      >
      <FontAwesome name="edit" size={32} color="orange" />

      </TouchableOpacity>
{/* BUTTON DELETE */}
      <TouchableOpacity
      onPress={() => {
        
        Alert.alert('Usunięcie sklepu', 'Potwierdź usunięcie sklepu: "' +title+'".',
        [
          {
            text: "Usuń",
            onPress: () => DeleteShop(id)
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
            placeholder="Dodaj sklep ..."
            onChangeText={shopName => setName(shopName)}
            defaultValue={shopName} 
            onSubmitEditing= {() => {
              AddShop(shopName); 
              setName('');
              Keyboard.dismiss();
              
            }}        
    />
          <TouchableOpacity
          disabled = { shopName ? false : true }
          onPress={() => {
            AddShop(shopName); 
            setName('');
            Keyboard.dismiss();
            
          }}   
          style={styles.ButtonAdd}
      

          >
          <FontAwesome name="plus-circle" size={55} color={shopName ? "green" : "gray"} />

          </TouchableOpacity>
    </View>



      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          extraData={shopName}
          ListEmptyComponent={<Text>Brak sklepów!</Text>}
          refreshControl={
            <RefreshControl
              enabled={true}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
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
