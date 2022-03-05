import React from "react";
import { Platform, View, Image, StyleSheet, Text } from "react-native";
import { Animated, Easing, Dimensions } from "react-native";
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
} from "react-navigation-tabs";
import {
  createStackNavigator,
  TransitionPresets,
  TransitionSpecs,
  HeaderStyleInterpolators,
} from "react-navigation-stack";
import { CardStyleInterpolators } from "react-navigation-stack";
import EventScreen from "../screens/Event/index";

import WalletsScreen from "../screens/WalletsScreen";
import OperationDetailScreen from "../screens/OperationDetailScreen";
import TokenTransactionScreen from "../screens/OperationDetailScreen/TokenTransactionScreen";
import BuyEventTransactionScreen from "../screens/OperationDetailScreen/BuyEventTransactionScreen";
import BarPaymentScreen from "../screens/OperationDetailScreen/BarPaymentScreen";

import LinksScreen from "../screens/LinkScan/LinksScreen";
import TiketScreen from "../screens/Ticket/myTiket/TiketScreen";
import TicketDetailGrayScreen from "../screens/Ticket/myTiket/TicketDetailGrayScreen";
import ScanTicketScreen from "../screens/Ticket/scanTicket/ScanTicketScreen";
import TicketResultScanQrcodeScreen from "../screens/Ticket/scanTicket/TicketResultScanQrcodeScreen";

import EventDetailScreen from "../screens/Event/EventDetailScreen";
import TransferTicketsScreen from "../screens/Ticket/transferTickets/TransferTicketsScreen";
import TransferTicketsSuccessScreen from "../screens/Ticket/transferTickets/TransferTicketsSuccessScreen";

import ResellTicketsScreen from "../screens/Ticket/sellTicket/ResellTicketsScreen";
import TicketsForSaleScreen from "../screens/Ticket/sellTicket/TicketsForSaleScreen";
import SentToTicketScreen from "../screens/Ticket/sellTicket/SentToTicketScreen";

import SaleDetailTikectScreen from "../screens/Ticket/sale/SaleDetailTikectScreen";
import SaleDetailEditTikectScreen from "../screens/Ticket/sale/SaleDetailEditTikectScreen";

import ResultScanQrcodeScreen from "../screens/LinkScan/ResultScanQrcodeScreen";
import ContactsScreen from "../screens/ContactsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import PersonalInfo from "../screens/Profile/PersonalInfo";
import TabBarComponent from "../components/Navigation/TabBarComponent";
import SearchOperationScreen from "../screens/WalletsScreen/SearchOperationScreen";
import XNavScreen from "../screens/XNavScreen";
import SendToScreen from "../screens/SendToScreen";
import PaymentScreen from "../screens/Payment/PaymentScreen";
import SecurityScreen from "../screens/Secutity/SecurityScreen";
import VerifyPhoneNumberScreen from "../screens/Secutity/VerifyPhoneNumberScreen";
import EnterVerifyCodeScreen from "../screens/Secutity/EnterVerifyCodeScreen";
import VerifySuccessScreen from "../screens/Secutity/VerifySuccessScreen";
import BackupWalletScreen from "../screens/Secutity/BackupWalletScreen";

import NotificationScreen from "../screens/NotificationScreen/index";

import LoginPasscodeScreen from "../screens/AuthScreens/LoginPasscodeScreen";
import XNavButton from "../components/Navigation/TabBarComponent/XNavButton";
import TicketTopScreen from "../screens/Ticket/TicketTopScreen";
import LookerScreen from "../screens/TransactionScreens/LookerScreen";
import SearchEventScreen from "../screens/Event/SearchEventScreen";
import FilterCountryComponent from "../screens/Event/filterEvent/FilterCountryComponent";
import FilterTimeComponent from "../screens/Event/filterEvent/FilterTimeComponent";
import EventBuyScreen from "../screens/Event/EventBuyScreen";
import CheckoutScreen from "../screens/Event/CheckoutScreen";
import EventPaymentTypeScreen from "../screens/Event/EventPaymentTypeScreen";
import BuyEventSuccessScreen from "../screens/Event/BuyEventSuccessScreen";
import EventDetailPrivateScreen from "../screens/Event/EventDetailPrivateScreen";

