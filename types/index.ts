export interface Service {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  _count: {
    DoctorProfiles: number;
  };
}

export type Specialty = {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};
export type DoctorData = {
  doctors: Doctor[];
  services: ServiceSlug[];
};

export type Doctor = {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  trackingNumber: string;
  dob: string; // ISO date string
  gender: string | null;
  profilePicture: string;
  bio: string;
  medicalLicense: string;
  medicalLicenseExpiry: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  state: string;
  medicalSchool: string;
  graduationYear: string;
  primarySpecialization: string;
  otherSpecialties: string[];
  boardCertificates: string[];
  hospitalName: string;
  hospitalAddress: string;
  hospitalContactNumber: string;
  hospitalEmailAddress: string;
  hospitalWebsite: string;
  hospitalHoursOfOperation: string;
  servicesOffered: string[];
  insuranceAccepted: string | null;
  langaugesSpoken: string[];
  educationHistory: string;
  research: string;
  acoomplisments: string;
  page: string;
  additionalDocs: string[];
  operationMode: string;
  hourlyWage: number;
  userId: string;
  serviceId: string;
  sepecialityId: string;
  symptomIds: string[];
  createdAt: string;
  updatedAt: string;
  availability: Availability;
};

export type Availability = {
  id: string;
  doctorId: string;
  monday: string[];
  tuesDay: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
  createdAt: string;
  updatedAt: string;
};

export type ServiceSlug = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type DoctorProfile = {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  trackingNumber: string;
  dob: string;
  gender: string;
  profilePicture: string;
  bio: string;
  medicalLicense: string;
  medicalLicenseExpiry: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  state: string;
  medicalSchool: string;
  graduationYear: string;
  primarySpecialization: string;
  otherSpecialties: string[];
  boardCertificates: string[];
  hospitalName: string;
  hospitalAddress: string;
  hospitalContactNumber: string;
  hospitalEmailAddress: string;
  hospitalWebsite: string;
  hospitalHoursOfOperation: string;
  servicesOffered: string[];
  insuranceAccepted: boolean;
  langaugesSpoken: string[];
  educationHistory: string;
  research: string;
  acoomplisments: string;
  page: string;
  additionalDocs: string[];
  operationMode: string;
  hourlyWage: number;
  userId: string;
  serviceId: string;
  sepecialityId: string;
  symptomIds: string[];
  createdAt: string;
  updatedAt: string;
  availability: {
    id: string;
    doctorId: string;
    monday: string[];
    tuesDay: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
    createdAt: string;
    updatedAt: string;
  };
  sepeciality: {
    id: string;
    title: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
  };
  service: {
    id: string;
    title: string;
    slug: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type DashboardStats = {
  patients: string;
  appointments: string;
  inboxes: string;
};

export type DoctorSpeciality = {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  trackingNumber: string;
  dob: string;
  gender: string | null;
  profilePicture: string;
  bio: string;
  medicalLicense: string;
  medicalLicenseExpiry: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  state: string;
  medicalSchool: string;
  graduationYear: string;
  primarySpecialization: string;
  otherSpecialties: string[];
  boardCertificates: string[];
  hospitalName: string;
  hospitalAddress: string;
  hospitalContactNumber: string;
  hospitalEmailAddress: string;
  hospitalWebsite: string;
  hospitalHoursOfOperation: string;
  servicesOffered: string[];
  insuranceAccepted: string | null;
  languagesSpoken: string[]; // corrected spelling
  educationHistory: string;
  research: string;
  accomplishments: string; // corrected spelling
  page: string;
  additionalDocs: string[];
  operationMode: string;
  hourlyWage: number;
  userId: string;
  serviceId: string;
  sepecialityId: string; // kept as-is in case your DB uses this key, but you may want to rename to `specialityId`
  symptomIds: string[];
  createdAt: string;
  updatedAt: string;
  availability: any; // Adjust based on the expected structure, or set to `null` if not used
};

export type Speciality = {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type Specialities = {
  doctors: DoctorSpeciality[];
  specialities: Speciality[];
};
export type SearDataProps = {
  services: ServiceSlug[];
  specialities: Speciality[];
  symptoms: any[];
  doctors: DoctorSpeciality[];
};
export type RegisterDataProps = {
  email: string;
  name: string;
  password: string;
};
export const getItem = <T>(data: T[], index: number): T => data[index];
export const getItemCount = <T>(data: T[]): number => data.length;

export interface RegisterResponse {
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
    token: number;
  };
  message: string;
  status: number;
}
export type AppointmentsProps = {
  appointmentDate: string;
  userId: string;
  doctorId: string;
  charge: number;
  appointmentTime: string;
  fullName: string;
  gender: string;
  phoneNumber: string;
  email: string;
  dob: any;
  address: string;
  reason: string;
  medicdoc: string[];
  occupation: string;
};
export type Appointment = {
  id: string;
  appointmentDate: string;
  doctorId: string;
  charge: number;
  appointmentTime: string;
  fullName: string;
  gender: string;
  phoneNumber: string;
  email: string;
  dob: string;
  address: string;
  reason: string;
  medicdoc: string[];
  occupation: string;
  status: boolean;
  meetingLink: string;
  meetingProvider: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  doctor: {
    id: string;
    firstName: string;
    lastName: string;
    middleName: string;
    trackingNumber: string;
    dob: string;
    gender: string | null;
    profilePicture: string;
    bio: string;
    medicalLicense: string;
    medicalLicenseExpiry: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    state: string;
    medicalSchool: string;
    graduationYear: string;
    primarySpecialization: string;
    otherSpecialties: string[];
    boardCertificates: string[];
    hospitalName: string;
    hospitalAddress: string;
    hospitalContactNumber: string;
    hospitalEmailAddress: string;
    hospitalWebsite: string;
    hospitalHoursOfOperation: string;
    servicesOffered: string[];
    insuranceAccepted: string | null;
    langaugesSpoken: string[];
    educationHistory: string;
    research: string;
    acoomplisments: string;
    page: string;
    additionalDocs: string[];
    operationMode: string;
    hourlyWage: number;
    userId: string;
    serviceId: string;
    sepecialityId: string;
    symptomIds: string[];
    createdAt: string;
    updatedAt: string;
    sepeciality: {
      id: string;
      title: string;
      slug: string;
      createdAt: string;
      updatedAt: string;
    };
  };
};

