/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as React from 'react';
import { ColorSchemeName, Pressable, TouchableOpacity, Text, Touchable } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';


// AUTH
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';

// LIST
import TabListScreen from '../screens/List/TabListScreen';
import GetListScreen from '../screens/List/GetListScreen';
import EditListScreen from '../screens/List/EditListScreen';

// SHOP
import TabShopScreen from '../screens/Shop/TabShopScreen';
import GetShopScreen from '../screens/Shop/GetShopScreen';
import EditShopScreen from '../screens/Shop/EditShopScreen';
// CUSTOM PRODUCT
import TabCustomProductScreen from '../screens/CustomProduct/TabCustomProductScreen';
import GetCustomProductScreen from '../screens/CustomProduct/GetCustomProductScreen';
import EditCustomProductScreen from '../screens/CustomProduct/EditCustomProductScreen';

import NotFoundScreen from '../screens/NotFoundScreen';

import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import { getToken } from '../api/env';


export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

      <RootNavigator /> 
    </NavigationContainer>

  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {



  return (
  <Stack.Navigator>
    
        {/* Auth  */}
        <Stack.Group>
            <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
            <Stack.Screen name="Register" options={{title: 'Rejestracja'}} component={RegisterScreen} />  
        </Stack.Group>
    
      {/*Bottom Tab Navigator - Lists, Shops, CustomProducts index*/}
        <Stack.Group>
           <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
        </Stack.Group>

      {/* List Modals */}
        <Stack.Group>
          <Stack.Screen name="GetList" options={({ route }) => ({ title: 'Lista: "'+route.params.name+'"' })} component={GetListScreen} />
          <Stack.Screen name="EditList" options={({ route }) => ({ title: 'Edycja listy: "'+route.params.name+'"' })} component={EditListScreen} />  
        </Stack.Group>

      {/* Shop Modals */}
      <Stack.Group>      
         <Stack.Screen name="GetShop" options={({ route }) => ({ title: 'Sklep: "'+route.params.name+'"' })} component={GetShopScreen} /> 
         <Stack.Screen name="EditShop" options={({ route }) => ({ title: 'Edycja sklepu: "'+route.params.name+'"' })} component={EditShopScreen} />    
      </Stack.Group>

      {/* Custom Products Modals */}
      <Stack.Group>            
        <Stack.Screen name="GetCustomProduct" options={({ route }) => ({ title: 'Produkt: ' })} component={GetCustomProductScreen} />     
        <Stack.Screen name="EditCustomProduct" options={({ route }) => ({ title: 'Edycja produktu: "'+route.params.name+'"' })} component={EditCustomProductScreen} />    
      </Stack.Group>        

      {/* ETC */}
      <Stack.Group>        
        <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      </Stack.Group> 

  </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();


  return (

    
    <BottomTab.Navigator
      initialRouteName="TabList"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="TabList"
        component={TabListScreen}
        options={({ navigation }: RootTabScreenProps<'TabList'>) => ({
          title: 'Twoje Listy',
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        })}
      />
      <BottomTab.Screen
        name="TabShop"
        component={TabShopScreen}
        options={{
          title: 'Twoje Sklepy',
          tabBarIcon: ({ color }) => <TabBarIcon name="shopping-bag" color={color} />,
        }}
      />
            <BottomTab.Screen
        name="TabCustomProduct"
        component={TabCustomProductScreen}
        options={{
          title: 'Twoje produkty',
          tabBarIcon: ({ color }) => <TabBarIcon name="archive" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
