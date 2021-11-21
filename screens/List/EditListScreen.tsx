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

export default function EditListScreen({ route, navigation }: RootTabScreenProps<'TabList'>) {
 
  const {listId, shopId, shareKey}:any  = route.params;
  const [isLoading, setLoading] = useState(true);
  const [listData, setListData]:any = useState([]);
  const [shopData, setShopData]:any = useState([]);
  const [isShareKey, setShareKey]:any = useState(shareKey);
  const [selectedShop, setSelectedShop] = useState(shopId);
  const [listName, setListName]:any = useState('');

//FUNKCJA POBIERAJĄCA LISTĘ
  const getList = async () => {
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

     const response = await fetch(API_URL + '/lists/' + listId , options);
     const json = await response.json();
     setListData(json);
     setListName(json.name);
   } catch (error) {
     console.error(error);
   } finally {
     
     //setLoading(false);
   }
 }

 //Pobranie sklepów użytkownika
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
   setShopData(json);
 } catch (error) {
   console.error(error);
 } finally {
   setLoading(false);
 }
}

//share
const shareProduct = async (list_id) => {
  try {

    var random;

    if(isShareKey)
      random = '';
    else
      random = (Math.random()*1e24).toString(36);

    const token = await getToken();
    const urlencoded = new URLSearchParams();  
    const options = {
      method: 'PUT',
      body: JSON.stringify({
        share_key: random
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/json',
        'Authorization': 'Bearer '+token
        
      },

    }

     const response = await fetch(API_URL + '/lists/' + listId, options);
     setShareKey(random);
   } catch (error) {
     console.error(error);
    }


}

//Edytuj dane
const EditList = async (list_id) => {
  try {

    const token = await getToken();
    const urlencoded = new URLSearchParams();  
    const options = {
      method: 'PUT',
      body: JSON.stringify({
        name: listName,
        shop_id:selectedShop
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/json',
        'Authorization': 'Bearer '+token
        
      },

    }

     const response = await fetch(API_URL + '/lists/' + listId, options);
   } catch (error) {
     console.error(error);
    }
    finally {

      navigation.replace('Root');

    }

}


 useEffect(() => {
 
   getList();
   getShops();

 }, []);



  return (
    <View style={styles.container}>

    {isLoading ? (

      <Text>Ładowanie</Text>

    ) : (

      <>
        <Text >Nazwa listy:</Text>
        <TextInput
          style={styles.TextInput}
          placeholder="Podaj nazwę listy ..."
          onChangeText={listName => setListName(listName)}
          value={listName}  
          //defaultValue={listData.name}     
        />

        <Text style={{paddingTop: 15}} >Sklep:</Text>

        <Picker
          selectedValue={selectedShop}
          onValueChange={(itemValue) =>
            setSelectedShop(itemValue)
          }
          style={styles.Picker}
          >
         <Picker.Item label="[Brak przypisania]" value="" />
          {shopData.map((shop, id) => {
            return (
              <Picker.Item label={shop.name} key={shop.id.toString()} value={shop.id.toString()} />

            );

          })}

        </Picker>
        
        <View style = {styles.ShareView}>
            <Text  style={{paddingTop: 5, }} >Udostępnij: </Text>
                <BouncyCheckbox
                  style={{paddingTop:15, left:22, top:35, position:'absolute'}}
                  size={24}
                  fillColor="green"
                  isChecked={shareKey != ''}
                  unfillColor="#ffffff"
                  iconStyle={{ borderColor: "gray" }}
                  onPress={() => {shareProduct(listData.id); }}
                />

                {isShareKey ? (

                <>
                
                <TouchableOpacity
                onPress={() => { 
                  Clipboard.setString('listak.pl/lists/shared/'+isShareKey); 
                  showMessage({
                    message: 'Skopiowano adres URL listy do schowka!',
                    type:"success",
                    icon:"success"
                   });
                }}

                >

                  <TextInput
                  style={styles.TextInputShare}
                  value={'listak.pl/lists/shared/'+isShareKey}   
                  editable={false}  
                    
                />
                </TouchableOpacity>
               </>
                ) : null }
                  
        </View>

        <TouchableOpacity
      onPress={() => EditList(listId)}
      style={styles.Button}


      >
        <Text style={styles.ButtonText}>
            Edytuj listę
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

    backgroundColor: "#FAFAFA",
    width: "100%",
    borderRadius:5,
    borderWidth:1,
    borderColor:"#d9d9d9",
    height:55,
    padding:15

  },
  TextInputShare: {
    color:"black",
    backgroundColor: "#FAFAFA",
    width:"100%",
    borderRadius:5,
    borderWidth:1,
    borderColor:"#d9d9d9",
    height:55,
    padding:15,
    textAlign: 'left',

  },
  Picker: {

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
});
