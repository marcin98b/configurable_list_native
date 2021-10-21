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
import { ColorSchemeName, Pressable } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import TabListScreen from '../screens/TabListScreen';
import GetListScreen from '../screens/GetListScreen';
import TabShopScreen from '../screens/TabShopScreen';

import TabCustomProductScreen from '../screens/TabCustomProductScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

import {getToken} from "../api/env";

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
     <Stack.Screen name="GetList" options={({ route }) => ({ title: route.params.name })} component={GetListScreen} />       
    <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    <Stack.Group screenOptions={{ presentation: 'modal' }}>
    <Stack.Screen name="Modal" component={ModalScreen} />
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


const Drawer = createDrawerNavigator();






/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
