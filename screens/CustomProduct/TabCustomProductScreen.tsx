import * as React from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Alert, RefreshControl, Image, Button} from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import {API_URL, getToken, setToken} from "../../api/env";
import { FontAwesome } from '@expo/vector-icons';
import {Keyboard} from 'react-native'
import { showMessage, hideMessage } from "react-native-flash-message";


import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';

export default function TabCustomProductScreen({ navigation }: RootTabScreenProps<'TabList'>) {
 
  const [refreshing, setRefreshing] = useState(false);
  const [productName, setName] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);


//Odswiezanie produktow
const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const onRefresh = React.useCallback(() => {
  setRefreshing(true);
  wait(500).then(() => 
  {
  setRefreshing(false);
  GetProducts();

  });
}, []);


//FUNKCJA WCZYTUJĄCA PRODUKTY
  const GetProducts = async () => {
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

     const response = await fetch(API_URL + '/customProducts', options);
     const json = await response.json();
     setData(json);
   } catch (error) {
     console.error(error);
   } finally {
     setLoading(false);
   }
 }


//FUNKCJA DODAJĄCA NOWY PRODUKT
 const AddProduct = async (productName) => {
  try {

  const token = await getToken();
  const options = {
    method: 'POST',
    body: JSON.stringify({
      name:productName
    }),
    headers: {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization': 'Bearer '+token
      
    },

  }

   const response = await fetch(API_URL + '/customProducts/create', options);
 } catch (error) {
   console.error(error);
 } finally {
   GetProducts();
   showMessage({
    message: 'Pomyślnie dodano produkt "'+productName+'"!',
    type:"success",
    icon:"success"
   });
   setLoading(false);
 }
}

//FUNKCJA USUWAJĄCĄ PRZEDMIOT
const DeleteProduct = async (productId) => {
  try {

  const token = await getToken();
  const options = {
    method: 'DELETE',
    body: JSON.stringify({
      id:productId
    }),
    headers: {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization': 'Bearer '+token
      
    },

  }

   const response = await fetch(API_URL + '/customProducts/'+productId, options);
 } catch (error) {
   console.error(error);
 } finally {
   GetProducts();
   showMessage({
    message: "Pomyślnie usunięto produkt!",
    type:"info",
    icon:"success"
   });
   setLoading(false);
 }
}



 useEffect(() => {
   GetProducts();
 }, []);



 //GRAFICZNY KOMPONENT LISTY
 const Item = ({ id,name, description, img_filepath, share_key}) => (
  <TouchableOpacity
  onPress={() => navigation.navigate('GetCustomProduct', 
  {productId: id.toString() })
  
  
  
}
>
    
  <View style={styles.item}>

      <Image
            style={styles.productImage}
            defaultSource={require('../../assets/images/Blank.png')}
            source={img_filepath
              ? {uri: 'https://listak.pl/storage/'+img_filepath}                      
              : require('../../assets/images/Blank.png')} 
      />

    <Text style={styles.title}>{name}</Text>

{/* BUTTON EDIT */}
    <TouchableOpacity
      onPress={() => 

         navigation.navigate('EditCustomProduct', 
         {productId: id.toString(), 
          name:name, 
          description:description,
          img_filepath: typeof img_filepath === 'string' ? img_filepath.toString() : '',
          share_key: typeof share_key === 'string' ? share_key.toString() : '',
         })
     
        }
        style={styles.ButtonEdit}
   
      >
      <FontAwesome name="edit" size={32} color="orange" />

      </TouchableOpacity>
{/* BUTTON DELETE */}
      <TouchableOpacity
      onPress={() => {
        
        Alert.alert('Usunięcie produktu', 'Potwierdź usunięcie produktu: "' +name+'".',
        [
          {
            text: "Usuń",
            onPress: () => DeleteProduct(id)
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
  <Item
       name={item.name}
       id={item.id}
       img_filepath={item.img_filepath} 
       description={item.description}
       share_key={item.share_key}
       />
);

//VIEW
  return (
    <View style={styles.container}>


    <View style={styles.addPanel}>
    <TextInput
            style={styles.addInput}
            placeholder="Dodaj produkt ..."
            onChangeText={productName => setName(productName)}
            defaultValue={productName} 
            onSubmitEditing= {() => {
              AddProduct(productName); 
              setName('');
              Keyboard.dismiss();
              
            }}        
    />
          <TouchableOpacity
          disabled = { productName ? false : true }
          onPress={() => {
            AddProduct(productName); 
            setName('');
            Keyboard.dismiss();
            
          }}   
          style={styles.ButtonAdd}
      

          >
          <FontAwesome name="plus-circle" size={55} color={productName ? "green" : "gray"} />

          </TouchableOpacity>
    </View>



      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          extraData={productName}
          ListEmptyComponent={<Text>Brak produktów!</Text>}
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
  },
  title: {
    flex:1,
    paddingLeft:15,
    paddingTop:15,
    fontSize: 20,
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: '#F0F0F0',
    padding: 0,
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
    flex:0,
    paddingRight:20,
    paddingTop:15
    
  },
  ButtonEdit:{
    top:2,
    paddingTop:15,
    paddingRight:5

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

  productImage: {
    borderRadius: 10,
    width: 90,
    height:70


  }
});
