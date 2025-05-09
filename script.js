document.addEventListener('DOMContentLoaded', () => {
    const html = document.documentElement;
    const body = document.body;
    const padlock = document.getElementById('unlock-trigger');
    const mouseKey = document.getElementById('mouse-key');
    const loadingScreen = document.querySelector('.loading-screen');

    const panels = {
        top: document.querySelector('.panel-top'),
        bottom: document.querySelector('.panel-bottom'),
        left: document.querySelector('.panel-left'),
        right: document.querySelector('.panel-right')
    };
    const allPanels = Object.values(panels).filter(p => p);

    const flaps = {
        top: document.querySelector('.flap-top'),
        bottom: document.querySelector('.flap-bottom'),
        left: document.querySelector('.flap-left'),
        right: document.querySelector('.flap-right')
    };
    const allFlaps = Object.values(flaps).filter(f => f);

    const styles = getComputedStyle(document.documentElement);
    const parseMs = (cssVarName, fallbackMs) => {
        const val = styles.getPropertyValue(cssVarName)?.trim();
        if (val) {
            if (val.endsWith('ms')) return parseFloat(val);
            if (val.endsWith('s')) return parseFloat(val) * 1000;
        }
        return fallbackMs;
    };

    const showMouseKey = () => { if (mouseKey) mouseKey.classList.add('visible'); };
    const hideMouseKey = () => { if (mouseKey) mouseKey.classList.remove('visible'); };
    const moveMouseKey = (e) => {
        if (mouseKey && mouseKey.classList.contains('visible')) {
            mouseKey.style.left = e.clientX + 15 + 'px';
            mouseKey.style.top = e.clientY + 15 + 'px';
        }
    };

    if (body.classList.contains('initially-folded')) {
        showMouseKey();
        document.addEventListener('mousemove', moveMouseKey);
    }

    if (padlock) {
        padlock.addEventListener('click', () => {
            padlock.style.pointerEvents = 'none';
            hideMouseKey();
            if (document.removeEventListener) {
                document.removeEventListener('mousemove', moveMouseKey);
                setTimeout(() => {
                    document.querySelector("#unlock-trigger").remove()
                },1500)
            }

            const padlockUnlockWiggleDuration = parseMs('--padlock-unlock-wiggle-duration', 400);
            const padlockShackleOpenDuration = parseMs('--padlock-shackle-open-duration', 600);
            
            const flapOpenDuration = parseMs('--flap-open-duration', 700);
            const flapStaggerJsDelay = parseMs('--flap-stagger-js-delay', 10);

            const panelExpandDelayJs = parseMs('--panel-expand-delay-js', 10); // JS delay for panel expansion start
            const panelExpandDuration = parseMs('--panel-expand-duration', 500); // Duration for expansion AND for push-off/slide-off

            const pushSlideOffDuration = panelExpandDuration; // Duration for panels to push off & flaps to slide off

            const loadingScreenFadeDelayJs = parseMs('--loading-screen-fade-delay-js', 200);

            // 1. Padlock animations
            padlock.classList.add('unlocking');
            padlock.classList.add('shackle-open');
            setTimeout(() => padlock.classList.remove('unlocking'), padlockUnlockWiggleDuration);
            const padlockFadeStartTime = padlockShackleOpenDuration * 0.7;
            setTimeout(() => padlock.classList.add('fade-out'), padlockFadeStartTime);

            // 2. Open Flaps (staggered)
            const flapsStartTime = padlockShackleOpenDuration * 0.1; // Flaps start opening
            let maxFlapOpenTriggerTime = flapsStartTime;
            allFlaps.forEach((flap, index) => {
                if (flap) {
                    const triggerTime = flapsStartTime + (index * flapStaggerJsDelay);
                    setTimeout(() => flap.classList.add('open'), triggerTime);
                    if (index === allFlaps.length - 1) {
                        maxFlapOpenTriggerTime = triggerTime;
                    }
                }
            });
            const timeWhenLastFlapFinishesOpening = maxFlapOpenTriggerTime + flapOpenDuration;

            // 3. Expand Panels (slide into view to frame the envelope)
            // This step is REINSTATED.
            const panelExpansionStartTime = 100;
            setTimeout(() => {
                allPanels.forEach(panel => panel?.classList.add('expanded'));
            }, panelExpansionStartTime);
            const timeWhenPanelsFinishExpanding = panelExpansionStartTime + panelExpandDuration;

            // 4. Coordinated "Push Off" (Panels) & "Slide Off" (Flaps)
            // Starts after flaps are open AND panels are expanded.
            const slideOffBuffer = 50; // ms, small visual buffer
            const actualPushSlideOffStartTime = 900;

            setTimeout(() => {
                allFlaps.forEach(flap => flap?.classList.add('sliding-off'));
                allPanels.forEach(panel => panel?.classList.add('slide-off')); // Triggers push and delayed instant opacity change
            }, actualPushSlideOffStartTime);

            // 5. Unlock Body Scroll & Fade Out Entire Loading Screen
            // Happens after the push/slide-off animation completes.
            const finalUnlockAndFadeStartTime = actualPushSlideOffStartTime + pushSlideOffDuration;

            setTimeout(() => {
                html.classList.add('unlocked');
                body.classList.add('unlocked');
                if (loadingScreen) {
                    loadingScreen.remove();
                }
            }, finalUnlockAndFadeStartTime - 100);

        }, { once: true });
    }

    document.querySelectorAll('.foldable-header').forEach(header => {
        header.addEventListener('click', () => {
            if (body.classList.contains('unlocked') && header.parentElement) {
                header.parentElement.classList.toggle('active');
            }
        });
    });

    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (!href || href === "#") return;
            const targetElement = document.querySelector(href);

            if (targetElement) {
                if (body.classList.contains('unlocked')) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                } else {
                    if (padlock && typeof padlock.click === 'function' && !padlock.classList.contains('shackle-open')) {
                        padlock.click(); 

                        const padlockShackleOpenDuration = parseMs('--padlock-shackle-open-duration', 200);
                        const flapOpenDuration = parseMs('--flap-open-duration', 200);
                        const flapStaggerJsDelay = parseMs('--flap-stagger-js-delay', 100);
                        
                        const panelExpandDelayJs = parseMs('--panel-expand-delay-js', 200);
                        const panelExpandDuration = parseMs('--panel-expand-duration', 200);
                        const pushSlideOffTotalDuration = panelExpandDuration; // Same duration

                        const loadingScreenFadeDelayJs = parseMs('--loading-screen-fade-delay-js', 200);
                        const loadingScreenFadeDuration = parseMs('--loading-screen-fade-duration', 700);

                        const flapsStartTime = padlockShackleOpenDuration * 0.4;
                        const numberOfFlaps = allFlaps ? allFlaps.length : 0;
                        const maxFlapOpenTriggerTime = flapsStartTime + ((numberOfFlaps > 0 ? numberOfFlaps - 1 : 0) * flapStaggerJsDelay);
                        const timeWhenLastFlapFinishesOpening = maxFlapOpenTriggerTime + flapOpenDuration;
                        
                        const panelExpansionStartTime = flapsStartTime + panelExpandDelayJs;
                        const timeWhenPanelsFinishExpanding = panelExpansionStartTime + panelExpandDuration;
                        
                        const slideOffBuffer = 50;
                        const actualPushSlideOffStartTime = Math.max(timeWhenLastFlapFinishesOpening, timeWhenPanelsFinishExpanding) + slideOffBuffer;
                        
                        const estimatedTimeUntilScrollable = actualPushSlideOffStartTime + pushSlideOffTotalDuration + loadingScreenFadeDelayJs + (loadingScreenFadeDuration * 0.8) + 300;

                        setTimeout(() => {
                            if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });
                        }, estimatedTimeUntilScrollable);

                    } else if (padlock && padlock.classList.contains('shackle-open') && !body.classList.contains('unlocked')){
                        const pushSlideOffTotalDuration = parseMs('--panel-expand-duration', 500);
                        const loadingScreenFadeDelayJs = parseMs('--loading-screen-fade-delay-js', 200);
                        const loadingScreenFadeDuration = parseMs('--loading-screen-fade-duration', 300);
                        const quickEstimate = pushSlideOffTotalDuration + loadingScreenFadeDelayJs + loadingScreenFadeDuration + 100;
                         setTimeout(() => {
                            if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });
                        }, quickEstimate);
                    }
                }
            } else {
                console.warn('Navigation target not found:', href);
            }
        });
    });
});

