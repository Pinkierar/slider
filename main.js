function main() {

  // Все слайдеры
  const sliders = document.querySelectorAll('.slider');

  // Инициализация всех слайдеров
  sliders.forEach(slider => {

    // Конвейер
    const conveyor = slider.querySelector('.slider-conveyor');

    // Оригинальные слайды
    const slides = Array.from(conveyor.children);

    // Разделитель и его копия
    const separator = document.createElement('div');
    separator.className = 'slider-separator';
    separator.style.width = '0px';
    const separatorClone = separator.cloneNode(true);

    let isDrag = false;           // Перетаскивание ли
    let separatorWidth = 0;       // Ширина разделителя
    let pointerPosition = 0;      // Позиция указателя по оси X
    let pointerPrevPosition = 0;  // Предыдущая позиция указателя по оси X
    let conveyorWidth = 0;        // Ширина конвейера
    let conveyorPosition = 0;     // Позиция конвейера по оси X

    // Добавление элементов в conveyor
    // Получается: Слайды + разделитель + копия слайдов + копия разделителя
    conveyor.append(separator);
    for (const slide of slides) {
      conveyor.append(slide.cloneNode(true));
    }
    conveyor.append(separatorClone);

    // Событие изменения размера окна
    const resizeHandler = () => {

      // Общая ширина всех оригинальных слайдов
      const slidesWidth = slides.reduce((width, slide) => {
        const slideWidth = slide.getBoundingClientRect().width;

        return width + slideWidth;
      }, 0);

      conveyorWidth = conveyor.getBoundingClientRect().width;
      separatorWidth = conveyorWidth - slidesWidth;

      separatorClone.style.width = separator.style.width = `${separatorWidth}px`;
    };
    window.addEventListener('resize', resizeHandler);
    window.setTimeout(resizeHandler, 100); // Стили рендерятся с задержкой
    resizeHandler();

    // Событие нажатия
    slider.addEventListener('pointerdown', event => {
      pointerPrevPosition = event.pageX;

      isDrag = true;
    });

    // Событие движения
    window.addEventListener('pointermove', event => {
      if (!isDrag) return;

      pointerPosition = event.pageX;

      // Смещение курсора вычитается из текущей позиции конвейера
      const pointerOffset = pointerPrevPosition - pointerPosition;
      conveyorPosition -= pointerOffset;

      // Если первый элемент ушёл за левую сторону слайдера,
      // то он переместится в конец конвейера,
      // а сам конвейер сместится вправо на ширину перемещённого элемента
      const firstItem = conveyor.firstElementChild;
      const firstWidth = firstItem.getBoundingClientRect().width;
      if (conveyorPosition <= -firstWidth) {
        conveyorPosition += firstWidth;
        conveyor.append(firstItem);
      }

      // Если левая граница конвейера попала на слайдер,
      // то последний элемент переместится в начало конвейера,
      // а сам конвейер сместится влево на ширину перемещённого элемента
      const lastItem = conveyor.lastElementChild;
      const lastWidth = lastItem.getBoundingClientRect().width;
      if (conveyorPosition > 0) {
        conveyorPosition -= lastWidth;
        conveyor.prepend(lastItem);
      }

      // Рендер позиции конвейера
      conveyor.style.transform = `translateX(${conveyorPosition}px)`;

      pointerPrevPosition = pointerPosition;
    });

    // Событие отпускания
    window.addEventListener('pointerup', () => {
      isDrag = false;
    });
  });
}

window.addEventListener('DOMContentLoaded', main);