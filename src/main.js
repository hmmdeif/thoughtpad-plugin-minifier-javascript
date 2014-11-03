var uglify = require('uglify-js'),
    _thoughtpad;

var init = function (thoughtpad) {
    _thoughtpad = thoughtpad;
    _thoughtpad.subscribe("javascript-postcompile-request", compile);
},

compile = function *(obj) {
    if (!obj.contents) return;
    
    _thoughtpad.notify("javascript-postcompile-complete", uglify.minify(obj.contents));
};

module.exports = {
    init: init
};