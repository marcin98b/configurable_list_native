import * as React from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Keyboard, Alert, Animated, Touchable, Image, Clipboard } from 'react-native';
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

export default function EditCustomProductScreen({ route, navigation }: RootTabScreenProps<'TabList'>) {
 
  const {productId, name, description, share_key, img_filepath}:any  = route.params;
  const [isShareKey, setShareKey]:any = useState(share_key);
  const [productName, setProductName]:any = useState(name);
  const [productDescription, setProductDescription]:any = useState(description);
  const [ImagePath, setImagePath]:any = useState(img_filepath);


//share
const shareCustomProduct = async (product_id) => {
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

     const response = await fetch(API_URL + '/customProducts/' + product_id, options);
     const data = await response.json();
     setShareKey(data.share_key);

   } catch (error) {
     console.error(error);
    }


}

//Edytuj dane
const EditCustomProduct = async (product_id, name, description) => {
  try {

    const token = await getToken();
    const urlencoded = new URLSearchParams();  
    const options = {
      method: 'PUT',
      body: JSON.stringify({
        name: name,
        description:description
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/json',
        'Authorization': 'Bearer '+token
        
      },

    }

     const response = await fetch(API_URL + '/customProducts/' + product_id, options);
   } catch (error) {
     console.error(error);
    }
    finally {

      navigation.replace('Root', {screen:"TabCustomProduct"});

    }

}

  return (
    <View style={styles.container}>


      <>

      <View style={styles.productHeader}>
        
                <Image
                style={styles.productImage}
                defaultSource={require('../../assets/images/Blank.png')}
                source={img_filepath
                        ? {uri: 'https://listak.pl/storage/'+img_filepath}                      
                        : require('../../assets/images/Blank.png')} 
                />
            </View>


        <Text >Nazwa  produktu:</Text>
        <TextInput
          style={styles.TextInput}
          placeholder="Podaj nazwę produktu ..."
          onChangeText={productName => setProductName(productName)}
          value={productName}  
        />
     
        <Text   style={{paddingTop: 5, }} >Opis:</Text>
        <TextInput
          multiline
          numberOfLines={10}
          style={[styles.TextInput, {height:80, textAlignVertical: "top" }]}
          placeholder="Opisz swój produkt ..."
          onChangeText={description => setProductDescription(description)}
          value={productDescription}  
        />

        
        <View style = {styles.ShareView}>
            <Text  style={{paddingTop: 5, }} >Udostępnij: </Text>
                <BouncyCheckbox
                  style={{paddingTop:3, paddingLeft:5}}
                  size={24}
                  fillColor="green"
                  isChecked={share_key != ''}
                  unfillColor="#ffffff"
                  iconStyle={{ borderColor: "gray" }}
                  onPress={() => {shareCustomProduct(productId); }}
                />


                  
        </View>
     
     {isShareKey ? (

      <>

      <TouchableOpacity
      onPress={() => { 
        Clipboard.setString('listak.pl/customProducts/shared/'+isShareKey); 
        showMessage({
          message: 'Skopiowano adres URL listy do schowka!',
          type:"success",
          icon:"success"
        });
      }}

      >

        <TextInput
        style={styles.TextInputShare}
        value={'listak.pl/customProducts/shared/'+isShareKey}   
        editable={false}  
          
       />
      </TouchableOpacity>
      </>
      ) : <View style={{    height:55, padding:15,}}></View> }


        <TouchableOpacity
      onPress={() => EditCustomProduct(productId,productName, productDescription)}
      style={styles.Button}


      >
        <Text style={styles.ButtonText}>
            Edytuj produkt
        </Text>

      </TouchableOpacity>

      </>


    </View>

  );

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,

  },
  ShareView: {
    paddingTop:15,
    paddingBottom:5,
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
    color:"blue",
    fontWeight:'bold',
    backgroundColor: "#FAFAFA",
    width:"100%",
    borderRadius:5,
    borderWidth:1,
    borderColor:"#d9d9d9",
    height:55,
    padding:15,
    textAlign: 'left',
    fontSize:12

  },
  productHeader: {
    
    alignItems: 'center',

  },

  productImage: {

    borderRadius: 100,
    borderWidth:1,
    width: 120,
    height:120,
    borderColor: '#CCCCCC',

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
