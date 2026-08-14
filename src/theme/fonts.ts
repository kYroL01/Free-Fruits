// Deep-import each weight's font file directly rather than the package barrel: the barrel's
// index.js unconditionally `require()`s all 18 weights per family as a side effect, and Metro
// can't tree-shake that away — it would bundle every unused weight (~7MB) instead of just the 9
// files we load.
import Archivo_500Medium from '@expo-google-fonts/archivo/500Medium/Archivo_500Medium.ttf';
import Archivo_600SemiBold from '@expo-google-fonts/archivo/600SemiBold/Archivo_600SemiBold.ttf';
import Archivo_700Bold from '@expo-google-fonts/archivo/700Bold/Archivo_700Bold.ttf';
import Archivo_800ExtraBold from '@expo-google-fonts/archivo/800ExtraBold/Archivo_800ExtraBold.ttf';
import DMSans_400Regular from '@expo-google-fonts/dm-sans/400Regular/DMSans_400Regular.ttf';
import DMSans_500Medium from '@expo-google-fonts/dm-sans/500Medium/DMSans_500Medium.ttf';
import DMSans_700Bold from '@expo-google-fonts/dm-sans/700Bold/DMSans_700Bold.ttf';
import IBMPlexMono_500Medium from '@expo-google-fonts/ibm-plex-mono/500Medium/IBMPlexMono_500Medium.ttf';
import IBMPlexMono_600SemiBold from '@expo-google-fonts/ibm-plex-mono/600SemiBold/IBMPlexMono_600SemiBold.ttf';

import { fontFamilies } from './typography';

export const fontsToLoad = {
  [fontFamilies.archivoMedium]: Archivo_500Medium,
  [fontFamilies.archivoSemiBold]: Archivo_600SemiBold,
  [fontFamilies.archivoBold]: Archivo_700Bold,
  [fontFamilies.archivoExtraBold]: Archivo_800ExtraBold,
  [fontFamilies.dmSansRegular]: DMSans_400Regular,
  [fontFamilies.dmSansMedium]: DMSans_500Medium,
  [fontFamilies.dmSansBold]: DMSans_700Bold,
  [fontFamilies.monoMedium]: IBMPlexMono_500Medium,
  [fontFamilies.monoSemiBold]: IBMPlexMono_600SemiBold,
} as const;
