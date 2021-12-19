example1 = {
    tempo: 90,
    music: {
        'left': {
            clef: 'treble',
            time_signature: '4/4',
            notes:
                [
                    {
                        note: 'D',
                        octave: '4',
                        duration: 'eighth',
                        startTime: 0,
                    }, {
                        note: 'B',
                        octave: '4',
                        duration: 'eighth',
                        startTime: 0.50,
                    }, {
                        note: 'A',
                        octave: '4',
                        duration: 'eighth',
                        startTime: 1.0,
                    }, {
                        note: 'G',
                        octave: '4',
                        duration: 'eighth',
                        startTime: 1.50,
                    }, {
                        note: 'D',
                        octave: '4',
                        duration: 'half',
                        startTime: 2.0,
                    },

                    {
                        note: 'D',
                        octave: '4',
                        duration: 'eighth',
                        startTime: 4.0,
                    }, {
                        note: 'B',
                        octave: '4',
                        duration: 'eighth',
                        startTime: 4.50,
                    }, {
                        note: 'A',
                        octave: '4',
                        duration: 'eighth',
                        startTime: 5.0,
                    }, {
                        note: 'G',
                        octave: '4',
                        duration: 'eighth',
                        startTime: 5.50,
                    }, {
                        note: 'E',
                        octave: '4',
                        duration: 'half',
                        startTime: 6.0,
                    },

                    {
                        note: 'E',
                        octave: '4',
                        duration: 'eighth',
                        startTime: 8.0,
                    }, {
                        note: 'C',
                        octave: '5',
                        duration: 'eighth',
                        startTime: 8.50,
                    }, {
                        note: 'B',
                        octave: '4',
                        duration: 'eighth',
                        startTime: 9.0,
                    }, {
                        note: 'A',
                        octave: '4',
                        duration: 'eighth',
                        startTime: 9.50,
                    }, {
                        note: 'F',
                        octave: '4',
                        duration: 'half',
                        startTime: 10.0,
                    },

                    {
                        note: 'D',
                        octave: '5',
                        duration: 'eighth',
                        startTime: 12.0,
                    }, {
                        note: 'D',
                        octave: '5',
                        duration: 'eighth',
                        startTime: 12.50,
                    }, {
                        note: 'C',
                        octave: '5',
                        duration: 'eighth',
                        startTime: 13.0,
                    }, {
                        note: 'A',
                        octave: '4',
                        duration: 'eighth',
                        startTime: 13.50,
                    }, {
                        note: 'B',
                        octave: '4',
                        duration: 'half',
                        startTime: 14.0,
                    },
                ]
        },
        'right': {
            clef: 'bass',
            time_signature: '4/4',
            notes:
            [
                {
                    note: 'B',
                    octave: '3',
                    duration: 'half',
                    startTime: 0,
                }, {
                    note: 'G',
                    octave: '3',
                    duration: 'half',
                    startTime: 0,
                }, {
                    note: 'B',
                    octave: '3',
                    duration: 'half',
                    startTime: 2.0,
                }, {
                    note: 'G',
                    octave: '3',
                    duration: 'half',
                    startTime: 2.0,
                },

                {
                    note: 'B',
                    octave: '3',
                    duration: 'half',
                    startTime: 4.0,
                }, {
                    note: 'G',
                    octave: '3',
                    duration: 'half',
                    startTime: 4.0,
                }, {
                    note: 'C',
                    octave: '4',
                    duration: 'half',
                    startTime: 6.0,
                }, {
                    note: 'G',
                    octave: '3',
                    duration: 'half',
                    startTime: 6.0,
                },

                {
                    note: 'C',
                    octave: '4',
                    duration: 'half',
                    startTime: 8.0,
                }, {
                    note: 'G',
                    octave: '3',
                    duration: 'half',
                    startTime: 8.0,
                }, {
                    note: 'D',
                    octave: '4',
                    duration: 'half',
                    startTime: 10.0,
                }, {
                    note: 'A',
                    octave: '3',
                    duration: 'half',
                    startTime: 10.0,
                },

                {
                    note: 'A',
                    octave: '3',
                    duration: 'half',
                    startTime: 12.0,
                }, {
                    note: 'D',
                    octave: '4',
                    duration: 'half',
                    startTime: 12.0,
                }, {
                    note: 'D',
                    octave: '4',
                    duration: 'half',
                    startTime: 14.0,
                }, {
                    note: 'B',
                    octave: '3',
                    duration: 'half',
                    startTime: 14.0,
                }, 
            ]
        }
    },
    visualize: true,
    editable: true,
}

