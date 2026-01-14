/**
 * Media Module
 * Digital Asset Management (DAM) system
 */

// Types
export * from "./types";

// Components
export { default as MediaPickerModal } from "./components/MediaPickerModal";
export { default as MediaPickerField } from "./components/MediaPickerField";
export { default as FocalPointEditor } from "./components/FocalPointEditor";
export { default as FocalPointPicker } from "./components/FocalPointPicker";
export { default as AspectRatioPicker } from "./components/AspectRatioPicker";

// Utilities (client-safe)
export * from "./utils/mediaUtils";
// Note: imageProcessing.ts contains server-only functions (sharp/fs)
// Import directly from ./utils/imageProcessing in API routes if needed
