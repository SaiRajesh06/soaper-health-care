// src/components/profile/types.ts
export interface ProfileData {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      fullAddress: string;
    };
    preferredLanguage: string;
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
  }