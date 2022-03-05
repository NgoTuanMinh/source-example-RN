import React, { useCallback } from 'react';
import { Text, StyleSheet, Image, View, FlatList } from 'react-native'
import { ListItem, withTheme } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { translate } from '../../../App';
import * as ImageCustoms from '../../components/Icons/CircleIcons';

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        paddingBottom: 4,
        fontWeight: 'bold',
        color: 'black',
    },
    iconStyle: {
        width: 42, height: 30, resizeMode: 'contain',
    },
    containerStyle: {
        flexDirection: 'row',
        marginVertical: 10
    },
    viewRowStyle: {
        flexDirection: 'row'
    },
    txtActive: {
        color: '#fff',
    },
    viewActiveStyle: {
        backgroundColor: '#48A44A',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
    },
    viewContentStyle: {
        justifyContent: 'center',
        flex: 7,
        marginHorizontal: 10
    },
    viewBtnStyle: {
        flex: 1.5,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

const PairablesListItem = ({ pairedList, unPairWearable, walletKey, theme}) => {
    const renderActiveView = (item) => {
        if (item.active) {
            return (
                <View style={styles.viewActiveStyle}>
                    <Text style={styles.txtActive}>{translate("Active")}</Text>
                </View>
            )
        }
        return null;
    }

    const renderItem = ({ item, index }) => {
        const isActive = item.active;

        return (
            <View style={styles.containerStyle}>
                <View style={[styles.viewBtnStyle, !isActive ? { opacity: 0.4 } : { opacity: 1 }]}>
                    <Image source={ImageCustoms.icWearables} resizeMode='contain' style={styles.iconStyle} />
                </View>
                <View style={[styles.viewContentStyle, !isActive ? { opacity: 0.4 } : { opacity: 1 }]}>
                    <View style={styles.viewRowStyle}>
                        <Text>{translate("Wristband")} </Text>
                        {renderActiveView(item)}
                    </View>
                    <Text style={{ color: theme.colors.gray }} numberOfLines={1} >{item.publicKey}</Text>
                </View>
                <TouchableOpacity
                    style={styles.viewBtnStyle}
                    onPress={() => unPairWearable(walletKey, item.tagId || item.tagIdInverted, item.active)}>
                    <Image source={ImageCustoms.icDotHorizontal} resizeMode='contain' style={{ height: 4, width: 16, }} />
                </TouchableOpacity>
            </View >
        )
    }

    return (
        <FlatList
            data={pairedList}
            renderItem={renderItem}
            keyExtractor={(item, index) => String(index)}
        />
    )
}

export default withTheme(PairablesListItem);