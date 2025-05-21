import * as React from "react"
import Svg, { SvgProps, G, Path } from "react-native-svg"
const UserSearch = (props: SvgProps) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={20} height={18} {...props}>
        <G data-name="Group 113">
            <Path
                d="M8 8a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0-6a2 2 0 1 1-2 2 2.006 2.006 0 0 1 2-2Z"
                data-name="Path 36"
            />
            <Path
                d="M2 14c.22-.72 3.31-2 6-2a5.945 5.945 0 0 1 .35-1.99C5.62 9.91 0 11.27 0 14v2h9.54a5.875 5.875 0 0 1-1.19-2Z"
                data-name="Path 37"
            />
            <Path
                d="M17.43 14.02A3.864 3.864 0 0 0 18 12a4 4 0 1 0-4 4 3.959 3.959 0 0 0 2.02-.57L18.59 18 20 16.59c-1.5-1.5-.79-.8-2.57-2.57ZM14 14a2 2 0 1 1 2-2 2.006 2.006 0 0 1-2 2Z"
                data-name="Path 38"
            />
        </G>
    </Svg>
)
export default UserSearch;
