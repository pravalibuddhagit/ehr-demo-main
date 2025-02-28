
const PATTERNS = {
    NAME: /^(?=.*[A-Za-z])[A-Za-z\s]+$/, // Letters and spaces only
    LAST_NAME:/^[A-Za-z]+$/, // Starts with letter 
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email format
    PASSWORD: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$_!%*?&])[A-Za-z\d@_$!%*?&]{3,8}$/, // 3-8 chars, uppercase, number, special
    MOBILE_PHONE: /^\(\d{3}\) \d{3}-\d{4}$/, // (123) 456-7890
    ZIPCODE: /^\d{5}(\d{4})?$/, // 5 or 9 digits
    DOB: /^\d{4}-\d{2}-\d{2}$/, //yyyy-mm-dd format
    OBJECT_ID: /^[0-9a-fA-F]{24}$/, // MongoDB ObjectId format
    TIME_SLOT: /^(9AM - 10AM|10AM - 11AM|11AM - 12PM|12PM - 1PM|2PM - 3PM|3PM - 4PM|4PM - 5PM|5PM - 6PM)$/, // Time slots
    ISO_DATE: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, // UTC ISO 8601 format (e.g., 2025-03-03T00:00:00.000Z)
  };
  
  // Validation functions
  const validateField = (field, value, pattern, maxLength, required = true, customMessage,validateFn) => {
    // Convert value to string if it exists, or treat as empty if undefined/null
  const stringValue = value != null ? String(value) : '';

  if (required && (!value || stringValue.trim() === '')) {
    return `${field} is required`;
  }
  if (stringValue && maxLength && stringValue.length > maxLength) {
    return `${field} must be max ${maxLength} characters`;
  }
  if (stringValue && pattern && !pattern.test(stringValue)) {
    return customMessage || `${field} is invalid`;
  }
  // Apply custom validate function if provided
  if (validateFn && value !== undefined && !validateFn(value)) {
    return customMessage || `${field} is invalid`;
  }

  return null;
  };
  
  const validateObject = (data, rules) => {
    const errors = {};
  
    for (const [field, rule] of Object.entries(rules)) {
      const error = validateField(
        field,
        data[field],
        rule.pattern,
        rule.maxLength,
        rule.required,
        rule.customMessage,
        rule.validate // Pass the validate function
      );
      if (error) errors[field] = error;
    }
  
    return Object.keys(errors).length > 0 ? errors : null;
  };
  
  //validators for reuse
  const validateRegistration = (data) => {
    const rules = {
      first_name: { pattern: PATTERNS.NAME, maxLength: 35, required: true },
      last_name: { pattern: PATTERNS.LAST_NAME, maxLength: 35, required: true },
      email: { pattern: PATTERNS.EMAIL, required: true },
      password: {
        pattern: PATTERNS.PASSWORD,
        required: true,
        customMessage:
          'Password must be 3-8 characters long and include at least one uppercase letter, one number, and one special character',
      },
    };
    return validateObject(data, rules);
  };
  
  const validateUser = (data) => {
    const rules = {
      first_name: { pattern: PATTERNS.NAME, maxLength: 35, required: true },
      last_name: { pattern: PATTERNS.LAST_NAME, maxLength: 35, required: true },
      email: { pattern: PATTERNS.EMAIL, required: true },
      mobile_phone: {
        pattern: PATTERNS.MOBILE_PHONE,
        maxLength: 14,
        required: true,
        customMessage: 'Mobile phone must be in format (123) 456-7890',
      },
      address_line_1: { maxLength: 40, required: true },
      address_line_2: { maxLength: 100, required: false },
      city: { pattern: PATTERNS.NAME,  maxLength: 35, required: true },
      state: {  pattern: PATTERNS.NAME, maxLength: 20, required: true },
      country: {  pattern: PATTERNS.NAME, maxLength: 20, required: true },
      zipcode: { pattern: PATTERNS.ZIPCODE, required: true, customMessage: 'Zipcode must be 5 or 9 digits' },
      dob: {
        pattern: PATTERNS.DOB,
        required: true,
        customMessage: 'Date of birth must be in yyyy-mm-dd format and not in the future',
      },
      gender: {
        required: true,
        customMessage: 'Gender must be male, female, or other',
        validate: (value) => ['male', 'female', 'other'].includes(String(value)),
      },
      agreeToTerms: {
        required: true,
        customMessage: 'agreeToTerms must be a boolean',
        validate: (value) => typeof value === 'boolean',
      },
      allowNotifications: {
        required: false,
        customMessage: 'allowNotifications must be a boolean',
        validate: (value) => typeof value === 'boolean',
      },
    };
  
    const errors = validateObject(data, rules) || {};
  
 // Additional DOB validation for yyyy-mm-dd format
 if (!errors.dob && data.dob) {
  const [year, month, day] = data.dob.split('-').map(Number);
  const date = new Date(year, month - 1, day); // month is 0-based in JS
  const today = new Date();

  if (
    isNaN(date.getTime()) || // Invalid date
    date.getMonth() !== month - 1 || // Month mismatch
    date.getDate() !== day || // Day mismatch
    date.getFullYear() !== year || // Year mismatch
    date > today // Future date check
  ) {
    errors.dob = 'Invalid date of birth or date is in the future';
  }
}
  
    return errors;
  };

  const validatePatient = (data) => {
    const rules = {
      first_name: {
        pattern: PATTERNS.NAME,
        maxLength: 35,
        required: true,
        customMessage: 'First name must contain alphabets and spaces only',
      },
      last_name: {
        pattern: PATTERNS.LAST_NAME,
        maxLength: 35,
        required: true,
        customMessage: 'Last name must contain alphabets only',
      },
      email: {
        pattern: PATTERNS.EMAIL,
        required: true,
        customMessage: 'Enter a valid email',
      },
      mobile_phone: {
        pattern: PATTERNS.MOBILE_PHONE,
        required: true,
        customMessage: 'Mobile phone must be in format (123) 456-7890',
      },
      address_line_1: {
        maxLength: 40,
        required: true,
        customMessage: 'Address Line 1 is required',
      },
      dob: {
        pattern: PATTERNS.DOB,
        required: true,
        customMessage: 'Date of birth must be in yyyy-mm-dd format and not in the future',
      },
      gender: {
        required: true,
        customMessage: 'Gender must be male, female, or other',
        validate: (value) => ['male', 'female', 'other'].includes(String(value)),
      },
    };
  
    let errors = validateObject(data, rules) || {};
  
    // Additional DOB validation for yyyy-mm-dd format
    if (!errors.dob && data.dob) {
      const [year, month, day] = data.dob.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const today = new Date();
      if (
        isNaN(date.getTime()) ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day ||
        date.getFullYear() !== year ||
        date > today
      ) {
        errors.dob = 'Invalid date of birth or date is in the future';
      }
    }
  
    return errors;
  };

  // New validator for appointments
