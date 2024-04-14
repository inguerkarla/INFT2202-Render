"use strict";
class Contact {
    firstName;
    lastName;
    email;
    subject;
    message;
    address;
    phone;
    constructor(firstName, lastName, email, subject, message, address, phone) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.subject = subject;
        this.message = message;
        this.address = address;
        this.phone = phone;
    }
    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    toFormModalBody() {
        const elements = [];
        const nameParagraph = document.createElement("p");
        nameParagraph.appendChild(document.createTextNode(`Thank you for submitting your request ${this.getFullName()} for subject '${this.subject}' which contains the following message:`));
        elements.push(nameParagraph);
        const messageParagraph = document.createElement("p");
        messageParagraph.innerHTML = `<i>${this.message}</i>`;
        elements.push(messageParagraph);
        const emailParagraph = document.createElement("p");
        emailParagraph.innerHTML = `A response will be returned to you shortly by our staff to the email you specified, ${this.email}.`;
        elements.push(emailParagraph);
        const addressParagraph = document.createElement("p");
        addressParagraph.innerHTML = `Address: ${this.address}`;
        elements.push(addressParagraph);
        const phoneParagraph = document.createElement("p");
        phoneParagraph.innerHTML = `Phone: ${this.phone}`;
        elements.push(phoneParagraph);
        return elements;
    }
}
//# sourceMappingURL=contact.js.map