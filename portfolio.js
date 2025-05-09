document.addEventListener('DOMContentLoaded', () => {
    const foldableHeaders = document.querySelectorAll('.foldable .foldable-header');
    foldableHeaders.forEach(header => {
        header.addEventListener('mouseover', () => {
            const foldable = header.closest('.foldable');
            if (foldable) {
                foldable.classList.toggle('active');
            }
        });
        header.addEventListener('mouseout', () => {
            const foldable = header.closest('.foldable');
            if (foldable) {
                foldable.classList.toggle('active');
            }
        });
    });

    // Example: Code to handle the initial loading screen and unlock the body
    // This depends on how your loading animation is structured.
    // If you have a loading screen element and an unlock trigger:
    // const unlockTrigger = document.getElementById('unlock-trigger'); // Or whatever triggers the unlock
    // if (unlockTrigger) {
    //     unlockTrigger.addEventListener('click', () => {
    //         document.body.classList.remove('initially-folded');
    //         document.body.classList.add('unlocked');
    //         // Potentially hide or remove the loading screen
    //         const loadingScreen = document.querySelector('.loading-screen');
    //         if (loadingScreen) loadingScreen.style.display = 'none';
    //     });
    // } else {
    //    // If no explicit trigger, perhaps unlock after a delay or automatically
    //    // For testing, you might temporarily remove 'initially-folded' from body in HTML
    //    // or add 'unlocked' to see the content directly.
    // }
});

// Wait for the DOM to be fully loaded before attaching events
document.addEventListener('DOMContentLoaded', () => {

    // Existing code for padlock and envelope animation goes here if you have it
    // For example:
    // const padlock = document.getElementById('unlock-trigger');
    // const envelope = document.getElementById('envelope');
    // const body = document.body;
    // ... (your existing animation logic) ...


    // Add the new Day/Night button logic
    const dayNightButton = document.getElementById('day-night-button');
    const body = document.body; // Get the body element to toggle class

    // Define the text strings
    const dayText = 'writing code by day ☀️';
    const dayHoverText = '...and poetry by night 🌙';
    const nightText = 'writing poetry by night🌙';
    const nightHoverText = '...  and  code  by  day  ☀️';

    // Set initial text (should match HTML, but good practice)
    dayNightButton.textContent = dayText;

    // Add event listeners for hover
    dayNightButton.addEventListener('mouseover', () => {
        // Check if the body currently has the 'night-mode' class
        const isNightMode = body.classList.contains('night-mode');

        // Set button text based on the current mode
        dayNightButton.textContent = isNightMode ? nightHoverText : dayHoverText;
    });

    dayNightButton.addEventListener('mouseout', () => {
        // Check if the body currently has the 'night-mode' class
        const isNightMode = body.classList.contains('night-mode');

        // Set button text back to the permanent text for the current mode
        dayNightButton.textContent = isNightMode ? nightText : dayText;
    });

    // Add event listener for click
    dayNightButton.addEventListener('click', () => {
        // Toggle the 'night-mode' class on the body
        body.classList.toggle('night-mode');

        // Update the button's permanent text after the mode changes
        const isNightMode = body.classList.contains('night-mode');
        dayNightButton.textContent = isNightMode ? nightText : dayText;

        // Optional: Store preference in localStorage
        if (isNightMode) {
            localStorage.setItem('theme', 'night');
        } else {
            localStorage.setItem('theme', 'day');
        }
    });

    // Optional: Check for saved theme preference on page load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'night') {
        body.classList.add('night-mode');
        // Ensure button text is correct if starting in night mode
         if (dayNightButton) {
             dayNightButton.textContent = nightText;
         }
    }
    // Else, it defaults to day mode which is the initial state

    // Add a check to update button text if the DOM was loaded before JS
     if (!savedTheme && dayNightButton.textContent !== dayText) {
          dayNightButton.textContent = dayText;
     }


    // Make sure your existing foldable script is here or included elsewhere
    document.querySelectorAll('.foldable-header').forEach(header => {
        header.addEventListener('click', () => {
            const foldable = header.closest('.foldable');
            foldable.classList.toggle('active');
        });
    });
});