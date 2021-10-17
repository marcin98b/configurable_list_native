import * as React from 'react';
import { StyleSheet, TouchableOpacity, Button } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import {API_URL, getToken, setToken} from "../api/env";

//network
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { NavigationHelpersContext } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GetListScreen({ route, navigation }: RootTabScreenProps<'TabList'>) {
 
  const {listId}  = route.params;
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);


  const getLists = async () => {
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

 useEffect(() => {
   getLists();
 }, []);


 //Komponent listy

 const Item = ({ id,title }) => (
  <TouchableOpacity
  onPress={() => navigation.navigate('NotFound')}
  >
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
  </TouchableOpacity>
);

const renderItem = ({ item }) => (
  <Item title={item.name} id={item.id} />
);


  return (
    <View style={styles.container}>

      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}

          // data={data}
          // keyExtractor={item => item.id}
          // renderItem={({ item }) => (

          //   <Text>{item.name},  {item.created_at}</Text>

          // )}
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
    backgroundColor: '#b3ffb3',
    padding: 20,
    marginVertical: 4,
    borderRadius: 10
  
  }
});
