import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const Delete = (props: SvgProps) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={14} height={18} {...props}>
        <Path
            d="M11 6v10H3V6h8M9.5 0h-5l-1 1H0v2h14V1h-3.5ZM13 4H1v12a2.006 2.006 0 0 0 2 2h8a2.006 2.006 0 0 0 2-2Z"
            data-name="Path 35"
        />
    </Svg>
)
export default Delete;
