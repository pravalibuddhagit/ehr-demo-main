export interface User {
    _id?: string;  // Optional, since MongoDB auto-generates it
    first_name: string;
    last_name: string;
    email: string;
    mobile_phone: string;
    address_line_1: string;
    address_line_2?: string;  // Optional
    city: string;
    state: string;
    zipcode: string;
    country: string;  // Defaults to 'UK' in backend
    dob: Date;
    notes: string;  // Optional
    gender: string;
    agreeToTerms: boolean;
    allowNotifications?: boolean;  // Defaults to false in backend
  }
  