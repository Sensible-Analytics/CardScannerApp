# CardSnap — Brand Implementation Instructions for AI Agent

React Native | TypeScript | iOS + Android

---

## Instruction Format

Every step in this document is a concrete, executable task. Complete them in the exact order listed. Do not infer missing values — every value is specified explicitly in `cardsnap_brand_guidelines.md`. When a step says "verify", run the listed command and confirm the output before proceeding.

---

## Step 1 — Create the Theme File Structure

Create the following files before writing any component code. All brand values live here. Components import from here. Nothing is hardcoded in component files.

```
src/
  theme/
    colors.ts        ← all colour tokens
    typography.ts    ← all type scale values
    spacing.ts       ← all spacing + radius tokens
    animation.ts     ← durations, spring configs, haptic map
    icons.ts         ← icon name constants
    index.ts         ← re-exports everything
    useTheme.ts      ← hook that returns theme + colorScheme
```

---

## Step 2 — colors.ts

Create `src/theme/colors.ts` with the exact values below. Do not add, remove, or rename any token.

```ts
// src/theme/colors.ts
export const light = {
  // Primary
  brandPrimary:      '#0066FF',
  brandPrimaryDark:  '#003DB3',
  brandPrimaryLight: '#E6F0FF',

  // Text
  textPrimary:   '#111827',
  textSecondary: '#6B7280',
  textTertiary:  '#9CA3AF',

  // Surfaces
  surfacePrimary:   '#FFFFFF',
  surfaceSecondary: '#F5F7FA',
  surfaceTertiary:  '#EAECF0',

  // Borders
  borderDefault: '#E5E7EB',
  borderStrong:  '#D1D5DB',

  // Semantic
  success:      '#10B981',
  successLight: '#D1FAE5',
  warning:      '#F59E0B',
  warningLight: '#FEF3C7',
  danger:       '#EF4444',
  dangerLight:  '#FEE2E2',

  // Fixed
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export const dark: typeof light = {
  brandPrimary:      '#0066FF',
  brandPrimaryDark:  '#003DB3',
  brandPrimaryLight: '#0A1F4D',

  textPrimary:   '#F9FAFB',
  textSecondary: '#9CA3AF',
  textTertiary:  '#6B7280',

  surfacePrimary:   '#1C1C1E',
  surfaceSecondary: '#111111',
  surfaceTertiary:  '#2C2C2E',

  borderDefault: '#374151',
  borderStrong:  '#4B5563',

  success:      '#10B981',
  successLight: '#064E3B',
  warning:      '#F59E0B',
  warningLight: '#451A03',
  danger:       '#EF4444',
  dangerLight:  '#450A0A',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export type ColorTokens = typeof light;
```

---

## Step 3 — typography.ts

Create `src/theme/typography.ts`:

```ts
// src/theme/typography.ts
import { Platform } from 'react-native';

export const fontFamily = {
  regular:  Platform.select({ ios: 'System', android: 'Roboto' })!,
  medium:   Platform.select({ ios: 'System', android: 'Roboto-Medium' })!,
  semiBold: Platform.select({ ios: 'System', android: 'Roboto-Medium' })!,
  bold:     Platform.select({ ios: 'System', android: 'Roboto-Bold' })!,
};

export const fontSize = {
  screenTitle: 28,
  heading:     22,
  name:        20,
  body:        16,
  label:       13,
  caption:     12,
  button:      16,
  buttonSm:    14,
} as const;

export const fontWeight = {
  regular:  '400',
  medium:   '500',
  semiBold: '600',
  bold:     '700',
} as const;

export const lineHeight = {
  screenTitle: 34,
  heading:     28,
  name:        26,
  body:        24,
  label:       18,
  caption:     16,
  button:      20,
  buttonSm:    18,
} as const;

// Pre-composed text styles — use these directly on <Text> components
export const textStyles = {
  screenTitle: { fontSize: fontSize.screenTitle, fontWeight: fontWeight.bold,    lineHeight: lineHeight.screenTitle },
  heading:     { fontSize: fontSize.heading,     fontWeight: fontWeight.bold,    lineHeight: lineHeight.heading },
  name:        { fontSize: fontSize.name,        fontWeight: fontWeight.semiBold, lineHeight: lineHeight.name },
  body:        { fontSize: fontSize.body,        fontWeight: fontWeight.regular, lineHeight: lineHeight.body },
  label:       { fontSize: fontSize.label,       fontWeight: fontWeight.medium,  lineHeight: lineHeight.label },
  caption:     { fontSize: fontSize.caption,     fontWeight: fontWeight.regular, lineHeight: lineHeight.caption },
  button:      { fontSize: fontSize.button,      fontWeight: fontWeight.semiBold, lineHeight: lineHeight.button },
  buttonSm:    { fontSize: fontSize.buttonSm,    fontWeight: fontWeight.medium,  lineHeight: lineHeight.buttonSm },
} as const;
```

