const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.nav-list a');
const sections = document.querySelectorAll('main section[id]');
const revealItems = document.querySelectorAll('.reveal');
const projectGalleries = document.querySelectorAll('.project-gallery');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    siteNav.classList.toggle('is-open', !isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('is-open');
    });
  });
}

const activateLink = (id) => {
  navLinks.forEach((link) => {
    const isCurrent = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('is-active', isCurrent);
    if (isCurrent) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};

if (sections.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activateLink(entry.target.id);
        }
      });
    },
    {
      rootMargin: '-35% 0px -50% 0px',
      threshold: 0.1,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

if (revealItems.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

if (projectGalleries.length > 0) {
  projectGalleries.forEach((gallery) => {
    const featuredImage = gallery.querySelector('.project-gallery__featured');
    const thumbButtons = gallery.querySelectorAll('.project-gallery__thumb');

    if (!featuredImage || thumbButtons.length === 0) {
      return;
    }

    const setActiveThumbnail = (activeButton) => {
      thumbButtons.forEach((button) => {
        const isActive = button === activeButton;

        button.setAttribute('aria-pressed', String(isActive));
        button.classList.toggle('is-active', isActive);
      });
    };

    const syncInitialActiveThumbnail = () => {
      const currentFeaturedSrc = featuredImage.getAttribute('src');
      const currentFeaturedAlt = featuredImage.getAttribute('alt');

      const matchingButton = Array.from(thumbButtons).find((button) => {
        const thumbImage = button.querySelector('img');

        return (
          thumbImage?.getAttribute('src') === currentFeaturedSrc &&
          thumbImage.dataset.galleryAlt === currentFeaturedAlt
        );
      });

      if (matchingButton) {
        setActiveThumbnail(matchingButton);
        return;
      }

      setActiveThumbnail(thumbButtons[0]);
    };

    syncInitialActiveThumbnail();

    thumbButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const thumbImage = button.querySelector('img');

        if (!thumbImage) {
          return;
        }

        const nextFeaturedSrc = thumbImage.getAttribute('src');
        const nextFeaturedAlt = thumbImage.dataset.galleryAlt;

        if (!nextFeaturedSrc || !nextFeaturedAlt) {
          return;
        }

        featuredImage.setAttribute('src', nextFeaturedSrc);
        featuredImage.setAttribute('alt', nextFeaturedAlt);

        setActiveThumbnail(button);
      });
    });
  });
}
