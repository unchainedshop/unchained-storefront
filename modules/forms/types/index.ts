/**
 * Form Types
 * Shared type definitions for form builder
 */

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "file";

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  options?: FormFieldOption[]; // For select, radio, checkbox
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  width?: "full" | "half"; // Grid layout
  order: number;
}

export interface FormSettings {
  submitButtonText: string;
  successMessage: string;
  redirectUrl?: string;
  emailNotification: {
    enabled: boolean;
    to: string[];
    subject: string;
    includeSubmissionData: boolean;
  };
  captcha: {
    enabled: boolean;
    provider?: "recaptcha" | "hcaptcha";
  };
  limitSubmissions?: {
    enabled: boolean;
    maxPerUser?: number;
    maxTotal?: number;
  };
}

export interface Form {
  id: string;
  name: string;
  slug: string;
  description?: string;
  fields: FormField[];
  settings: FormSettings;
  status: "draft" | "published" | "archived";
  submissionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, unknown>;
  metadata: {
    userAgent?: string;
    ip?: string;
    referrer?: string;
    locale?: string;
  };
  status: "new" | "read" | "archived" | "spam";
  submittedAt: string;
}

export type FormStatus = Form["status"];
export type SubmissionStatus = FormSubmission["status"];
