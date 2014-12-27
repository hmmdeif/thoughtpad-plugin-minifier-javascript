var uglify = require('uglify-js');

var init = function (thoughtpad) {
    thoughtpad.subscribe("javascript-postcompile-request", compile);
},

compile = function *(obj) {
    if (!obj.contents) return;

    // By default we take the contents by string. The user can override this using the eventData config variable
    var data = { fromString: true };

    if (obj.thoughtpad.config && obj.thoughtpad.config.eventData && obj.thoughtpad.config.eventData['javascript-postcompile']) {
        data = obj.thoughtpad.config.eventData['javascript-postcompile'];
    }

    yield obj.thoughtpad.notify("javascript-postcompile-complete", { contents: uglify.minify(obj.contents, data).code, name: obj.name });
};

module.exports = {
    init: init
};