export interface FingerprintDevice {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  ipAddress: string;
  port: number;
  serialNumber: string;
  firmwareVersion: string;
  connected: boolean;
  lastSync: Date;
  enrolledUsers: number;
  maxUsers: number;
  deviceType: "TCP" | "USB" | "SERIAL";
  status: "ONLINE" | "OFFLINE" | "ERROR" | "MAINTENANCE";
  features: DeviceFeatures;
  settings: DeviceSettings;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface DeviceFeatures {
  supportsFaceRecognition: boolean;
  supportsCardReader: boolean;
  supportsDisplay: boolean;
  supportsVoicePrompt: boolean;
  supportsWifi: boolean;
  supportsBluetooth: boolean;
  maxTemplateSize: number;
  supportedAlgorithms: string[];
}

export interface DeviceSettings {
  enrollmentQuality: 1 | 2 | 3 | 4 | 5;
  verificationTimeout: number;
  enrollmentTimeout: number;
  duplicateThreshold: number;
  volumeLevel: number;
  brightness: number;
  sleepTime: number;
  autoShutdown: boolean;
  beepOnSuccess: boolean;
  beepOnFailure: boolean;
  language: string;
  dateTimeFormat: string;
}

export interface EmployeeEnrollment {
  id: number;
  employeeId: string;
  employeeName: string;
  departmentCode: string;
  departmentName: string;
  positionCode: string;
  positionName: string;
  placementCode: string;
  placementName: string;
  fingerprintId?: string;
  enrollmentDate?: Date;
  enrollmentStatus: EnrollmentStatus;
  deviceId?: string;
  deviceName?: string;
  lastVerified?: Date;
  templateCount: number;
  enrollmentQuality?: number;
  fingerIndex?: number;
  fingerName?: string;
  remark?: string;
  enrollmentHistory: EnrollmentHistory[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface EnrollmentHistory {
  id: number;
  employeeId: string;
  action: "ENROLLED" | "RE_ENROLLED" | "DELETED" | "VERIFIED" | "FAILED";
  deviceId: string;
  deviceName: string;
  fingerIndex: number;
  quality: number;
  timestamp: Date;
  performedBy: string;
  remark?: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface EnrollmentProgress {
  enrollmentId: string;
  employeeId: string;
  deviceId: string;
  fingerIndex: number;
  currentStep: EnrollmentStep;
  totalSteps: number;
  percentage: number;
  templateCount: number;
  quality: number;
  message: string;
  instruction: string;
  success: boolean;
  error?: string;
  startTime: Date;
  estimatedCompletion?: Date;
}

export interface FingerprintTemplate {
  id: string;
  employeeId: string;
  fingerIndex: number;
  templateData: string; // Base64 encoded template
  templateSize: number;
  quality: number;
  algorithm: string;
  deviceId: string;
  enrollmentDate: Date;
  lastUsed?: Date;
  usageCount: number;
  isActive: boolean;
  checksum: string;
}

export interface EnrollmentSession {
  id: string;
  employeeId: string;
  deviceId: string;
  fingerIndex: number;
  status: "ACTIVE" | "COMPLETED" | "FAILED" | "CANCELLED";
  startTime: Date;
  endTime?: Date;
  progress: EnrollmentProgress;
  attempts: number;
  maxAttempts: number;
  performedBy: string;
}

export interface VerificationResult {
  success: boolean;
  employeeId?: string;
  employeeName?: string;
  matchScore: number;
  threshold: number;
  fingerIndex: number;
  deviceId: string;
  verificationTime: Date;
  processingTime: number; // milliseconds
  template?: FingerprintTemplate;
  error?: string;
}

export interface DeviceHealth {
  deviceId: string;
  status: "HEALTHY" | "WARNING" | "CRITICAL" | "OFFLINE";
  temperature: number;
  humidity: number;
  sensorStatus: "OK" | "DIRTY" | "DAMAGED";
  memoryUsage: number;
  storageUsage: number;
  uptime: number; // seconds
  lastMaintenance?: Date;
  issues: DeviceIssue[];
  recommendations: string[];
}

export interface DeviceIssue {
  type: "ERROR" | "WARNING" | "INFO";
  code: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
}

export interface EnrollmentStatistics {
  totalEmployees: number;
  enrolledEmployees: number;
  notEnrolledEmployees: number;
  pendingEnrollments: number;
  failedEnrollments: number;
  enrollmentRate: number; // percentage
  averageEnrollmentTime: number; // seconds
  totalTemplates: number;
  averageTemplateQuality: number;
  deviceUtilization: DeviceUtilization[];
  enrollmentTrends: EnrollmentTrend[];
  qualityDistribution: QualityDistribution[];
}

export interface DeviceUtilization {
  deviceId: string;
  deviceName: string;
  enrollmentCount: number;
  verificationCount: number;
  utilizationRate: number; // percentage
  averageResponseTime: number; // milliseconds
  errorRate: number; // percentage
}

export interface EnrollmentTrend {
  date: Date;
  enrollments: number;
  failures: number;
  averageQuality: number;
}

export interface QualityDistribution {
  qualityLevel: number;
  count: number;
  percentage: number;
}

export interface BulkEnrollmentRequest {
  employeeIds: string[];
  deviceId: string;
  fingerIndex: number;
  qualityLevel: number;
  notes?: string;
  performedBy: string;
}

export interface BulkEnrollmentResult {
  requestId: string;
  totalEmployees: number;
  successfulEnrollments: number;
  failedEnrollments: number;
  status: "IN_PROGRESS" | "COMPLETED" | "FAILED" | "CANCELLED";
  results: BulkEnrollmentItem[];
  startTime: Date;
  endTime?: Date;
}

export interface BulkEnrollmentItem {
  employeeId: string;
  employeeName: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  error?: string;
  enrollmentTime?: Date;
  quality?: number;
}

export interface ExportOptions {
  format: "CSV" | "EXCEL" | "JSON" | "XML";
  includeTemplates: boolean;
  includeHistory: boolean;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  departments?: string[];
  positions?: string[];
  enrollmentStatus?: EnrollmentStatus[];
}

export interface ImportResult {
  totalRecords: number;
  successfulImports: number;
  failedImports: number;
  warnings: string[];
  errors: ImportError[];
  duplicates: string[];
  summary: ImportSummary;
}

export interface ImportError {
  rowNumber: number;
  employeeId: string;
  error: string;
  suggestion?: string;
}

export interface ImportSummary {
  newEnrollments: number;
  updatedEnrollments: number;
  skippedRecords: number;
  invalidRecords: number;
}
// Enums
export enum EnrollmentStatus {
  NOT_ENROLLED = "NOT_ENROLLED",
  ENROLLED = "ENROLLED",
  PENDING = "PENDING",
  FAILED = "FAILED",
  EXPIRED = "EXPIRED",
  SUSPENDED = "SUSPENDED",
}

export enum EnrollmentStep {
  INITIALIZING = "INITIALIZING",
  WAITING_FOR_FINGER = "WAITING_FOR_FINGER",
  SCANNING = "SCANNING",
  PROCESSING = "PROCESSING",
  TEMPLATE_CREATION = "TEMPLATE_CREATION",
  QUALITY_CHECK = "QUALITY_CHECK",
  STORING = "STORING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum FingerIndex {
  LEFT_THUMB = 0,
  LEFT_INDEX = 1,
  LEFT_MIDDLE = 2,
  LEFT_RING = 3,
  LEFT_PINKY = 4,
  RIGHT_THUMB = 5,
  RIGHT_INDEX = 6,
  RIGHT_MIDDLE = 7,
  RIGHT_RING = 8,
  RIGHT_PINKY = 9,
}

export enum DeviceCommand {
  CONNECT = "CONNECT",
  DISCONNECT = "DISCONNECT",
  SYNC = "SYNC",
  RESET = "RESET",
  REBOOT = "REBOOT",
  CLEAR_DATA = "CLEAR_DATA",
  BACKUP = "BACKUP",
  RESTORE = "RESTORE",
  UPDATE_FIRMWARE = "UPDATE_FIRMWARE",
  CALIBRATE = "CALIBRATE",
}

// API Response Types
// export interface ApiResponse<T> {
//   success: boolean;
//   data?: T;
//   message: string;
//   errors?: string[];
//   pagination?: PaginationInfo;
//   timestamp: Date;
// }

// export interface PaginationInfo {
//   currentPage: number;
//   totalPages: number;
//   totalRecords: number;
//   pageSize: number;
//   hasNext: boolean;
//   hasPrevious: boolean;
// }

// // Search and Filter Types
// export interface EnrollmentSearchCriteria {
//   text?: string;
//   searchIndex?: number;
//   enrollmentStatus?: EnrollmentStatus;
//   departmentCode?: string;
//   positionCode?: string;
//   deviceId?: string;
//   dateRange?: {
//     startDate: Date;
//     endDate: Date;
//   };
//   qualityRange?: {
//     minQuality: number;
//     maxQuality: number;
//   };
//   pageSize?: number;
//   pageNumber?: number;
//   sortBy?: string;
//   sortDirection?: 'ASC' | 'DESC';
// }

// // WebSocket Event Types for Real-time Updates
// export interface FingerprintWebSocketEvent {
//   type: 'ENROLLMENT_PROGRESS' | 'DEVICE_STATUS' | 'VERIFICATION_RESULT' | 'ERROR';
//   data: any;
//   timestamp: Date;
//   deviceId?: string;
//   employeeId?: string;
// }

// // Configuration Types
// export interface FingerprintSystemConfig {
//   maxEnrollmentAttempts: number;
//   enrollmentTimeout: number;
//   verificationTimeout: number;
//   defaultQualityLevel: number;
//   enableAuditLog: boolean;
//   enableRealTimeSync: boolean;
//   backupInterval: number; // hours
//   maintenanceMode: boolean;
//   supportedDevices: string[];
//   defaultDeviceSettings: DeviceSettings;
// }

// // SDK Integration Types
// export interface FingerprintSDKConfig {
//   sdkType: 'ZKTECO' | 'SUPREMA' | 'NITGEN' | 'GRANDING' | 'CUSTOM';
//   dllPath?: string;
//   licenseKey?: string;
//   apiEndpoint?: string;
//   timeout: number;
//   retryAttempts: number;
//   logLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
// }

// export interface SDKResponse {
//   success: boolean;
//   data?: any;
//   errorCode?: number;
//   errorMessage?: string;
//   deviceId?: string;
//   timestamp: Date;
// }
