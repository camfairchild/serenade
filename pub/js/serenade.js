(function(global, document, $) {
class Serenade {
    constructor(data) {
        if (data.music.left || data.music.right) {
            if (data.music.left) {
                data.music.left.notes.sort(this.sortNotes);
            }
            if (data.music.right) {
                data.music.right.notes.sort(this.sortNotes);
            }
        } else {
            data.music.notes.sort(this.sortNotes);
        }
        this.music = new Music(data);
        this.data = data;
        this.update = this.update.bind(this)
        this.outer = document.createElement('div');
        this.outer.classList.add('serenade-outer');
    }

    update(data) {
        this.data = data;
        while (this.outer.firstChild) {
            this.outer.firstChild.remove();
        }
        this.render()
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
        const buttons = document.createElement('div');
        buttons.classList.add('serenade-buttons');
        // visualizer show button
        let showButton = document.createElement('button');
        showButton.classList.add('serenade-visualize-button');
        showButton.classList.add('serenade-visualize-button-show');
        buttons.appendChild(showButton);

        if (!this.data.visualize) {
            showButton.classList.add('hidden');
        }
        
        // input show button
        const editButton = document.createElement('button');
        editButton.classList.add('serenade-edit-button');
        editButton.classList.add('serenade-edit-button-edit');
        buttons.appendChild(editButton);
        if (!this.data.editable) {
            editButton.classList.add('hidden');
        }

        this.outer.appendChild(buttons);

        // input
        this.input = new SerenadeInput(this.data, this.update);
        const input = this.input.render();
        this.outer.appendChild(input);

        editButton.addEventListener('click', this.input.editButtonEventHandler.bind(this.input));

        this.music = new Music(this.data);
        const inner = this.music.render()
        this.outer.appendChild(inner);

        this.visualizer = new SerenadeVisualizer(this.data);
        const visualizer = this.visualizer.render();
        this.outer.appendChild(visualizer);
        if (!this.data.visualize) {
            showButton.classList.add('hidden');
        }

        showButton.addEventListener('click', this.visualizer.toggleShowHide.bind(this.visualizer));

        return this.outer
    }
}

function make_unique_id(){
    const datetime = new Date().getTime();
    return datetime.toString(36).slice(-4);
}
class SerenadeVisualizer {
    constructor(data) {
        this.data = data;
        this.notes = null;
        this.time_sig = '4/4';

        if (this.data.music['left'] && this.data.music['right']) {
            this.notes = this.data.music['left'].notes.concat(this.data.music['right'].notes); 
            this.time_sig = this.data.music['left'].time_sig;    
        } else {
            // one hand only
            this.notes = this.data.music.notes
            this.time_sig = this.data.music.time_sig;
        }

        // sort again
        this.notes.sort(Serenade.sortNotes)

        this.keys = []
    }

    toggleShowHide(event) {
        event.preventDefault();
        const button = event.target;
        if (this.outer.classList.contains('hidden')) {
            this.outer.classList.remove('hidden');
            button.classList.remove('serenade-visualize-button-show');
            button.classList.add('serenade-visualize-button-close');
        } else {            
            this.outer.classList.add('hidden');
            button.classList.add('serenade-visualize-button-show');
            button.classList.remove('serenade-visualize-button-close');
        }
    }

    play(event) {
        event.preventDefault();
        console.log('play');
        // restart all keys
        for (let i = 0; i < this.keys.length; i++) {
            const keyElement = this.keys[i];
            
            // generate the animation
            keyElement.style['animation-play-state'] = 'running';
            const restarted = keyElement.cloneNode(true);
            keyElement.parentNode.replaceChild(restarted, keyElement);
            this.keys[i] = restarted;
        }
    }

    getDurationAndDelay(note, bpm=60, time_sig='4/4') {
        bpm = bpm * 0.5
        const time_sig_split = time_sig.split('/');
        const denom = parseInt(time_sig_split[1]);
        const beat_length = 60 / bpm;
        const durations = {
            'whole': 1,
            'half': 0.5,
            'quarter': 0.25,
            'eighth': 0.125,
            'sixteenth': 0.0625,
            '32nd': 0.03125,
            '64th': 0.015625,
        }
        const duration = durations[note.duration] * beat_length * denom;
        
        const delay = note.startTime/denom * beat_length;

        return [duration, delay];
    }

    getKey(note) {
        const notes_to_offset = {
            'C': 0,
            'C#': 1,
            'D': 2,
            'D#': 3,
            'E': 4,
            'F': 5,
            'F#': 6,
            'G': 7,
            'G#': 8,
            'A': 9,
            'A#': 10,
            'B': 11,
        }

        let offset = notes_to_offset[note.note];
        offset += (note.octave - 2) * 12;
        return offset;
    }

    render() {
        this.outer = document.createElement('div');
        this.outer.classList.add('serenade-visualizer-outer');
        this.outer.classList.add('hidden');

        const outer2 = document.createElement('div');
        outer2.classList.add('serenade-visualizer-outer2');
        this.outer.appendChild(outer2);
        
        const inner = document.createElement('div');
        inner.classList.add('serenade-visualizer-inner');
        outer2.appendChild(inner);

        const top = document.createElement('div');
        top.classList.add('serenade-visualizer-top');
        inner.appendChild(top);

        const bottom = document.createElement('div');
        bottom.classList.add('serenade-visualizer-bottom');
        inner.appendChild(bottom);

        const playButton = document.createElement('button');
        playButton.classList.add('serenade-visualizer-play-button');
        playButton.onclick = this.play.bind(this);
        outer2.appendChild(playButton);
        

        let durations = {}
        let delays = {}
        let notes = {}
        const not_black_keys = [5,13,19,27,33,41,47,55,57]
        for (let i = 0; i < 57; i++) {
            const offset = i;

            let key;
            let keyElement;
            if (offset  % 2 === 1) {
                // potential black key
                const top_ = (not_black_keys.indexOf(offset) === -1);
                if (top_) {
                    key = new SerenadeVisualizerKey(offset, top_);
                    keyElement = key.render();
                    top.appendChild(keyElement);
                    this.keys.push(keyElement); 
                }
            } else {
                key = new SerenadeVisualizerKey(offset, false);
                keyElement = key.render();
                bottom.appendChild(keyElement);
                this.keys.push(keyElement);
            }
            
            // init durations and delays
            durations[i.toString()] = [];
            delays[i.toString()] = [];
            notes[i.toString()] = [];
        }

        let max_end = 0
        for (let i = 0; i < this.notes.length; i++) {
            const note = this.notes[i];
            const key = this.getKey(note);
            // get each duration and delay
            const [duration, delay] = this.getDurationAndDelay(note, this.data.tempo, this.time_sig);
            durations[key.toString()].push(duration);
            delays[key.toString()].push(delay);
            notes[key.toString()].push(note);
            
            // update max end time
            if (delay + duration > max_end) {
                max_end = delay + duration;
            }
        }

        const uid = make_unique_id();
        const style = document.createElement('style');
        style.id = `serenade-key-anim-${uid}`;
        document.head.appendChild(style);

        for (let i = 0; i < this.keys.length; i++) {
            const keyElement = this.keys[i];
            const notes_ = notes[i.toString()];
            const durations_ = durations[i.toString()];
            const delays_ = delays[i.toString()];
            if (durations_.length === 0) {
                continue;
            }
            const delays_as_percents = [];
            const end_as_percents = [];
            for (let j = 0; j < durations_.length; j++) {
                // get each start and end as a percentage of max end time
                const start = delays_[j] / max_end * 100;
                const end = (delays_[j] + durations_[j]) / max_end * 100;
                delays_as_percents.push(start);
                end_as_percents.push(end);
            }

            let key_animation = `@keyframes serenade-key-anim-${uid}-${i} {`;
            for (let j = 0; j < delays_as_percents.length; j++) {
                const start = delays_as_percents[j];
                const end = end_as_percents[j];
                const middle = (start + end) / 2;

                const note = notes_[j];

                // generate the animation
                if (top.contains(keyElement)) {
                    key_animation += `${start}% {
                        background-color: black;
                    } ${middle}% {
                        background-color: red;
                    } ${end}% {
                        background-color: black;
                    }`;
                } else {
                    key_animation += `${start}% {
                        background-color: white;
                    } ${middle}% {
                        background-color: red;
                    } ${end}% {
                        background-color: white;
                    }`;
                }
            }
            key_animation += '}\n';
            
            style.innerHTML += key_animation;
            keyElement.style.animation = `serenade-key-anim-${uid}-${i} ${max_end}s linear`;
        }
        return this.outer;
    }
}

class SerenadeVisualizerKey {
    constructor(offset, top=false) {
        this.offset = offset;
        this.top = top;
    }

    render() {
        const key = document.createElement('div');
        key.classList.add('serenade-visualizer-key');
        if (this.top) {
            key.classList.add(`serenade-visualizer-key-top`);
            key.style.left = `${this.offset/58 * 100 + 0.73}%`;
        } else {
            key.classList.add(`serenade-visualizer-key-bottom`);
        }
        return key;
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
        return JSON.parse(dataString)
    }

    generateDataString(data) {
        const dataString = JSON.stringify(data, null, 2);
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
        if (this.outer.classList.contains('hidden')) {
            this.outer.classList.remove('hidden')
            editButton.classList.add('serenade-edit-button-close');
            editButton.classList.remove('serenade-edit-button-edit');
        } else {
            this.outer.classList.add('hidden')
            editButton.classList.remove('serenade-edit-button-close');
            editButton.classList.add('serenade-edit-button-edit');

        }
    }

    render() {
        this.outer = document.createElement('div');
        this.outer.classList.add('serenade-edit-input-outer');
        this.outer.classList.add('hidden');

        const input = document.createElement('textarea');
        input.classList.add('serenade-edit-input-inner');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'Edit Serenade Data');
        input.value = this.dataString;

        const innerButton = document.createElement('button');
        innerButton.classList.add('serenade-edit-input-button');
        innerButton.innerText = 'Render';
        innerButton.addEventListener('click', this.updateEventHandler)
        this.outer.appendChild(input);
        this.outer.appendChild(innerButton);
     
        if (!this.data.editable) {
            this.outer.style.display = 'none';
        }
        return this.outer
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

        this.sortNotes()

        this.num_bars = this.calculateNumBars(this.notes, this.bar_width);
    }

    sortNotes() {
        this.notes.sort((a, b) => {
            if (a.startTime < b.startTime) {
                return -1;
            } else if (a.startTime > b.startTime) {
                return 1;
            } else {
                return 0;
            }
        })
    }

    render() {
        const staff = document.createElement('div');
        staff.classList.add('serenade-staff');

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
    constructor(index = -1, bar_width, notes = [], time_sigs, clef = false, left_right = true) {
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

            note_element.style.gridColumn = `${adjusted_start} / span 1`;
            const topOffset = this.getNoteTop(note);
            note_element.style.gridRow = `${topOffset.toString()}`;
            bar.appendChild(note_element);

            // add external lines if outside of staff
            const note_ = note.note.toLowerCase()
            if (topOffset <= 3) {
                // add lines on/below
                const lines_to_add = Math.ceil((4 - topOffset) / 2)
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
                const lines_to_add = Math.ceil((topOffset - 26) / 2)

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

        //const note_text = document.createTextNode(`${this.data.note}${this.data.octave}`);

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
    global.s$ = s$;
    global.Serenade = Serenade;

})(window, window.document, $);