//
import TopUpTokenEventScreen from "../screens/Event/TopUpTokenEvent/TopUpTokenEventScreen";
import PaymentEventScreen from "../screens/Event/TopUpTokenEvent/PaymentEventScreen";
import TermsPaymentEventScreen from "../screens/Event/TopUpTokenEvent/TermsPaymentEventScreen";
import VerifyPhoneNumberEventScreen from "../screens/Secutity/VerifyPhoneNumberScreen";
import EnterVerifyCodeEventScreen from "../screens/Secutity/EnterVerifyCodeScreen";
import VerifySuccessEventScreen from "../screens/Secutity/VerifySuccessScreen";
import WebViewMangoPayEventScreen from "../screens/Event/TopUpTokenEvent/WebViewMangoPayEventScreen";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {
    defaultNavigationOptions: {
      headerStyle: {
        marginHorizontal: 15,
        borderBottomColor: "transparent",
        borderBottomWidth: 0,
        elevation: 0,
      },
      headerTitleStyle: {
        fontWeight: "bold",
        textTransform: "uppercase",
        borderWidth: 0,
        textAlign: "center",
        flexGrow: 1,
        alignSelf: "center",
      },
    },
  },
});

function forVertical(props) {
  const { layout, position, scene } = props;

  const index = scene.index;
  const height = layout.initHeight;

  const translateX = 0;
  const translateY = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [height, 0, 0],
  });

  return {
    transform: [{ translateX }, { translateY }],
  };
}

const tabBarComponent = (props) => {
  return <TabBarComponent {...props} />;
};

