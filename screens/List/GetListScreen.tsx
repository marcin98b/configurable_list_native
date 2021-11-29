import * as React from 'react';
import { StyleSheet, TouchableOpacity, TextInput, RefreshControl, Keyboard, Alert, Animated } from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import {API_URL, getToken, setToken} from "../../api/env";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { FontAwesome } from '@expo/vector-icons';
//network
import { useEffect, useState } from 'react';
import { ActivityIndicator, SectionList } from 'react-native';
import { showMessage, hideMessage } from "react-native-flash-message";
import _ from 'lodash';


export default function GetListScreen({ route, navigation }: RootTabScreenProps<'TabList'>) {
 
  const [refreshing, setRefreshing] = useState(false);
  const {listId}:any  = route.params;
  const [isLoading, setLoading] = useState(true);
  const [data, setData] : any = useState([]);
  const [productName, setName] = useState('');


//Odswiezanie produktow
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(500).then(() => 
    {
    setRefreshing(false);
    getProducts();

    });
  }, []);


//FUNKCJA POBIERAJĄCA PRODUKTY
  const getProducts = async () => {
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

     const response = await fetch(API_URL + '/lists/' + listId + '/products', options);
     const json = await response.json();

     //przeksztalcenie danych do postaci
     // [
     //    'title': '',
     //    'data': []
     // ]
     console.log(json);
     let newJson : string[] = [];

     if(Array.isArray(json)) //Array of Objects
     {
      json.map( item => {
          newJson.push(
              _.mapKeys( item, ( value, key ) => {
                  let newKey = key;
                  if( key === 'name' )
                      newKey = 'title';
                      
                  if( key === 'products' )
                      newKey = 'data';
      
                  return newKey;
              })
          )
      });
      setData(newJson);
     }
     else // Single Object
     {
        let newJson = JSON.stringify(json);
        newJson = newJson.replace("name", "title");
        newJson = newJson.replace("products", "data");   
        newJson = "[" + newJson + "];";
        newJson = JSON.parse(newJson);
        setData(newJson);
     }
     //console.log( newJson );

 

   } catch (error) {
     console.error(error);
   } finally {
     setLoading(false);
   }
 }

//FUNKCJA DODAJĄCY NOWY PRODUKT
const AddProduct = async (listId, productName) => {
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

   const response = await fetch(API_URL + '/lists/' + listId + '/addproduct', options);
 } catch (error) {
   console.error(error);
 } finally {
   getProducts();
   showMessage({
    message: 'Pomyślnie dodano produkt "'+productName+'"!',
    type:"success",
    icon:"success"
   });
   setLoading(false);
 }
}



 const TickProduct = async (product_id, tickState) => {
  try {

    const token = await getToken();
    const urlencoded = new URLSearchParams();  
    const options = {
      method: 'PUT',
      body: JSON.stringify({
        ticked: !tickState
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/json',
        'Authorization': 'Bearer '+token
        
      },

    }

     const response = await fetch(API_URL + '/lists/' + listId + '/products/' + product_id, options);
   } catch (error) {
     console.error(error);

  
 }

}

//FUNKCJA USUWAJĄCĄ LISTĘ O DANYM ID
const DeleteProduct = async (listId, productId) => {
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

   const response = await fetch(API_URL + '/lists/'+listId+'/products/'+productId, options);
 } catch (error) {
   console.error(error);
 } finally {
   getProducts();
   showMessage({
    message: "Pomyślnie usunięto produkt",
    type:"info",
    icon:"success"
   });
   setLoading(false);
 }
}



 useEffect(() => {
   getProducts();
 }, []);


 //Komponent listy

 const Item = ({ id,title, ticked}) => (


  <View style={[styles.item, {
    flexDirection: "row"
  }]}>


    <BouncyCheckbox
      size={30}
      fillColor="blue"
      isChecked={ticked}
      unfillColor="#FFFFFF"
      iconStyle={{ borderColor: "white" }}
      onPress={() => {TickProduct(id, ticked); ticked = !ticked }}
    />

        <Text style={styles.title}>{title}</Text>

{/* BUTTON DELETE */}
<TouchableOpacity
      onPress={() => { DeleteProduct(listId, id) }}   
      style={styles.ButtonDelete}
   
      >
      <FontAwesome name="remove" size={32} color="red" />

      </TouchableOpacity>

  </View>

);

const renderItem = ({ item }) => (
  <Item title={item.name}
        id={item.id} 
        ticked={item.ticked} />
);


  return (

    <View style={styles.container}>

      <View style={styles.addPanel}>
          <TextInput
                  style={styles.addInput}
                  placeholder="Dodaj produkt ..."
                  onChangeText={productName => setName(productName)}
                  defaultValue={productName} 
                  onSubmitEditing= {() => {
                    AddProduct(listId, productName); 
                    setName('');
                    //Keyboard.dismiss();
                    
                  }}        
          />
                <TouchableOpacity
                disabled = { productName ? false : true }
                onPress={() => {
                  AddProduct(listId, productName); 
                  setName('');
                 // Keyboard.dismiss();
                  
                }}   
                style={styles.ButtonAdd}
            

                >
                <FontAwesome name="plus-circle" size={55} color={productName ? "blue" : "gray"} />

                </TouchableOpacity>
          </View>

      {isLoading ? <ActivityIndicator/> : (
            <SectionList
            sections={data}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            renderSectionHeader={({ section: { title } }) => (
              <Text>{title}</Text>
            )}
          />


        // <>
        // </>

        // <FlatList
        //   data={data}
        //   renderItem={renderItem}
        //   keyExtractor={item => item.id.toString()}
        //   ListEmptyComponent={<Text>Brak produktow!</Text>}
        //   refreshControl={
        //     <RefreshControl
        //       enabled={true}
        //       refreshing={refreshing}
        //       onRefresh={onRefresh}
        //     />
        //   }
        // />
      )} 


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
    fontSize: 20,
    fontWeight: 'bold',
    flexDirection:'row-reverse',
    flex:1
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  item: {
    flexDirection:'row',
    backgroundColor: '#e6e6ff',
    padding: 20,
    marginVertical: 4,
    borderRadius: 10,
    borderWidth:2,
    borderColor:"#E1E1FF"
  
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
