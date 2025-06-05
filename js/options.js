document.addEventListener('DOMContentLoaded', function () {
    const timeUnitsInput = document.getElementById('timeUnits');
    const frequencyInput = document.getElementById('frequency');
    const errorReTestTimeInput = document.getElementById('errorReTestTime');
    const timeOutInput = document.getElementById('timeOut');
    const soundFilePathInput = document.getElementById('soundFilePath'); // Will remain disabled
    const animationInput = document.getElementById('animation');
    const desktopAlertInput = document.getElementById('desktopAlert');
    const saveButton = document.getElementById('saveButton');
    const statusDiv = document.getElementById('status');

    // Load current settings
    function loadOptions() {
        try {
            let storedOptions = localStorage.getItem('autoQueryOption');
            if (storedOptions) {
                const options = JSON.parse(storedOptions);
                timeUnitsInput.value = options.TimeUnits;
                frequencyInput.value = options.Frequency;
                errorReTestTimeInput.value = options.ErrorReTestTime;
                timeOutInput.value = options.TimeOut;
                soundFilePathInput.value = options.SoundFilePath;
                animationInput.checked = options.Animation;
                desktopAlertInput.checked = options.DesktopAlert;
            } else {
                statusDiv.textContent = 'No stored options found.';
            }
        } catch (e) {
            statusDiv.textContent = 'Error loading options: ' + e.message;
            console.error("Error loading options:", e);
        }
    }

    // Save settings
    saveButton.addEventListener('click', function () {
        try {
            const optionsToSave = {
                TimeUnits: parseInt(timeUnitsInput.value) || 5000,
                Frequency: parseInt(frequencyInput.value) || 35,
                ErrorReTestTime: parseInt(errorReTestTimeInput.value) || 0,
                TimeOut: parseInt(timeOutInput.value) || 2,
                SoundFilePath: soundFilePathInput.value || 'Notice.mp3',
                Animation: animationInput.checked,
                DesktopAlert: desktopAlertInput.checked
            };
            localStorage.setItem('autoQueryOption', JSON.stringify(optionsToSave));
            statusDiv.textContent = 'Settings saved!';
            setTimeout(() => statusDiv.textContent = '', 2000);

            // TODO: Later attempt to add: Notify the background script to reload options
            // if (chrome.runtime && chrome.runtime.sendMessage) {
            //     chrome.runtime.sendMessage({ type: "optionsUpdated" }, response => {
            //         if (chrome.runtime.lastError) {
            //             console.warn("Could not send optionsUpdated message:", chrome.runtime.lastError.message);
            //         } else {
            //             console.log("Background script notified of options update.");
            //         }
            //     });
            // }

        } catch (e) {
            statusDiv.textContent = 'Error saving options: ' + e.message;
            console.error("Error saving options:", e);
        }
    });

    loadOptions();
});
