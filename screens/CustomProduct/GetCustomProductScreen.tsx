import * as React from 'react';
import { StyleSheet, Modal, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, View } from '../../components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { RootTabScreenProps } from '../../types';
import {API_URL, getToken, setToken} from "../../api/env";
import { useEffect, useState } from 'react';

import { BarCodeScanner } from 'expo-barcode-scanner';


export default function GetCustomProductScreen({ route, navigation }: RootTabScreenProps<'TabList'>) {
 
  const {productId}:any  = route.params;
  const [productData, setData] : any = useState([]);
  const [isLoading, setLoading] = useState(true);

  // *integracyjne
  const [modalVisible, setModalVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [eanData, setEanData]:any = useState(null);
  const [eanFetchError, setEanFetchError]:any = useState(null);
  // ------------------

  const getCustomProduct = async (custom_product_id) => {
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

   const response = await fetch(API_URL + '/customProducts/'+custom_product_id, options);
   const json = await response.json();
   setData(json);
   navigation.setOptions({ title: 'Produkt: "'+json.name+'"' });
 } catch (error) {
   console.error(error);
 } finally {
   setLoading(false);
 }
}

//*integracyjne
const checkPermissions = async () => {
  const {granted} = await BarCodeScanner.getPermissionsAsync();
  if(granted) setHasPermission(true)
  else
  {
    const {status} = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  }
}

const getEANdata = async (ean) => {
  
  // pobranie danych z API "Barcode Lookup"
  const url = 'https://barcode-lookup.p.rapidapi.com/v3/products?barcode=' + ean;
  const options = {
    method: 'GET',
    headers: {
    'x-rapidapi-host': 'barcode-lookup.p.rapidapi.com',
    'x-rapidapi-key': '3d171f6182msh40fe4c0bde3048dp15b79ajsncfeec23f15de'
    },
  }
 const response = await fetch(url, options)
 .then((response) => response.json())
 .then((responseJson) => {setEanData(responseJson); console.log(responseJson)}) //produkt znaleziony
 .catch((error) => {
  console.log(error);  //produkt nieznaleziony
  setEanFetchError(error);
 })

}


const handleBarCodeScanned = ({ data }) => {

  //ukrycie aparatu
  setModalVisible(false);

  //Pobranie produktu
  getEANdata(data);
  
  //sprawdzenie czy odpowiedź nie jest pusta lub nie posiada błędu
  if(eanData !== null && !eanFetchError) 
  {
    alert('Produkt został znaleziony w bazie. Uzupełniono tytuł oraz opis produktu.')

    //pobranie danych o produkcie
    let title = eanData.products[0].title;
    let desc = eanData.products[0].description;
    
    //Nawigacja do widoku edycji produktu z nowymi danymi
    navigation.navigate('EditCustomProduct', 
    {productId: productId.toString(), 
    name: title, 
    description: desc,
    img_filepath: typeof productData.img_filepath === 'string' ? productData.img_filepath.toString() : '',
    share_key: typeof productData.share_key === 'string' ? productData.share_key.toString() : '',
  })
  }
  else alert('Produkt nie znajduje się w bazie!');
};

//--------------

useEffect(() => {
  getCustomProduct(productId);
  
}, []);
  


  return (

    <View style={styles.container}>

    {isLoading ? <ActivityIndicator/> : (

          <>
        {/* Integracyjne */}
        <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(false);
                }}
              >
                  <View style={styles.modalView}>
                    <Text style={styles.modalHeader}>Odczyt kodu kreskowego</Text>
                    <BarCodeScanner
                    type='back'
                    onBarCodeScanned={handleBarCodeScanned}
                    
                    barCodeTypes={[BarCodeScanner.Constants.BarCodeType.ean8, BarCodeScanner.Constants.BarCodeType.ean13]}
                    style={StyleSheet.absoluteFillObject}
                    >

                    <View style={styles.barcodeOverlay}></View>

                    </BarCodeScanner>
                      <TouchableOpacity
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}
                      >
                        <Text style={styles.textStyle}>Zakończ</Text>
                      </TouchableOpacity>
                  </View>
          </Modal>
        {/* ------------------- */}

          <View style={styles.productHeader}>
                          <Text style={styles.title}>{productData.name}</Text>
                          <Image
                          style={styles.productImage}
                          defaultSource={require('../../assets/images/Blank.png')}
                          source={productData.img_filepath
                                  ? {uri: 'https://listak.pl/storage/'+productData.img_filepath}                      
                                  : require('../../assets/images/Blank.png')} 
                          />
                      </View>
                      
                      <View>
                          <Text style={styles.titleDesc}>Opis:</Text>
                          <Text style={styles.productDescription}>
                              
                              {productData.description ? productData.description : (<Text>Brak opisu produktu.</Text>)}
                              
                          </Text>

                      </View>

                      {/* *integracyjne */}
                        <View
                              style={{position:'absolute', right:'37%', bottom:'3%', alignItems:'center',}}
                          >
                              <TouchableOpacity
                        onPress={() => {checkPermissions && setModalVisible(true) }  }
                              

                                    
                            >
                                <FontAwesome style={{left:40}} name="barcode" size={42} color="black" />
                                <Text style={{fontSize:10}}>Pobierz dane o produkcie</Text>

                        </TouchableOpacity>    
                     </View>
                      {/* ------------------- */}



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
  title: {
    fontSize: 24,
    paddingTop:3,
    paddingBottom:5,
    fontWeight:'bold'

  },
  titleDesc: {
    fontSize: 24,
    paddingTop:15,
    paddingLeft:5,
    fontWeight:'bold'

  },
  productHeader: {
    
    alignItems: 'center',

  },

  
  productImage: {
    borderRadius: 10,
    borderWidth:1,
    width: 300,
    height:300,
    borderColor: '#CCCCCC',

  },

  productDescription: {

    padding:5,
    textAlign:"justify"

  },
  //*integracyjne

  modalView: {
    margin: "5%",
    marginTop:"17%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    height:'90%',
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    position:'absolute',
    bottom:10,
    borderRadius: 20,
    padding: 10,
    width:'100%',
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "gray",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  modalHeader: {
    fontWeight:'bold',
    fontSize:18
  },
  barcodeOverlay: {
    marginTop:'65%',
    marginLeft:'5%',
    marginRight:'5%',    
    backgroundColor:'rgba(255,255,255,0.1)',
    borderColor:'white',
    borderWidth:3,
    borderRadius:5,
    borderStyle:'dashed', 
    width:'90%', 
    height:'30%'

  }

  // ------------
});
