
let odData = null;
let currentStatus = "Pending";

function openPage(page) {
    document.querySelectorAll(".content, .subpage")
        .forEach(section => section.classList.add("hidden"));

    if (page === "homePage") {
        document.querySelector(".content").classList.remove("hidden");
    } else {
        document.getElementById(page).classList.remove("hidden");
    }
}

function showNotification() {
    alert("You have no new notifications.");
}

document.getElementById("odForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;

    if (start >= end) {
        alert("Please select a valid OD time.");
        return;
    }

    odData = {
        student: document.getElementById("student").value,
        roll: document.getElementById("roll").value,
        department: document.getElementById("department").value,
        purpose: document.getElementById("purpose").value,
        venue: document.getElementById("venue").value,
        date: document.getElementById("date").value,
        start: start,
        end: end
    };

    currentStatus = "Pending";

    document.getElementById("welcomeName").innerText =
        odData.student + "!";

    document.getElementById("mainStatus").innerText = "Pending";

    updateStatus();

    document.getElementById("historyList").innerHTML = `
        <div class="history-item">
            <h3>${odData.purpose}</h3>
            <p>Venue: ${odData.venue}</p>
            <p>Date: ${odData.date}</p>
            <p>Status: Pending</p>
        </div>
    `;

    alert("OD application submitted successfully!");

    this.reset();
    openPage("statusPage");
});

function updateStatus() {
    if (!odData) return;

    document.getElementById("statusDetails").innerHTML = `
        <h3>Application Details</h3>
        <p>Name: ${odData.student}</p>
        <p>Register No: ${odData.roll}</p>
        <p>Department: ${odData.department}</p>
        <p>Purpose: ${odData.purpose}</p>
        <p>Venue: ${odData.venue}</p>
        <p>Date: ${odData.date}</p>
        <p>Time: ${odData.start} - ${odData.end}</p>
        <h3>Current Status: ${currentStatus}</h3>
    `;

    document.getElementById("mainStatus").innerText = currentStatus;
}

function checkLocation() {
    if (!odData || currentStatus !== "Approved") {
        alert("Location check-in is available only after OD approval.");
        return;
    }

    if (!navigator.geolocation) {
        alert("Location is not supported.");
        return;
    }

    if (!confirm("Do you agree to share your location for this OD check-in?")) {
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            document.getElementById("locationResult").innerHTML = `
                <h3>Location Check-in Successful</h3>
                <p>Latitude: ${lat}</p>
                <p>Longitude: ${lon}</p>
                <a target="_blank" href="https://www.google.com/maps?q=${lat},${lon}">
                    View Location on Map
                </a>
                <p>Check-in time: ${new Date().toLocaleTimeString()}</p>
                <button class="secondary" onclick="stopLocation()">
                    End Location Sharing
                </button>
            `;
        },
        () => {
            alert("Location permission denied or unavailable.");
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

function stopLocation() {
    document.getElementById("locationResult").innerHTML =
        "<p>Location sharing stopped.</p>";
}

document.getElementById("date").min =
    new Date().toISOString().split("T")[0];
