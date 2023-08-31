const CLASS_NAME_SELECT = 'select';
const CLASS_NAME_ACTIVE = 'select_show';
const CLASS_NAME_SELECTED = 'select__option_selected';
const SELECTOR_ACTIVE = '.select_show';
const SELECTOR_DATA = '[data-select]';
const SELECTOR_DATA_TOGGLE = '[data-select="toggle"]';
const SELECTOR_OPTION_SELECTED = '.select__option_selected';

class CustomSelect {
    constructor(target, params) {
        this._elRoot = typeof target === 'string' ? document.querySelector(target) : target;
        this._params = params || {};

        if (this._params['options']) {
            this._elRoot.classList.add(CLASS_NAME_SELECT);
            this._elRoot.innerHTML = CustomSelect.template(this._params);
        }
        this._elToggle = this._elRoot.querySelector(SELECTOR_DATA_TOGGLE);
        this._elHidden = this._elRoot.querySelector('input[type=hidden]');
        this._elRoot.addEventListener('click', this._onClick.bind(this));
        if (this._params.search) this._oninput(this._elRoot, this._params);
    }
    _onClick(e) {
        const target = e.target;
        const type = target.closest(SELECTOR_DATA).dataset.select;

        switch (type) {
            case 'toggle':
                this.toggle();
                break;
            case 'option':
                this._changeValue(target);
                break;
        }
    }
    _update(option) {
        option = option.closest('.select__option');

        const selected = this._elRoot.querySelector(SELECTOR_OPTION_SELECTED);


        if (selected) {
            selected.classList.remove(CLASS_NAME_SELECTED);
        }
        option.classList.add(CLASS_NAME_SELECTED);
        if (this._elToggle.dataset.type === 'search'){
            this._elToggle.value = option.textContent;
            this._elHidden.value = option.dataset['value'];
        }else {
            this._elToggle.textContent = option.textContent;
            this._elToggle.value = option.dataset['value'];
            this._elRoot.classList.add('_selected');
        }
        this._elToggle.dataset.index = option.dataset['index'];
        this._elRoot.dispatchEvent(new CustomEvent('select.change'));
        this._params.onSelected ? this._params.onSelected(this, option) : null;

        return option.dataset['value'];
    }
    _reset() {
        const selected = this._elRoot.querySelector(SELECTOR_OPTION_SELECTED);
        if (selected) {
            selected.classList.remove(CLASS_NAME_SELECTED);
        }
        this._elToggle.textContent = 'Выберите из списка';
        this._elToggle.value = '';
        this._elToggle.dataset.index = -1;
        this._elRoot.dispatchEvent(new CustomEvent('select.change'));
        this._params.onSelected ? this._params.onSelected(this, null) : null;
        return '';
    }
    _changeValue(option) {
        if (option.classList.contains(CLASS_NAME_SELECTED)) {
            return;
        }
        this._update(option);
        this.hide();
    }
    _oninput(elem, params){
        // console.log(params);
        this._elToggle.addEventListener('input', () => {
            let value = this._elToggle.value.trim();
            let items = [];

            if (value !== ''){

                params.options.forEach((option, index) => {
                    let hide = '_hide',
                        text = option[1];

                    if (text.search(value) !== -1){
                        hide = '';
                        text = this._insertMark(text, text.search(value), value.length);
                    }

                    items.push(`<li class="select__option ${hide}" data-select="option" data-value="${option[0]}" data-index="${index}">${text}</li>`);
                })

                this._elRoot.querySelector('.select__options').innerHTML = items.join('');
            }else {
                let items = [];
                params.options.forEach((option, index) => {
                    items.push(`<li class="select__option" data-select="option" data-value="${option[0]}" data-index="${index}">${option[1]}</li>`);
                })
                this._elRoot.querySelector('.select__options').innerHTML = items.join('');
            }
        })
    }
    _insertMark(string, pos, length){
        return string.slice(0, pos) + '<mark>' + string.slice(pos, pos + length) + '</mark>' + string.slice(pos + length);
    }
    // __search_draw(options){
    //
    // }
    show() {
        document.querySelectorAll(SELECTOR_ACTIVE).forEach(select => {
            select.classList.remove(CLASS_NAME_ACTIVE);
        });
        this._elRoot.classList.add(CLASS_NAME_ACTIVE);
    }
    hide() {
        this._elRoot.classList.remove(CLASS_NAME_ACTIVE);
    }
    toggle() {
        if (this._elRoot.classList.contains(CLASS_NAME_ACTIVE)) {
            this.hide();
        } else {
            this.show();
        }
    }
    dispose() {
        this._elRoot.removeEventListener('click', this._onClick);
    }
    get value() {
        return this._elToggle.value;
    }
    set value(value) {
        let isExists = false;
        this._elRoot.querySelectorAll('.select__option').forEach((option) => {
            if (option.dataset['value'] === value) {
                isExists = true;
                return this._update(option);
            }
        });
        if (!isExists) {
            return this._reset();
        }
    }
    get selectedIndex() {
        return this._elToggle.dataset['index'];
    }
    set selectedIndex(index) {
        const option = this._elRoot.querySelector(`.select__option[data-index="${index}"]`);
        if (option) {
            return this._update(option);
        }
        return this._reset();
    }
}

