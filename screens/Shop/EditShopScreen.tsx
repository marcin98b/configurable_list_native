import * as React from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Keyboard, Alert, Animated, Touchable, Clipboard } from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import {API_URL, getToken, setToken} from "../../api/env";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { FontAwesome } from '@expo/vector-icons';
//network
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { showMessage, hideMessage } from "react-native-flash-message";
import {Picker} from '@react-native-picker/picker';
import { NavigationHelpersContext } from '@react-navigation/native';
// nie dziala w expo - uzywanie domyslnej
//import Clipboard from '@react-native-clipboard/clipboard';

export default function EditShopScreen({ route, navigation }: RootTabScreenProps<'TabShop'>) {
 
  const {shopId, name}:any  = route.params;
  const [isLoading, setLoading] = useState(true);
  const [shopData, setShopData]:any = useState([]);
  const [shopName, setShopName]:any = useState(name);

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
    finally {

      navigation.replace('Root', {screen:"TabShop"});

    }

}


 useEffect(() => {
 
   getShop(shopId);

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

        <TouchableOpacity
      onPress={() => EditShop(shopId, shopName)}
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

  },
  ShareView: {
    paddingTop:25,
    flexDirection:'row',

  },

  TextInput: {

    backgroundColor: "#f2f2f2",
    width: "100%",
    borderRadius:5,
    borderWidth:1,
    borderColor:"#d9d9d9",
    height:55,
    padding:15

  },
  TextInputShare: {
    color:"black",
    backgroundColor: "#f2f2f2",
    width:"100%",
    borderRadius:5,
    borderWidth:1,
    borderColor:"#d9d9d9",
    height:55,
    padding:15,
    textAlign: 'left',

  },
  Picker: {

    backgroundColor: "#f2f2f2",
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
});
