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
import { ColorSchemeName, Pressable, TouchableOpacity, Text } from 'react-native';


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

// CUSTOM PRODUCT
import TabCustomProductScreen from '../screens/CustomProduct/TabCustomProductScreen';

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
     <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
     <Stack.Screen name="Register" options={{title: 'Rejestracja'}} component={RegisterScreen} />  
     <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
     <Stack.Screen name="GetList" options={({ route }) => ({ title: 'Lista: "'+route.params.name+'"' })} component={GetListScreen} />
     <Stack.Screen name="EditList" options={({ route }) => ({ title: 'Edycja listy: "'+route.params.name+'"' })} component={EditListScreen} />         
    <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />

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
          // headerRight: () => (
          //   <Pressable
          //     onPress={() => navigation.navigate('TabShop')}
          //     style={({ pressed }) => ({
          //       opacity: pressed ? 0.5 : 1,
          //     })}>
          //     <FontAwesome
          //       name="info-circle"
          //       size={25}
          //       color={Colors[colorScheme].text}
          //       style={{ marginRight: 15 }}
          //     />
          //   </Pressable>
          // ),
        })}
      />
      <BottomTab.Screen
        name="TabShop"
        component={TabShopScreen}
        options={{
          title: 'Sklepy',
          tabBarIcon: ({ color }) => <TabBarIcon name="shopping-bag" color={color} />,
        }}
      />
            <BottomTab.Screen
        name="TabCustomProduct"
        component={TabCustomProductScreen}
        options={{
          title: 'Produkty',
          tabBarIcon: ({ color }) => <TabBarIcon name="archive" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}


// const Drawer = createDrawerNavigator();
// function DrawerNavigator() {

//   return (

//       <Drawer.Navigator initialRouteName="Root">
//       {getToken() == null ? (
//         <>
//      <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
//      <Stack.Screen name="Register" options={{title: 'Rejestracja'}} component={RegisterScreen} />  
//         </>
//       ) : (
//         <>
//         <Drawer.Screen name="Root" component={RootNavigator} />
//         <Drawer.Screen name="Notifications" component={BottomTabNavigator} />
//         </>
//       )}



      
//       </Drawer.Navigator>


//   );



// }



/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
