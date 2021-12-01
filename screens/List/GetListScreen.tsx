import * as React from 'react';
import { StyleSheet, TouchableOpacity, TextInput, RefreshControl, Keyboard, Alert, Animated, Touchable } from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import {API_URL, getToken, setToken} from "../../api/env";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Autocomplete from 'react-native-autocomplete-input';
import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SectionList } from 'react-native';
import { showMessage, hideMessage } from "react-native-flash-message";
import {Picker} from '@react-native-picker/picker';
import _ from 'lodash';

export default function GetListScreen({ route, navigation }: RootTabScreenProps<'TabList'>) {
 
  const [refreshing, setRefreshing] = useState(false);
  const {listId, shopId}:any  = route.params;
  const [isLoading, setLoading] = useState(true);
  const [productData, setProductData] : any = useState([]);
  const [categoryData, setCategoryData] : any = useState([]);
  const [customProductData, setCustomProductData] : any = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
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
     //console.log(json);
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
      setProductData(newJson);
     }
     else // Single Object
     {
       if(json === typeof(undefined)) setProductData(['']);
       else
       {
        let newJson = JSON.stringify(json);
        newJson = newJson.replace("name", "title");
        newJson = newJson.replace("products", "data");   
        newJson = "[" + newJson + "];";
        newJson = JSON.parse(newJson);
        setProductData(newJson);
       }

     }
     //console.log( newJson );

 

   } catch (error) {
     console.error(error);
   } finally {
     setLoading(false);
   }
 }

//FUNKCJA WCZYTUJĄCA LISTY DANEGO SKLEPU
const getCategories = async (shop_id) => {
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

   const response = await fetch(API_URL + '/shops/' +shop_id + '/categories', options);
   const json = await response.json();
   setCategoryData(json);
   if(Array.isArray(json) && json.length) setSelectedCategory(json[0].id);
 } catch (error) {
   console.error(error);
 } 
}

const getCustomProducts = async () => {
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
   setCustomProductData(json.map( s => s.name ));
 } catch (error) {
   console.error(error);
 } finally {
   setLoading(false);
 }
}



//FUNKCJA DODAJĄCY NOWY PRODUKT
const AddProduct = async (listId, productName, shop_category_id) => {
  try {

  const token = await getToken();
  const options = {
    method: 'POST',
    body: JSON.stringify({
      name:productName,
      shop_category_id: shop_category_id
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
    finally {
      getProducts(); //tickedState
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
   shopId != '' ? getCategories(shopId): null;
   getCustomProducts();
   getProducts();
 }, []);


 //Komponent listy

 const Item = ({ id,title, ticked, custom_product_id}) => (


  <View style={ticked ? styles.itemChecked: styles.item}>


    <BouncyCheckbox
      size={30}
      fillColor="green"
      isChecked={ticked}
      unfillColor="#FFFFFF"
      iconStyle={{ borderColor: "white" }}
      onPress={() => {TickProduct(id, ticked); ticked = !ticked }}
    />

      {custom_product_id ?
            (
            <TouchableOpacity 
                    style={{ flexDirection:'row-reverse', flex:1}}
                    onPress = {() => navigation.navigate('GetCustomProduct', {productId:custom_product_id})}
            >
                <Text style={[styles.title,{color:'blue', textDecorationLine:"underline"}]}>{title}</Text>
            </TouchableOpacity>
            )
          :
            <Text style={styles.title}>{title}</Text>
      }


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
        ticked={item.ticked}
        custom_product_id={item.custom_product_id}      
  />
);


  return (

    <View style={styles.container}>

      <View style={styles.addPanel}>


                {shopId === '' ? null : (
                  <>
                  <View style={[styles.Picker]}>
                  <Picker
                  style={{transform: [{scaleX: 0.85}, {scaleY: 0.85}],}}
                  selectedValue={selectedCategory}
                  onValueChange={(itemValue) =>
                    setSelectedCategory(itemValue)
                  }
                  
                  >
                  {categoryData.map((cat, id) => {
                    return (
                      <Picker.Item label={cat.name} key={cat.id.toString()} value={cat.id.toString()} />

                    );

                  })}
                      <Picker.Item label="[Brak]" value="" />
                  </Picker>
                  </View>
                </>
              )}


          <TextInput
                  style={shopId === '' ? styles.addInput : styles.addInputWithCategory}
                  placeholder="Dodaj produkt ..."
                  onChangeText={productName => setName(productName)}
                  defaultValue={productName} 
                  onSubmitEditing= {() => {
                    AddProduct(listId, productName, selectedCategory); 
                    setName('');
                    //Keyboard.dismiss();
                    
                  }}        
          />
                <TouchableOpacity
                disabled = { productName ? false : true }
                onPress={() => {
                  AddProduct(listId, productName, selectedCategory); 
                  setName('');
                 // Keyboard.dismiss();
                  
                }}   
                style={shopId === '' ? styles.ButtonAdd : styles.ButtonAddWithCategory}
            

                >
                <FontAwesome name="plus-circle" size={55} color={productName ? "blue" : "gray"} />

                </TouchableOpacity>



          </View>




      {isLoading ? <ActivityIndicator/> : (
            <SectionList
            sections={productData}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={renderItem}
            renderSectionHeader={
                  ({ section: { data, title } }) => (
                    data.length > 0 ? 
              <Text style={styles.sectionTitle}>{title}</Text>
              :null
              )
            }
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
    backgroundColor: '#ffcccc',
    padding: 10,
    marginVertical: 4,
    borderRadius: 10,
    borderWidth:2,
    borderColor:"red"
  
  },
  itemChecked: {
    flexDirection:'row',
    backgroundColor: '#ccffcc',
    padding: 10,
    marginVertical: 4,
    borderRadius: 10,
    borderWidth:2,
    borderColor:"green"
  
  },
  addInput: {
    backgroundColor: "#FAFAFA",
    paddingLeft:15,
    width: "100%",
    borderRadius:20,
    borderWidth:1,
    borderColor:"#d9d9d9",
    height:55,
    marginBottom:-15
   

  },
  ButtonAdd: {

    marginLeft:5,
    position: 'absolute',
    right: 12,
    bottom:0
  },
  ButtonDelete:{
    right:5
    
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
  sectionTitle: {
    fontWeight:'bold', 
    paddingLeft:20,
    paddingTop:15, 
    fontSize:18

  },
  addInputWithCategory: {
    flex:4,
    backgroundColor: "#FAFAFA",
    paddingLeft:15,
    borderBottomRightRadius:20,
    borderTopRightRadius:20,
    borderWidth:1,
    borderLeftWidth:0,
    borderColor:"#d9d9d9",
    height:55,
    marginBottom:-15,
    zIndex:1

   

  },
  ButtonAddWithCategory: {

    marginLeft:5,
    position: 'absolute',
    right: 12,
    bottom:0,
    zIndex:2
  },
  Picker: {
    flex:3,
    backgroundColor: "#FAFAFA",
    paddingTop:15,
    borderBottomLeftRadius:20,
    borderTopLeftRadius:20,
    borderWidth:1,
    borderColor:"#d9d9d9",
    height:55,
    marginBottom:-15
    
  
  },

});
