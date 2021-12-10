import * as React from 'react';
import { Platform, StyleSheet, SafeAreaView, Pressable, TouchableOpacity, TextInput, Modal, Keyboard, Alert, Animated, Touchable, Image, Clipboard } from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import {API_URL, getToken, setToken} from "../../api/env";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { FontAwesome } from '@expo/vector-icons';
//network
import { useEffect, useState, useCallback } from 'react';
import { showMessage, hideMessage } from "react-native-flash-message";
import * as ImagePicker from 'expo-image-picker';


export default function EditCustomProductScreen({ route, navigation }: RootTabScreenProps<'TabList'>) {
 
  const {productId, name, description, share_key, img_filepath}:any  = route.params;
  const [isShareKey, setShareKey]:any = useState(share_key);
  const [productName, setProductName]:any = useState(name);
  const [productDescription, setProductDescription]:any = useState(description);
  const [ImagePath, setImagePath]:any = useState(img_filepath);
  //const [PhotoData, setImageData]:any = useState(null);

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

useEffect(() => {

  (async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Potrzebne uprawnienia');
      }
    }
  })();

}, []);


//Dodawanie zdjęcia - przez album
const PickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.5,
    base64:true
  });

  //console.log(result);

  if (!result.cancelled)
    UploadPhoto(result);
  else return;

};

//Dodawanie zdjęcia - przez kamerę
const PickCameraPhoto = async () => {

  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if(!permission.granted) return;
  else
  {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      base64: true

    });

    if(!result.cancelled)
      UploadPhoto(result);

  }


}

const UploadPhoto = async (result) => {

  const token = await getToken();
  let fileType = result.uri.substring(result.uri.lastIndexOf(".") + 1);
  console.log(fileType);
  let formData = new FormData();

  formData.append("image", {
    uri: result.uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`
  });

  let options = {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      'Authorization': 'Bearer '+token
    }
  };
  return await fetch(API_URL + '/customProducts/' + productId + '/upload', options)
  .then(response => response.text())
  .then(result => {
    console.log(result);
    setImagePath('products/'+ result);
    }
  )
  .catch(error => console.log('error', error));

}




  return (
    <View style={styles.container}>

      <>

      <View style={styles.productHeader}>
        

                <Image
                style={styles.productImage}
                defaultSource={require('../../assets/images/Blank.png')}
                source={ImagePath
                        ? {uri: 'https://listak.pl/storage/'+ImagePath}                      
                        : require('../../assets/images/Blank.png')} 
                />
       <TouchableOpacity
          style={styles.productUploadIcon} 

          onPress={PickImage}
        >
               <FontAwesome name="cloud-upload" size={42} color="blue" />
       
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.productPictureIcon}
          onPress={PickCameraPhoto}
        >
            <FontAwesome  name="camera" size={36} color="gray" />
       
        </TouchableOpacity>

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
          style={[styles.TextInput, {height:'30%', textAlignVertical: "top" }]}
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
    width: 150,
    height:150,
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
  productUploadIcon: {

    position:'absolute', 
    top:120,
    right:"16%"

  },

  productPictureIcon: {

    position:'absolute', 
    top:122,
    right:"3%"

  }
});
