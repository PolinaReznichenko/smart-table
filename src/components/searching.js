export function initSearching(searchField) {
  // Возвращаемая функция добавляет в query параметр поиска, используя значение из поля search
  return (query, state, action) => {
    return state[searchField] ? Object.assign({}, query, {  // проверяем, что в поле поиска было что-то введено
          search: state[searchField]                        // устанавливаем в query параметр
        }) : query;                                         // если поле с поиском пустое, просто возвращаем query без изменений
  }
}
