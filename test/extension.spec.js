var assert = require('assert'),
    exec = require('child_process').exec,
    fs = require('fs'),
    Extension = require('openframe-extension'),
    WebsiteExtension = require('../extension');

describe('instantiation', function() {
    it('should be an instance of type Extension', function() {
        assert(WebsiteExtension instanceof Extension);
    });
});

describe('properties', function() {
    it('should include all required format properties', function() {
        var format = WebsiteExtension.props.format;

        assert(format.name);
        assert(typeof format.name === 'string');

        assert(format.display_name);
        assert(typeof format.display_name === 'string');

        assert(format.download !== undefined);
        assert(typeof format.download === 'boolean');

        assert(format.start_command);
        assert(typeof format.start_command === 'string' || typeof format.start_command === 'function');

        if (typeof format.start_command === 'function') {
            assert(typeof format.start_command() === 'string');
        }

        assert(format.end_command);
        assert(typeof format.end_command === 'string');
    });
});

describe('start_command', function() {
    var expectedDefault = 'exec /usr/bin/chromium --noerrdialogs --kiosk --incognito  "http://test.com"';

    after(function(done) {
        exec('rm ' + __dirname + '/.xinitrc', done);
    });

    it('should update .xinitrc file with supplied token', function(done) {
        var format = getTestFormat(),
            command;

        // replace $url token with url string
        command = format.start_command({}, {
            $url: 'http://test.com'
        });

        assert(typeof command === 'string');
        checkXinitrc(format.xinitrcFinalPath, expectedDefault, done);
    });
    it('should not accept undefined args parameter', function(done) {
        var format = getTestFormat(),
            command;

        // replace $url token with url string
        command = format.start_command(undefined, {
            $url: 'http://test.com'
        });

        assert(typeof command === 'string');
        checkXinitrc(format.xinitrcFinalPath, expectedDefault, done);
    });
    it('should update .xinitrc with optional args', function(done) {
        var format = getTestFormat(),
            command,
            expected = 'exec /usr/bin/chromium --noerrdialogs --kiosk --incognito --allow-insecure-localhost "http://test.com"';

        // replace $url token with url string
        command = format.start_command({flags:'--allow-insecure-localhost'}, {
            $url: 'http://test.com'
        });

        assert(typeof command === 'string');
        checkXinitrc(format.xinitrcFinalPath, expected, done);
    });
    it('should ignore unsupported args', function(done) {
        var format = getTestFormat(),
            command;

        // replace $url token with url string
        command = format.start_command({random:'args'}, {
            $url: 'http://test.com'
        });

        assert(typeof command === 'string');
        checkXinitrc(format.xinitrcFinalPath, expectedDefault, done);
    });

    function checkXinitrc(path, expected, done) {
        fs.readFile(path, 'utf8', function(err, data) {
            if (err) {
                throw err;
            }
            assert.equal(data, expected);
            done();
        });
    }
    function getTestFormat() {
        var format = WebsiteExtension.props.format;

        // set test .xinitrc.tpl
        format.xinitrcTplPath = __dirname + '/.xinitrc.tpl';
        format.xinitrcFinalPath = format.xinitrcTplPath.replace('.tpl', '');

        return format;
    }
});
