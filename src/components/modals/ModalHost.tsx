import { Modal, Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

import { useAppStore } from '@/store';
import { t } from '@/i18n';
import { useTheme } from '@/theme/ThemeProvider';
import { radii } from '@/theme/spacing';
import { durations } from '@/theme/motion';
import { ConditionReportModal } from './ConditionReportModal';
import { SendFailureModal } from './SendFailureModal';
import { QueuedModal } from './QueuedModal';
import { SuccessModal } from './SuccessModal';
import { NoLocationModal } from './NoLocationModal';
import { DuplicateModal } from './DuplicateModal';
import { AvatarPickerModal } from './AvatarPickerModal';
import { InviteLinkModal } from './InviteLinkModal';

/** Modal types that take over the whole screen (success, queued-offline) rather than presenting
 * as a centred scrim card — per spec these are "full-bleed"/"full-screen on bg", not dialogs. */
const FULL_SCREEN_TYPES = new Set(['success', 'queued']);

/** Single instance mounted at the root, driven by ui.activeModal. Tap-scrim dismisses every
 * card-style modal except duplicate, which needs an explicit choice; full-screen types have no
 * scrim to tap. */
export function ModalHost() {
  const activeModal = useAppStore((s) => s.activeModal);
  const closeModal = useAppStore((s) => s.closeModal);
  const { tokens } = useTheme();

  if (!activeModal) return null;

  const fullScreen = FULL_SCREEN_TYPES.has(activeModal.type);
  const dismissable = !fullScreen && activeModal.type !== 'duplicate';

  if (fullScreen) {
    return (
      <Modal visible transparent={false} animationType="fade" statusBarTranslucent>
        <ModalBody />
      </Modal>
    );
  }

  return (
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => dismissable && closeModal()}
    >
      <Animated.View
        entering={FadeIn.duration(durations.scrimFade)}
        exiting={FadeOut.duration(durations.scrimFade)}
        style={{ flex: 1, backgroundColor: 'rgba(8,14,8,0.58)', justifyContent: 'center' }}
      >
        <Pressable
          accessibilityLabel={t('common.dismiss')}
          onPress={() => dismissable && closeModal()}
          style={{ position: 'absolute', inset: 0 }}
        />
        <Animated.View
          entering={SlideInDown.duration(durations.cardIn)}
          exiting={SlideOutDown.duration(durations.cardIn)}
          style={{
            marginHorizontal: 18,
            maxHeight: '80%',
            backgroundColor: tokens.surface,
            borderRadius: radii.sheet,
            padding: 20,
          }}
        >
          <View
            style={{
              width: 38,
              height: 4,
              borderRadius: 2,
              backgroundColor: tokens.line,
              alignSelf: 'center',
              marginBottom: 14,
            }}
          />
          <ModalBody />
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

function ModalBody() {
  const activeModal = useAppStore((s) => s.activeModal);
  if (!activeModal) return null;

  switch (activeModal.type) {
    case 'condition_report':
      return <ConditionReportModal treeId={activeModal.treeId} />;
    case 'send_failure':
      return <SendFailureModal onRetry={activeModal.onRetry} onLater={activeModal.onLater} />;
    case 'queued':
      return <QueuedModal points={activeModal.points} queueCount={activeModal.queueCount} />;
    case 'success':
      return <SuccessModal points={activeModal.points} pending={activeModal.pending} />;
    case 'no_location':
      return <NoLocationModal />;
    case 'duplicate':
      return <DuplicateModal {...activeModal} />;
    case 'avatar_picker':
      return <AvatarPickerModal />;
    case 'invite_link':
      return <InviteLinkModal />;
  }
}
