const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const PI = Math.PI;
const img = new Image();
img.src = 'space.jpg';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


/**
 * Абстрактный класс фигуры
 */
class Figure {
    /**
     * Конструктор класса
     * @param {number} posX 
     * @param {number} posY 
     * @param {string} fillStyle 
     */
    constructor(posX = 0, posY = 0, fillStyle = 'red') {
        this._posX = posX;
        this._posY = posY;
        this._fillStyle = fillStyle;
    }

    get posX() {
        return this._posX;
    }

    get posY() {
        return this._posY;
    }

    get fillStyle() {
        return this._fillStyle;
    }

    set fillStyle(newFill) {
        this._fillStyle = newFill;
    }

    /**
     * Обёртка для метода отрисовки фигуры. Нужен, чтобы можно было помещать в метод draw различные фигуры
     * @param {number} posX 
     * @param {number} poxY 
     */
    _figure(posX, poxY) {}

    /**
     * Метод для отрисовки фигуры
     * @param {number} posX 
     * @param {number} poxY 
     */
    draw(posX, poxY) {
        ctx.fillStyle = this._fillStyle;
        ctx.beginPath();
        this._figure(posX, poxY);
        ctx.closePath();
        ctx.fill();
    }
};


/**
 * Класс для создания окружностей
 */
class Circle extends Figure {
    /**
     * Конструктор класса
     * @param {number} posX 
     * @param {number} posY 
     * @param {number} radius 
     * @param {string} fillStyle 
     */
    constructor(posX, posY, radius, fillStyle) {
        super(posX, posY, fillStyle);
        this._newX = 0;
        this._newY = 0;
        this._radius = radius;
        this._angle = 0;
        this._speed = .005;
        this._spinDirection = {
            clockwise: true,
            anticlockwise: false,

            // Метод для объекта _spinDirection. Переключает состояние полей clockwise и anticlockwise на противоположные
            _toggleDirection() {
                this.clockwise = !this.clockwise;
                this.anticlockwise = !this.anticlockwise;
            }
        };
    }

    get newX() {
        return this._newX;
    }

    get newY() {
        return this._newY;
    }

    get radius() {
        return this._radius;
    }

    set radius(newRadius) {
        this._radius = newRadius;
    }

    set speed(newSpeed) {
        this._speed = newSpeed;
    }

    // Движение по часовой стрелке
    clockwise() {
        const {
            clockwise,
            _toggleDirection
        } = this._spinDirection;

        if (clockwise === false) {
            this._speed = -this._speed;
            _toggleDirection.call(this._spinDirection);
        }
    }

    // Движение против часовой стрелки
    anticlockwise() {
        const {
            anticlockwise,
            _toggleDirection
        } = this._spinDirection;

        if (anticlockwise === false) {
            this._speed = -this._speed;
            _toggleDirection.call(this._spinDirection);
        }
    }

    /**
     * Переопределение метода _figure родительского класса. Помещаем в него метод для отрисовки окружности
     * @param {number} posX 
     * @param {number} posY 
     * @param {number} radius 
     */
    _figure(posX = this._posX, posY = this._posY, radius = this._radius) {
        ctx.arc(posX, posY, radius, 0, PI * 2);
    }

    // Движение вокруг центра экрана
    moveAroundCenter() {
        this._newX = canvas.width / 2 + Math.cos(this._angle) * this._radius * 10;
        this._newY = canvas.height / 2 + Math.sin(this._angle) * this._radius * 10;
        this._angle += this._speed;
        this.draw(this._newX, this._newY);
    }

    /**
     * Движение вокруг какого-либо объекта на экране
     * @param {number} posX 
     * @param {number} posY 
     */
    moveAroundObject(posX, posY) {
        this._newX = posX + Math.cos(this._angle) * this._radius * 15;
        this._newY = posY + Math.sin(this._angle) * this._radius * 15;
        this._angle += this._speed * 3;
        this.draw(this._newX, this._newY);
    }
};

