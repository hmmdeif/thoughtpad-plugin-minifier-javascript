var uglify = require('uglify-js'),
    _thoughtpad;

var init = function (thoughtpad) {
    _thoughtpad = thoughtpad;
    _thoughtpad.subscribe("javascript-postcompile-request", compile);
},

compile = function *(obj) {
    if (!obj.contents) return;

    yield _thoughtpad.notify("javascript-postcompile-complete", { contents: uglify.minify(obj.contents, obj.data).code, name: obj.name });
};

module.exports = {
    init: init
};