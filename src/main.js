var uglify = require('uglify-js');

var init = function (thoughtpad) {
    thoughtpad.subscribe("javascript-postcompile-request", compile);
},

compile = function *(obj) {
    if (!obj.contents) return;

    yield obj.thoughtpad.notify("javascript-postcompile-complete", { contents: uglify.minify(obj.contents, obj.data).code, name: obj.name });
};

module.exports = {
    init: init
};