/**
 * Класс с методами для управления анимацией. Используется паттерн синглтон
 */
class Controls {
    constructor() {

        if (!Controls.instance) {
            Controls.instance = this;
        }

        this._toggleMoonVisibility = document.querySelector('.controls .toggle-moon-visibility');

        this._animationState = {
            play: true,
            pause: false,

            toggleState() {
                this.play = !this.play;
                this.pause = !this.pause;
            }
        };

        this._planetsVisibility = {
            _earth: true,
            _moon: true,

            _enable() {
                this._earth = true;
                this._moon = true;
            },

            _disable() {
                this._earth = false;
                this._moon = false;
            },

            _toggle(planet) {
                switch (planet) {
                    case 'earth':
                        this._earth = !this._earth;
                        break;
                    case 'moon':
                        this._moon = !this._moon;
                        break;
                }
            }
        };

        return Controls.instance;
    }

    // Запуск интервала и анимации
    play() {
        const {
            play
        } = this._animationState;

        if (play) {
            return;
        }

        timer = setInterval(start, 0);
        this._animationState.toggleState();
    }

    // Очистка интервала. Остановка анимации
    pause() {
        const {
            pause
        } = this._animationState;

        if (pause) {
            return;
        }

        clearInterval(timer);
        this._animationState.toggleState();
    }

    // Старт или пауза анимации
    togglePlayPause() {
        const {
            play
        } = this._animationState;

        if (play) {
            this.pause();
            return;
        }

        this.play();
    }

    // Переключение видимости голубой и белой планеты
    togglePlanets() {
        const {
            _earth,
            _moon,
            _enable,
            _disable,
            _toggle
        } = this._planetsVisibility;

        if (!_moon && _earth) {
            earth.fillStyle = 'transparent';
            _toggle.call(this._planetsVisibility, 'earth');
            return;
        }

        if (_earth) {
            earth.fillStyle = 'transparent';
            moon.fillStyle = 'transparent';
            this._toggleMoonControlClasses();
            _disable.call(this._planetsVisibility);
            return;
        }

        if (!_earth && !_moon) {
            earth.fillStyle = 'blue';
            moon.fillStyle = 'white';
            this._toggleMoonControlClasses();
            _enable.call(this._planetsVisibility);
            return;
        }

        if (!_earth && _moon) {
            earth.fillStyle = 'blue';
            _toggle.call(this._planetsVisibility, 'earth');
            return;
        }
    }

    // Переключение видимости белой планеты
    toggleMoon() {
        const {
            _moon,
            _toggle
        } = this._planetsVisibility;

        if (_moon) {
            moon.fillStyle = 'transparent';
            _toggle.call(this._planetsVisibility, 'moon');
            return;
        }

        moon.fillStyle = 'white';
        _toggle.call(this._planetsVisibility, 'moon');
    }

    _toggleMoonControlClasses() {
        this._toggleMoonVisibility.classList.toggle('toggle-moon-visibility_true');
        this._toggleMoonVisibility.classList.toggle('toggle-moon-visibility_false');
    }
}

const controls = new Controls();

Object.freeze(controls);

// Создание экземпляров класса Circle
const sun = new Circle(canvas.width / 2, canvas.height / 2, canvas.width / 15, 'yellow');
const earth = new Circle(null, null, sun.radius / 5, 'blue');
const moon = new Circle(null, null, earth.radius / 8, 'white');

// Запуск по-умолчанию
const start = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    sun.draw();
    earth.moveAroundCenter();
    moon.moveAroundObject(earth.newX, earth.newY);
};

let timer = setInterval(start, 0);

