
const PATTERNS = {
    NAME: /^(?=.*[A-Za-z])[A-Za-z\s]+$/, // Letters and spaces only
    LAST_NAME:/^[A-Za-z]+$/, // Starts with letter 
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email format
    PASSWORD: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$_!%*?&])[A-Za-z\d@_$!%*?&]{3,8}$/, // 3-8 chars, uppercase, number, special
    MOBILE_PHONE: /^\(\d{3}\) \d{3}-\d{4}$/, // (123) 456-7890
    ZIPCODE: /^\d{5}(\d{4})?$/, // 5 or 9 digits
    DOB: /^\d{4}-\d{2}-\d{2}$/, //yyyy- mm-dd format
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
  
  module.exports = {
    validateRegistration,
    validateUser,
    validateField,
    PATTERNS,
  };