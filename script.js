document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const birthdateInput = document.getElementById('birthdate');
    const genderSelect = document.getElementById('gender');
    const usernameError = document.getElementById('username-error');
    const birthdateError = document.getElementById('birthdate-error');
    const genderError = document.getElementById('gender-error');
    const mainContent = document.getElementById('main-content');
    const authSection = document.getElementById('auth');
    const logoutBtn = document.getElementById('logout-btn');
    const header = document.getElementById('header');
    const footer = document.querySelector('footer');
    const menuLinks = document.querySelectorAll('.menu a');
    const pages = document.querySelectorAll('.page');

    // Функция сохранения состояния
    function saveState(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    // Функция загрузки состояния
    function loadState(key) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }

    // Восстановление состояния
    function restoreState() {
        const isAuthenticated = loadState('isAuthenticated');
        const activePage = loadState('activePage');
        const userData = loadState('userData');

        if (isAuthenticated) {
            authSection.style.display = 'none';
            mainContent.classList.remove('hidden');
            header.classList.remove('hidden');
            footer.classList.remove('hidden');
            logoutBtn.classList.remove('hidden');

            // Восстановление активной страницы
            if (activePage) {
                pages.forEach((page) => page.classList.remove('active'));
                document.getElementById(activePage).classList.add('active');
            }
        }
    }

    // Обработчик отправки формы авторизации
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        let isValid = true;

        // Проверка логина
        const usernameRegex = /^[а-яА-ЯёЁ]{4,10}$/;
        if (!usernameRegex.test(usernameInput.value)) {
            usernameError.textContent = 'Логин должен быть от 4 до 10 русских букв.';
            isValid = false;
        } else {
            usernameError.textContent = '';
        }

        // Проверка даты рождения
        if (!birthdateInput.value) {
            birthdateError.textContent = 'Дата рождения обязательна.';
            isValid = false;
        } else {
            const birthdate = new Date(birthdateInput.value);
            const minDate = new Date('1950-01-01');
            const currentDate = new Date();
            if (birthdate < minDate || birthdate > currentDate) {
                birthdateError.textContent = 'Дата должна быть между 1950 и текущим годом.';
                isValid = false;
            } else {
                birthdateError.textContent = '';
            }
        }

        // Проверка пола
        if (!genderSelect.value) {
            genderError.textContent = 'Выберите ваш пол.';
            isValid = false;
        } else {
            genderError.textContent = '';
        }

        if (isValid) {
            authSection.style.display = 'none';
            mainContent.classList.remove('hidden');
            header.classList.remove('hidden');
            footer.classList.remove('hidden');
            logoutBtn.classList.remove('hidden');

            // Сохранение состояния
            saveState('isAuthenticated', true);
            saveState('userData', {
                username: usernameInput.value,
                birthdate: birthdateInput.value,
                gender: genderSelect.value,
            });
            saveState('activePage', 'description'); // Начальная страница
        }
    });

    // Переход по разделам
    menuLinks.forEach((link) => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const page = this.dataset.page;
            pages.forEach((p) => p.classList.remove('active'));
            document.getElementById(page).classList.add('active');

            // Сохранение активной страницы
            saveState('activePage', page);
        });
    });

    // Выход из системы
    logoutBtn.addEventListener('click', function () {
        mainContent.classList.add('hidden');
        authSection.style.display = 'flex';
        header.classList.add('hidden');
        footer.classList.add('hidden');
        logoutBtn.classList.add('hidden');
        loginForm.reset();

        // Очистка состояния
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userData');
        localStorage.removeItem('activePage');
    });

    // Восстановление состояния при загрузке страницы
    restoreState();
});
document.addEventListener('DOMContentLoaded', function () {
    const eventList = document.getElementById('event-list');
    const eventDescription = document.getElementById('event-description');
    const searchInput = document.getElementById('search-input');

    // Описания событий
const events = {
    crime: "Преступление Раскольникова - момент, когда он убивает старуху-процентщицу, оправдывая своё действие моральной теорией.",
    "meeting-sonya": "Встреча с Соней - ключевой момент романа, когда Раскольников впервые находит поддержку в сложный момент.", // Изменено
    confession: "Признание Раскольникова - момент, когда герой решается признаться в своём преступлении, столкнувшись с внутренними муками.",
    siberia: "Ссылка в Сибирь - финал романа, где Раскольников начинает свой путь искупления и внутреннего очищения.",
    redemption: "Искупление - этап, на котором Раскольников осознаёт свои ошибки и начинает внутреннюю трансформацию.",
    mother: "Письмо матери - эпизод, раскрывающий любовь и заботу матери Раскольникова, её переживания за сына."
};


    // Событие клика на элемент списка
    eventList.addEventListener('click', function (e) {
        if (e.target && e.target.nodeName === 'LI') {
            const eventKey = e.target.getAttribute('data-event');
            const description = events[eventKey] || "Описание не найдено.";
            eventDescription.innerHTML = `<p>${description}</p>`;
        }
    });

    // Фильтрация списка по поисковому запросу
    searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase();
        const items = eventList.getElementsByTagName('li');

        for (let item of items) {
            const text = item.textContent.toLowerCase();
            if (text.includes(query)) {
                item.style.display = ''; // Показываем элемент
            } else {
                item.style.display = 'none'; // Скрываем элемент
            }
        }
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const indicator = document.getElementById('slider-indicator');

    let currentSlide = 0;

    // Обновляем индикатор текущего слайда
    function updateIndicator() {
        indicator.textContent = `${currentSlide + 1} слайд из ${slides.length}`;
    }

    // Перемещаем слайды
    function updateSlidePosition() {
        const slidesContainer = document.querySelector('.slides');
        slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateIndicator();

        // Блокируем кнопки в крайних состояниях
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === slides.length - 1;
    }

    // Обработчики кнопок
    prevBtn.addEventListener('click', function () {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlidePosition();
        }
    });

    nextBtn.addEventListener('click', function () {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            updateSlidePosition();
        }
    });

    // Инициализация
    updateSlidePosition();
});
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('test-form');
    const checkBtn = document.getElementById('check-btn');
    const resetBtn = document.getElementById('reset-btn');
    const result = document.getElementById('test-result');

    // Ответы на вопросы
    const answers = {
        q1: "достоевский",
        q2: 1866,
        q3: "родион",
        q4: 5,
        q5: "соня",
        q6: "теория"
    };

    // Проверить ответы
    checkBtn.addEventListener('click', function () {
        let score = 0;
        const feedbacks = form.querySelectorAll('.feedback');
    
        // Сброс старых отзывов
        feedbacks.forEach(feedback => feedback.textContent = '');
    
        // Проверяем ответы
        const formData = new FormData(form);
        for (let [key, value] of formData.entries()) {
            const feedback = form.querySelector(`[name="${key}"]`).nextElementSibling;
    
            if (String(value).trim().toLowerCase() === String(answers[key]).toLowerCase()) {
                feedback.textContent = "Ответ верный!";
                feedback.className = "feedback correct";
                score++;
            } else {
                feedback.textContent = `Ответ неправильный. Правильный ответ: ${answers[key]}`;
                feedback.className = "feedback incorrect";
            }
        }
    
        // Сохраняем результат теста в localStorage
        localStorage.setItem('lastTestScore', score);
    
        // Проверяем, что результат теста записался
        console.log('Сохранённый результат:', localStorage.getItem('lastTestScore'));
    
        // Показ результата
        result.textContent = `Вы набрали ${score} из 6 баллов.`;
        result.classList.remove('hidden');
    
        // Показ кнопки "Пройти тест заново"
        checkBtn.classList.add('hidden');
        resetBtn.classList.remove('hidden');
    });
    

    // Сброс теста
    resetBtn.addEventListener('click', function () {
        form.reset();
        const feedbacks = form.querySelectorAll('.feedback');
        feedbacks.forEach(feedback => feedback.textContent = '');
        result.classList.add('hidden');
        checkBtn.classList.remove('hidden');
        resetBtn.classList.add('hidden');
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const userLogin = document.getElementById('user-login');
    const userBirthdate = document.getElementById('user-birthdate');
    const userGender = document.getElementById('user-gender');
    const testScore = document.getElementById('test-score');
    const logoutBtnProfile = document.getElementById('logout-btn-profile');

    // Функция загрузки данных пользователя из localStorage
    function loadUserData() {
        const userData = JSON.parse(localStorage.getItem('userData')); // Загружаем данные пользователя
        const lastTestScore = localStorage.getItem('lastTestScore'); // Загружаем результат теста

        console.log('Загруженные данные пользователя:', userData); // Для отладки
        console.log('Загруженный результат теста:', lastTestScore); // Для отладки

        // Если пользователь авторизован, выводим его данные
        if (userData) {
            userLogin.textContent = userData.username || '-';
            userBirthdate.textContent = userData.birthdate || '-';
            userGender.textContent = userData.gender === 'male' ? 'Мужской' : 'Женский';
        } else {
            userLogin.textContent = 'Нет данных';
            userBirthdate.textContent = 'Нет данных';
            userGender.textContent = 'Нет данных';
        }

        // Если тест не проходился, отображаем "Нет данных"
        if (lastTestScore !== null) {
            testScore.textContent = `${lastTestScore} баллов`;
        } else {
            testScore.textContent = 'Нет данных';
        }
    }

    // Обработчик кнопки "Выход"
    logoutBtnProfile.addEventListener('click', function () {
        // Удаляем данные авторизации и результата теста
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userData');
        localStorage.removeItem('lastTestScore');

        // Сбрасываем видимость секций
        document.getElementById('auth').style.display = 'flex';
        document.getElementById('main-content').classList.add('hidden');
        document.getElementById('header').classList.add('hidden');
        document.querySelector('footer').classList.add('hidden');
    });

    // Загружаем данные пользователя при входе в личный кабинет
    loadUserData();
});