(() => {
    // Инициализация элементов управления анимацией
    const play = document.querySelector('.controls .play');
    const pause = document.querySelector('.controls .pause');
    const earthDirectionAnticlockwise = document.querySelector('.controls .earth-direction_anticlockwise');
    const earthDirectionClockwise = document.querySelector('.controls .earth-direction_clockwise');
    const toggleEarthVisibility = document.querySelector('.controls .toggle-earth-visibility');
    const moonDirectionAnticlockwise = document.querySelector('.controls .moon-direction_anticlockwise');
    const moonDirectionClockwise = document.querySelector('.controls .moon-direction_clockwise');
    const toggleMoonVisibility = document.querySelector('.controls .toggle-moon-visibility');
    const controlsHelp = document.querySelector('.controls__item-help');
    const helpModal = document.querySelector('.help');
    const helpClose = document.querySelector('.close');

    // Переключение классов для элемента управления показа планет
    const toggleEarthControlClasses = function () {
        this.classList.toggle('toggle-earth-visibility_true');
        this.classList.toggle('toggle-earth-visibility_false');

    };

    // Переключение классов для элемента управления показа луны
    const toggleMoonControlClasses = function () {
        this.classList.toggle('toggle-moon-visibility_true');
        this.classList.toggle('toggle-moon-visibility_false');
    };

    /**
     * Управление анимацией с помощью клавиатуры
     * @param {object} evt 
     */
    const keyboardControls = evt => {
        switch (evt.key) {
            case 'ArrowUp':
                earth.clockwise();
                break;
            case 'ArrowDown':
                earth.anticlockwise();
                break;
            case 'ArrowLeft':
                moon.clockwise();
                break;
            case 'ArrowRight':
                moon.anticlockwise();
                break;
            case '1':
                controls.togglePlanets();
                toggleEarthControlClasses.call(toggleEarthVisibility);
                break;
            case '2':
                controls.toggleMoon();
                toggleMoonControlClasses.call(toggleMoonVisibility);
                break;
            case ' ':
                controls.togglePlayPause();
                break;
        }
    };

    // Показать модальное окно с подсказками
    const enableHelp = () => {
        helpModal.classList.add('js-visible');
        controls.pause();
    }

    // Скрыть модальное окно с подсказками
    const closeHelp = () => {
        helpModal.classList.remove('js-visible');
        controls.play();
    };

    // Проверка пропорций экрана
    const checkProportion = () => {
        const windowProportion = window.innerWidth / window.innerHeight;
        const controlsPanel = document.querySelector('.controls');
        if (windowProportion < 0.62) {
            controls.togglePlayPause();
            sun.fillStyle = 'transparent';
            earth.fillStyle = 'transparent';
            moon.fillStyle = 'transparent';
            controlsPanel.classList.add('js-d-none');

            ctx.fillStyle = 'white';
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            ctx.textAlign = 'center';
            ctx.font = '35px Arial';
            ctx.fillText('Измените размер окна', canvas.width / 2, canvas.height / 2);

        } else {
            controls.play();
            sun.fillStyle = 'yellow';
            earth.fillStyle = 'blue';
            moon.fillStyle = 'white';
            controlsPanel.classList.remove('js-d-none');
        }
    };

    // Подписка на события
    play.addEventListener('click', controls.play.bind(controls));
    pause.addEventListener('click', controls.pause.bind(controls));
    earthDirectionAnticlockwise.addEventListener('click', earth.anticlockwise.bind(earth));
    earthDirectionClockwise.addEventListener('click', earth.clockwise.bind(earth));
    toggleEarthVisibility.addEventListener('click', controls.togglePlanets.bind(controls));
    toggleEarthVisibility.addEventListener('click', toggleEarthControlClasses);
    moonDirectionAnticlockwise.addEventListener('click', moon.anticlockwise.bind(moon));
    moonDirectionClockwise.addEventListener('click', moon.clockwise.bind(moon));
    toggleMoonVisibility.addEventListener('click', controls.toggleMoon.bind(controls));
    toggleMoonVisibility.addEventListener('click', toggleMoonControlClasses);
    controlsHelp.addEventListener('click', enableHelp);
    helpClose.addEventListener('click', closeHelp);
    window.addEventListener('keydown', keyboardControls);
    window.addEventListener('load', earth.anticlockwise.bind(earth));
    window.addEventListener('load', checkProportion);
    window.addEventListener('resize', checkProportion);
})();