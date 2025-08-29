document.addEventListener('DOMContentLoaded', function () {
  const preloader = document.getElementById('preloader');
  const MIN_DISPLAY_TIME = 700; // 1.5 seconds
  const HIDE_DELAY = 500; // Matches your CSS transition time
  const start = Date.now();

  function hidePreloader() {
    const elapsed = Date.now() - start;
    const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsed);

    setTimeout(() => {
      preloader.classList.add('hidden');

      // Remove from DOM after animation completes
      setTimeout(() => {
        preloader.style.display = 'none';
      }, HIDE_DELAY);
    }, remainingTime);
  }

  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);

    // Optional: Hide after max timeout (failsafe)
    setTimeout(hidePreloader, 4000);
  }
});

document.addEventListener('DOMContentLoaded', function () {

    // Get the toggle button and main header elements
    const upbarcontent = document.querySelector('.upbar-content');
    const upbar = document.querySelector('.upbar');
    const uploadbox = document.querySelector('.upload-box');
    const grid = document.querySelector('.grid-container');
    const projectHeading = document.querySelector('.project-heading');
    const explore = document.querySelector('.explore');
    const footer = document.querySelector('.footer');
    const toggler = document.querySelector('.toggler');
    const mainHeader = document.querySelector('.main-header');
    const showcase = document.querySelector('.showcase');
    const cardcontent = document.querySelector('.card-content');
    const blockbox = document.querySelector('.block-box');

    // Add click event listener to the toggle button
    toggler.addEventListener('click', function () {
        // Toggle the 'active' class on the main header and showcase
        upbar.classList.toggle('active');
        upbarcontent.classList.toggle('active');
        uploadbox.classList.toggle('active');
        uploadbox.classList.toggle('active');
        mainHeader.classList.toggle('active');
        showcase.classList.toggle('active');
        grid.classList.toggle('active');
        projectHeading.classList.toggle('active');
        explore.classList.toggle('active');
        footer.classList.toggle('active');
        cardcontent.classList.toggle('active');
        blockbox.classList.toggle('active');

        // Change the icon based on the state
        const icon = toggler.querySelector('i');
        if (mainHeader.classList.contains('active')) {
            icon.classList.remove('fa-bars-staggered');
            icon.classList.add('fas fa-xmark');
        } else {
            icon.classList.remove('fas fa-xmark');
            icon.classList.add('fa-bars-staggered');
        }
    });

    // Close the sidebar when clicking outside of it on mobile
    document.addEventListener('click', function (event) {
        if (window.innerWidth <= 768 &&
            mainHeader.classList.contains('active') &&
            !mainHeader.contains(event.target) &&
            !toggler.contains(event.target)) {
              upbar.classList.remove('active');
              upbarcontent.classList.remove('active');
              uploadbox.classList.remove('active');
            mainHeader.classList.remove('active');
            showcase.classList.remove('active');
            grid.classList.remove('active');
            projectHeading.classList.remove('active');
            explore.classList.remove('active');
            footer.classList.remove('active');
                    blockbox.classList.toggle('active');


            const icon = toggler.querySelector('i');
            icon.classList.remove('fas fa-xmark');
            icon.classList.add('fa-bars-staggered');
        }
    });

    // Add event listeners for nav items to close sidebar on mobile when clicked
    const navItems = document.querySelectorAll('.nav-list-item');
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                mainHeader.classList.remove('active');
                mainHeader.classList.remove('active');
                showcase.classList.remove('active');
                              upbar.classList.remove('active');

                              upbarcontent.classList.remove('active');

                container.classList.remove('active');
                grid.classList.remove('active');
                projectHeading.classList.remove('active');
                explore.classList.remove('active');
                footer.classList.remove('active');
        cardcontent.classList.toggle('active');

                const icon = toggler.querySelector('i');
                icon.classList.remove('fas fa-xmark');
                icon.classList.add('fa-bars-staggered');
            }
        });
    });
});