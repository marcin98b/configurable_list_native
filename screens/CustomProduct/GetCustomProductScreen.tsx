import * as React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';


export default function GetCustomProductScreen({ route, navigation }: RootTabScreenProps<'TabList'>) {
 
  const {productId, name, description, img_filepath, share_key}:any  = route.params;



  return (


    <View style={styles.container}>



            <View style={styles.productHeader}>
                <Text style={styles.title}>{name}</Text>
                <Image
                style={styles.productImage}
                defaultSource={require('../../assets/images/Blank.png')}
                source={img_filepath
                        ? {uri: 'https://listak.pl/storage/'+img_filepath}                      
                        : require('../../assets/images/Blank.png')} 
                />
            </View>
            
            <View>
                <Text style={styles.titleDesc}>Opis:</Text>
                <Text style={styles.productDescription}>
                    
                    {description ? description : (<Text>Brak opisu produktu.</Text>)}
                    
                </Text>

            </View>


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
