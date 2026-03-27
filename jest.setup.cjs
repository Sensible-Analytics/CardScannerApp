// Jest setup file for consistent native module mocking

// Mock react-native with all basic components
jest.mock("react-native", () => {
  const React = require("react");

  const createMockComponent = (name) => {
    return React.forwardRef(({ children, ...props }, ref) => {
      return React.createElement(name, { ...props, ref }, children);
    });
  };

  // FlatList needs special handling to render items
  const FlatList = React.forwardRef(({
    data,
    renderItem,
    keyExtractor,
    ItemSeparatorComponent,
    ListEmptyComponent,
    ListHeaderComponent,
    ...props
  }, ref) => {
    const elements = [];

    if (ListHeaderComponent) {
      elements.push(
        React.createElement(
          React.Fragment,
          { key: "__header" },
          typeof ListHeaderComponent === "function"
            ? React.createElement(ListHeaderComponent)
            : ListHeaderComponent
        )
      );
    }

    if (!data || data.length === 0) {
      if (ListEmptyComponent) {
        elements.push(
          React.createElement(
            React.Fragment,
            { key: "__empty" },
            typeof ListEmptyComponent === "function"
              ? React.createElement(ListEmptyComponent)
              : ListEmptyComponent
          )
        );
      }
    } else {
      data.forEach((item, index) => {
        if (index > 0 && ItemSeparatorComponent) {
          elements.push(
            React.createElement(
              React.Fragment,
              { key: `__sep_${index}` },
              React.createElement(ItemSeparatorComponent)
            )
          );
        }
        elements.push(
          React.createElement(
            React.Fragment,
            { key: keyExtractor ? keyExtractor(item, index) : index },
            renderItem({ item, index })
          )
        );
      });
    }

    return React.createElement("FlatList", { ...props, ref }, elements);
  });

  return {
    View: createMockComponent("View"),
    Text: createMockComponent("Text"),
    TextInput: createMockComponent("TextInput"),
    TouchableOpacity: createMockComponent("TouchableOpacity"),
    TouchableHighlight: createMockComponent("TouchableHighlight"),
    ScrollView: createMockComponent("ScrollView"),
    KeyboardAvoidingView: createMockComponent("KeyboardAvoidingView"),
    FlatList,
    Switch: createMockComponent("Switch"),
    ActivityIndicator: createMockComponent("ActivityIndicator"),
    Image: createMockComponent("Image"),
    Modal: createMockComponent("Modal"),
    SafeAreaView: createMockComponent("SafeAreaView"),
    StatusBar: createMockComponent("StatusBar"),
    Pressable: createMockComponent("Pressable"),
    Platform: {
      OS: "ios",
      select: (obj) => obj.ios || obj.default,
    },
    StyleSheet: {
      create: (styles) => styles,
      flatten: (style) => {
        if (Array.isArray(style)) {
          return Object.assign({}, ...style);
        }
        return style || {};
      },
    },
    Alert: {
      alert: jest.fn(),
      prompt: jest.fn(),
    },
    Linking: {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      openURL: jest.fn().mockResolvedValue(true),
      canOpenURL: jest.fn().mockResolvedValue(true),
      getInitialURL: jest.fn().mockResolvedValue("/"),
    },
    AppState: {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      currentState: "active",
    },
    NativeModules: {
      LaunchArgs: {
        getConstants: () => ({ launchArgs: {} }),
        getLaunchArgs: jest.fn().mockResolvedValue({}),
      },
    },
  };
});

// Mock react-native-vision-camera
jest.mock("react-native-vision-camera", () => ({
  Camera: jest.fn().mockImplementation(() => ({
    takePicture: jest.fn().mockResolvedValue({ uri: "test-uri" }),
    requestCameraPermission: jest.fn().mockResolvedValue("authorized"),
    getAvailableCameraIds: jest.fn().mockResolvedValue(["back", "front"]),
  })),

  PermissionStatus: {
    UNDETERMINED: "undetermined",
    DENIED: "denied",
    AUTHORIZED: "authorized",
  },
}));

// Mock rn-mlkit-ocr
jest.mock("rn-mlkit-ocr", () => ({
  recognizeText: jest.fn().mockResolvedValue({
    text: "John Doe\njohn.doe@example.com\n+1-555-123-4567\nAcme Inc.",
  }),
}));

// Mock react-native-share
jest.mock("react-native-share", () => ({
  open: jest.fn().mockResolvedValue(true),
  isAvailable: jest.fn().mockResolvedValue(true),
}));

// Mock react-native-fs
jest.mock("react-native-fs", () => ({
  exists: jest.fn().mockResolvedValue(true),
  mkdir: jest.fn().mockResolvedValue(undefined),
  writeFile: jest.fn().mockResolvedValue(undefined),
  readFile: jest.fn().mockResolvedValue("test content"),
  unlink: jest.fn().mockResolvedValue(undefined),
  getFSInfo: jest.fn().mockResolvedValue({}),
  getAllExternalFilesDirs: jest.fn().mockResolvedValue([]),
  getExternalStorageDirectory: jest
    .fn()
    .mockResolvedValue("/storage/emulated/0"),
  getPictureURL: jest.fn().mockResolvedValue("file:///test.jpg"),
  moveFile: jest.fn().mockResolvedValue(undefined),
  copyFile: jest.fn().mockResolvedValue(undefined),
  downloadFile: jest.fn().mockResolvedValue({ jobId: "123" }),
  stopDownload: jest.fn().mockResolvedValue(undefined),
}));

// Mock @react-native-async-storage/async-storage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  mergeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  flushGetRequests: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
  multiMerge: jest.fn(),
}));

// Mock react-native-vector-icons/MaterialCommunityIcons
jest.mock("react-native-vector-icons/MaterialCommunityIcons", () => "Icon");
