// Scroll Handle — smooth logo scaling
// const logo = document.getElementById('logo');
// const logoImg = logo.querySelector('img');
// const heroVideo = document.querySelector('.hero__video');

// // ขนาดเริ่มต้นของ logo (14.5rem = 145px ที่ font-size 62.5%)
// const logoFullHeight = logo.offsetHeight;
// const logoMinHeight = 32;
// const minScale = logoMinHeight / logoFullHeight;

// let ticking = false;

// window.addEventListener('scroll', () => {
// 	if (!ticking) {
// 		requestAnimationFrame(() => {
// 			const videoRect = heroVideo.getBoundingClientRect();
// 			const videoTop = videoRect.top;
// 			const videoMidpoint = videoRect.height / 2;

// 			// progress: 0 = ยังไม่ scroll, 1 = scroll ผ่านจุดกึ่งกลาง video
// 			// videoTop เริ่มจากค่าบวก (อยู่ใน viewport) → ค่อย ๆ ติดลบ (scroll ผ่าน)
// 			const progress = Math.min(Math.max(-videoTop / videoMidpoint, 0), 1);

// 			// interpolate scale: 1 → minScale
// 			const scale = 1 - progress * (1 - minScale);
// 			logoImg.style.transform = `scale(${scale})`;
// 			ticking = false;
// 		});
// 		ticking = true;
// 	}
// }, { passive: true });

const logo = document.getElementById('logo');
const logoImg = logo.querySelector('img');
const heroVideo = document.querySelector('.hero__video');

const logoMinHeight = 32; // px

let logoFullHeight = 0;
let minScale = 1;
let ticking = false;

// 🔹 คำนวณขนาดใหม่ทุกครั้งที่ layout เปลี่ยน
function calculateLogoSize() {
    // reset scale ก่อนวัดจริง
    logoImg.style.transform = 'scale(1)';
    
    logoFullHeight = logo.offsetHeight;
    minScale = logoMinHeight / logoFullHeight;
}

// 🔹 ฟังก์ชัน update scale ตาม scroll
function updateLogoScale() {
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

// 🔹 Scroll listener (optimized)
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateLogoScale();
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// 🔹 Resize listener (สำคัญมาก)
window.addEventListener('resize', () => {
    calculateLogoSize();
    updateLogoScale(); // recalculation ทันที
});

// 🔹 Initial run
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
    const LOGO_GAP = 100; // ระยะห่างจาก logo ที่ต้องการ (px)

    // เลือก section.collection ทั้งหมด (New Collection + Bestseller)
    const collectionSections = document.querySelectorAll('section.collection');

    collectionSections.forEach((section) => {
        const card = section.querySelector('.collection__card');
        const text = section.querySelector('.collection__text');
        // image อาจเป็น <img> หรือ <video>
        const image = card.querySelector('.collection__image, video');

        if (!card || !text || !image) return;

        // บันทึกตำแหน่งเริ่มต้น (กึ่งกลาง image)
        const initialTop = (image.offsetHeight - text.offsetHeight) / 2;
        // ตำแหน่งสูงสุดที่ text จะลงไปได้ (ขอบล่างของ image)
        const maxTop = image.offsetHeight - text.offsetHeight;

        // ตั้งค่าเริ่มต้น
        text.style.position = 'absolute';
        text.style.top = initialTop + 'px';
        text.style.left = '50%';
        text.style.transform = 'translateX(-50%)';
        text.style.transition = 'none'; // ไม่ต้องมี transition เพราะจะ sync กับ scroll

        function updateTextPosition() {
            const logoEl = document.getElementById('logo');
            const logoRect = logoEl.getBoundingClientRect();
            const logoBottom = logoRect.bottom; // ขอบล่างของ logo ใน viewport

            const cardRect = card.getBoundingClientRect();
            const imageRect = image.getBoundingClientRect();

            // ตำแหน่ง "sticky start" ที่ text ควรอยู่ เมื่อ text อยู่ห่างจาก logo 100px
            // คือ text ควรอยู่ที่ viewport y = logoBottom + LOGO_GAP
            const stickyViewportY = logoBottom + LOGO_GAP;

            // แปลง stickyViewportY เป็นตำแหน่ง top ภายใน card
            // card.getBoundingClientRect().top คือ ตำแหน่งบนสุดของ card ใน viewport
            const desiredTopInCard = stickyViewportY - cardRect.top;

            // Clamp ค่าให้อยู่ระหว่าง initialTop (กึ่งกลาง) ถึง maxTop (ขอบล่าง)
            let newTop;
            if (desiredTopInCard <= initialTop) {
                // ยังไม่ถึงจุดที่ต้อง sticky → อยู่กึ่งกลาง
                newTop = initialTop;
            } else if (desiredTopInCard >= maxTop) {
                // เลื่อนเลยขอบล่าง image → ค้างที่ขอบล่าง
                newTop = maxTop;
            } else {
                // อยู่ระหว่าง → ตาม scroll
                newTop = desiredTopInCard;
            }

            text.style.top = newTop + 'px';
        }

        // ใช้ scroll event ร่วมกับ requestAnimationFrame
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

        // เรียกครั้งแรก
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
        // Question item wrapper
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';

        // Question row
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

                // ปิดทุก answer ก่อน (optional: เปิดได้ทีละอัน)
                questionContainer.querySelectorAll('.answer.open').forEach(a => {
                    a.classList.remove('open');
                });
                questionContainer.querySelectorAll('.dropdown-arrow.open').forEach(a => {
                    a.classList.remove('open');
                });

                // ถ้าเดิมปิดอยู่ → เปิด, ถ้าเดิมเปิด → ปิด (ปิดไปแล้วข้างบน)
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
        // Remove active from all badges
        badges.forEach(b => b.classList.remove('active'));
        // Add active to clicked badge
        badge.classList.add('active');
        // Render questions for the selected category
        renderQuestions(badge.dataset.category);
    });
});

// Render default category (returns)
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
			}
	});
}
