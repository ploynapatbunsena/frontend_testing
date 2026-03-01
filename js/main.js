function onScrollThrottled(callback) {
    let isScheduled = false;

    window.addEventListener('scroll', () => {
        if (!isScheduled) {
            requestAnimationFrame(() => {
                callback();
                isScheduled = false;
            });
            isScheduled = true;
        }
    }, { passive: true });
}

// Logo Scale on Scroll
const logo = document.getElementById('logo');
const logoImg = logo.querySelector('img');
const heroVideo = document.querySelector('.hero__video');

const LOGO_MIN_HEIGHT = 32;

let logoFullHeight = 0;
let logoMinScale = 1;

function calculateLogoSize() {
    logoImg.style.transform = 'scale(1)';
    logoFullHeight = logo.offsetHeight;
    logoMinScale = LOGO_MIN_HEIGHT / logoFullHeight;
}

function updateLogoScale() {
    if (window.innerWidth <= 768) return;

    const videoRect = heroVideo.getBoundingClientRect();
    const scrollProgress = Math.min(
        Math.max(-videoRect.top / (videoRect.height / 2), 0),
        1
    );

    const scale = 1 - scrollProgress * (1 - logoMinScale);
    logoImg.style.transform = `scale(${scale})`;
}

onScrollThrottled(updateLogoScale);

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
const selectOptions = document.querySelectorAll('.custom-select__option');

selectTrigger.addEventListener('click', () => {
    customSelect.classList.toggle('open');
});

selectOptions.forEach(option => {
    option.addEventListener('click', () => {
        selectValue.textContent = option.dataset.value;
        customSelect.classList.remove('open');
        customSelect.classList.add('has-value');
    });
});

document.addEventListener('click', (e) => {
    if (!customSelect.contains(e.target)) {
        customSelect.classList.remove('open');
    }
});

// Sticky Collection Text
{
    const LOGO_GAP = 100;
    const collectionSections = document.querySelectorAll('section.collection');

    const stickyItems = [];

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

        stickyItems.push({ card, text, image, initialTop, maxTop });
    });

    function updateAllStickyTexts() {
        const logoEl = document.getElementById('logo');
        const logoBottom = logoEl.getBoundingClientRect().bottom;
        const stickyViewportY = logoBottom + LOGO_GAP;

        stickyItems.forEach(({ card, text, initialTop, maxTop }) => {
            const cardTop = card.getBoundingClientRect().top;
            const desiredTop = stickyViewportY - cardTop;

            const newTop = Math.min(Math.max(desiredTop, initialTop), maxTop);
            text.style.top = newTop + 'px';
        });
    }
    onScrollThrottled(updateAllStickyTexts);
    updateAllStickyTexts();
}

// Hover Video Play (Media Swap)
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

function createQuestionElement(item) {
    const questionItem = document.createElement('div');
    questionItem.className = 'question-item';

    // questions-header
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

    // answer
    const answer = document.createElement('p');
    answer.className = 'answer';
    answer.textContent = item.a;

    // divider
    const divider = document.createElement('div');
    divider.className = 'divider';

    // Toggle accordion — ทุกข้อคลิกได้
    questionList.addEventListener('click', () => {
        const isOpen = answer.classList.contains('open');

        questionContainer.querySelectorAll('.answer.open').forEach(a => a.classList.remove('open'));
        questionContainer.querySelectorAll('.dropdown-arrow.open').forEach(a => a.classList.remove('open'));

        if (!isOpen) {
            answer.classList.add('open');
            arrow.classList.add('open');
        }
    });

    questionItem.appendChild(questionList);
    questionItem.appendChild(answer);
    questionItem.appendChild(divider);

    return questionItem;
}

// question list - category
function renderQuestions(category) {
    const questions = faqData[category] || [];
    questionContainer.innerHTML = '';
    questions.forEach(item => {
        questionContainer.appendChild(createQuestionElement(item));
    });
}

// badge click handler
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

// Mobile "EDITORIAL" Dropdown
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