s$('serenade.ex1', example1).render();


example2 = {
    tempo: 90,
    music: {
        'left': {
            clef: 'treble',
            time_signature: '3/4',
            notes:
                [
                    {
                        note: 'C',
                        octave: '6',
                        duration: 'quarter',
                        startTime: 0,
                    }, {
                        note: 'B',
                        octave: '5',
                        duration: 'quarter',
                        startTime: 1.0,
                    }, {
                        note: 'A',
                        octave: '5',
                        duration: 'quarter',
                        startTime: 2.0,
                    }, 

                    {
                        note: 'D',
                        octave: '4',
                        duration: 'quarter',
                        startTime: 3.0,
                    }, {
                        note: 'C',
                        octave: '4',
                        duration: 'quarter',
                        startTime: 4.0,
                    }, {
                        note: 'B',
                        octave: '3',
                        duration: 'quarter',
                        startTime: 5.0,
                    }, 
                ]
        },
        'right': {
            clef: 'bass',
            time_signature: '3/4',
            notes:
            [
                {
                    note: 'E',
                    octave: '2',
                    duration: 'quarter',
                    startTime: 6.0,
                }, {
                    note: 'D',
                    octave: '2',
                    duration: 'quarter',
                    startTime: 7.0,
                }, {
                    note: 'C',
                    octave: '2',
                    duration: 'quarter',
                    startTime: 8.0,
                }, 
            ]
        }
    },
    visualize: true,
    editable: true,
}

s$('serenade.ex2', example2).render();

example3 = {
    tempo: 90,
    music: {
        'left': {
            clef: 'treble',
            time_signature: '3/2',
            notes:
                [
                    {
                        note: 'G',
                        octave: '5',
                        duration: 'sixteenth',
                        startTime: 0,
                    }, {
                        note: 'F',
                        octave: '5',
                        duration: 'eighth',
                        startTime: 0.25,
                    }, {
                        note: 'E',
                        octave: '5',
                        duration: 'quarter',
                        startTime: 0.75,
                    }, 

                    {
                        note: 'D',
                        octave: '5',
                        duration: 'half',
                        startTime: 1.75,
                    }, {
                        note: 'C',
                        octave: '5',
                        duration: 'whole',
                        startTime: 6.0,
                    }, 
                ]
        },
        'right': {
            clef: 'bass',
            time_signature: '3/2',
            notes:
            [
                {
                    note: 'A',
                    octave: '3',
                    duration: 'whole',
                    startTime: 12.0,
                }, {
                    note: 'G',
                    octave: '3',
                    duration: 'half',
                    startTime: 16.0,
                }, 
                {
                    note: 'F',
                    octave: '3',
                    duration: 'quarter',
                    startTime: 18.00,
                }, {
                    note: 'E',
                    octave: '3',
                    duration: 'eighth',
                    startTime: 19.0,
                }, {
                    note: 'D',
                    octave: '3',
                    duration: 'sixteenth',
                    startTime: 19.5,
                }, 
            ]
        }
    },
    visualize: true,
    editable: true,
}

s$('serenade.ex3', example3).render();

s$('serenade.ex6', example1).render();

s$('serenade.ex7', example1).render();

const s_ = s$('serenade.ex8', example1);
s_.render();
let data_ = s_.data_;
data_.music['left'].notes[0].note = 'C';
s_.serenade.update(data_)

const s = s$('serenade.ex4', example3);
s.data_ = example2
s.render()

const ser = new Serenade(example3);
const elem = ser.render()
const replace_ = document.querySelector('serenade.ex5');
replace_.innerHTML = '';
replace_.appendChild(elem);