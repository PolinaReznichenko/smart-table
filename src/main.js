import "./fonts/ys-display/fonts.css";
import "./style.css";

import {data as sourceData} from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";
import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// Инициализация API (исходные данные используемые в render)
const api = initData();

/**
 * Сбор и обработка полей (текущих значений) из контейнера таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));
  const rowsPerPage = parseInt(state.rowsPerPage);        // приводим количество страниц к числу
  const page = parseInt(state.page ?? 1);                 // номер страницы по умолчанию 1 и тоже число

  return {
    ...state,
    rowsPerPage,
    page
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях. Сердце приложения (главная функция)
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
  let state = collectState();      // сбор состояния полей из таблицы (текущие значения формы)
  let query = {};                  // здесь будут формироваться параметры запроса
  // Использование (последовательное применение функций, где каждая формирует и добавляет свои параметры в query)
  query = applySearching(query, state, action);    // обновляем параметры запроса с учётом поиска
  query = applyFiltering(query, state, action);    // обновляем параметры запроса с учётом фильтрации
  query = applySorting(query, state, action);      // обновляем параметры запроса с учётом сортировки
  query = applyPagination(query, state, action);   // обновляем параметры запроса с учётом пагинации

  const { total, items } = await api.getRecords(query); // запрашиваем данные с сервера с собранными параметрами (возвращается готовый срез данных items и общее количество записей total)

  updatePagination(total, query); // перерисовываем (обновляем) интерфейс пагинации

  sampleTable.render(items); // отрисовываем таблицу с полученными записями
}

//Подключение к таблице шаблонов. Настройка структуры таблицы
const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render
);

// Инициализация компонентов
const { applyPagination, updatePagination } = initPagination(  // пагинация
  sampleTable.pagination.elements,
  (el, page, isCurrent) => {  // задается содержимое для каждой кнопки
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  }
);

const applySorting = initSorting([  // сортировка
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal
]);

const { applyFiltering, updateIndexes } = initFiltering(  // фильтрация
  sampleTable.filter.elements
);

const applySearching = initSearching("search"); // поиск

// Добавление таблицы в DOM (на страницу)
const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

// Функция, которая вызывается первой, она загружает справочники и заполняет селекты фильтров
async function init() {
  const indexes = await api.getIndexes();  //  загружаем справочники (продавцов) с сервера
  updateIndexes(sampleTable.filter.elements, {  // передаем объект фильтров
    searchBySeller: indexes.sellers             // передаем объект с индексами
  });
}

// Запуск первого рендера (отображение первой страницы таблицы)
init().then(render);
