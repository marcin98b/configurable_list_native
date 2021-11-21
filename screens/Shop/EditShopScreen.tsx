import * as React from 'react';
import { StyleSheet, LogBox, ScrollView, TouchableOpacity, TextInput, Keyboard, Alert, Animated, Touchable, Clipboard } from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import {API_URL, getToken, setToken} from "../../api/env";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { FontAwesome } from '@expo/vector-icons';
//network
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { showMessage, hideMessage } from "react-native-flash-message";
import DraggableFlatList, {ScaleDecorator, ShadowDecorator, OpacityDecorator} from 'react-native-draggable-flatlist'

export default function EditShopScreen({ route, navigation }: RootTabScreenProps<'TabShop'>) {
 
  const {shopId, name}:any  = route.params;
  const [isLoading, setLoading] = useState(true);
  const [shopData, setShopData]:any = useState([]);
  const [shopName, setShopName]:any = useState(name);
  const [categoryName, setCategoryName]:any = useState('');
  const [categoryData, setCategoriesData]:any = useState([]);
//FUNKCJA POBIERAJĄCA SKLEP
  const getShop = async (shop_id) => {
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

     const response = await fetch(API_URL + '/shops/' + shop_id , options);
     const json = await response.json();
     setShopData(json);
   } catch (error) {
     console.error(error);
   } finally {
     
     //setLoading(false);
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
   setCategoriesData(json);
 } catch (error) {
   console.error(error);
 } finally {
   setLoading(false);
 }
}



//Edytuj dane
const EditShop = async (shop_id, shop_name) => {
  try {

    const token = await getToken();
    const urlencoded = new URLSearchParams();  
    const options = {
      method: 'PUT',
      body: JSON.stringify({
        name: shop_name,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/json',
        'Authorization': 'Bearer '+token
        
      },

    }

     const response = await fetch(API_URL + '/shops/' + shop_id, options);
   } catch (error) {
     console.error(error);
    }
    // finally {
    
    //   navigation.replace('Root', {screen:"TabShop"});

    // }

}

//Edytuj kolejnosc kategorii
const EditCategoryOrder = async (shop_id) => {
  try {

    var orderList = '';
    categoryData.map((item, i, row) => {
      if (i + 1 === row.length) {
        orderList += item.id;
      } else {
        orderList += item.id + ',';
      }
    })



    const token = await getToken();
    const urlencoded = new URLSearchParams();  
    const options = {
      method: 'POST',
      body: {},
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/json',
        'Authorization': 'Bearer '+token
        
      },

    }

     const response = await fetch(API_URL + '/shops/' + shop_id + '/categories/updatePosition/' + orderList, options);
   } catch (error) {
     console.error(error);
    }
    // finally {

    //   navigation.replace('Root', {screen:"TabShop"});

    // }

}


//Dodaj nową kategorię
const AddCategory = async (shop_id, category_Name) => {
  try {

  const token = await getToken();
  const options = {
    method: 'POST',
    body: JSON.stringify({
      name:category_Name
    }),
    headers: {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization': 'Bearer '+token
      
    },

  }

   const response = await fetch(API_URL + '/shops/' +shop_id+ '/categories/create', options);
 } catch (error) {
   console.error(error);
 } finally {
   getCategories(shop_id);
   showMessage({
    message: 'Pomyślnie dodano kategorię "'+category_Name+'"!',
    type:"success",
    icon:"success"
   });
   setLoading(false);
 }
}

//Usuń kategorię
const DeleteCategory = async (shop_id, category_id) => {
  try {

  const token = await getToken();
  const options = {
    method: 'DELETE',
    body: JSON.stringify({
      id:category_id
    }),
    headers: {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization': 'Bearer '+token
      
    },

  }

   const response = await fetch(API_URL + '/shops/'+shop_id+'/categories/'+category_id, options);
 } catch (error) {
   console.error(error);
 } finally {
   getCategories(shop_id);
   showMessage({
    message: "Pomyślnie usunięto kategorię!",
    type:"info",
    icon:"success"
   });
   setLoading(false);
 }
}


type Item = {
  id: number;
  name: string;
  order_position: number;

};