const SellTicketStack = createStackNavigator(
  {
    ResellTicketsScreen: {
      screen: ResellTicketsScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    TicketsForSaleScreen: {
      screen: TicketsForSaleScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    SaleDetailEditTikectScreen: {
      screen: SaleDetailEditTikectScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    SentToTicketScreen: {
      screen: SentToTicketScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    headerMode: "none",
  }
);

const TiketStack = createStackNavigator({
  TiketScreen: {
    screen: TiketScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  TransferTicketsScreen: {
    screen: TransferTicketsScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  TransferTicketsSuccessScreen: {
    screen: TransferTicketsSuccessScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
});

const TranferTicketTransactionStack = createStackNavigator({
  BuyEventTransactionScreen: {
    screen: BuyEventTransactionScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  TransferTicketsScreen: {
    screen: TransferTicketsScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  TransferTicketsSuccessScreen: {
    screen: TransferTicketsSuccessScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
});

const EventsStack = createStackNavigator(
  {
    Events: {
      screen: EventScreen,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: "rgba(255,255,255,0)",
        },
      },
    },
  },
  {
    ...config,
    initialRouteName: "Events",
  }
);

const TicketsStack = createStackNavigator(
  {
    Tickets: {
      screen: TicketTopScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    ...config,
    initialRouteName: "Tickets",
  }
);

const WalletsStack = createStackNavigator(
  {
    Wallet: WalletsScreen,
  },
  {
    ...config,
    initialRouteName: "Wallet",
  }
);
WalletsStack.navigationOptions = {
  tabBarLabel: "Wallet",
};
WalletsStack.path = "";

const WearablesStack = createStackNavigator(
  {
    Wearables: LinksScreen,
  },
  {
    ...config,
    initialRouteName: "Wearables",
  }
);
WearablesStack.navigationOptions = {
  tabBarLabel: "Wearables",
};
WearablesStack.path = "";

const MoreStack = createStackNavigator(
  {
    More: ProfileScreen,
  },
  {
    ...config,
    initialRouteName: "More",
  }
);

const ContactsStack = createStackNavigator(
  {
    Contacts: ContactsScreen,
  },
  config
);
ContactsStack.navigationOptions = {
  tabBarLabel: "Contacts",
};
ContactsStack.path = "";

const SendToStack = createStackNavigator(
  {
    SendToScreen: {
      screen: SendToScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  config
);

const XNavStack = createStackNavigator(
  {
    XNav: XNavScreen,
  },
  {
    ...config,
    mode: "modal",
    headerMode: "none",
    defaultNavigationOptions: {
      ...TransitionPresets.ModalTransition,
    },
    // transitionConfig: () => ({ screenInterpolator: forVertical })
  }
);
XNavStack.navigationOptions = {
  tabBarLabel: "",
};
XNavStack.path = "";

const tabNavigatorStack = createBottomTabNavigator(
  {
    WalletsStack,
    EventsStack,
    // WearablesStack,
    XNavStack,
    TicketsStack,
    //ContactsStack,
    MoreStack,
  },
  {
    tabBarComponent,
    headerMode: "none",
    showIcon: false,
  }
);

tabNavigatorStack.path = "";

const SecurityStack = createStackNavigator(
  {
    Security: {
      screen: SecurityScreen,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: "rgba(255,255,255,0)",
        },
      },
    },
    VerifyPhoneNumber: {
      screen: VerifyPhoneNumberScreen,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: "rgba(255,255,255,0)",
        },
      },
    },
    VerifyCodeToSecurity: {
      screen: EnterVerifyCodeScreen,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: "rgba(255,255,255,0)",
        },
      },
    },
    VerifySuccess: {
      screen: VerifySuccessScreen,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: "rgba(255,255,255,0)",
        },
      },
    },
    BackupWalletScreen: {
      screen: BackupWalletScreen,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: "rgba(255,255,255,0)",
        },
      },
    },
  },
  {
    defaultRouteName: "Security",
    headerMode: "screen",
  }
);
SecurityStack.path = "";

const NotiStack = createStackNavigator(
  {
    NotificationNavigator: {
      screen: NotificationScreen,
      // navigationOptions: {
      //   headerShown: false,
      //   cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      // }
    },
  },
  {
    headerMode: "none",
    mode: "modal",
    defaultNavigationOptions: {
      gestureEnabled: false,
    },
    // transitionConfig: () => ({
    //   screenInterpolator: CardStackStyleInterpolator.forHorizontal,
    // }),
    // gestureDirection: 'horizontal',
    // transitionSpec: {
    //   // open: TransitionSpecs.TransitionIOSSpec,
    //   // close: TransitionSpecs.TransitionIOSSpec,
    //   open: CardStyleInterpolators.forVerticalIOS,
    //   close: CardStyleInterpolators.forVerticalIOS,
    // },
    // headerStyleInterpolator: HeaderStyleInterpolators.forFade,

    //cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
  }
);

const SaleStack = createStackNavigator({
  SaleDetailTikectScreen: {
    screen: SaleDetailTikectScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  SaleDetailEditTikectScreen: {
    screen: SaleDetailEditTikectScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  SentToTicketScreen: {
    screen: SentToTicketScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
});

const SearchEventStack = createStackNavigator({
  SearchEventScreen: {
    screen: SearchEventScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  FilterCountryScreen: {
    screen: FilterCountryComponent,
    navigationOptions: {
      headerShown: false,
    },
  },
  FilterTimeScreen: {
    screen: FilterTimeComponent,
    navigationOptions: {
      headerShown: false,
    },
  },
});

const TokenTopUpEvent = createStackNavigator(
  {
    TopUpTokenEventScreen: TopUpTokenEventScreen,
    PaymentEventScreen: {
      screen: PaymentEventScreen,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: "rgba(255,255,255,0)",
        },
      },
    },
    TermsPaymentEventScreen: {
      screen: TermsPaymentEventScreen,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: "rgba(255,255,255,0)",
        },
      },
    },
    VerifyPhoneNumberEventScreen: {
      screen: VerifyPhoneNumberEventScreen,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: "rgba(255,255,255,0)",
        },
      },
    },
    VerifyCodeToSecurity: {
      screen: EnterVerifyCodeScreen,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: "rgba(255,255,255,0)",
        },
      },
    },
    VerifySuccessEventScreen: {
      screen: VerifySuccessEventScreen,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: "rgba(255,255,255,0)",
        },
      },
    },

    WebViewMangoPayEventScreen: {
      screen: WebViewMangoPayEventScreen,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: "rgba(255,255,255,0)",
        },
      },
    },
  },
  config
);