---

## Step 4 — spacing.ts

Create `src/theme/spacing.ts`:

```ts
// src/theme/spacing.ts
export const spacing = {
  s1:  4,
  s2:  8,
  s3:  12,
  s4:  16,
  s5:  20,
  s6:  24,
  s8:  32,
  s10: 40,
  s12: 48,
} as const;

export const borderRadius = {
  sm:   6,
  md:   10,
  lg:   14,
  xl:   20,
  full: 9999,
} as const;

export const elevation = {
  sheet: {
    shadowColor:   '#000000',
    shadowOffset:  { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius:  12,
    elevation:     8,
  },
} as const;
```

---

## Step 5 — animation.ts

Create `src/theme/animation.ts`:

```ts
// src/theme/animation.ts
export const duration = {
  micro:      120,
  transition: 280,
  confirm:    400,
} as const;

export const spring = {
  standard: { stiffness: 120, damping: 14, mass: 1 },
} as const;

// Fake progress bar timing for OCR processing screen
export const progressTimings = {
  phase1End:      0.40,   // reaches 40% in 500ms
  phase1Duration: 500,
  phase2End:      0.80,   // reaches 80% over 1500ms
  phase2Duration: 1500,
  holdAt:         0.95,   // holds at 95% until OCR resolves
  completeDuration: 200,  // jumps to 100% in 200ms on resolve
} as const;

// Haptic event map
export const haptics = {
  shutter:      'impactMedium',    // document scanner captures image
  ocrComplete:  'notificationSuccess',  // ReviewScreen loads
  contactSaved: 'notificationSuccess',  // contact written to device
  error:        'notificationError',    // any failure
  toggle:       'impactLight',          // toggle switch
  destructive:  'impactHeavy',          // delete action
} as const;
```

---

## Step 6 — icons.ts

Create `src/theme/icons.ts`:

```ts
// src/theme/icons.ts
// All icon names are from the Feather icon set (react-native-vector-icons/Feather)
// Never reference an icon name as a string literal in a component — use these constants

export const icons = {
  settings:    'settings',
  torch:       'zap',
  gallery:     'image',
  back:        'arrow-left',
  fieldName:   'user',
  fieldCompany:'briefcase',
  fieldTitle:  'award',
  fieldEmail:  'mail',
  fieldPhone:  'phone',
  fieldWebsite:'globe',
  fieldAddress:'map-pin',
  saveContact: 'user-plus',
  shareVCard:  'share-2',
  sendCrm:     'send',
  success:     'check-circle',
  scanAgain:   'refresh-cw',
  integrations:'grid',
  connected:   'check',
  disconnect:  'x',
} as const;

export const iconSize = {
  nav:    24,
  row:    20,
  button: 18,
  inline: 14,
} as const;
```

---

## Step 7 — useTheme.ts

Create `src/theme/useTheme.ts`:

```ts
// src/theme/useTheme.ts
import { useColorScheme } from 'react-native';
import { light, dark } from './colors';
import { textStyles, fontFamily } from './typography';
import { spacing, borderRadius, elevation } from './spacing';
import { duration, spring, haptics } from './animation';
import { icons, iconSize } from './icons';

export function useTheme() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? dark : light;
  return { colors, textStyles, fontFamily, spacing, borderRadius, elevation, duration, spring, haptics, icons, iconSize, isDark: scheme === 'dark' };
}

export type Theme = ReturnType<typeof useTheme>;
```

