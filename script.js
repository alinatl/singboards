// 1. Исчезающий хедер
let lastScroll = 0;
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > lastScroll && currentScroll > 100) {
    nav.classList.add('hidden');
  } else {
    nav.classList.remove('hidden');
  }
  lastScroll = currentScroll;
});

// 4. Меню
const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const spans = burgerBtn.querySelectorAll('span');

burgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle('active'); // Было 'open', стало 'active'

    // Анимация крестика
    if (mobileMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Закрытие при клике в любое место экрана
document.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
});

<!--// 2. Авто-карусель-->
<!--const slides = document.querySelectorAll('.slide');-->
<!--let currentSlide = 0;-->
<!--setInterval(() => {-->
<!--  slides[currentSlide].classList.remove('active');-->
<!--  currentSlide = (currentSlide + 1) % slides.length;-->
<!--  slides[currentSlide].classList.add('active');-->
<!--}, 5000);-->


// 2. Авто-карусель с поддержкой свайпов
const slides = document.querySelectorAll('.slide');
const carouselContainer = document.querySelector('.carousel');
let currentSlide = 0;
let touchStartX = 0;
let touchEndX = 0;

function showSlide(index) {
  slides[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

// Автопереключение
let autoSlideInterval = setInterval(nextSlide, 5000);

// Обработка свайпов
carouselContainer.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
  clearInterval(autoSlideInterval); // Останавливаем авто-слайд при касании
});

carouselContainer.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
  // Перезапускаем авто-слайд
  autoSlideInterval = setInterval(nextSlide, 5000);
});

function handleSwipe() {
  const swipeDistance = touchStartX - touchEndX;
  if (swipeDistance > 50) {
    nextSlide(); // Свайп влево
  } else if (swipeDistance < -50) {
    prevSlide(); // Свайп вправо
  }
}

// 3. Лайтбокс
const lightbox = document.getElementById('lightbox');
const lbImg = lightbox.querySelector('img');
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('click', () => {
    if(img.closest('.lightbox')) return;
    lbImg.src = img.src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});
lightbox.addEventListener('click', () => {
  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto';
});


<!--загрузка рандомной ссылки-->
fetch('pages.json')
  .then(res => {
    if (!res.ok) throw new Error('Ошибка загрузки JSON');
    return res.json();
  })
  .then(pages => {
    // 1. Получаем массив всех ключей (путей к страницам) из объекта
    const urls = Object.keys(pages);

    // Функция для выбора случайного URL
    function getRandomUrl() {
      const randomIndex = Math.floor(Math.random() * urls.length);
      return urls[randomIndex];
    }

    // 2. Устанавливаем случайную ссылку сразу при загрузке
    randomLink.href = getRandomUrl();

    // 3. (Опционально) Обновляем ссылку ПЕРЕД переходом,
    // чтобы при каждом клике был новый результат
    randomLink.addEventListener('mousedown', () => {
      randomLink.href = getRandomUrl();
    });
  })
  .catch(err => console.error('Ошибка:', err));
