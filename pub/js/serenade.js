class Serenade {
    constructor(element) {
        this.element = element;
        this.music = new Music();
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
        const inner = this.parse(data);
        outer.appendChild(inner);
        return outer;
    }

    parse(data) {
        const inner = document.createElement('div');
        
        const music = new Music(data).render();
        inner.appendChild(music);

        return inner;
    }
}

class Music {
    constructor(data) {
        this.data = data;
    }

    render() {
        const staff_holder = document.createElement('div');
        staff_holder.classList.add('serenade-staff-holder');
        const staff = new Staff(this.data).render()
        staff_holder.appendChild(staff);
        return staff_holder;
    }
}

class Staff {
    constructor(data) {
        this.data = data;
    }

    render() {
        const staff = document.createElement('div');
        staff.classList.add('serenade-staff');
        let bar_width;
        let num_bars;
        let notes_top;
        let notes_bottom;

        if (this.data.music['left'] && this.data.music['right']) {
            bar_width = this.calculateBarWidth(this.data.music['left'].time_signature);
            notes_top = this.data.music['left'].notes
            notes_bottom = this.data.music['right'].notes
            
        } else {
            // one hand only
            bar_width = this.calculateBarWidth(this.data.music.time_signature);
            notes_top = this.data.music.notes
            notes_bottom = []
        }

        num_bars = this.calculateNumBars(notes_top.concat(notes_bottom), bar_width);
        
        for (let i = 0; i < num_bars; i++) {
            const bar = document.createElement('div');
            bar.classList.add('serenade-bar-holder');

            const bar_notes_top = this.getBarNotes(i, bar_width, notes_top);
            const bar_notes_bottom = this.getBarNotes(i, bar_width, notes_bottom);

            const clef = i == 0 ? this.data.clef : null;
            const top_bar = new Bar(i, bar_width, bar_notes_top, clef).render();
            const bottom_bar = new Bar(i, bar_width, bar_notes_bottom, clef).render()
            
            top_bar.classList.add('serenade-top-bar');
            bottom_bar.classList.add('serenade-bottom-bar');

            bar.appendChild(top_bar);
            bar.appendChild(bottom_bar);
            staff.appendChild(bar);
        }

        return staff;
    }

    getBarNotes(i, bar_width, notes) {
        let bar_notes = [];
        for (let j = 0; j < notes.length; j++) {
            const note = notes[j];

            if (note.startTime >= i * bar_width) {
                
                bar_notes.push(note);
            }
        }
        return bar_notes;
    }

    durations = {
        'whole': 4,
        'half': 2,
        'quarter': 1,
        'eighth': 0.5,
        '16th': 0.25,
        '32nd': 0.125,
        '64th': 0.0625,
    }

    calculateNumBars(notes, bar_width) {
        

        const max_end_time = notes.reduce((max, note) => {
            return Math.max(max, note.startTime + this.durations[note.duration]);
        }, 0.0);
        return Math.ceil(max_end_time / bar_width);;
    }

    calculateBarWidth(time_signature) {
        if (time_signature.includes('/')) {
            const [num, denom] = time_signature.split('/');
            return parseFloat(num) / parseFloat(denom) * 4;
        } else {
            const time_sigs = {
                'common': '4/4',
                'march': '2/4',
                'waltz': '3/4',
                'cut': '2/2',
                'common time': '4/4',
                'march time': '2/4',
                'waltz time': '3/4',
                'cut time': '2/2',
            }
            // default to common time
            return this.calculateBarWidth(time_sigs[time_signature.toLowerCase()] || '4/4');
        }
    }
}

class Bar {
    constructor(index=-1, bar_width, notes=[], clef='treble') {
        this.notes = notes;
        this.index = index;
        this.bar_width = bar_width;
        this.clef = clef;
    }

    getNoteTop(note, clef) {
        let offset = 0;
        const clef_offsets = {
            'treble': 0  ,
            'bass': -2,
        }
        const note_offsets = {
            'c': 0,
            'd': 2,
            'e': 4,
            'f': 5,
            'g': 7,
            'a': 9,
            'b': 11,
        }


        return offset;
    }

    render() {
        const bar = document.createElement('div');
        bar.classList.add('serenade-bar');
        for (let i = 0; i < this.notes.length; i++) {
            const note = this.notes[i];
            const adjusted_start = note.startTime - this.index * this.bar_width 
            const note_element = new Note(note, adjusted_start).render();
            note_element.style.left = `${adjusted_start * 100}%`;
            note_element.style.top = `${this.getNoteTop(note, this.clef)}%`;
            bar.appendChild(note_element);
        }
        return bar;
    }
}

class Note {
    constructor(note_data, start_time) {
        this.data = note_data;
        this.start_time = start_time;
    }

    render() {
        const note = document.createElement('div');
        note.classList.add('serenade-note');
        note.classList.add('serenade-note-' + this.data.duration);
        note.style.left = this.startTime * 100 + '%';

        const note_text = document.createTextNode(this.data.note);
        note.appendChild(note_text);

        return note;
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

