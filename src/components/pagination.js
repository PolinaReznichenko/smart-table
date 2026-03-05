import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
    // клонируем шаблон кнопки и удаляем оригинал
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();

    let pageCount; // общее количество страниц, которое отображали при последней отрисовке

    const applyPagination = (query, state, action) => {
            const limit = state.rowsPerPage; // сколько строк на одной странице
            let page = state.page; // текущая страница

            // @todo: #2.6 — обработать действия (клики по кнопкам)
            if (action) switch(action.name) { // в зависимости от имени действия меняем page
                case 'prev': page = Math.max(1, page - 1); break;
                case 'next': page = Math.min(pageCount, page + 1); break;
                case 'first': page = 1; break;
                case 'last': page = pageCount; break;
            }

            return Object.assign({}, query, { // добавим параметры к query (текущие параметры запроса), но не изменяем исходный объект
                limit,
                page
            });
    };

    const updatePagination = (total, { page, limit }) => {
            pageCount = Math.ceil(total / limit); // обновляем общее количество страниц

            // переносим код, который делали под @todo: #2.4
            // @todo: #2.4 — получить список видимых страниц (например, [1,2,3,4,5]) и вывести их
            const visiblePages = getPages(page, pageCount, 5);
            pages.replaceChildren(...visiblePages.map(pageNumber => {
                const el = pageTemplate.cloneNode(true);
                return createPage(el, pageNumber, pageNumber === page);
            }));

            // переносим код, который делали под @todo: #2.5 (обратите внимание, что rowsPerPage заменена на limit)
            // @todo: #2.5 — обновить статус пагинации
            fromRow.textContent = (page - 1) * limit + 1;
            toRow.textContent = Math.min((page * limit), total);
            totalRows.textContent = total; // total = количество всех записей(данных)
        }

    return {
        updatePagination,
        applyPagination
    };
}