// import {verticalScale, horizontalScale} from './scaling';
// import {DefaultTheme} from 'styled-components';

// export const defaultTheme: DefaultTheme = {
//   spacingValues: {
//     vXxs: verticalScale(2),
//     vXs: verticalScale(4),
//     vSm: verticalScale(8),
//     vMd: verticalScale(14),
//     vLg: verticalScale(18),
//     vXl: verticalScale(24),
//     v2xl: verticalScale(32),
//     v3xl: verticalScale(56),
//     hXxs: horizontalScale(2),
//     hXs: horizontalScale(4),
//     hSm: horizontalScale(8),
//     hMd: horizontalScale(12),
//     hLg: horizontalScale(16),
//     hXl: horizontalScale(24),
//     h2xl: horizontalScale(40),
//     h3xl: horizontalScale(64),
//   },
//   colors: {
//     orangePrimary: '#F37421',
//     orangeSecondary: '#FFEEE2',
//     orange10: '#e6e7f2',
//     ctaDisabled: '#B1B0B3',
//     secondary: '#a2d2ff',

//     // White
//     white: '#FFFFFF',
//     white10: '#F7F6F6',
//     white20: '#E4DADA',
//     white30: '#DDD',
//     white40: '#F4F6FC',
//     white50: '#E8E8E8',
//     white60: '#D3D2D2',
//     white70: '#D0D0D0',
//     white80: '#BAB9BD',
//     white90: '#CED2DD',

//     // Black
//     black: '#000000',
//     black10: '#3F3F3F',
//     black20: '#717074',
//     black30: '#070400',
//     disabled: '#B1B0B3',
//     disabled2: '#e9ecef',
//     black40: '#2D2C2C',

//     health: '#03A9F5',
//     life: '#FF9801',
//     home: '#A833F1',
//     auto: '#F716F8',
//     marine: '#00B7D6',

//     // Red
//     red: ' #F1504D',

//     status_active: '#1E9517',
//     status_oob: '#FF0000',

//     // Star
//     starBlack: '#292929',
//     starRed: '#F92222',
//     starGreen: '#3EC21F',
//     starYellow: '#ffdd35',
//   },
//   textType: {
//     BodyXlBold: {
//       fontWeight: 700,
//       fontSize: verticalScale(22),
//       lineHeight: verticalScale(28),
//     },
//     BodyXl: {
//       fontWeight: 400,
//       fontSize: verticalScale(22),
//       lineHeight: verticalScale(31),
//     },
//     BodyLg: {
//       fontWeight: 400,
//       fontSize: verticalScale(16),
//       lineHeight: verticalScale(24),
//     },
//     BodyLgBold: {
//       fontWeight: 700,
//       fontSize: verticalScale(16),
//       lineHeight: verticalScale(24),
//     },
//     BodyMd: {
//       fontWeight: 400,
//       fontSize: verticalScale(16),
//       lineHeight: verticalScale(22),
//     },
//     BodyMdBold: {
//       fontWeight: 700,
//       fontSize: verticalScale(16),
//       lineHeight: verticalScale(22),
//     },
//     BodyMdTall: {
//       fontWeight: 400,
//       fontSize: verticalScale(16),
//       lineHeight: verticalScale(25),
//     },
//     BodySm: {
//       fontWeight: 400,
//       fontSize: verticalScale(14),
//       lineHeight: verticalScale(24),
//     },
//     BodySmBold: {
//       fontWeight: 700,
//       fontSize: verticalScale(14),
//       lineHeight: verticalScale(24),
//     },
//     BodySmTall: {
//       fontWeight: 400,
//       fontSize: verticalScale(14),
//       lineHeight: verticalScale(22),
//     },
//     BodyXsBold: {
//       fontWeight: 700,
//       fontSize: verticalScale(12),
//       lineHeight: verticalScale(18),
//     },
//     BodyXsTall: {
//       fontWeight: 400,
//       fontSize: verticalScale(12),
//       lineHeight: verticalScale(18),
//     },
//     BodyXs: {
//       fontWeight: 400,
//       fontSize: verticalScale(12),
//       lineHeight: verticalScale(18),
//     },
//     BodyXxsBold: {
//       fontWeight: 700,
//       fontSize: verticalScale(10),
//       lineHeight: verticalScale(15),
//     },
//     BodyXxs: {
//       fontWeight: 400,
//       fontSize: verticalScale(10),
//       lineHeight: verticalScale(15),
//     },
//     BodyXxxs: {
//       fontWeight: 400,
//       fontSize: verticalScale(8),
//       lineHeight: verticalScale(12),
//     },
//     BodyXxxsBold: {
//       fontWeight: 700,
//       fontSize: verticalScale(8),
//       lineHeight: verticalScale(12),
//     },
//     HeadingXl: {
//       fontWeight: 700,
//       fontSize: verticalScale(18),
//       lineHeight: verticalScale(22),
//     },
//     HeadingLg: {
//       fontWeight: 700,
//       fontSize: verticalScale(16),
//     },
//     HeadingMd: {
//       fontWeight: 700,
//       fontSize: verticalScale(30),
//       lineHeight: verticalScale(39),
//     },
//     HeadingSm: {
//       fontWeight: 700,
//       fontSize: verticalScale(22),
//       lineHeight: verticalScale(29),
//     },
//     HeadingXs: {
//       fontWeight: 700,
//       fontSize: verticalScale(12),
//     },
//     ButtonLabel: {
//       fontWeight: 400,
//       fontSize: verticalScale(16),
//       lineHeight: verticalScale(23),
//       letterSpacing: horizontalScale(-2),
//     },
//     ButtonLabelSm: {
//       fontWeight: 700,
//       fontSize: verticalScale(12),
//       lineHeight: verticalScale(18),
//     },
//     ButtonLabelMd: {
//       fontWeight: 700,
//       fontSize: verticalScale(14),
//       lineHeight: verticalScale(19),
//     },
//     default: {
//       fontWeight: 400,
//       fontSize: verticalScale(14),
//       lineHeight: verticalScale(25),
//     },
//   },
// };

// export default defaultTheme;