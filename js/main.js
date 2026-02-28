// Scroll Handle — smooth logo scaling
const logo = document.getElementById('logo');
const logoImg = logo.querySelector('img');
const heroVideo = document.querySelector('.hero__video');

const logoMinHeight = 32;

let logoFullHeight = 0;
let minScale = 1;
let ticking = false;

function calculateLogoSize() {
    logoImg.style.transform = 'scale(1)';

    logoFullHeight = logo.offsetHeight;
    minScale = logoMinHeight / logoFullHeight;
}

function updateLogoScale() {
    if (window.innerWidth <= 768) return;
    const videoRect = heroVideo.getBoundingClientRect();
    const videoTop = videoRect.top;
    const videoMidpoint = videoRect.height / 2;

    const progress = Math.min(
        Math.max(-videoTop / videoMidpoint, 0),
        1
    );

    const scale = 1 - progress * (1 - minScale);
    logoImg.style.transform = `scale(${scale})`;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateLogoScale();
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

window.addEventListener('resize', () => {
    calculateLogoSize();
    updateLogoScale();
});

window.addEventListener('load', () => {
    calculateLogoSize();
    updateLogoScale();
});

// Custom Select Dropdown
const customSelect = document.getElementById('customSelect');
const selectTrigger = document.getElementById('selectTrigger');
const selectValue = document.getElementById('selectValue');
const options = document.querySelectorAll('.custom-select__option');

selectTrigger.addEventListener('click', () => {
    customSelect.classList.toggle('open');
});

options.forEach(option => {
    option.addEventListener('click', () => {
        selectValue.textContent = option.dataset.value;
        customSelect.classList.remove('open');
        customSelect.classList.add('has-value');
    });
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!customSelect.contains(e.target)) {
        customSelect.classList.remove('open');
    }
});

// Sticky Collection Text
(function () {
    const LOGO_GAP = 100;

    const collectionSections = document.querySelectorAll('section.collection');

    collectionSections.forEach((section) => {
        const card = section.querySelector('.collection__card');
        const text = section.querySelector('.collection__text');
     
        const image = card.querySelector('.collection__image, video');

        const initialTop = (image.offsetHeight - text.offsetHeight) / 2;

        const maxTop = image.offsetHeight - text.offsetHeight;

        text.style.position = 'absolute';
        text.style.top = initialTop + 'px';
        text.style.left = '50%';
        text.style.transform = 'translateX(-50%)';
        text.style.transition = 'none';

        function updateTextPosition() {
            const logoEl = document.getElementById('logo');
            const logoRect = logoEl.getBoundingClientRect();
            const logoBottom = logoRect.bottom;

            const cardRect = card.getBoundingClientRect();
            const imageRect = image.getBoundingClientRect();

            const stickyViewportY = logoBottom + LOGO_GAP;
            const desiredTopInCard = stickyViewportY - cardRect.top;

            let newTop;
            if (desiredTopInCard <= initialTop) {
                newTop = initialTop;
            } else if (desiredTopInCard >= maxTop) {
                newTop = maxTop;
            } else {
                newTop = desiredTopInCard;
            }

            text.style.top = newTop + 'px';
        }

        let ticking2 = false;
        window.addEventListener('scroll', () => {
            if (!ticking2) {
                requestAnimationFrame(() => {
                    updateTextPosition();
                    ticking2 = false;
                });
                ticking2 = true;
            }
        }, { passive: true });

        updateTextPosition();
    });
})();

// Hover Video Play
const mediaSwaps = document.querySelectorAll('.media-swap');
mediaSwaps.forEach((swap) => {
    const video = swap.querySelector('video');
    if (!video) return;

    swap.addEventListener('mouseenter', () => {
        video.currentTime = 0;
        video.play();
    });

    swap.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
    });
});

// FAQ — Badge Filter & Accordion
const faqData = {
    shipping: [
        { q: 'Do you offer international shipping?', a: 'Items can be returned within 14 days of receipt, provided they are unworn, unwashed, and in original condition with tags attached.' },
        { q: 'How long does delivery take?', a: '' },
        { q: 'How can I track my order?', a: '' }
    ],
    returns: [
        { q: 'What is your return policy?', a: 'Items can be returned within 14 days of receipt, provided they are unworn, unwashed, and in original condition with tags attached.' },
        { q: 'Can I exchange for a different size?', a: '' },
        { q: 'Are sale items refundable?', a: '' }
    ],
};

const questionContainer = document.getElementById('questionContainer');
const badges = document.querySelectorAll('.badge-gray[data-category]');

function renderQuestions(category) {
    const questions = faqData[category] || [];
    questionContainer.innerHTML = '';

    questions.forEach((item, index) => {
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';

        const questionList = document.createElement('div');
        questionList.className = 'question-list';

        const title = document.createElement('div');
        title.className = 'question-list__title';
        title.textContent = item.q;

        const arrow = document.createElement('img');
        arrow.className = 'dropdown-arrow';
        arrow.src = 'assets/icons/arrow-question.svg';
        arrow.alt = 'arrow';

        questionList.appendChild(title);
        questionList.appendChild(arrow);

        // Answer
        const answer = document.createElement('p');
        answer.className = 'answer';
        answer.textContent = item.a;

        // Divider
        const divider = document.createElement('div');
        divider.className = 'divider';

        // Toggle accordion on click
        if (index === 0) {
            questionList.addEventListener('click', () => {
                const isOpen = answer.classList.contains('open');
                questionContainer.querySelectorAll('.answer.open').forEach(a => {
                    a.classList.remove('open');
                });
                questionContainer.querySelectorAll('.dropdown-arrow.open').forEach(a => {
                    a.classList.remove('open');
                });

                if (!isOpen) {
                    answer.classList.add('open');
                    arrow.classList.add('open');
                }
            });
        }

        questionItem.appendChild(questionList);
        questionItem.appendChild(answer);
        questionItem.appendChild(divider);
        questionContainer.appendChild(questionItem);
    });
}

// Badge click handler
badges.forEach(badge => {
    badge.addEventListener('click', () => {
        badges.forEach(b => b.classList.remove('active'));
        badge.classList.add('active');
        renderQuestions(badge.dataset.category);
    });
});

renderQuestions('returns');

// Hamburger Menu (Mobile)
const hamburger = document.getElementById('hamburger');
const menuLinks = document.getElementById('menuLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    menuLinks.classList.toggle('active');
    document.body.style.overflow = menuLinks.classList.contains('active') ? 'hidden' : '';
});

// Mobile EDITORIAL dropdown toggle (click instead of hover)
const editorialDropdown = menuLinks.querySelector('.dropdown');
if (editorialDropdown) {
    const editorialTrigger = editorialDropdown.querySelector('.dropdown__trigger');
    const editorialMenu = editorialDropdown.querySelector('.dropdown__menu');

    editorialTrigger.addEventListener('click', (e) => {
        if (window.matchMedia('(max-width: 768px)').matches) {
            e.preventDefault();
            editorialMenu.classList.toggle('open');
            editorialDropdown.classList.toggle('open');
        }
    });
}
