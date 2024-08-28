
export function createInputElement(className, placeholder = '', value = '') {
    const input = document.createElement("input");
    input.classList.add(className);
    input.placeholder = placeholder;
    input.value = value;
    return input;
}