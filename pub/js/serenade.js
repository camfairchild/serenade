class Serenade {
    constructor(data) {
        this.music = new Music(data);
        this.data = data;
        this.update = this.update.bind(this)
        this.outer = document.createElement('div');
        this.outer.classList.add('serenade-outer');
    }

    update(data) {
        console.log("Update: ", data)
        this.data = data;
        while (this.outer.firstChild) {
            this.outer.firstChild.remove();
        }
        this.render()
    }

    render() {
        // input
        this.input = new SerenadeInput(this.data, this.update);
        const input = this.input.render();
        this.outer.appendChild(input);

        this.music = new Music(this.data);
        const inner = this.music.render()
        this.outer.appendChild(inner);

        return this.outer
    }
}

class SerenadeInput {
    constructor(data, updateParent) {
        this.data = data;
        this.updateParent = updateParent;
        this.updateEventHandler = this.updateEventHandler.bind(this)
        this.dataString = this.generateDataString(data);
    }

    parseTextInput(dataString) {
        let str = "tempo: 90;left: (clef: treble;key: G;time: 4/4;notes: (D4:eighth:0, B4:eighth:0.5, A4:eighth:1, G4:eighth:1.5, D4:half:2, D4:eighth:4, B4:eighth:4.5, A4:eighth:5, G4:eighth:5.5, E4:half:6, E4:eighth:8, C5:eighth:8.5, B4:eighth:9, A4:eighth:9.5, F4:half:10, D5:eighth:12, D5:eighth:12.5, C5:eighth:13, A4:eighth:13.5, B4:half:14);right: (clef: treble;key: G;time: 4/4;notes: (D4:eighth:0, B4:eighth:0.5, A4:eighth:1, G4:eighth:1.5, D4:half:2, D4:eighth:4, B4:eighth:4.5, A4:eighth:5, G4:eighth:5.5, E4:half:6, E4:eighth:8, C5:eighth:8.5, B4:eighth:9, A4:eighth:9.5, F4:half:10, D5:eighth:12, D5:eighth:12.5, C5:eighth:13, A4:eighth:13.5, B4:half:14);editable: true;"
        return JSON.parse(dataString)
    }

    generateDataString(data) {
        const dataString = JSON.stringify(data, null, 2);
        /*
        let dataString = '';
        if (data.tempo) {
            dataString += `tempo: ${data.tempo};`
        }
        if (data.music) {
            if (data.music.left) {
                dataString += `left: (`
                if (data.music.left.clef) {
                    dataString += `clef: ${data.music.left.clef};`
                }
                if (data.music.left.key) {
                    dataString += `key: ${data.music.left.key};`
                }
                if (data.music.left.time_signature) {
                    dataString += `time: ${data.music.left.time_signature};`
                }
                if (data.music.left.notes) {
                    dataString += `notes: (`
                    for (let i = 0; i < data.music.left.notes.length - 1; i++) {
                        const note = data.music.left.notes[i];
                        dataString += `${note.note}${note.octave}:${note.duration}:${note.startTime}, `
                    }
                    const lastNote = data.music.left.notes[data.music.left.notes.length - 1];
                    dataString += `${lastNote.note}${lastNote.octave}:${lastNote.duration}:${lastNote.startTime});`
                }

                if (data.music.right) {
                    dataString += `right: (`
                    if (data.music.left.clef) {
                        dataString += `clef: ${data.music.left.clef};`
                    }
                    if (data.music.left.key) {
                        dataString += `key: ${data.music.left.key};`
                    }
                    if (data.music.left.time_signature) {
                        dataString += `time: ${data.music.left.time_signature};`
                    }
                    if (data.music.left.notes) {
                        dataString += `notes: (`
                        for (let i = 0; i < data.music.left.notes.length - 1; i++) {
                            const note = data.music.left.notes[i];
                            dataString += `${note.note}${note.octave}:${note.duration}:${note.startTime}, `
                        }
                        const lastNote = data.music.left.notes[data.music.left.notes.length - 1];
                        dataString += `${lastNote.note}${lastNote.octave}:${lastNote.duration}:${lastNote.startTime});`
                    }
                }
            } else {
                dataString += `music: (`
                if (data.music.left.clef) {
                    dataString += `clef: ${data.music.left.clef};`
                }
                if (data.music.left.key) {
                    dataString += `key: ${data.music.left.key};`
                }
                if (data.music.left.time_signature) {
                    dataString += `time: ${data.music.left.time_signature};`
                }
                if (data.music.left.notes) {
                    dataString += `notes: (`
                    for (let i = 0; i < data.music.left.notes.length - 1; i++) {
                        const note = data.music.left.notes[i];
                        dataString += `${note.note}${note.octave}:${note.duration}:${note.startTime}, `
                    }
                    const lastNote = data.music.left.notes[data.music.left.notes.length - 1];
                    dataString += `${lastNote.note}${lastNote.octave}:${lastNote.duration}:${lastNote.startTime});`
                }
            }
            
        }
        if (data.editable) {
            dataString += 'editable: true;'
        }
        if (data.visualize) {
            dataString += 'visualize: true;'
        }*/

        return dataString
    }

