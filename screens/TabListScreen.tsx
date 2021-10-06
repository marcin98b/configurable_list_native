import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import api from '../api.json';

//network
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';

export default function TabListScreen({ navigation }: RootTabScreenProps<'TabList'>) {
 
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
 
  const getLists = async () => {
    try {

    const urlencoded = new URLSearchParams();  
    const options = {
      method: 'GET',
      //body: urlencoded,
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/json',
        'Authorization': 'Bearer '+api.KEY
        
      },

    }

     const response = await fetch('https://listak.pl/api/lists', options);
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

 
  return (
    <View style={styles.container}>

      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (

            <Text>{item.name},  {item.created_at}</Text>

          )}
          ListEmptyComponent={<Text>Brak list!</Text>}
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
});
