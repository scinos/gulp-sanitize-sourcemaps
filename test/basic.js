"use strict"

const expect = require('chai').expect
const File = require('vinyl')
const utils = require('./utils')

describe('Basic tests', function() {
    describe('Vinyl file', function() {
        it('Does not modify a null file', function(done) {
            const originalFile = new File()
            utils.withFile(originalFile, (err, file) => {
                expect(originalFile).to.equal(file)
                done()
            })
        })

        it('Does not modify a file without sourcemaps', function(done) {
            const originalFile = new File({
                contents: new Buffer('something')
            })

            utils.withFile(originalFile, (err, file) => {
                expect(originalFile).to.equal(file)
                done()
            })
        })
    })

    describe('Sourcemap', function() {
        it ('Maintains the sourceMap properties', function(done) {
            const originalSourceMap = {
                version: 3,
                file: 'compiled.js',
                sourceRoot: 'sourceroot/',
                mappings: 'AAAAA',
                names: ['test'],
                sources: ['original.js']
            }

            utils.withSourceMap(originalSourceMap, (err, sourceMap) => {
                expect(sourceMap.version).to.equal(3)
                expect(sourceMap.sources).to.deep.equal(['original.js'])
                expect(sourceMap.names).to.deep.equal(['test'])
                expect(sourceMap.mappings).to.equal('AAAAA')
                expect(sourceMap.file).to.equal('compiled.js')
                expect(sourceMap.sourceRoot).to.equal('sourceroot/')
                done()
            })
        })
    })

    describe('Mappings', function() {
        it ('Maintain the same mappings', function(done) {
            const originalMappings = [
                {
                    original: { line: 1, column: 0 },
                    generated: { line: 1, column: 0 }
                }
            ]

            utils.withMappings(originalMappings, (err, mappings) => {
                expect(mappings).to.deep.equal(originalMappings)
                done()
            })
        })

        it ('Removes duplicated mappings', function(done) {
            const originalMappings = [
                {
                    original: { line: 1, column: 0 },
                    generated: { line: 1, column: 0 }
                },
                {
                    original: { line: 1, column: 0 },
                    generated: { line: 1, column: 0 }
                }
            ]

            utils.withMappings(originalMappings, (err, mappings) => {
                expect(mappings).to.deep.equal([
                    {
                        original: { line: 1, column: 0 },
                        generated: { line: 1, column: 0 }
                    }
                ])
                done()
            })
        })

        it ('Removes maps with two destinations for the same origin', function(done) {
            const originalMappings = [
                {
                    original: { line: 1, column: 0 },
                    generated: { line: 1, column: 0 }
                },
                {
                    original: { line: 1, column: 0 },
                    generated: { line: 1, column: 1 }
                }
            ]

            utils.withMappings(originalMappings, (err, mappings) => {
                expect(mappings).to.deep.equal([
                    {
                        original: { line: 1, column: 0 },
                        generated: { line: 1, column: 0 }
                    }
                ])
                done()
            })
        })

        it ('Duplicated columns are fine if the line is different', function(done) {
            const originalMappings = [
                {
                    original: { line: 1, column: 0 },
                    generated: { line: 1, column: 0 }
                },
                {
                    original: { line: 2, column: 0 },
                    generated: { line: 1, column: 1 }
                }
            ]

            utils.withMappings(originalMappings, (err, mappings) => {
                expect(mappings).to.deep.equal([
                    {
                        original: { line: 1, column: 0 },
                        generated: { line: 1, column: 0 }
                    },
                    {
                        original: { line: 2, column: 0 },
                        generated: { line: 1, column: 1 }
                    }
                ])
                done()
            })
        })
    })
})