const tabNavMainStack = createStackNavigator(
  {
    mainWllet: {
      screen: tabNavigatorStack,
      navigationOptions: () => ({
        headerShown: false,
        cardStyle: {
          backgroundColor: "rgba(255,255,255,0)",
        },
      }),
    },
    Contacts: ContactsScreen,
    Wearables: LinksScreen,
    NotiStack: {
      screen: NotiStack,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: "rgba(255,255,255,0)",
        },
      },
    },
    SearchOperation: {
      screen: SearchOperationScreen,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: "rgba(255,255,255,0)",
        },
      },
    },
    SearchEventStack: {
      screen: SearchEventStack,
      navigationOptions: {
        headerShown: false,
      },
    },
    OperationDetail: {
      screen: OperationDetailScreen,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: "rgba(255,255,255,0)",
        },
      },
    },
    SendTo: {
      screen: SendToStack,
      navigationOptions: {
        headerShown: false,
      },
    },
    TokenTransactionScreen: {
      screen: TokenTransactionScreen,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: "rgba(255,255,255,0)",
        },
      },
    },
    TranferTicketTransactionStack: {
      screen: TranferTicketTransactionStack,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: "rgba(255,255,255,0)",
        },
      },
    },
    BarPaymentScreen: {
      screen: BarPaymentScreen,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: "rgba(255,255,255,0)",
        },
      },
    },
    SecurityScreen: {
      screen: SecurityStack,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: "rgba(255,255,255,0)",
        },
      },
    },
    PersonalInfo: PersonalInfo,
    ResultScanQrcodeScreen: ResultScanQrcodeScreen,
    TiketStack: {
      screen: TiketStack,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: "rgba(255,255,255,0)",
        },
      },
    },
    TicketDetailGrayScreen: {
      screen: TicketDetailGrayScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    SellTicketStack: {
      screen: SellTicketStack,
      navigationOptions: {
        headerShown: false,
      },
    },
    SaleStack: {
      screen: SaleStack,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: "rgba(255,255,255,0)",
        },
      },
    },
    EventDetailScreen: {
      screen: EventDetailScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    EventBuyScreen: {
      screen: EventBuyScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    CheckoutScreen: {
      screen: CheckoutScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    EventDetailPrivateScreen: {
      screen: EventDetailPrivateScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    EventPaymentTypeScreen: {
      screen: EventPaymentTypeScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    TokenTopUpEvent: {
      screen: TokenTopUpEvent,
      navigationOptions: {
        headerShown: false,
      },
    },
    LookerScreen: {
      screen: LookerScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    BuyEventSuccessScreen: {
      screen: BuyEventSuccessScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    ScanTicketScreen: ScanTicketScreen,
    TicketResultScanQrcodeScreen: TicketResultScanQrcodeScreen,
  },
  {
    ...config,
    defaultRouteName: "mainWllet",
    headerMode: "screen",
  }
);
tabNavMainStack.path = "";

const MainWalletStack = createStackNavigator(
  {
    tabNavMain: {
      screen: tabNavMainStack,
      navigationOptions: {
        cardStyle: {
          backgroundColor: "rgba(255,255,255,0)",
        },
      },
    },

    mainXNav: {
      screen: XNavScreen,
      navigationOptions: {
        cardStyle: {
          backgroundColor: "rgba(255,255,255,0)",
        },
      },
    },
    Login: {
      screen: LoginPasscodeScreen,
      navigationOptions: {
        cardStyle: {
          backgroundColor: "rgba(255,255,255,0)",
        },
      },
    },
  },
  {
    ...config,
    defaultRouteName: "tabNavMain",
    headerMode: "none",
    defaultNavigationOptions: {
      ...TransitionPresets.ModalTransition,
    },
  }
);
MainWalletStack.path = "";

export default MainWalletStack;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    marginVertical: 0,
    bottom: Platform.OS === "ios" ? 15 : 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
  },
  tabs: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
  },
  extraBox: {
    height: 15,
    backgroundColor: "#ffffff",
  },
});
