document.addEventListener('DOMContentLoaded', () => {
    const statusText = document.getElementById('status');
    const violationCountSpan = document.getElementById('violationCount');
    const maxViolationsSpan = document.getElementById('maxViolations');
    const startButton = document.getElementById('startExamButton');

    // Function to update the popup display
    function updateStatus(count, max) {
        violationCountSpan.textContent = count;
        maxViolationsSpan.textContent = max;
        statusText.textContent = count >= max ? 'TERMINATED' : 'Active';
    }

    // Get initial status from the background script
    chrome.runtime.sendMessage({ action: "GET_VIOLATION_COUNT" }, (response) => {
        if (response) {
            updateStatus(response.count, response.max);
        }
    });

    // Handle the "Start Proctoring" button click
    startButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: "START_PROCTORING" }, (response) => {
            if (response && response.status === "Proctoring started") {
                alert("Proctoring has begun. Do not switch tabs or look away!");
                updateStatus(0, 3);
            }
        });
    });
});