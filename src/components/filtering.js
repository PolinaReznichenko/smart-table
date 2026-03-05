export function initFiltering(elements) {
    // заполнение выпадающих списков опциями из справочников с сервера (продавцов, покупателей, ...)
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes)                               // Получаем ключи из объекта (массив имён полей)
          .forEach((elementName) => {                      // Перебираем по именам
            elements[elementName].append(                  // в каждый элемент добавляем опции
                ...Object.values(indexes[elementName])     // формируем массив имён, значений опций
                    .map(name => {                         // устанавливаем name как значение и текстовое содержимое
                        const el = document.createElement('option');
                        el.textContent = name;
                        el.value = name;
                        return el;
                        })
            )
        })
    }

    //формирование части запроса к серверу, отвечающей за фильтрацию
    const applyFiltering = (query, state, action) => {
        // код с обработкой очистки поля
        if (action && action.name === "clear") {
            const filterInput = action.parentElement.querySelector("input");
            filterInput.value = "";
            const fieldName = action.dataset.field;
            state[fieldName] = "";
        }

        // @todo: #4.5 — отфильтровать данные, используя компаратор
        // сбор значений фильтров
        const filter = {};
        Object.keys(elements).forEach(key => {  // проходим по всем ключам объекта (элементам фильтров)
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) { // ищем поля ввода в фильтре с непустыми данными
                    filter[`filter[${elements[key].name}]`] = elements[key].value; // чтобы сформировать в query вложенный объект фильтра (например, { 'filter[seller]': 'Иванов' })
                }
            }
        })

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query; // если в фильтре что-то добавилось, применим к запросу (не меняя исходный query)
    }

    return {
        updateIndexes,
        applyFiltering
    }
}