---

## Step 8 — index.ts

Create `src/theme/index.ts`:

```ts
// src/theme/index.ts
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './animation';
export * from './icons';
export { useTheme } from './useTheme';
export type { Theme } from './useTheme';
```

**Verify Step 8:**
```bash
# TypeScript must resolve the theme module without errors
npx tsc --noEmit src/theme/index.ts
# Expected: no output (no errors)
```

---

## Step 9 — App Logo Assets

### 9.1 Source File
The logo source is `cardsnap_logo.svg`. It is the single source of truth. All raster exports are generated from this file. Never edit a PNG directly.

### 9.2 Generate iOS Assets
```bash
# Requires: npm install -g svg2png  OR  brew install librsvg

# iOS App Store icon (must be exact 1024×1024, no transparency, no rounded corners)
rsvg-convert -w 1024 -h 1024 cardsnap_logo.svg -o ios/CardSnap/Images.xcassets/AppIcon.appiconset/icon-1024.png

# iPhone home screen (3x)
rsvg-convert -w 180 -h 180 cardsnap_logo.svg -o ios/CardSnap/Images.xcassets/AppIcon.appiconset/icon-60@3x.png

# iPhone home screen (2x)
rsvg-convert -w 120 -h 120 cardsnap_logo.svg -o ios/CardSnap/Images.xcassets/AppIcon.appiconset/icon-60@2x.png

# iPhone Spotlight (3x)
rsvg-convert -w 120 -h 120 cardsnap_logo.svg -o ios/CardSnap/Images.xcassets/AppIcon.appiconset/icon-40@3x.png

# iPhone Settings (3x)
rsvg-convert -w 87 -h 87 cardsnap_logo.svg  -o ios/CardSnap/Images.xcassets/AppIcon.appiconset/icon-29@3x.png

# iPad home screen (2x)
rsvg-convert -w 152 -h 152 cardsnap_logo.svg -o ios/CardSnap/Images.xcassets/AppIcon.appiconset/icon-76@2x.png
```

### 9.3 Generate Android Assets
```bash
# Android Play Store
rsvg-convert -w 512 -h 512 cardsnap_logo.svg -o android/app/src/main/res/playstore-icon.png

# Launcher icons — round and square variants
rsvg-convert -w 192 -h 192 cardsnap_logo.svg -o android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
rsvg-convert -w 144 -h 144 cardsnap_logo.svg -o android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
rsvg-convert -w 96  -h 96  cardsnap_logo.svg -o android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
rsvg-convert -w 72  -h 72  cardsnap_logo.svg -o android/app/src/main/res/mipmap-hdpi/ic_launcher.png
rsvg-convert -w 48  -h 48  cardsnap_logo.svg -o android/app/src/main/res/mipmap-mdpi/ic_launcher.png

# Android notification icon — must be white on transparent
# Generate a special white-only version:
# Replace all fills with white, remove background rect, then export at 24dp densities
rsvg-convert -w 96  -h 96  cardsnap_logo_notification.svg -o android/app/src/main/res/drawable/ic_notification.png
```

### 9.4 Update Android Manifest
In `android/app/src/main/AndroidManifest.xml`, confirm:
```xml
<application
  android:icon="@mipmap/ic_launcher"
  android:roundIcon="@mipmap/ic_launcher_round"
  ...>
```

### 9.5 Update iOS AppIcon.appiconset Contents.json
After adding all PNG files, update `Contents.json` to reference each file at its correct idiom/scale combination. This is a standard Xcode asset catalog file — use the Xcode GUI or reference the Apple documentation for the exact JSON schema.

**Verify Step 9:**
```bash
# Confirm all required sizes exist
ls -lh ios/CardSnap/Images.xcassets/AppIcon.appiconset/*.png
# Expected: at least 6 PNG files at the sizes generated above

ls -lh android/app/src/main/res/mipmap-*/ic_launcher.png
# Expected: 5 PNG files across the density folders
```

