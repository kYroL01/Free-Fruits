import { useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { File, Paths } from 'expo-file-system';
import * as Crypto from 'expo-crypto';

import { useTheme } from '@/theme/ThemeProvider';
import { useLocation } from '@/hooks/useLocation';
import { mediumHaptic } from '@/utils/haptics';
import { AppText } from '@/components/ui';
import type { LatLng } from '@/domain/types';

type CaptureResult = { photoUri: string; exifGps: LatLng; takenAt: string };

type CameraStepProps = {
  onCaptured: (result: CaptureResult) => void;
  onNoLocationUpload: () => void;
};

function persistPhoto(sourceUri: string): string {
  const dest = new File(Paths.document, `tree-${Crypto.randomUUID()}.jpg`);
  const source = new File(sourceUri);
  source.copy(dest);
  return dest.uri;
}

export function CameraStep({ onCaptured, onNoLocationUpload }: CameraStepProps) {
  const { tokens } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const { coords, accuracyM, status: locationStatus } = useLocation();
  const cameraRef = useRef<CameraView>(null);
  const [torch, setTorch] = useState(false);
  const [capturing, setCapturing] = useState(false);

  const gpsReady = locationStatus === 'granted' && !!coords;

  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: '#000' }} />;
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
        <AppText variant="cardTitle">Camera access needed</AppText>
        <AppText variant="body" dim style={{ textAlign: 'center' }}>
          A tree only counts once you photograph it on site — the GPS stamp is the proof.
        </AppText>
        <Pressable
          accessibilityRole="button"
          onPress={requestPermission}
          style={{ backgroundColor: tokens.fuchsia, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14 }}
        >
          <AppText variant="primaryButton" color="#FFFFFF">
            Allow camera
          </AppText>
        </Pressable>
      </View>
    );
  }

  const shutter = async () => {
    if (!gpsReady || !cameraRef.current || capturing) return;
    mediumHaptic();
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (!photo) return;
      const photoUri = persistPhoto(photo.uri);
      onCaptured({ photoUri, exifGps: coords!, takenAt: new Date().toISOString() });
    } finally {
      setCapturing(false);
    }
  };

  const upload = async () => {
    const permResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permResult.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (result.canceled) return;
    // Library picks are treated as missing GPS in this build — only a live on-site capture
    // can prove the photo was taken at the pin.
    onNoLocationUpload();
  };

  return (
    <View style={{ flex: 1, borderRadius: 22, overflow: 'hidden', backgroundColor: '#000' }}>
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" enableTorch={torch}>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', gap: 8, padding: 16 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                backgroundColor: 'rgba(0,0,0,0.55)',
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 6,
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: gpsReady ? tokens.green : tokens.gold,
                }}
              />
              <AppText variant="microLabel" color="#FFFFFF">
                {gpsReady ? `GPS LOCKED · ${Math.round(accuracyM ?? 0)} M` : 'SEARCHING FOR GPS'}
              </AppText>
            </View>
            <View
              style={{
                backgroundColor: 'rgba(0,0,0,0.55)',
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 6,
                justifyContent: 'center',
              }}
            >
              <AppText variant="microLabel" color="#FFFFFF">
                {gpsReady && coords ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : '—, —'}
              </AppText>
            </View>
          </View>

          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                width: 180,
                height: 180,
                borderRadius: 16,
                borderWidth: 1.5,
                borderColor: 'rgba(255,255,255,0.6)',
                borderStyle: 'dashed',
              }}
            />
            <AppText variant="body" color="#FFFFFF" style={{ marginTop: 10, textAlign: 'center', paddingHorizontal: 40 }}>
              Frame the whole tree, standing at its trunk
            </AppText>
          </View>

          <View style={{ padding: 20, gap: 10, alignItems: 'center' }}>
            <AppText variant="microLabel" color="rgba(255,255,255,0.7)">
              {gpsReady ? 'Location is stamped into the photo' : 'Wait for a lock — without coordinates the photo proves nothing.'}
            </AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 32 }}>
              <Pressable accessibilityRole="button" accessibilityLabel="Upload from library" onPress={upload}>
                <AppText variant="microLabel" color="#FFFFFF">
                  UPLOAD
                </AppText>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Take photo"
                onPress={shutter}
                disabled={!gpsReady || capturing}
                style={{
                  width: 66,
                  height: 66,
                  borderRadius: 33,
                  backgroundColor: tokens.fuchsia,
                  opacity: gpsReady ? 1 : 0.4,
                  borderWidth: 4,
                  borderColor: 'rgba(255,255,255,0.8)',
                }}
              />

              <Pressable accessibilityRole="button" accessibilityLabel="Toggle flash" onPress={() => setTorch((t) => !t)}>
                <AppText variant="microLabel" color={torch ? tokens.fuchsia : '#FFFFFF'}>
                  FLASH
                </AppText>
              </Pressable>
            </View>
          </View>
        </View>
      </CameraView>
    </View>
  );
}
