'use strict';
const through = require('through2');
const sourceMap = require('source-map');
const SourceMapConsumer = sourceMap.SourceMapConsumer;
const SourceMapGenerator = sourceMap.SourceMapGenerator;

module.exports = function(options) {
    function clean(file, encoding, callback) {
        if (file.isNull() || !file.sourceMap) {
          this.push(file);
          return callback();
        }

        const consumer = new SourceMapConsumer(file.sourceMap);
        const generator = new sourceMap.SourceMapGenerator({
          file: file.sourceMap.file,
          sourceRoot: file.sourceMap.sourceRoot
        });
        let lastColumnByLine = [];

        consumer.eachMapping((m)=>{
            if (m.originalColumn <= lastColumnByLine[m.originalLine] || 0) return;
            lastColumnByLine[m.originalLine] = m.originalColumn;
            generator.addMapping({
              source: m.source.replace(RegExp("^" + file.sourceMap.sourceRoot), ""),
              name: m.name,
              original: { line: m.originalLine, column: m.originalColumn },
              generated: { line: m.generatedLine, column: m.generatedColumn }
            })
        }, this, SourceMapConsumer.ORIGINAL_ORDER);

        file.sourceMap = JSON.parse(generator.toString());
        this.push(file);
        callback();
    }

    return through.obj(clean);
};