const validateAppointment = (data) => {
  const rules = {
     provider_id: {
      pattern: PATTERNS.OBJECT_ID,
      required: true,
      customMessage: 'Provider ID must be a valid ObjectId',
    },
    patient_id: {
      pattern: PATTERNS.OBJECT_ID,
      required: true,
      customMessage: 'Patient ID must be a valid ObjectId',
    },
    reason: {
      maxLength: 500,
      required: true,
      customMessage: 'Reason is required and must be 500 characters or less',
    },
    appointment_date: {
      pattern: PATTERNS.ISO_DATE, // Validate UTC ISO format
      required: true,
      customMessage: 'Appointment date must be in ISO 8601 UTC format (e.g., 2025-03-03T00:00:00.000Z)',
    },
    appointment_time: {
      pattern: PATTERNS.TIME_SLOT,
      required: true,
      customMessage: 'Time slot must be one of the predefined options',
    },
    status: {
      required: false,
      customMessage: 'Status must be pending, confirmed, or cancelled',
      validate: (value) => ['pending', 'completed', 'rejected'].includes(String(value)),
    },
  };

  let errors = validateObject(data, rules) || {};

  // ✅ Additional validation: Check if appointment_date is in the future
  if (!errors.appointment_date && data.appointment_date) {
    const appointmentDate = new Date(data.appointment_date);
    const today = new Date();

    if (isNaN(appointmentDate.getTime())) {
      errors.appointment_date = 'Invalid appointment date';
    } else if (appointmentDate < today) {
      errors.appointment_date = 'Appointment date cannot be in the past';
    }
  }

  return errors ;
};
  
  module.exports = {
    validateRegistration,
    validateUser,
    validateField,
    validatePatient,
    validateAppointment,
    PATTERNS,
  };