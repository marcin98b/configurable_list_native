/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
  Register:undefined;
  Login:undefined;
  GetList:{listId:string, name:string};
  EditList:{listId:string, name:string, shopId:string, shareKey:string};
  GetShop:{shopId:string, name:string};
  EditShop:{shopId:string, name:string};
  GetCustomProduct:{productId:any};  
  EditCustomProduct:{productId:string, name:string, description:string, img_filepath:string, share_key:string};  
};

// export type DrawerStackParamList = {
//   Root: NavigatorScreenParams<RootTabParamList> | undefined;
//   NotFound: undefined;
//   Register:undefined;
//   Login:undefined;
//   GetList:{listId:string, name:string};

// };

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  TabList: undefined;
  TabShop: undefined;
  TabCustomProduct: undefined;

};



export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
