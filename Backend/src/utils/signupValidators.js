const {parsePhoneNumberFromString } = require('libphonenumber-js');

function isStrongPassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

function validateEmail(emailId) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailId);
}

function validatePhoneNum(phoneNum) {
    const phoneNumber = parsePhoneNumberFromString(phoneNum);
    if (!phoneNumber || !phoneNumber.isValid()) return false;

    return true;
}

function validateBirthDate(birthDate) {
    
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(birthDate)) return false;

    const [year, month, day] = birthDate.split("-").map(Number);
    if (month < 1 || month > 12) return false;

    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) return false;
    
    const today = new Date();
    const birth = new Date(birthDate);
    if(isNaN(birth.getTime()) || (birth > today)) return false;

    const age = today.getFullYear() - birth.getFullYear();
    if(age < 18 || age > 120 ) return false;

    return true;
}

function validateFields(user) {
    const { firstName, lastName, birthDate, userName, emailId, phoneNum, password } = user;
    if (!firstName || !lastName || !birthDate || !userName || !emailId || !phoneNum || !password) return false;

    return true;
}

module.exports = { validateFields, validateBirthDate, validatePhoneNum, validateEmail, isStrongPassword };