    updateEventHandler(e) {
        e.preventDefault();
        const input = e.target.parentElement.children[0];
        const dataString = input.value;
        const data = this.parseTextInput(dataString);
        this.updateParent(data);
    }

    editButtonEventHandler(e) {
        e.preventDefault();
        const editButton = e.target
        const outer = e.target.parentElement.children[1];
        if (outer.classList.contains('hidden')) {
            outer.classList.remove('hidden')
            editButton.classList.add('serenade-edit-button-close');
            editButton.classList.remove('serenade-edit-button-edit');
        } else {
            outer.classList.add('hidden')
            editButton.classList.remove('serenade-edit-button-close');
            editButton.classList.add('serenade-edit-button-edit');
            
        }
    }

    render() {
        const outer = document.createElement('div');
        outer.classList.add('serenade-edit-outer');

        const editButton = document.createElement('button');
        editButton.classList.add('serenade-edit-button');
        editButton.classList.add('serenade-edit-button-edit');
        editButton.addEventListener('click', this.editButtonEventHandler);
        outer.appendChild(editButton);

        const inputOuter = document.createElement('div');
        inputOuter.classList.add('serenade-edit-input-outer');
        inputOuter.classList.add('hidden');

        const input = document.createElement('textarea');
        input.classList.add('serenade-edit-input-inner');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'Edit Serenade Data');
        input.value = this.dataString;

        const innerButton = document.createElement('button');
        innerButton.classList.add('serenade-edit-input-button');
        innerButton.innerText = 'Render';
        innerButton.addEventListener('click', this.updateEventHandler)
        inputOuter.appendChild(input);
        inputOuter.appendChild(innerButton);

        outer.appendChild(inputOuter);
        

        if (!this.data.editable) {
            outer.style.display = 'none';
        }
        return outer
    }
}

class Music {
    constructor(data) {
        this.data = data;
        this.staff = new Staff(data)
    }

    render() {
        const staff_holder = document.createElement('div');
        staff_holder.classList.add('serenade-staff-holder');
        this.staff = new Staff(this.data)
        const staff = this.staff.render()
        staff_holder.appendChild(staff);
        return staff_holder;
    }
}

