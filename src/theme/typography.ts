import type { TextStyle } from 'react-native';

/** Font family names as registered by expo-font in the root layout — see theme/fonts.ts. */
export const fontFamilies = {
  archivoMedium: 'Archivo_500Medium',
  archivoSemiBold: 'Archivo_600SemiBold',
  archivoBold: 'Archivo_700Bold',
  archivoExtraBold: 'Archivo_800ExtraBold',
  dmSansRegular: 'DMSans_400Regular',
  dmSansMedium: 'DMSans_500Medium',
  dmSansBold: 'DMSans_700Bold',
  monoMedium: 'IBMPlexMono_500Medium',
  monoSemiBold: 'IBMPlexMono_600SemiBold',
} as const;

/** em -> px letterSpacing at a given font size (RN letterSpacing is absolute, not em-relative). */
function em(fontSize: number, value: number): number {
  return Math.round(fontSize * value * 100) / 100;
}

export const typography = {
  screenTitle: {
    fontFamily: fontFamilies.archivoExtraBold,
    fontSize: 26,
    lineHeight: 26 * 1.1,
    letterSpacing: em(26, -0.03),
  } satisfies TextStyle,
  detailTitle: {
    fontFamily: fontFamilies.archivoExtraBold,
    fontSize: 27,
    lineHeight: 27 * 1.1,
    letterSpacing: em(27, -0.03),
  } satisfies TextStyle,
  sheetTitle: {
    fontFamily: fontFamilies.archivoExtraBold,
    fontSize: 21,
    lineHeight: 21 * 1.15,
    letterSpacing: em(21, -0.02),
  } satisfies TextStyle,
  successHeadline: {
    fontFamily: fontFamilies.archivoExtraBold,
    fontSize: 40,
    lineHeight: 40 * 1.02,
    letterSpacing: em(40, -0.035),
  } satisfies TextStyle,
  cardTitle: {
    fontFamily: fontFamilies.archivoBold,
    fontSize: 16,
    lineHeight: 16 * 1.25,
    letterSpacing: em(16, -0.02),
  } satisfies TextStyle,
  rowTitle: {
    fontFamily: fontFamilies.archivoBold,
    fontSize: 13.5,
    lineHeight: 13.5 * 1.3,
    letterSpacing: em(13.5, -0.01),
  } satisfies TextStyle,
  primaryButton: {
    fontFamily: fontFamilies.archivoBold,
    fontSize: 14,
    lineHeight: 14 * 1.2,
  } satisfies TextStyle,
  body: {
    fontFamily: fontFamilies.dmSansRegular,
    fontSize: 12.5,
    lineHeight: 12.5 * 1.6,
  } satisfies TextStyle,
  bodyMedium: {
    fontFamily: fontFamilies.dmSansMedium,
    fontSize: 12.5,
    lineHeight: 12.5 * 1.6,
  } satisfies TextStyle,
  rowLabel: {
    fontFamily: fontFamilies.dmSansMedium,
    fontSize: 13,
    lineHeight: 13 * 1.4,
  } satisfies TextStyle,
  sectionKicker: {
    fontFamily: fontFamilies.monoSemiBold,
    fontSize: 9.5,
    lineHeight: 9.5 * 1.3,
    letterSpacing: em(9.5, 0.09),
    textTransform: 'uppercase',
  } satisfies TextStyle,
  microLabel: {
    fontFamily: fontFamilies.monoSemiBold,
    fontSize: 8.5,
    lineHeight: 8.5 * 1.3,
    letterSpacing: em(8.5, 0.05),
    textTransform: 'uppercase',
  } satisfies TextStyle,
  pointsBig: {
    fontFamily: fontFamilies.monoSemiBold,
    fontSize: 44,
    lineHeight: 44 * 1.05,
  } satisfies TextStyle,
  pointsInline: {
    fontFamily: fontFamilies.monoSemiBold,
    fontSize: 16,
    lineHeight: 16 * 1.2,
  } satisfies TextStyle,
} as const;

export type TypographyRole = keyof typeof typography;
