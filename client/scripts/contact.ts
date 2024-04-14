"use strict";

/**
 * Contact class for the contact form
 */
class Contact {

    constructor(private readonly firstName: string, private readonly lastName: string, private readonly email: string,
                private readonly subject:string, private readonly message: string,
                private readonly address:string, private readonly phone:string) {

    }

    /**
     * Get concatenated full name
     * @returns {string}
     */
    getFullName() {
        return `${this.firstName} ${this.lastName}`
    }

    /**
     * Returns elements for modal body displaying all the objects properties
     * @returns {Node[]}
     */
    toFormModalBody() {

        const elements = [];

        const nameParagraph = document.createElement("p");
        nameParagraph.appendChild(
            document.createTextNode(`Thank you for submitting your request ${this.getFullName()} for subject '${this.subject}' which contains the following message:`))
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