class Staff {
    constructor(data) {
        this.data = data;
        this.bars = [];
        this.notes = [];
        this.bar_width = 0;
        this.left_right = true;

        if (this.data.music['left'] && this.data.music['right']) {
            this.bar_width = this.calculateBarWidth(this.data.music['left'].time_signature);
            this.notes = this.data.music['left'].notes.concat(this.data.music['right'].notes);

        } else {
            // one hand only
            this.bar_width = this.calculateBarWidth(this.data.music.time_signature);
            this.notes = this.data.music.notes
            this.left_right = false;
        }


        this.notes.sort(this.sortNotes)

        this.num_bars = this.calculateNumBars(this.notes, this.bar_width);
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

        if (this.data.music['left'] && this.data.music['right']) {
            this.bar_width = this.calculateBarWidth(this.data.music['left'].time_signature);
            this.notes = this.data.music['left'].notes.concat(this.data.music['right'].notes);

        } else {
            // one hand only
            this.bar_width = this.calculateBarWidth(this.data.music.time_signature);
            this.notes = this.data.music.notes
            this.left_right = false;
        }

        this.notes.sort(this.sortNotes)

        this.num_bars = this.calculateNumBars(this.notes, this.bar_width);
        
        for (let i = 0; i < this.num_bars; i++) {
            const bar_notes = this.getBarNotes(i, this.bar_width, this.notes);

            const clef = (i == 0);
            const time_sigs = [this.data.music['left']?.time_signature || this.data.music.time_signature, this.data.music['right']?.time_signature]
            const bar_ = new Bar(i, this.bar_width, bar_notes, time_sigs, clef, this.left_right)
            this.bars.push(bar_)
            const bar = bar_.render();
            
            staff.appendChild(bar);
        }

        return staff;
    }

