// Jest setup file for consistent native module mocking

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

// Mock react-native/Libraries/Linking/Linking
jest.mock("react-native/Libraries/Linking/Linking", () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  openURL: jest.fn().mockResolvedValue(true),
  canOpenURL: jest.fn().mockResolvedValue(true),
  getInitialURL: jest.fn().mockResolvedValue("/"),
}));

// Mock react-native/Libraries/Alert/Alert
jest.mock("react-native/Libraries/Alert/Alert", () => ({
  alert: jest.fn(),
  prompt: jest.fn(),
}));

// Mock react-native/Libraries/AppState/AppState
jest.mock("react-native/Libraries/AppState/AppState", () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  currentState: "active",
}));
