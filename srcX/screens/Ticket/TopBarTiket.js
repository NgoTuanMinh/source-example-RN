import React, { useState, useEffect } from "react";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import MyTiketScreen from "./myTiket/MyTiketScreen";
import SaleTiketScreen from "./sale/SaleTiketScreen";
import CustomTopBarComponent from "../LinkScan/CustomTopBarComponent";

const MyTiketStack = createStackNavigator({
  MyTiketScreen: MyTiketScreen,
});

const SaleTiketStack = createStackNavigator({
  SaleTiketScreen: SaleTiketScreen,
});

const TopBarTiket = createMaterialTopTabNavigator(
  {
    MyTiketStack,
    SaleTiketStack,
  },
  {
    initialRouteName: "MyTiketStack",
    tabBarComponent: CustomTopBarComponent,
    tabBarOptions: {
      showIcon: false,
      upperCaseLabel: true,
      swipeEnabled: true,
    },
    swipeEnabled: true,
  }
);

export default createAppContainer(TopBarTiket);
