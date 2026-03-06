import { getPages } from "../lib/utils.js";

export const initPagination = ({ pages, fromRow, toRow, totalRows }, createPage) => {
  //Подготовка (клонирование) шаблона кнопки для страницы и очистка контейнера (удаление оригинала шаблона)
  const pageTemplate = pages.firstElementChild.cloneNode(true);
  pages.firstElementChild.remove();

  let pageCount; // общее количество страниц, которое отображали при последней отрисовке

  // Функция, которая добавляет новые параметры в запрос
  const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage;  // сколько строк на одной странице
    let page = state.page;            // текущая страница

    // обработка действия (клики по кнопкам)
    if (action) switch (action.name) {  // в зависимости от имени действия меняем page
        case "prev":
          page = Math.max(1, page - 1);
          break;
        case "next":
          page = Math.min(pageCount, page + 1);
          break;
        case "first":
          page = 1;
          break;
        case "last":
          page = pageCount;
          break;
      }

    return Object.assign({}, query, {  // добавим параметры к query (текущим параметрам запроса)
      limit,
      page
    });
  };

  // Функция, которая обновляет интерфейс на основе total и текущих параметров
  const updatePagination = (total, { page, limit }) => {
    pageCount = Math.ceil(total / limit);  // обновляем общее количество страниц

    // получение списка видимых страниц (например, [1,2,3,4,5]) и вывод их
    const visiblePages = getPages(page, pageCount, 5);
    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        const el = pageTemplate.cloneNode(true);
        return createPage(el, pageNumber, pageNumber === page);
      })
    );

    // обновление статуса пагинации
    fromRow.textContent = (page - 1) * limit + 1;
    toRow.textContent = Math.min(page * limit, total);
    totalRows.textContent = total; // total = количество всех записей(данных)
  };

  return {
    updatePagination,
    applyPagination
  }
}