CustomSelect.template = params => {
    const name = params['name'];
    const options = params['options'];
    const targetValue = params['targetValue'];
    let select_type;
    let items = [];
    let selectedIndex = -1;
    let selectedValue = '';
    let selectedContent = 'Выберите из списка';
    let placeholder = (params.placeholder !== undefined) ? params.placeholder :'Оберіть із списку або введіть';


    options.forEach((option, index) => {
        let selectedClass = '';
        if (option[0] === targetValue) {
            selectedClass = ' select__option_selected';
            selectedIndex = index;
            selectedValue = option[0];
            selectedContent = option[1];
        }
        items.push(`<li class="select__option${selectedClass}" data-select="option" data-value="${option[0]}" data-index="${index}">${option[1]}</li>`);
    });

    // if (params.search){
    //     let input_trigger = `<input type="text" class="select__input" value="${selectedContent}" data-select="toggle" data-type="search" data-index="${selectedIndex}">`;
    //     if (selectedValue === '') {
    //         input_trigger = `<input type="text" class="select__input" placeholder="${placeholder}" data-select="toggle" data-type="search" data-index="${selectedIndex}">`;
    //     }
    //     select_type = `
    //         <div class="select__toggle">
    //             ${input_trigger}
    //             <input type="hidden" value="${selectedValue}" name="${name}">
    //         </div>
    //     `;
    // }else {
    //     select_type = `
    //         <div class="select__toggle">
    //             <button type="button" name="${name}" value="${selectedValue}" data-type="button" data-select="toggle" data-index="${selectedIndex}">${selectedContent}</button>
    //         </div>
    //     `;
    // }

    if (params.search){
        let input_trigger = `<input type="text" class="select__input" placeholder="${placeholder}" value="${selectedContent}" data-select="toggle" data-type="search" data-index="${selectedIndex}">`;
        if (selectedValue === '') {
            input_trigger = `<input type="text" placeholder="${placeholder}" class="select__input" data-select="toggle" data-type="search" data-index="${selectedIndex}">`;
        }
        select_type = `
            <div class="select__toggle">
                ${input_trigger}
                <input type="hidden" value="${selectedValue}" name="${name}">
            </div>
        `;
    }else {
        select_type = `
            <div class="select__toggle">       
                <label>Тест</label>        
                <button type="button" name="${name}" value="${selectedValue}" data-type="button" data-select="toggle" data-index="${selectedIndex}">${selectedContent}</button>
            </div>
        `;
    }

    return `
        ${select_type}
        <div class="select__dropdown">
            <ul class="select__options">${items.join('')}</ul>
        </div>
    `;
};


document.addEventListener('click', (e) => {
    if (!e.target.closest('.select')) {
        document.querySelectorAll(SELECTOR_ACTIVE).forEach(select => {
            select.classList.remove(CLASS_NAME_ACTIVE);
        });
    }
});
