'use babel';

import { Point, Range } from 'atom';

class Provider {

    constructor() {
        // This will work on PHP files, but not in comments.
		this.selector = '.source.php';
        this.disableForSelector = '.source.php .comment';

        // This will take priority over the default provider, which has an inclusionPriority of 0.
        // `excludeLowerPriority` will suppress any providers with a lower priority
        // i.e. The default provider will be suppressed
        this.inclusionPriority = 1;
        this.excludeLowerPriority = true;

        // This will be suggested before the default provider, which has a suggestionPriority of 1.
        this.suggestionPriority = 2;
	}

    // Required: Return a promise, an array of suggestions, or null.
    getSuggestions({editor, bufferPosition, scopeDescriptor, prefix, activatedManually}) {

      let { ECLIPSE_PATH, PROJECT_PATH, PROJECT_LANGUAGE, PROJECT_NAME, PROJECT_FILE_PATH, PROJECT_ENCODING } = require('./env');
      let exec = require("child_process").exec;

      let startPositionPoint = new Point(0, 0);
      let currPositionPoint = new Point(bufferPosition.row, bufferPosition.column);
      let positionRange = new Range(startPositionPoint, currPositionPoint);

      let text = editor.getBuffer().getTextInRange(positionRange);
      let offset = text.length;

      // todo add debounce
      // ...

      return new Promise((resolve, reject) => {
          exec(`${ECLIPSE_PATH}/eclim -command php_complete -p ${PROJECT_NAME} -f ${PROJECT_FILE_PATH} -o ${offset} -e ${PROJECT_ENCODING}`, function (error, stdout, stderr) {
              if (!error && stdout) {
                  let suggestions = JSON.parse(stdout);
                  let completions = [];
                  suggestions.forEach(function (el) {
                     completions.push({text: el.menu, description: el.info});
                  });
                  resolve(completions);
              } else {
                  reject({
                      reason: 'Code completion error.'
                  });
              }
          })
      })
    }

    // (optional): called _after_ the suggestion `replacementPrefix` is replaced
    // by the suggestion `text` in the buffer
    onDidInsertSuggestion({editor, triggerPosition, suggestion}) {}

    // (optional): called when your provider needs to be cleaned up. Unsubscribe
    // from things, kill any processes, etc.
    dispose() {}
}

export default new Provider();
