class Serenade {
    constructor(element) {
        this.element = element;
    }

    render(data) {
        // remove any existing children
        this.element.innerHTML = '';
        // fill with the visualized data
        this.element.appendChild(this.visualize(data));
    }

    visualize(data) {
        const outer = document.createElement('div');
        outer.classList.add('serenade-outer');
        const text = document.createTextNode('test');
        outer.appendChild(text);
        return outer;
    }
}

function s$(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        throw new Error(`Element ${selector} not found`);
    } else {
        return new Serenade(element);
    }
}

