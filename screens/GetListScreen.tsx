import * as React from 'react';
import { StyleSheet, TouchableOpacity, Button } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import {API_URL, getToken, setToken} from "../api/env";
import BouncyCheckbox from "react-native-bouncy-checkbox";

//network
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { NavigationHelpersContext } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GetListScreen({ route, navigation }: RootTabScreenProps<'TabList'>) {
 
  const {listId}:any  = route.params;
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);


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
     setData(json);
   } catch (error) {
     console.error(error);
   } finally {
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


  </View>

);

const renderItem = ({ item }) => (
  <Item title={item.name}
        id={item.id} 
        ticked={item.ticked} />
);


  return (
    <View style={styles.container}>

      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text>Brak produktow!</Text>}
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
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  item: {
    backgroundColor: '#e6e6ff',
    padding: 20,
    marginVertical: 4,
    borderRadius: 10
  
  }
});
