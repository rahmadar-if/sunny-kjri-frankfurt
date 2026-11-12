export type Language = 'en' | 'id';

export type ServiceType = 
  | 'passport-expired' 
  | 'passport-appointment-only' 
  | 'passport-damaged' 
  | 'passport-lost'
  | 'other-consular-services';

export interface ServiceItem {
  id: ServiceType;
  titleEn: string;
  titleId: string;
  tagEn: string;
  tagId: string;
  descriptionEn: string;
  descriptionId: string;
  feeEur: number;
  durationEn: string;
  durationId: string;
  iconName: string;
  requiredDocsEn: string[];
  requiredDocsId: string[];
}

export type ApplicationStatus = 
  | 'submitted'
  | 'verified'
  | 'appointment_ready'
  | 'in_production'
  | 'ready_for_pickup'
  | 'cancelled';

export interface ApplicationRecord {
  id: string;
  serviceId: ServiceType;
  serviceName: string;
  applicantName: string;
  nik: string;
  passportNumber: string;
  email: string;
  phone: string;
  germanAddress: string;
  passportType: 'electronic' | 'ordinary';
  status: ApplicationStatus;
  submissionDate: string;
  appointmentDate?: string;
  appointmentTime?: string;
  notes?: string;
  feePaid: number;
  qrCodeUrl?: string;
  dhlTrackingNumber?: string;
  dhlStatus?: string;
  dhlEstimatedDelivery?: string;
  cancellationReason?: string;
  rescheduledAt?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  nik: string;
  currentPassportNo: string;
  passportExpiry: string;
  phone: string;
  germanAddress: string;
  city: string;
  postalCode: string;
  peduliWniStatus: 'verified' | 'pending' | 'unregistered';
  peduliWniId: string;
}

export interface FaqItem {
  category: 'passport' | 'peduli-wni' | 'fees' | 'appointment';
  questionEn: string;
  questionId: string;
  answerEn: string;
  answerId: string;
}
