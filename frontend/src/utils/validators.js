export const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone);
export const validatePin = (pin) => /^\d{4}$/.test(pin);
export const validateOtp = (otp) => /^\d{6}$/.test(otp);