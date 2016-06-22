"use strict";

const babel = require('babel-core')
const fs = require('fs')
const path = require('path')
const utils = require('./utils')
const expect = require('chai').expect

function getSourceMapFor(name) {
    const file = fs.readFileSync(path.join(__dirname, 'realworld', name), {encoding: 'utf8'})
    const code = babel.transform(file, {sourceMap: true})
    return code.map;
}

describe("Complex examples from real files", function() {
    it ("ES6 sourcemap", function(done) {
        const originalSourceMap = getSourceMapFor('es6.js');
        utils.withSourceMap(originalSourceMap, (err, sourceMap) => {
            expect(sourceMap.mappings).to.equal('AAAA,CAAC,EAAC,MAAG,EAAC,GAAG,QAAO;AACZ,QAAI,KAAK;AACZ')
            done()
        })
    })
});