// This function will adjust the iframe's height
function adjustIframeHeight(iframeElement) {
    try {
        const iframeDocument = iframeElement.contentWindow.document;
        // Using scrollHeight of the documentElement (html tag) inside the iframe
        // is generally the most reliable way to get the full content height.
        const contentHeight = iframeDocument.documentElement.scrollHeight;

        if (contentHeight > 0) {
            iframeElement.style.height = contentHeight + 'px';
        } else {
            // Fallback or if contentHeight is 0 for some reason,
            // you might set a default min-height or log an issue.
            iframeElement.style.height = 'auto'; // Or a sensible default like '500px'
        }
    } catch (e) {
        console.error("Error adjusting iframe height: ", e);
        // This error can occur if the iframe content is from a different domain (due to Same-Origin Policy),
        // but since your src="portfolio.html" is local, this shouldn't be an issue.
    }
}

// Wait for the main window to load before trying to access the iframe
window.addEventListener('load', function() {
    const iframe = document.getElementById('content');

    if (iframe) {
        // Adjust height when the iframe content has loaded
        iframe.addEventListener('load', function() {
            adjustIframeHeight(iframe);
        });

        // In some cases, the iframe might have already loaded by the time this script runs,
        // especially if the script is deferred or the iframe content is very small/fast.
        // This is a simple check; if contentWindow exists and document is ready, try adjusting.
        if (iframe.contentWindow && iframe.contentWindow.document && 
            (iframe.contentWindow.document.readyState === 'complete' || iframe.contentWindow.document.readyState === 'interactive')) {
            // Small delay to ensure rendering is complete, especially if readyState is 'interactive'
            setTimeout(() => adjustIframeHeight(iframe), 100);
        }
    }
});