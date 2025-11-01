const VIOLATION_MESSAGE = "Browser focus lost! Exam will be terminated if you switch again.";
let violationFlag = false; 

// Function to enforce the lockdown visual
function enforceLockdown(message) {
    let blocker = document.getElementById('no-nakal-blocker');
    if (!blocker) {
        blocker = document.createElement('div');
        blocker.id = 'no-nakal-blocker';
        document.body.appendChild(blocker);
    }
    blocker.textContent = message;
}

// Listener for tab/window switching (loss of focus)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        
        if (violationFlag) {
            enforceLockdown("TERMINATION: Too many focus violations. Exam is over.");
            chrome.runtime.sendMessage({ action: "VIOLATION_DETECTED" });
            // This is the final, unrecoverable termination event.
            return;
        }

        violationFlag = true;
        enforceLockdown(VIOLATION_MESSAGE);
        
        // Notify the background script to record the violation
        chrome.runtime.sendMessage({ action: "VIOLATION_DETECTED" }, (response) => {
            console.warn(`Focus violation. Count: ${response.count}`);
        });

    } else {
        // User returned to the tab, remove the warning but keep the violation recorded
        let blocker = document.getElementById('no-nakal-blocker');
        if (blocker) {
            blocker.remove();
        }
    }
});

// Listener for final termination message from background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "EXAM_TERMINATE_FINAL") {
        enforceLockdown("EXAM TERMINATED: The maximum number of violations was exceeded.");
        // Logic to forcibly submit the exam form would go here
    }
});


// **TODO: Initialization of camera/audio monitoring goes here**
// You would dynamically load `monitoring/monitoring.js` after getting user consent.