const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
  return (
    <ScaleDecorator>
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        style={[
         styles.rowItem,
      
        ]}
      >
        <Text style={{flex:1}} >{item.name}</Text>
                {/* BUTTON DELETE */}
      <TouchableOpacity
      onPress={() => {
        
        Alert.alert('Usunięcie kategorii', 'Potwierdź usunięcie kategorii: "' +item.name+'".',
        [
          {
            text: "Usuń",
            onPress: () => DeleteCategory(shopId,item.id)
          },
          { text: "Anuluj", onPress: () => console.log('Anulowano')}
        ]
        )
        
        }}   
      style={{flex:0}}
   
      >
      <FontAwesome name="remove" size={24} color="red" />

      </TouchableOpacity>
      </TouchableOpacity>
    </ScaleDecorator>
  );
};


 useEffect(() => {
  
   LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
   getShop(shopId);
   getCategories(shopId);

 }, []);



  return (
    <View style={styles.container}>

    {isLoading ? (

      <Text>Ładowanie</Text>

    ) : (

      <>
        <Text >Nazwa sklepu:</Text>
        <TextInput
          style={styles.TextInput}
          placeholder="Podaj nazwę listy ..."
          onChangeText={shopName => setShopName(shopName)}
          value={shopName}  
          //defaultValue={listData.name}     
        />

        <Text style={{paddingTop: 15}}>Edycja kategorii:</Text>


        <View style={styles.addPanel}>
    <TextInput
            style={styles.addInput}
            placeholder="Dodaj kategorię do sklepu ..."
            onChangeText={categoryName => setCategoryName(categoryName)}
            defaultValue={categoryName} 
            onSubmitEditing= {() => {
              AddCategory(shopId,categoryName); 
              setCategoryName('');
              Keyboard.dismiss();
              
            }}        
    />
          <TouchableOpacity
          disabled = { categoryName ? false : true }
          onPress={() => {
            AddCategory(shopId,categoryName); 
            setCategoryName('');
            Keyboard.dismiss();
            
          }}   
          style={styles.ButtonAdd}
      

          >
          <FontAwesome name="plus-circle" size={38} color={shopName ? "green" : "gray"} />

          </TouchableOpacity>
    </View>

    <ScrollView style={{paddingTop:5}}>
        <DraggableFlatList
              data={categoryData}
              onDragEnd={({ data }) => setCategoriesData(data)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              ListEmptyComponent={<Text style = {{textAlign:'center', paddingTop:15}}>Ten sklep nie posiada żadnych kategorii!</Text>}
            />
    </ScrollView>
      {/* <Text>
      {categoryData.map((item, i, row) => {
      if (i + 1 === row.length) {
        return item.id;
      } else {
        return item.id + ',';
      }
    })
      }
    </Text> */}

        <TouchableOpacity
      onPress={() => 
        {
          EditShop(shopId, shopName);
          EditCategoryOrder(shopId);
          navigation.replace('Root', {screen:"TabShop"});
        }
}
      style={styles.Button}


      >
        <Text style={styles.ButtonText}>
            Edytuj Sklep
        </Text>

      </TouchableOpacity>

      </>
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
  TextInput: {

    backgroundColor: "#FAFAFA",
    width: "100%",
    borderRadius:5,
    borderWidth:1,
    borderColor:"#d9d9d9",
    height:55,
    padding:15

  },
  Button: {
    position:'relative',
    left:'30%',
    marginTop:25,
    backgroundColor: "#ffe680",
    width: "40%",
    height:45,
    borderRadius: 10,
        // alignItems: 'center',
    // justifyContent: 'center',
  },

  ButtonText: {
      textAlign:"center",
      color:"black",
      paddingTop: 10,
      fontWeight: "bold",
      fontSize:18,
      

  },

  
  rowItem: {
    flexDirection:'row',
    backgroundColor: '#F0F0F0',
    padding: 10,
    marginVertical: 4,
    borderRadius: 10,
    borderColor: '#CCCCCC',
    borderWidth: 2,
    width:"70%",
    textAlign:'center',
    alignItems: 'center',
    left:60
  },
  addInput: {
    backgroundColor: "#FAFAFA",
    width: "100%",
    borderRadius:5,
    borderWidth:1,
    borderColor:"#d9d9d9",
    height:55,
    padding:15
   

  },
  ButtonAdd: {

    
    position: 'absolute',
    right: 12,
    bottom:13
  },
  addPanel: {
    flexDirection:"row",
    padding:5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
