function detectCardType() {
    const cardNumberInput = document.getElementById('cardNumber');
    const cardTypeOutput = document.getElementById('cardTypeOutput');

    const cardNumber = cardNumberInput.value.trim();
    let cardType = 'Unknown Card Type';

    // Card type detection logic
    if (/^4/.test(cardNumber)) {
        cardType = 'Visa';
    } else if (/^5[1-5]/.test(cardNumber)) {
        cardType = 'MasterCard';
    } else if (/^3[47]/.test(cardNumber)) {
        cardType = 'American Express';
    } else if (/^6(?:011|5)/.test(cardNumber)) {
        cardType = 'Discover';
    } else if (/^3(?:0[0-5]|[68])/.test(cardNumber)) {
        cardType = 'Diners Club';
    } else if (/^35/.test(cardNumber)) {
        cardType = 'JCB';
    }

    // Display detected card type
    cardTypeOutput.textContent = cardType;
    if(cardType == "Unknown Card Type"){
        cardTypeOutput.style.color = 'red'
    }else{
        cardTypeOutput.style.color = 'green'
    }
}

// Attach event listener (if not using inline oninput)
const cardNumberInput = document.getElementById('cardNumber');
cardNumberInput.addEventListener('input', detectCardType);

//  MCO CALCULATION  START ================================================================================================


//  MCO CALCULATION  END ================================================================================================



// ADD PASSENGER ====================================================================
document.addEventListener('DOMContentLoaded', function () {
    const passengerDetailsContainer = document.getElementById('passenger-details');
    const addPassengerButton = document.getElementById('add-passenger');    

    // Add new passenger row
    addPassengerButton.addEventListener('click', function () {
        const newPassengerRow = document.querySelector('.passenger-row').cloneNode(true);
        newPassengerRow.querySelectorAll('input, select').forEach(input => input.value = ''); // clear all the input fields
        passengerDetailsContainer.appendChild(newPassengerRow);
    });

    // Remove passenger row
    passengerDetailsContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('remove-passenger')) {
            const row = e.target.closest('.passenger-row');
            if (passengerDetailsContainer.children.length > 1) {
                row.remove();
            } else {
                alert('You must have at least one passenger.');
            }
        }
    });
});
// ADD PASSENGER ====================================================================


// Form submit Function  start ========================================================

// document.addEventListener('DOMContentLoaded', function () {
//     document.getElementById('formsubmit').addEventListener('click', function () {
//         const data = {
//             // Example data to be sent
//             name: document.getElementById('total-quoted').value,
//             email: document.getElementById('mco_desc').value
//         };

//         fetch('/newBookingForm', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(data)
//         })
//         .then(response => response.json())
//         .then(result => {
//             console.log('Success:', result);
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
//     });

// Form submit Function end ========================================================