---

## Step 10 — Implement PrimaryButton Component

Create `src/components/PrimaryButton.tsx` using only theme tokens. This is the reference implementation that all other buttons follow.

```tsx
// src/components/PrimaryButton.tsx
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary';
  testID?: string;
}

export function PrimaryButton({ label, onPress, loading, disabled, variant = 'primary', testID }: Props) {
  const { colors, textStyles, spacing, borderRadius } = useTheme();

  const isDisabled = disabled || loading;

  const bg = {
    primary:   isDisabled ? colors.surfaceTertiary  : colors.brandPrimary,
    secondary: colors.transparent,
    tertiary:  colors.transparent,
  }[variant];

  const textColor = {
    primary:   isDisabled ? colors.textTertiary : colors.white,
    secondary: colors.brandPrimary,
    tertiary:  colors.brandPrimary,
  }[variant];

  const borderColor = {
    primary:   colors.transparent,
    secondary: colors.brandPrimary,
    tertiary:  colors.transparent,
  }[variant];

  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={0.82}
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        {
          height:            variant === 'tertiary' ? 44 : 52,
          backgroundColor:   bg,
          borderColor:       borderColor,
          borderWidth:       variant === 'secondary' ? 1.5 : 0,
          borderRadius:      borderRadius.lg,
          paddingHorizontal: spacing.s6,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[textStyles.button, { color: textColor }]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

---

## Step 11 — Implement FieldRow Component (ReviewScreen)

Create `src/components/FieldRow.tsx`. This is the editable field row used on the ReviewScreen for every contact field.

```tsx
// src/components/FieldRow.tsx
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../theme';

interface Props {
  label:       string;
  value:       string;
  onChangeText:(t: string) => void;
  iconName:    string;
  confidence?: 'high' | 'medium' | 'low';
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'url';
  testID?:     string;
}

export function FieldRow({ label, value, onChangeText, iconName, confidence = 'high', keyboardType = 'default', testID }: Props) {
  const { colors, textStyles, spacing, iconSize } = useTheme();
  const [focused, setFocused] = useState(false);

  const isLowConf = confidence === 'low';
  const iconColor = focused
    ? colors.brandPrimary
    : isLowConf
    ? colors.warning
    : colors.textSecondary;

  return (
    <View
      testID={testID ? `${testID}-row` : undefined}
      style={[
        styles.row,
        {
          borderBottomWidth: focused ? 2 : 1,
          borderBottomColor: focused ? colors.brandPrimary : colors.borderDefault,
          borderLeftWidth:   isLowConf ? 3 : 0,
          borderLeftColor:   colors.warning,
          paddingHorizontal: spacing.s4,
          paddingVertical:   spacing.s3,
          backgroundColor:   colors.surfacePrimary,
        },
      ]}
    >
      <Icon name={iconName} size={iconSize.row} color={iconColor} style={{ marginRight: spacing.s3, marginTop: 2 }} />
      <View style={{ flex: 1 }}>
        <Text style={[textStyles.caption, { color: colors.textSecondary, marginBottom: 2 }]}>
          {label}
        </Text>
        <TextInput
          testID={testID}
          accessibilityLabel={testID}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          keyboardType={keyboardType}
          style={[textStyles.body, { color: colors.textPrimary, padding: 0, margin: 0 }]}
          placeholderTextColor={colors.textTertiary}
          placeholder={`Add ${label.toLowerCase()}`}
          returnKeyType="next"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems:    'flex-start',
    minHeight:     56,
  },
});
```

---

## Step 12 — Implement SectionHeader Component

```tsx
// src/components/SectionHeader.tsx
import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../theme';

interface Props { title: string; first?: boolean; }

