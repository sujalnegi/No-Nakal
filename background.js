let violationCount = 0;
const MAX_VIOLATIONS = 3;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "VIOLATION_DETECTED") {
        violationCount++;
        
        if (violationCount >= MAX_VIOLATIONS) {
            chrome.tabs.sendMessage(sender.tab.id, { action: "EXAM_TERMINATE_FINAL" });
            
            // In a real app, you would also push this data to a server
        }
        
        sendResponse({ status: "Violation recorded", count: violationCount });
    } else if (request.action === "GET_VIOLATION_COUNT") {
        sendResponse({ count: violationCount, max: MAX_VIOLATIONS });
    } else if (request.action === "START_PROCTORING") {
        violationCount = 0;
        sendResponse({ status: "Proctoring started" });
    }
});