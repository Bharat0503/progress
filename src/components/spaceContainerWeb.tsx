import React, { useEffect, useState } from 'react'
import { View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import config from '../utils/config'


import { borderColors, commonColors, textColors } from '../utils/colors'
import Icons from '../assets/icons'
import { ScrollView } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import SpaceSubContainerWeb from './spaceSubContainerWeb'

interface SpaceContainerProps {
    data: any
    title: string
    // subscribed?: boolean
    // hub?: boolean
    // spaces?: boolean
    // data: any
    // title?: string,
    // loading?: boolean
    // onClick?: (id: number) => void | undefined
}

const SpaceContainerWeb: React.FC<SpaceContainerProps> = ({ data, title }) => {




    const dimension = useSelector((state: any) => state.reducer.dimentions)
    // useFetchDimention();

    const getFontSize = (size: number) => {
        return (dimension.width / 320) * size
    }

    const getWidth = (width: number) => {
        return dimension.width * (width / 100)
    }

    const getHeight = (height: number) => {
        if (config.isWeb) {
            if (dimension?.height > 820) {
                return dimension.height * (height / 100)
            }
            else {
                return 820 * (height / 100)
            }
        }
        else {
            return dimension.height * (height / 100)
        }
    }



    useEffect(() => {
        console.log("SpaceContainerWeb", data)
    }, [])




    return (

        <View style={{
            // backgroundColor: 'pink',
            height: getHeight(43), width: getWidth(60), marginTop: getHeight(2)
        }}>
            <View style={{
                // height: getHeight(6),
                width: getWidth(60),
                // backgroundColor: 'green',
                borderBottomColor: borderColors.profileImage, borderBottomWidth: 1
            }}>
                <Text style={{ fontFamily: 'bold', fontSize: getFontSize(3), color: textColors.spaceName }}>
                    {title}
                </Text>
            </View>
            <View style={{

            }}>

                <FlatList
                    data={data}
                    renderItem={({ item }) => <SpaceSubContainerWeb title={title} item={item} />}
                    horizontal={true}
                    keyExtractor={item => item.id}
                // nestedScrollEnabled={true}
                // style={{ backgroundColor: 'red' }}
                // contentContainerStyle={{ justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'pink', flex: 1 / 3 }}


                />


            </View>

            {/* {
                loading
                    ?
                    <View style={{ alignSelf: 'center' }}>
                        <ActivityIndicator />
                    </View>

                    : <FlatList
                        scrollEnabled={false}
                        data={data}
                        renderItem={({ item }) => <Item image={item.logo} id={item.id} item={item} />}
                        numColumns={3}
                        keyExtractor={item => item.id}
                    //style={{ backgroundColor: 'pink' }}
                    // contentContainerStyle={{ justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'pink', flex: 1 / 3 }}


                    />
            } */}


        </View>



    )

}

export default SpaceContainerWeb