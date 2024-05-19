const backendURL = 'http://localhost:80';





document.addEventListener("DOMContentLoaded", function() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    const billForm = document.getElementById("importbill-form");
    const billDetailsContainer = document.getElementById("bill-details-container");
    const addbillDetailBtn = document.getElementById("add-bill-detail");
    const billDetails = []; // Array to store bill details

    let detailCount = 0; // Counter to track number of bill details

    // Function to add a new bill detail
    function addbillDetail() {
        detailCount++;
        const newDetail = {
            description: "",
            quantity: "",
            rate: "",
            amount: ""
        };

        billDetails.push(newDetail); // Add empty detail to array

        const billDetail = document.createElement("div");
        billDetail.classList.add("bill-detail");

        billDetail.innerHTML = `
            <div class="form-group">
                <input type="text" class="form-control description" data-detail="${detailCount}" name="description" placeholder="Description">
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
        billDetailsContainer.appendChild(billDetail);
    }

    // Event listener for add bill detail button
    addbillDetailBtn.addEventListener("click", addbillDetail);

    // Event listener for input fields to calculate amount
    billDetailsContainer.addEventListener("input", function(event) {
        const target = event.target;
        if (target.classList.contains('quantity') || target.classList.contains('rate')) {
            const detailNumber = target.dataset.detail;
            const quantity = parseFloat(document.querySelector(`.quantity[data-detail="${detailNumber}"]`).value);
            const rate = parseFloat(document.querySelector(`.rate[data-detail="${detailNumber}"]`).value);
            const amount = quantity * rate;
            document.querySelector(`.amount[data-detail="${detailNumber}"]`).value = isNaN(amount) ? '' : amount;
            // Update corresponding detail in array
            const index = detailNumber - 1; // Adjust for 0-based index

            billDetails[index] = {
                description: billForm.querySelector(`.description[data-detail="${detailNumber}"]`).value,
                quantity: quantity,
                rate: rate,
                amount: isNaN(amount) ? '' : amount
            };
            // billDetails[index].quantity = quantity;
            // billDetails[index].rate = rate;
            // billDetails[index].amount = amount;

        }
    });

    // Event listener for form submission
    billForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the default form submission


        // Send POST request to backend with billDetails
        fetch(`${backendURL}/importbill`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                userId:userId,
                vendorname: billForm.vendorname.value,
                invoiceDate: billForm.invoiceDate.value,
                billDetails: billDetails
            })
        })
        .then(response => {
            if (response.ok) {
                // Handle successful response
                console.log('bill saved successfully');
                alert("bill saved successfully");
                billForm.reset();
            // Clear the bill details array
            billDetails.length = 0;
            // Clear bill details container
            billDetailsContainer.innerHTML = '';
            detailCount =0;
            } else if(response.status === 401){
                alert("Unauthorized personal please signin/login first ");

                window.location.href = '../signin.html';
            }
            else {
                // Handle error response
                alert('bill not saved');

                console.error('Failed to save bill');
                throw new Error('Failed to save bill');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle network errors or other exceptions
        });
    });





    const viewInsightsBtn = document.getElementById("view-insights-btn");
    const searchsection = document.querySelector(".search-section");
    const importBillList = document.querySelector(".bill-list-section");
    const searchForm  =  document.getElementById('search-form');

    // Event listener for "View Insights" button click
    viewInsightsBtn.addEventListener("click", function(event) {
        event.preventDefault();
        // Show search form and import bill list
        searchsection.style.display = "block";
        importBillList.style.display = "block";
        // Fetch and display import bill list
        fetchImportBillList();
    });

    // Event listener for search form submission
    searchForm.addEventListener("submit", async function(event) {
        event.preventDefault();
        // Fetch and display filtered import bill list based on search criteria
        await fetchImportBillList();
    });

    async function fetchImportBillList() {
        // Fetch import bill list data from the server
        try {
            const response = await fetch(`${backendURL}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    userId : userId,
                    vendorname : searchForm.vendorname.value,
                    startDate : searchForm.startDate.value,
                    endDate : searchForm.endDate.value

                    // Include search criteria here (if any)

                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch import bill list');
            }

            const data = await response.json();
            // Call a function to display the import bill list dynamically
            displayImportBillList(data);
        } catch (error) {
            console.error('Error:', error);
            // Handle error
        }
    }

function displayImportBillList(data) {
        
        const billListContainer = document.getElementById("bill-list-container");

// Assuming the response variable contains the JSON response you provided
const { bills, totalAmount } = data;

// Clear previous content of the container
billListContainer.innerHTML = '';
const totalAmountElement = document.createElement('p');
totalAmountElement.textContent = `Total Amount: ${totalAmount}`;


// Iterate through the bills array and create HTML elements to display each bill
bills.forEach(bill => {
    // Create a card element for each bill
    const card = document.createElement('div');
    card.classList.add('card');
    
    // Construct HTML content for the card using bill data
    card.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">Vendor: ${bill.vendorname}</h5>
            <p class="card-text">Invoice Date: ${bill.invoiceDate}</p>
            <ul class="list-group">
                ${bill.billDetails.map(detail => `
                    <li class="list-group-item">
                        Description: ${detail.description}, Quantity: ${detail.quantity}, Rate: ${detail.rate}, Amount: ${detail.amount}
                    </li>
                `).join('')}
            </ul>
        </div>
        <br>
    `;
    
    // Append the card to the container
    billListContainer.appendChild(card);


    
    
});
billListContainer.appendChild(totalAmountElement);


}
});