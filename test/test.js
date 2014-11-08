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

        co(function *() {
            yield thoughtpad.notify("javascript-postcompile-request", { contents: "d", data: { fromString: true } });
        })();
    });

    it("should ignore requests with no content", function () {
        thoughtpad = man.registerPlugins([app]);

        thoughtpad.subscribe("javascript-postcompile-complete", function *() {
            true.should.be.false;
        });

        co(function *() {
            yield thoughtpad.notify("javascript-postcompile-request", { contents: "" });
        })();
    });

    it("should minify javascript from file", function (done) {
        var filename = __dirname + '/file.js';
        thoughtpad = man.registerPlugins([app]);

        thoughtpad.subscribe("javascript-postcompile-complete", function *(contents) {
            contents.code.should.equal('var a="hello";a+=" there";');
            yield fs.unlink(filename);
            
        });

        co(function *() {
            yield fs.writeFile(filename, "var a = 'hello';\n\na += ' there';");
            yield thoughtpad.notify("javascript-postcompile-request", { contents: filename });
            done();
        })();
        
    });

    it("should minify javascript from string", function (done) {
        thoughtpad = man.registerPlugins([app]);

        thoughtpad.subscribe("javascript-postcompile-complete", function *(contents) {
            contents.code.should.equal('var a="hello";a+=" there";');
        });

        co(function *() {
            yield thoughtpad.notify("javascript-postcompile-request", { contents: "var a = 'hello';\n\na += ' there';", data: { fromString: true } });
            done();
        })();
    });
});