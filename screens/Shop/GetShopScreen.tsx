import * as React from 'react';
import {useRef} from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Alert, RefreshControl, Button} from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import {API_URL, getToken, setToken} from "../../api/env";
import { FontAwesome } from '@expo/vector-icons';
import {Keyboard} from 'react-native'
import { HeaderBackButton } from '@react-navigation/elements';
import { showMessage, hideMessage } from "react-native-flash-message";
import moment from "moment";
import 'moment/locale/pl';
//network
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
export default function GetShopScreen({ route, navigation }: RootTabScreenProps<'TabList'>) {
 
  const [refreshing, setRefreshing] = useState(false);
  const {shopId, name}:any  = route.params;
  const [listName, setName] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

//Odswiezanie list
const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const onRefresh = React.useCallback(() => {
  setRefreshing(true);
  wait(500).then(() => 
  {
  setRefreshing(false);
  getLists(shopId);

  });
}, []);
  
//FUNKCJA WCZYTUJĄCA LISTY DANEGO SKLEPU
  const getLists = async (shop_id) => {
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

     const response = await fetch(API_URL + '/shops/' +shop_id + '/lists', options);
     const json = await response.json();
     setData(json);
   } catch (error) {
     console.error(error);
   } finally {
     setLoading(false);
   }
 }


//FUNKCJA DODAJĄCA NOWĄ LISTĘ DO SKLEPU
 const AddList = async (listName, shop_id) => {
  try {

  const token = await getToken();
  const options = {
    method: 'POST',
    body: JSON.stringify({
      name:listName,
      shop_id:shop_id
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
   getLists(shop_id);
   showMessage({
    message: 'Pomyślnie dodano listę "'+listName+'" dla sklepu!',
    type:"success",
    icon:"success"
   });
   setLoading(false);
 }
}

//FUNKCJA USUWAJĄCĄ LISTĘ O DANYM ID
const DeleteList = async (listId) => {
  try {

  const token = await getToken();
  const options = {
    method: 'DELETE',
    body: JSON.stringify({
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
   getLists(shopId);
   showMessage({
    message: "Pomyślnie usunięto listę!",
    type:"info",
    icon:"success"
   });
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
   getLists(shopId);
   showMessage({
    message: "Pomyślnie zduplikowano listę!",
    type:"success",
    icon:"success"
   });
   setLoading(false);
 }
}

 useEffect(() => {
   getLists(shopId);

   navigation.setOptions({
    headerLeft: () => (

      <HeaderBackButton
        style={{marginLeft:-4,marginRight:30}}
      onPress={() => {
        navigation.replace('Root', {screen:"TabShop"});
      }}
    />

    )
  });

 }, []);



 //GRAFICZNY KOMPONENT LISTY
 const Item = ({ id,title, shop_id, share_key, productsCounted, productsAvalaible, created_at }) => (
  <TouchableOpacity
  onPress={() => navigation.navigate('GetList', {
    listId: id.toString(), 
    shopId: typeof shop_id === 'number' ? shop_id.toString() : '',
    name:title})}
  >
  <View style={styles.item}>

    <Text style={styles.title}>{title}</Text>
    <Text style={styles.counter}>Produkty: {productsCounted} / {productsAvalaible}</Text>
    <Text style={styles.dateCreated}>{moment(created_at).locale("pl").fromNow()}</Text>



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
      onPress={() => 

         navigation.navigate('EditList', 
         {listId: id.toString(), 
          name:title, 
          shopId: typeof shop_id === 'number' ? shop_id.toString() : '',
          shareKey: typeof share_key === 'string' ? share_key.toString() : '',
         })
     
        }
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
  <Item title={item.name} 
        id={item.id} 
        shop_id={item.shop_id} 
        share_key ={item.share_key} 
        productsAvalaible={item.productsAvalaible}
        productsCounted={item.productsCounted}
        created_at={item.created_at}
  />
);

//VIEW
  return (
    <View style={styles.container}>


    <View style={styles.addPanel}>
    <TextInput
            style={styles.addInput}
            placeholder="Dodaj listę do sklepu ..."
            onChangeText={listName => setName(listName)}
            defaultValue={listName} 
            onSubmitEditing= {() => {
              AddList(listName, shopId); 
              setName('');
              Keyboard.dismiss();
              
            }}        
    />
          <TouchableOpacity
          disabled = { listName ? false : true }
          onPress={() => {
            AddList(listName, shopId); 
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
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          extraData={listName}
          ListEmptyComponent={<Text>Brak list!</Text>}
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
  )


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
    bottom:10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  counter: {
    position:'absolute',
    top:35,
    left:20,
    color:"gray",
    fontSize:14
  },
  dateCreated: {
    position:'absolute',
    top:55,
    left:'40%',
    color:"gray",
    fontSize:12

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
