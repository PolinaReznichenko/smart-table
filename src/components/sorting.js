import {sortMap} from "../lib/sort.js";

export function initSorting(columns) {
    return (query , state, action) => {
        let field = null; // поле, по которому сортируем
        let order = null; // направление сортировки (up, down, none)

        if (action && action.name === 'sort') {
            // @todo: #3.1 — запомнить выбранный режим сортировки
            action.dataset.value = sortMap[action.dataset.value];  // переключаем состояние
            field = action.dataset.field;  // запоминаем поле
            order = action.dataset.value;  // запоминаем новое направление сортировки

            // @todo: #3.2 — сбросить сортировки остальных колонок
            columns.forEach(column => {
                if (column.dataset.field !== action.dataset.field) {
                    column.dataset.value = 'none';
                }
            });
        } else {
            // @todo: #3.3 — получить выбранный режим сортировки
            // если не сортировка или первый рендер
            columns.forEach(column => {
                if (column.dataset.value !== 'none') {  // берем поле и направление у колонки не none, чтобы сортировка применялась согласно ранее выбранной колонке
                    field = column.dataset.field;
                    order = column.dataset.value;
                }
            });
        }

         const sort = (field && order !== 'none') ? `${field}:${order}` : null; // сохраним в переменную параметр сортировки в виде field:direction

        return sort ? Object.assign({}, query, { sort }) : query; //  если есть сортировка, добавляем в запрос, если нет, то не трогаем query
    }
}