export function SectionHeader({ title, first = false }: Props) {
  const { colors, textStyles, spacing } = useTheme();
  return (
    <View style={{
      backgroundColor:  colors.surfaceSecondary,
      paddingHorizontal: spacing.s6,
      paddingTop:        first ? spacing.s4 : spacing.s8,
      paddingBottom:     spacing.s2,
    }}>
      <Text style={[
        textStyles.caption,
        { color: colors.textSecondary, letterSpacing: 0.8 },
      ]}>
        {title.toUpperCase()}
      </Text>
    </View>
  );
}
```

---

## Step 13 — Implement OfflineBanner Component

```tsx
// src/components/OfflineBanner.tsx
import React from 'react';
import { View, Text } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useTheme } from '../theme';

export function OfflineBanner() {
  const { colors, textStyles, spacing } = useTheme();
  const [offline, setOffline] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setOffline(!state.isConnected);
    });
    return unsubscribe;
  }, []);

  if (!offline) return null;

  return (
    <View testID="banner-offline" style={{
      height:            36,
      backgroundColor:   colors.surfaceTertiary,
      flexDirection:     'row',
      alignItems:        'center',
      paddingHorizontal: spacing.s6,
    }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success, marginRight: spacing.s2 }} />
      <Text style={[textStyles.caption, { color: colors.textSecondary }]}>
        No internet — scanning still works
      </Text>
    </View>
  );
}
```

---

## Step 14 — Implement SuccessScreen

```tsx
// src/screens/SuccessScreen.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useTheme } from '../theme';

