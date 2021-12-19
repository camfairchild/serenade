# SerenadeJS

## Landing Page
https://glacial-escarpment-44247.herokuapp.com/examples.html

## Documentation
https://glacial-escarpment-44247.herokuapp.com/examples.html#documentation

## Getting Started

### Requirements

    jQuery ^3.6.0

You can inlcude jQuery in your code by linking it in your html, e.g. from Google.  
You will also need the css included with serenade and all the images.  
https://raw.githubusercontent.com/csc309-fall-2021/js-library-fairchi5/main/pub/images/  
https://raw.githubusercontent.com/csc309-fall-2021/js-library-fairchi5/main/pub/css/serenade.css
       
You can get all the code for Serenade by downloading the repo.  

      git clone git@github.com:csc309-fall-2021/js-library-fairchi5.git serenade
      
Then, you can include the script file, jQuery, and the stylesheets in the head of your html

       <head>
          <title>SerenadeJS Example</title>
          <link rel="stylesheet" href="https://raw.githubusercontent.com/csc309-fall-2021/js-library-fairchi5/main/pub/css/serenade.css">
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
          <script src="https://raw.githubusercontent.com/csc309-fall-2021/js-library-fairchi5/main/pub/js/serenade.js"></script>
       </head>

Serenade requires that you call it in your JS. This can be done in a few ways.  

#### Serenade Query Selector
You can use the built-in Serenade query selector (jQuery syntax) to fill a Serenade tag.
HTML:  

    <serenade class="ex1"></serenade>
JS:  
   
    s$('serenade.ex1', example).render();

#### Render Then Replace with jQuery
You can also call render and Serenade will create a DOM element that you can insert into your HTML page.  
HTML:

    <serenade class="ex2"></serenade>
JS:

    const ser = new Serenade(example);
    const elem = ser.render()
    const replace_ = document.querySelector('serenade.ex2');
    replace_.innerHTML = '';
    replace_.appendChild(elem);
   
#### Updating Serenade data
You can also update the data in Serenade using `Serenade.update(data)`  
HTML:

    <serenade class="ex3"></serenade>
JS:
    
    // select element with Serenade
    const s_ = s$('serenade.ex3', example);
    // render Serenade object in place
    s_.render();
    // copy Serenade object data and modify a note
    let data_ = s_.data_;
    data_.music['left'].notes[0].note = 'C';
    // call update, this re-renders the DOM
    s_.serenade.update(data_)
#### Serenade Class
You can create a `Serenade` class instance and render it separately.  
HTML:
    
    <serenade class="ex4"></serenade>
JS:
    
    // create instance
    const ser = new Serenade(example);
    // render to DOM element
    const elem = ser.render()
    // use jQuery to insert into webpage
    const replace_ = document.querySelector('serenade.ex4);
    replace_.innerHTML = '';
    replace_.appendChild(elem);


# Third-party libraries
[express](https://www.npmjs.com/package/express), [jQuery](jquery.com)
