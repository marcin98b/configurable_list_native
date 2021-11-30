import * as React from 'react';
import { StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, View } from '../../components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { RootTabScreenProps } from '../../types';
import {API_URL, getToken, setToken} from "../../api/env";
import { useEffect, useState } from 'react';

export default function GetCustomProductScreen({ route, navigation }: RootTabScreenProps<'TabList'>) {
 
  const {productId}:any  = route.params;
  const [data, setData] : any = useState([]);
  const [isLoading, setLoading] = useState(true);

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

useEffect(() => {
  getCustomProduct(productId);
  
}, []);
  


  return (

    <View style={styles.container}>

    {isLoading ? <ActivityIndicator/> : (

          <>

          <View style={styles.productHeader}>
                          <Text style={styles.title}>{data.name}</Text>
                          <Image
                          style={styles.productImage}
                          defaultSource={require('../../assets/images/Blank.png')}
                          source={data.img_filepath
                                  ? {uri: 'https://listak.pl/storage/'+data.img_filepath}                      
                                  : require('../../assets/images/Blank.png')} 
                          />
                      </View>
                      
                      <View>
                          <Text style={styles.titleDesc}>Opis:</Text>
                          <Text style={styles.productDescription}>
                              
                              {data.description ? data.description : (<Text>Brak opisu produktu.</Text>)}
                              
                          </Text>

                      </View>


                        <View
                              style={{paddingTop:'20%',alignItems:'center',}}
                          >
                      <TouchableOpacity
                onPress={() => {}  }
                      
                          //Systemy Integracyjne projekt
                            
                    >
                        <FontAwesome style={{left:40}} name="barcode" size={42} color="black" />
                        <Text style={{fontSize:10}}>Pobierz dane o produkcie</Text>

                </TouchableOpacity>
                </View>




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
    fontSize: 28,
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

  }
});
