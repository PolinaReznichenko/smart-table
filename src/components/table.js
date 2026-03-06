import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;  // объект с настройками
  const root = cloneTemplate(tableTemplate);                       // создаем корневой объект таблицы и клонируем основной шаблон

  // вывод дополнительных шаблонов до и после таблицы
  before.reverse().forEach((subName) => {  // перед таблицей
    root[subName] = cloneTemplate(subName);           // для каждого имени создаём клон шаблона (например, search/header/filter) и сохраняем его как свойство объекта root
    root.container.prepend(root[subName].container);  // контейнер этого клона вставляем в начало корневого контейнера таблицы
  });

  after.forEach((subName) => {  // после таблицы
    root[subName] = cloneTemplate(subName);
    root.container.append(root[subName].container);
  });

  // обработка событий и вызов onAction() (в основном файле это render)
  root.container.addEventListener("change", () => {  // при изменении значений полей формы
    onAction();  // при изменении сразу происходит перерисовка
  });
  root.container.addEventListener("reset", () => {  // при сбросе формы
    setTimeout(onAction);  // чтобы дать браузеру время на выполнение сброса значений до того, как мы вызовем onAction (иначе были бы старые значения)
  });
  root.container.addEventListener("submit", (e) => {  // при отправке формы
    e.preventDefault();
    onAction(e.submitter);  // передается элемент, который инициировал отправку
  });

  // отвечает за наполнение таблицы данными (для каждой записи создаётся строка из шаблона, заполняются ячейки (и, если нужно, поля ввода), и все строки вставляются в контейнер)
  const render = (data) => {
    // преобразование данных (списка записей с сервера) в массив строк на основе шаблона rowTemplate
    const nextRows = data.map((item) => {
      const row = cloneTemplate(rowTemplate);

      Object.keys(item).forEach((key) => {
        if (!!row.elements[key]) {              // проверяем, есть ли элемент с именем ключа объекта данных
          const element = row.elements[key];    // если нет, то устанавливаем
          element.textContent = item[key];      // задаем содержимое, чтобы показать значение в ячейке
          if (element.tagName === "INPUT" || element.tagName === "SELECT") {  // если инпут или селект, то устанавливаем еще его value
            element.value = item[key];
          }
        }
      });

      return row.container;  // возвращаем DOM-элемент готовой строки
    });
    root.elements.rows.replaceChildren(...nextRows);  //  заменяем содержимое контейнера для строк новыми строками (удаляет старые и добавляет новые)
  };

  return { ...root, render };
}
