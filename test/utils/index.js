"use strict"

const streamTest = require('streamtest').v2
const File = require('vinyl')
const sanitize = require('../../src')
const sourceMap = require('source-map')
const SourceMapConsumer = sourceMap.SourceMapConsumer
const SourceMapGenerator = sourceMap.SourceMapGenerator

function createSourceMap(sourceMap) {
    const generator = new SourceMapGenerator({
        file: sourceMap.file,
        sourceRoot: sourceMap.sourceRoot
    })
    sourceMap.mappings.forEach(m => generator.addMapping(m))

    return generator.toString();
}

function createFile(sourceMap) {
    const file = new File({
        contents: new Buffer('something'),
    })
    file.sourceMap = sourceMap

    return file
}

function extractMaps(sourceMap) {
    const consumer = new SourceMapConsumer(sourceMap)

    let maps = []
    consumer.eachMapping(m => {
        maps.push({
            original: {line: m.originalLine, column: m.originalColumn},
            generated: {line: m.generatedLine, column: m.generatedColumn}
        })
    }, SourceMapConsumer.ORIGINAL_ORDER)
    return maps
}

module.exports = {
    withFile(file, fn) {
        streamTest.fromObjects([file])
            .pipe(sanitize())
            .pipe(streamTest.toObjects((err, files)=> {
                fn(err, files[0])
            }))
    },

    withSourceMap(sourceMap, fn) {
        const file = createFile(sourceMap)
        streamTest.fromObjects([file])
            .pipe(sanitize())
            .pipe(streamTest.toObjects((err, files)=> {
                fn(err, files[0].sourceMap)
            }))
    },

    withMappings(mappings, fn) {
        const sourceMap = createSourceMap({
            file: 'something.js',
            sourceRoot: 'path/',
            mappings: mappings.map(m => {
                return {
                    source: 'source.js',
                    name: 'test',
                    original: m.original,
                    generated: m.generated
                }
            })
        })
        const file = createFile(sourceMap)
        streamTest.fromObjects([file])
            .pipe(sanitize())
            .pipe(streamTest.toObjects((err, files)=> {
                fn(err, extractMaps(files[0].sourceMap))
            }))
    }
}

