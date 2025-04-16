document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const form = document.querySelector('.form-container');
    const companyNameInput = document.getElementById('company-name');
    const businessPurposeInput = document.getElementById('business-purpose');
    const nameStatus = document.querySelector('.name-status');
    const addMemberButton = document.querySelector('.add-member-button');
    const memberList = document.querySelector('.member-list');
    const backButton = document.querySelector('.back-button');
    const nextButton = document.querySelector('.next-button');

    // Company name validation
    let nameCheckTimeout;
    companyNameInput.addEventListener('input', function() {
        clearTimeout(nameCheckTimeout);
        const name = this.value.trim();
        
        // Update status to checking
        nameStatus.className = 'name-status pending';
        nameStatus.innerHTML = '<span class="material-icons">hourglass_empty</span><span>Checking availability...</span>';

        nameCheckTimeout = setTimeout(() => {
            checkCompanyName(name);
        }, 500);
    });

    // Check company name availability
    async function checkCompanyName(name) {
        if (!name) {
            nameStatus.className = 'name-status';
            nameStatus.innerHTML = '';
            return;
        }

        // Check if name contains required terms
        const hasLLCTerm = /LLC|L\.L\.C\.|Limited Liability Company/i.test(name);
        if (!hasLLCTerm) {
            nameStatus.className = 'name-status error';
            nameStatus.innerHTML = '<span class="material-icons">error</span><span>Name must include "LLC", "L.L.C." or "Limited Liability Company"</span>';
            return;
        }

        try {
            // Simulate API call to check name availability
            await new Promise(resolve => setTimeout(resolve, 1000));
            const isAvailable = Math.random() > 0.3; // Simulate 70% chance of availability

            if (isAvailable) {
                nameStatus.className = 'name-status success';
                nameStatus.innerHTML = '<span class="material-icons">check_circle</span><span>Name is available!</span>';
            } else {
                nameStatus.className = 'name-status error';
                nameStatus.innerHTML = '<span class="material-icons">error</span><span>Name is not available</span>';
            }
        } catch (error) {
            nameStatus.className = 'name-status error';
            nameStatus.innerHTML = '<span class="material-icons">error</span><span>Error checking name availability</span>';
        }
    }

    // Add member functionality
    addMemberButton.addEventListener('click', function() {
        const memberItem = document.createElement('div');
        memberItem.className = 'member-item';
        memberItem.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>First Name</label>
                    <input type="text" placeholder="Enter first name">
                </div>
                <div class="form-group">
                    <label>Last Name</label>
                    <input type="text" placeholder="Enter last name">
                </div>
            </div>
            <div class="form-group">
                <label>Ownership Percentage</label>
                <input type="number" placeholder="Enter ownership percentage" min="0" max="100">
            </div>
            <button type="button" class="remove-member">
                <span class="material-icons">remove_circle_outline</span>
            </button>
        `;

        memberList.appendChild(memberItem);

        // Add remove functionality
        const removeButton = memberItem.querySelector('.remove-member');
        removeButton.addEventListener('click', function() {
            memberItem.remove();
            validateForm();
        });

        // Add validation for the new member's inputs
        const inputs = memberItem.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', validateForm);
        });

        validateForm();
    });

    // Form validation
    function validateForm() {
        let isValid = true;

        // Validate company name
        if (!companyNameInput.value.trim() || nameStatus.classList.contains('error')) {
            isValid = false;
        }

        // Validate business purpose
        if (!businessPurposeInput.value.trim()) {
            isValid = false;
        }

        // Validate address fields
        const addressInputs = form.querySelectorAll('#street-address, #city, #state, #zip');
        addressInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
            }
        });

        // Validate members
        const members = memberList.querySelectorAll('.member-item');
        let totalOwnership = 0;

        members.forEach(member => {
            const inputs = member.querySelectorAll('input');
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                }
            });

            const ownershipInput = member.querySelector('input[type="number"]');
            totalOwnership += parseInt(ownershipInput.value || 0);
        });

        if (members.length > 0 && totalOwnership !== 100) {
            isValid = false;
        }

        // Enable/disable next button
        nextButton.disabled = !isValid;
    }

    // Add validation listeners to all form inputs
    const formInputs = form.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('input', validateForm);
    });

    // Navigation
    backButton.addEventListener('click', function() {
        window.location.href = 'llc.html';
    });

    nextButton.addEventListener('click', function() {
        if (validateForm()) {
            // Collect form data
            const formData = {
                companyName: companyNameInput.value,
                businessPurpose: businessPurposeInput.value,
                address: {
                    street: document.getElementById('street-address').value,
                    unit: document.getElementById('address-unit').value,
                    city: document.getElementById('city').value,
                    state: document.getElementById('state').value,
                    zip: document.getElementById('zip').value
                },
                registeredAgent: document.querySelector('input[name="agent-type"]:checked').value,
                members: Array.from(memberList.querySelectorAll('.member-item')).map(member => {
                    const inputs = member.querySelectorAll('input');
                    return {
                        firstName: inputs[0].value,
                        lastName: inputs[1].value,
                        ownership: inputs[2].value
                    };
                })
            };

            // Store form data in session storage
            sessionStorage.setItem('llcFormData', JSON.stringify(formData));

            // Redirect to payment page
            window.location.href = 'payment.html';
        }
    });

    // Initial form validation
    validateForm();
}); 