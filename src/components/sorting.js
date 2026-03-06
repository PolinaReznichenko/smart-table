import { sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  // Возвращаемая функция добавляет в query параметры сортировки
  return (query, state, action) => {
    let field = null;  // поле, по которому сортируем
    let order = null;  // направление сортировки (up, down, none)

    if (action && action.name === "sort") {
      // запоминаем выбранный режим сортировки
      action.dataset.value = sortMap[action.dataset.value];  // переключаем состояние
      field = action.dataset.field;                          // запоминаем поле
      order = action.dataset.value;                          // запоминаем новое направление сортировки

      // сброс сортировки остальных колонок
      columns.forEach((column) => {
        if (column.dataset.field !== action.dataset.field) {
          column.dataset.value = "none";
        }
      })
    } else {
      // получаем выбранный режим сортировки (если не первый рендер)
      columns.forEach((column) => {
        if (column.dataset.value !== "none") {  // берем поле и направление у колонки, которая не none, чтобы сортировка применялась согласно ранее выбранной колонке
          field = column.dataset.field;
          order = column.dataset.value;
        }
      })
    }

    const sort = field && order !== "none" ? `${field}:${order}` : null;  // сохраним в переменную параметр сортировки в виде field:direction

    return sort ? Object.assign({}, query, { sort }) : query;  //  если есть сортировка, добавляем в запрос, если нет, то не трогаем query
  }
}
