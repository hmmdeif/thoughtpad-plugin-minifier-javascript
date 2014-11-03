var should = require('should'),
    app = require('./../src/main'),
    co = require('co'),
    fs = require('co-fs'),
    man = require('thoughtpad-plugin-manager'),
    thoughtpad;

describe("javascript minify plugin", function () {
    it("should register correctly to events", function () {
        thoughtpad = man.registerPlugins([app]);

        thoughtpad.subscribe("javascript-postcompile-complete", function *() {
            true.should.be.true;
        });

        thoughtpad.notify("javascript-postcompile-request", { contents: "" });
    });

    it("should ignore requests with no content", function () {
        thoughtpad = man.registerPlugins([app]);

        thoughtpad.subscribe("javascript-postcompile-complete", function *() {
            true.should.be.false;
        });

        thoughtpad.notify("javascript-postcompile-request", { contents: "" });
    });

    it("should minify javascript", function (done) {
        var filename = __dirname + '/file.js';
        thoughtpad = man.registerPlugins([app]);

        thoughtpad.subscribe("javascript-postcompile-complete", function *(contents) {
            contents.code.should.equal('var a="hello";a+=" there";');
            yield fs.unlink(filename);
            done();
        });

        co(function *() {
            yield fs.writeFile(filename, "var a = 'hello';\n\na += ' there';");
            thoughtpad.notify("javascript-postcompile-request", { contents: filename });
        })();
        
    });
});