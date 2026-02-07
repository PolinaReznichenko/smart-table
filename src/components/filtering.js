import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes)                                  // Получаем ключи из объекта
      .forEach((elementName) => {                         // Перебираем по именам
        elements[elementName].append(                     // в каждый элемент добавляем опции
            ...Object.values(indexes[elementName])        // формируем массив имён, значений опций
                      .map(name => {                      // используйте name как значение и текстовое содержимое
                        const optionTag = document.createElement("option");
                        optionTag.value = name;
                        optionTag.textContent = name;
                        return optionTag
                      })
        )
     })

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === "clear") {
            const filterInput = action.parentElement.querySelector("input");
            filterInput.value = "";
            const fieldName = action.dataset.field;
            state[fieldName] = "";
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    }
}