class Serenade {
    constructor(element) {
        this.element = element;
        this.music = new Music();
    }

    render(data) {
        // emove any existing children
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

    sortNotes(a, b) {
        if (a.startTime < b.startTime) {
            return -1;
        }
        if (a.startTime > b.startTime) {
            return 1;
        }
        return 0;
    }

    render() {
        const staff = document.createElement('div');
        staff.classList.add('serenade-staff');
        let bar_width;
        let num_bars;
        let notes;
        let left_right = true;

        if (this.data.music['left'] && this.data.music['right']) {
            bar_width = this.calculateBarWidth(this.data.music['left'].time_signature);
            notes = this.data.music['left'].notes.concat(this.data.music['right'].notes);

        } else {
            // one hand only
            bar_width = this.calculateBarWidth(this.data.music.time_signature);
            notes = this.data.music.notes
            left_right = false;
        }

        notes.sort(this.sortNotes)

        num_bars = this.calculateNumBars(notes, bar_width);
        
        for (let i = 0; i < num_bars; i++) {
            const bar_notes = this.getBarNotes(i, bar_width, notes);

            const clef = (i == 0);
            const bar = new Bar(i, bar_width, bar_notes, clef, left_right).render();
            
            staff.appendChild(bar);
        }

        return staff;
    }

    getBarNotes(i, bar_width, notes) {
        let bar_notes = [];
        for (let j = 0; j < notes.length; j++) {
            const note = notes[j];

            if (note.startTime >= i * bar_width && note.startTime < (i + 1) * bar_width) {
                
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
    constructor(index=-1, bar_width, notes=[], clef=false, left_right=true) {
        this.notes = notes;
        this.index = index;
        this.bar_width = bar_width;
        this.clef = clef;
        this.left_right = left_right;
        this.notes_width = this.calculateNotesWidth();
    }

    calculateNotesWidth() {
        const width = this.notes.reduce((prev, note) => {
            if (prev.startTime == note.startTime) {
                return prev;
            } else {
                return {
                    startTime: note.startTime,
                    width: prev.width + 1,
                };
            }
        }, {
            startTime: -1,
            width: 0
        });
        return width.width;
    }

    getNoteTop(note) {
        const octave = parseInt(note.octave);

        let offset = 0;
        const note_offsets = {
            'b': 0,
            'a': 1,
            'g': 2,
            'f': 3,
            'e': 4,
            'd': 5,
            'c': 6,
        }

        offset = note_offsets[note.note.toLowerCase()] + ((octave - 5) * -7) + 1;
        return offset;
    }

    render() {
        const bar = document.createElement('div');
        bar.classList.add('serenade-bar');
        let clef_offset = 0;
        if (this.clef) {
            const treble_clef = new Clef('Treble').render();
            clef_offset = 8;
            treble_clef.style.gridRow = '1 / span 14';
            treble_clef.style.gridColumn = `1 / span ${clef_offset}`;
            if (this.left_right) {
                const bass_clef = new Clef('Bass').render();
                bass_clef.style.gridRow = '16 / span 7';
                bass_clef.style.gridColumn = `1 / span ${clef_offset}`;
                bar.appendChild(bass_clef);
            }
            bar.appendChild(treble_clef);
        }
        bar.style.gridTemplateColumns = `repeat(${this.notes_width + 4 + clef_offset}, 1em)`
        for (let j = 0; j < 5; j++) {
            const line = document.createElement('div');
            line.classList.add('serenade-line');
            line.style.gridRow = `${j * 2 + 4}`;
            bar.appendChild(line);

            if (this.left_right) {
                const lower_line = document.createElement('div');
                lower_line.classList.add('serenade-line');
                lower_line.style.gridRow = `${j * 2 + 16}`;
                bar.appendChild(lower_line);
            }
        }
        let last_note_start_time = -1;
        let last_note_adj = 0;
        if (this.clef) {
            last_note_adj = 8;
        }
        for (let i = 0; i < this.notes.length; i++) {
            const note = this.notes[i];
            let adjusted_start;
            if (note.startTime != last_note_start_time) {
                adjusted_start = last_note_adj + 1;
            } else {
                adjusted_start = last_note_adj;
            }

            last_note_start_time = note.startTime;
            last_note_adj = adjusted_start;
            
            const note_element = new Note(note).render();

            note_element.style.gridColumn = `${adjusted_start}`;
            const topOffset = this.getNoteTop(note);
            note_element.style.gridRow = `${topOffset}`;
            bar.appendChild(note_element);
        }
        return bar;
    }
}

class Note {
    constructor(note_data) {
        this.data = note_data;
    }

    render() {
        const note = document.createElement('div');
        note.classList.add('serenade-note');
        note.classList.add('serenade-note-' + this.data.duration);

        const note_text = document.createTextNode(this.data.note);
        note.appendChild(note_text);

        return note;
    }

}

class Clef {
    constructor(clef) {
        this.clef = clef;
    }

    render() {
        const clef = document.createElement('div');
        const img = document.createElement('img');
        clef.classList.add('serenade-clef');
        
        if (this.clef === 'Treble') {
            img.src = './images/treble.png';
            img.alt = 'Treble Clef';
        } else {
            img.src = './images/bass.png';
            img.alt = 'Bass Clef';
        }
        clef.appendChild(img);

        return clef;
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