export function SuccessScreen() {
  const { colors, textStyles, haptics } = useTheme();
  const nav = useNavigation<any>();

  const circleScale  = useRef(new Animated.Value(0.8)).current;
  const circleOpacity = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    ReactNativeHapticFeedback.trigger(haptics.contactSaved);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(circleOpacity, { toValue: 1, duration: 80,  useNativeDriver: true }),
        Animated.spring(circleScale,   { toValue: 1, useNativeDriver: true, stiffness: 120, damping: 14 }),
      ]),
      Animated.delay(100),
      Animated.timing(checkOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    const t = setTimeout(() => nav.navigate('Scan'), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <View testID="screen-success" style={{ flex: 1, backgroundColor: colors.surfacePrimary, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{
        width: 72, height: 72, borderRadius: 36,
        backgroundColor: colors.success,
        alignItems: 'center', justifyContent: 'center',
        transform: [{ scale: circleScale }],
        opacity: circleOpacity,
        marginBottom: 20,
      }}>
        <Animated.Text style={{ color: colors.white, fontSize: 36, opacity: checkOpacity }}>✓</Animated.Text>
      </Animated.View>
      <Text style={[textStyles.heading, { color: colors.textPrimary }]}>Contact saved</Text>
    </View>
  );
}
```

---

## Step 15 — Apply Brand Colours to Navigation

In your navigation setup, apply brand colours to the navigation bar so the header matches the brand.

```tsx
// In your Stack Navigator screenOptions:
screenOptions={{
  headerStyle: {
    backgroundColor: colors.surfacePrimary,
  },
  headerTintColor:      colors.brandPrimary,
  headerTitleStyle:     { ...textStyles.heading, color: colors.textPrimary },
  headerShadowVisible:  false,
  headerBackTitleVisible: false,
  contentStyle: {
    backgroundColor: colors.surfaceSecondary,
  },
}}
```

---

## Step 16 — Apply Brand Colours to Status Bar

```tsx
// In your root App.tsx, inside the NavigationContainer:
import { StatusBar } from 'react-native';
import { useTheme } from './src/theme';

function AppStatusBar() {
  const { isDark } = useTheme();
  return (
    <StatusBar
      barStyle={isDark ? 'light-content' : 'dark-content'}
      backgroundColor="transparent"
      translucent
    />
  );
}
```

---

## Step 17 — Replace Hardcoded Colours in Existing Components

Search the entire `src/` directory for hardcoded hex strings and replace every occurrence with the corresponding theme token.

```bash
# Find all hardcoded hex colours in source files
grep -rn '#[0-9A-Fa-f]\{3,6\}' src/ --include="*.ts" --include="*.tsx"
```

For each result, open the file and replace the hardcoded value with the correct token from `src/theme/colors.ts`. Use `useTheme()` to access colours inside components.

Common replacements:
```
'#0066FF'  → colors.brandPrimary
'#FFFFFF'  → colors.white  (or colors.surfacePrimary for backgrounds)
'#111827'  → colors.textPrimary
'#6B7280'  → colors.textSecondary
'#F5F7FA'  → colors.surfaceSecondary
'#10B981'  → colors.success
'#F59E0B'  → colors.warning
'#EF4444'  → colors.danger
'#E5E7EB'  → colors.borderDefault
```

**Verify Step 17:**
```bash
# After replacement, this should return no results (or only results inside theme/colors.ts itself)
grep -rn '#[0-9A-Fa-f]\{6\}' src/ --include="*.tsx" | grep -v 'theme/colors.ts'
# Expected: no output
```

---

## Step 18 — Verify Haptic Feedback

Confirm `react-native-haptic-feedback` is installed and called at all four required points.

```bash
npm install react-native-haptic-feedback
cd ios && pod install && cd ..
```

Verify each call exists in the codebase:
```bash
grep -rn "HapticFeedback.trigger" src/ --include="*.ts" --include="*.tsx"
# Expected: at least 4 results:
#   impactMedium    — in document scanner onCapture callback
#   notificationSuccess — in OcrService (on OCR resolve)
#   notificationSuccess — in ContactService (on save complete)
#   notificationError   — in error handlers (catch blocks in save + scan)
```

---

## Step 19 — Final Visual Audit Checklist

Run the app on a physical device (not simulator) and verify each item visually. Check both light and dark mode by toggling the system appearance in Settings.

```
Light mode checks:
  [ ] Screen background is #F5F7FA (light grey), not white
  [ ] Card/modal backgrounds are #FFFFFF (white)
  [ ] Primary buttons are #0066FF
  [ ] Pressed primary buttons are #003DB3 (visibly darker)
  [ ] Disabled buttons are grey, not blue
  [ ] All field row labels are #6B7280 (secondary grey)
  [ ] All field values are #111827 (primary dark)
  [ ] Section headers are uppercase, #6B7280
  [ ] Bottom sheets have a soft upward shadow
  [ ] Success checkmark is #10B981 (green)
  [ ] Low-confidence fields have amber left border only, no background tint

Dark mode checks:
  [ ] Screen background is #111111 (near black)
  [ ] Card backgrounds are #1C1C1E
  [ ] Text is #F9FAFB (near white), not pure white
  [ ] Borders are #374151 (dark grey), visible but subtle
  [ ] Brand blue (#0066FF) unchanged — same in both modes
  [ ] Success green (#10B981) unchanged — same in both modes
  [ ] No element has a hardcoded white background that is invisible in dark mode

Typography checks:
  [ ] No font sizes below 12pt anywhere in the app
  [ ] Button text is 16pt semibold
  [ ] Body text is 16pt regular
  [ ] Field labels are 12pt regular above each input
  [ ] Section headers are 12pt uppercase with 0.8pt letter spacing

Icon checks:
  [ ] All icons are Feather icons — no mixed families
  [ ] Navigation bar icons are 24pt
  [ ] Field row icons are 20pt
  [ ] All icon colours match adjacent text colour
  [ ] Torch-on icon is amber (#F59E0B), torch-off is text-secondary

Animation checks:
  [ ] Scan button transitions to "Scanning..." immediately on press (not after 500ms)
  [ ] Processing screen appears before ReviewScreen (not a blank gap)
  [ ] Success checkmark animates (circle draws, then checkmark draws)
  [ ] App navigates to ScanScreen automatically 1500ms after success
  [ ] No layout jumps or flashes on year/filter changes
```

---

## Step 20 — Install Checklist

Verify all required packages are installed before declaring implementation complete.

```bash
# Confirm these are in package.json dependencies
cat package.json | grep -E "react-native-haptic-feedback|react-native-vector-icons|@react-native-community/netinfo"

# iOS pod install confirms native modules are linked
cd ios && pod install && cd ..

# TypeScript compilation passes
npx tsc --noEmit

# Expected: no errors from tsc
```

All 20 steps complete. The brand is implemented.
