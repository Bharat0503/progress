import React, { } from 'react'
import { View, Text, Image } from 'react-native'
import config from '../utils/config'


import { commonColors } from '../utils/colors'
import { useSelector } from 'react-redux'

interface SpaceSubHeaderProps {

}

const SpaceSubHeader: React.FC<SpaceSubHeaderProps> = () => {

    const space = useSelector((state: any) => state.reducer.space)
    const dimension = useSelector((state: any) => state.reducer.dimentions)

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
    return (

        <View style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: config.isWeb ? getWidth(25) : config.getWidth(100),
            marginTop: config.isWeb ? getHeight(1.5) : config.getHeight(3),
            marginBottom: config.isWeb ? getHeight(1) : config.getHeight(2)
        }}>
            {
                space?.logo
                    &&
                    <Image
                        style={{
                            width: config.isWeb ? getWidth(12) : config.getWidth(40),
                            height: config.isWeb ? getHeight(5) : config.getHeight(10),
                        }}
                        source={{ uri: space.logo }}
                        resizeMode='contain'
                    />
            }

            <Text style={{
                fontFamily: 'regular',
                fontSize: config.isWeb ? getFontSize(6) : config.generateFontSizeNew(16),
                color: commonColors.black,
                textAlign: 'center', marginHorizontal: config.isWeb ? getWidth(3.75) : config.getWidth(15)
            }}>
                {space?.name}
            </Text>
        </View >
    )
}

export default SpaceSubHeader