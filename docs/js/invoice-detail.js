const backendURL = 'https://user-data-management-backend.vercel.app';





document.addEventListener("DOMContentLoaded", function() {
    const invoiceForm = document.getElementById("invoice-form");
    const invoiceDetailsContainer = document.getElementById("invoice-details-container");
    const addInvoiceDetailBtn = document.getElementById("add-invoice-detail");
    const invoiceDetails = []; // Array to store invoice details

    let detailCount = 0; // Counter to track number of invoice details

    // Function to add a new invoice detail
    function addInvoiceDetail() {
        detailCount++;
        const newDetail = {
            description: "",
            hsnCode: "",
            quantity: "",
            rate: "",
            amount: ""
        };

        invoiceDetails.push(newDetail); // Add empty detail to array

        const invoiceDetail = document.createElement("div");
        invoiceDetail.classList.add("invoice-detail");

        invoiceDetail.innerHTML = `
            <div class="form-group">
                <input type="text" class="form-control description" data-detail="${detailCount}" name="description" placeholder="Description">
            </div>
            <div class="form-group">
                <input type="text" class="form-control hsnCode" data-detail="${detailCount}" name="hsnCode" placeholder="HSN Code">
            </div>
            <div class="form-group">
                <input type="number" class="form-control quantity" data-detail="${detailCount}" name="quantity" placeholder="Quantity">
            </div>
            <div class="form-group">
                <input type="number" class="form-control rate" data-detail="${detailCount}" name="rate" placeholder="Rate">
            </div>
            <div class="form-group">
                <input type="number" class="form-control amount" data-detail="${detailCount}" name="amount" placeholder="Amount" readonly>
            </div>
        `;
        invoiceDetailsContainer.appendChild(invoiceDetail);
    }

    // Event listener for add invoice detail button
    addInvoiceDetailBtn.addEventListener("click", addInvoiceDetail);

    // Event listener for input fields to calculate amount
    invoiceDetailsContainer.addEventListener("input", function(event) {
        const target = event.target;
        if (target.classList.contains('quantity') || target.classList.contains('rate')) {
            const detailNumber = target.dataset.detail;
            const quantity = parseFloat(document.querySelector(`.quantity[data-detail="${detailNumber}"]`).value);
            const rate = parseFloat(document.querySelector(`.rate[data-detail="${detailNumber}"]`).value);
            const amount = quantity * rate;
            document.querySelector(`.amount[data-detail="${detailNumber}"]`).value = isNaN(amount) ? '' : amount;
            // Update corresponding detail in array
            const index = detailNumber - 1; // Adjust for 0-based index

            invoiceDetails[index] = {
                description: invoiceForm.querySelector(`.description[data-detail="${detailNumber}"]`).value,
                hsnCode: invoiceForm.querySelector(`.hsnCode[data-detail="${detailNumber}"]`).value,
                quantity: quantity,
                rate: rate,
                amount: isNaN(amount) ? '' : amount
            };
            // invoiceDetails[index].quantity = quantity;
            // invoiceDetails[index].rate = rate;
            // invoiceDetails[index].amount = amount;

        }
    });

    // Event listener for form submission
    invoiceForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Send POST request to backend with invoiceDetails
        fetch(`${backendURL}/create-invoice`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                wsaddress: invoiceForm.wsaddress.value,
                wsgsstin: invoiceForm.wsgsstin.value,
                wspanno: invoiceForm.wspanno.value,
                rname: invoiceForm.rname.value,
                rbname: invoiceForm.rbname.value,
                raddress: invoiceForm.raddress.value,
                rgstin: invoiceForm.rgstin.value,
                invoiceDetails: invoiceDetails
            })
        })
        .then(response => {
            if (response.ok) {
                // Handle successful response
                console.log('Invoice generated successfully');
                invoiceForm.reset();
                invoiceDetails.length = 0;  
                invoiceDetailsContainer.innerHTML = '';

                 const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json(); // Parse JSON response
            } else {
                // Handle non-JSON response (e.g., PDF)
                return response.blob(); // Parse response as blob (PDF)
            }
            } else {
                // Handle error response
                console.error('Failed to generate invoice');
                throw new Error('Failed to generate invoice');
            }
        })
        .then(data => {
            if (data && data.invoiceUrl) {
                // Handle JSON response (if any)
                console.log('Invoice URL:', data.invoiceUrl);
                window.location.href = data.invoiceUrl; // Redirect to generated invoice URL
            } else {
                // Handle non-JSON response (e.g., PDF)
                console.log('Received PDF invoice');
                // Display or download the PDF
                const blob = new Blob([data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
    
                // Display the PDF in a new tab
                window.open(url);
    
                // To download the PDF instead:
                // const link = document.createElement('a');
                // link.href = url;
                // link.download = 'invoice.pdf';
                // document.body.appendChild(link);
                // link.click();
                // document.body.removeChild(link)
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle network errors or other exceptions
        });
    });
});
