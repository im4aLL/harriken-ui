// Global
import jQuery from 'jquery';

// Global variables
window.$ = window.jQuery = jQuery;

// Modules
import Example from './modules/Example';
import {function1, function2} from './modules/ExampleMultiple';

// Boostrap
$(document).ready(() => {
    new Example();

    function1();
    function2();
});