    getBarNotes(i, bar_width, notes) {
        let bar_notes = [];
        for (let j = 0; j < notes.length; j++) {
            const note = notes[j];
            // assumes no split notes
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
        'sixteenth': 0.25,
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
            const width = parseFloat(num) / parseFloat(denom) * 4

            return width;
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
    constructor(index=-1, bar_width, notes=[], time_sigs, clef=false, left_right=true) {
        this.notes = notes;
        this.index = index;
        this.bar_width = bar_width;
        this.clef = clef;
        this.left_right = left_right;
        this.notes_width = this.calculateNotesWidth();
        this.time_sigs = time_sigs;
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

        offset = note_offsets[note.note.toLowerCase()] + ((octave - 5) * -7) + 2;

        return offset;
    }

    render() {
        const bar = document.createElement('div');
        bar.classList.add('serenade-bar');
        let clef_offset = 0;
        if (this.clef) {
            const treble_clef = new Clef('Treble').render();
            clef_offset = 5;
            treble_clef.style.gridRow = '2 / span 14';
            treble_clef.style.gridColumn = `1 / span ${clef_offset}`;

            const time_signature1 = new TimeSig(this.time_sigs[0]).render()
            time_signature1.style.gridRow = '5 / span 9'
            time_signature1.style.gridColumn = `${clef_offset} / span 2`


            if (this.left_right) {
                const bass_clef = new Clef('Bass').render();
                bass_clef.style.gridRow = '17 / span 7';
                bass_clef.style.gridColumn = `1 / span ${clef_offset}`;
                bar.appendChild(bass_clef);

                const time_signature2 = new TimeSig(this.time_sigs[1]).render()
                time_signature2.style.gridRow = '17 / span 9'
                time_signature2.style.gridColumn = `${clef_offset} / span 2`
                bar.appendChild(time_signature2)
            }
            bar.appendChild(treble_clef);
            bar.appendChild(time_signature1)
        }
        bar.style.gridTemplateColumns = `repeat(${this.notes_width + 4 + clef_offset}, 1em)`
        for (let j = 0; j < 5; j++) {
            const line = document.createElement('div');
            line.classList.add('serenade-line');
            line.style.gridRow = `${j * 2 + 5}`;
            bar.appendChild(line);

            if (this.left_right) {
                const lower_line = document.createElement('div');
                lower_line.classList.add('serenade-line');
                lower_line.style.gridRow = `${j * 2 + 17}`;
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
            note_element.style.gridRow = `${topOffset.toString()}`;
            bar.appendChild(note_element);

            // add external lines if outside of staff
            const note_ = note.note.toLowerCase()
            if (topOffset <= 3) {
                // add lines on/below
                const lines_to_add = Math.ceil((4 - topOffset)/2)
                for (let i = 0; i < lines_to_add; i++) {
                    const back_line = document.createElement('div');
                    back_line.classList.add('serenade-line');
                    back_line.classList.add('serenade-line-unit')
                    back_line.style.gridRow = `${i * -2 + 3}`;
                    back_line.style.gridColumn = `${adjusted_start}`;
                    bar.appendChild(back_line);
                }
            } else if (topOffset === 15) {
                // add lines on
                const back_line = document.createElement('div');
                back_line.classList.add('serenade-line');
                back_line.classList.add('serenade-line-unit')
                back_line.style.gridRow = `${15}`;
                back_line.style.gridColumn = `${adjusted_start}`;
                bar.appendChild(back_line);
            } else if (topOffset >= 27) {
                // add lines on/below
                const lines_to_add = Math.ceil((topOffset - 26)/2)

                for (let i = 0; i < lines_to_add; i++) {
                    const back_line = document.createElement('div');
                    back_line.classList.add('serenade-line');
                    back_line.classList.add('serenade-line-unit')
                    back_line.style.gridRow = `${i * 2 + 27}`;
                    back_line.style.gridColumn = `${adjusted_start}`;
                    bar.appendChild(back_line);
                }
            }
            
            // flip stem if on second staff
            if (topOffset >= 16) {
                note_element.classList.add('serenade-note-lower')
            }
        }

        

        // add bar border/end
        const vbar_top = document.createElement('div')
        bar.appendChild(vbar_top)
        vbar_top.style.gridRow = '5 / span 9'
        vbar_top.classList.add('serenade-bar-border')
        
        if (this.left_right) {
            const vbar_bottom = document.createElement('div')
            vbar_bottom.classList.add('serenade-bar-border')
            bar.appendChild(vbar_bottom)
            vbar_bottom.style.gridRow = '17 / span 9'
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

        const note_img = document.createElement('img');
        note_img.src = `/images/${this.data.duration}.png`
        /*switch (this.data.duration) {
            case 'eighth':
                note_img.src = '/images/half.png'
                note_img.classList.add('serenade-note-closed')
                break
            case 'quarter':
                note_img.src = '/images/closed.png'
                note_img.classList.add('serenade-note-closed')
                break
            case 'sixteenth':
                note_img.src = '/images/closed.png'
                note_img.classList.add('serenade-note-closed')
                break
            default:
                note_img.src = '/images/open.png'
                note_img.classList.add('serenade-note-open')
        }*/

        const note_text = document.createTextNode(`${this.data.note}${this.data.octave}`);
        
        note.appendChild(note_img);
        //note.appendChild(note_text);

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

class TimeSig {
    constructor(time_signature) {
        this.sig = time_signature;
    }

    render() {
        const sig = document.createElement('div');
        const top = document.createElement('div');
        const bottom = document.createElement('div');
        const [top_txt, bottom_text] = this.sig.split('/')
        sig.classList.add('serenade-time-sig');
        
        top.classList.add('serenade-time-sig-top')
        bottom.classList.add('serenade-time-sig-bottom')

        const text1 = document.createTextNode(top_txt.toString())
        const text2 = document.createTextNode(bottom_text.toString())
        top.appendChild(text1)
        bottom.appendChild(text2)

        sig.appendChild(top);
        sig.appendChild(bottom);

        return sig;
    }

}

function s$(selector, data) {
    const element = document.querySelector(selector);
    this.data_ = data;
    this.render = render;
    this.serenade;

    function render() {
        this.serenade = new Serenade(this.data_);
        const outer = this.serenade.render();

        // remove any existing children
        element.innerHTML = '';

        // fill with the visualized data
        element.appendChild(outer);
    }

    if (!element) {
        throw new Error(`Element ${selector} not found`);
    } else {
        return this
    }
}

