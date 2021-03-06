'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _os2 = require('os');

var _os3 = _interopRequireDefault(_os2);

var _del2 = require('del');

var _del3 = _interopRequireDefault(_del2);

var _tarFs = require('tar-fs');

var _tarFs2 = _interopRequireDefault(_tarFs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Utilities for generating a more complex tar stream. Specifically, this allows for putting multiple
 * source folders into a single stream with potential custom mappings. This uses a temporary file for
 * intermediate staging which will be automatically cleaned up on process exit.
 *
 * @example
 * let tarUtils = new TarUtils();
 * let stream = tarUtils.all({
 *   '/fully/qualified/path' : '.',
 *   'relative/path' : 'subfolder'
 * });
 */
var TarUtils = function () {

  /**
   * Constructor with optional injection of dependencies for purposes of testing.
   *
   * @param {function} [_del=del]
   * @param {os} [_os=os]
   * @param {tar} [_tar=tar]
   * @param {process} [_process=process]
   */
  function TarUtils() {
    var _del = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _del3.default;

    var _os = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _os3.default;

    var _tar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _tarFs2.default;

    var _process = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : process;

    _classCallCheck(this, TarUtils);

    this._del = _del;
    this._os = _os;
    this._process = _process;
    this._tar = _tar;
  }

  /**
   * Generate a single tar stream that contains multiple inputs that can be mapped to relative paths.
   *
   * @param {{String, String}} mapping a map of source folders to target relative paths
   * @return {Promise<stream.Readable, Error>} a promise that resolves with the generated combined stream
   */


  _createClass(TarUtils, [{
    key: 'all',
    value: function all(mapping) {
      var _this = this;

      var temp = this.tempFolder();
      this.autoclean(temp);

      return this.copyAll(mapping, temp).then(function () {
        return _this._tar.pack(temp);
      });
    }

    /**
     * Generate a path for a temporary file that is appropriate for the current OS.
     *
     * @return {string} full-qualified folder path
     */

  }, {
    key: 'tempFolder',
    value: function tempFolder() {
      return this._os.tmpdir() + '/tar-utils__' + Math.floor(Math.random() * 10000);
    }

    /**
     * Recursively copy files from the source mapping onto the destination baseDir applying the additional subfoldering.
     *
     * @param {Map<String, String>} mapping a map of source folders to target relative paths
     * @param {String} baseDir the base output folder where all of the sources should be copied to
     * @return {Promise} a promise that resolves when all files have been copied
     */

  }, {
    key: 'copyAll',
    value: function copyAll(mapping, baseDir) {
      var _this2 = this;

      var promises = _lodash2.default.map(mapping, function (subDir, source) {
        return _this2.copy(source, baseDir + '/' + subDir);
      });

      return Promise.all(promises);
    }

    /**
     * Copy files from the source folder to the destination folder.
     *
     * @param {String} from the source folder
     * @param {String} to the destination folder
     * @return {Promise} a promise that resolves when all files have been copied
     */

  }, {
    key: 'copy',
    value: function copy(from, to) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var extract = _this3._tar.extract(to);
        extract.on('finish', function () {
          resolve();
        });
        _this3._tar.pack(from).pipe(extract);
      });
    }

    /**
     * Schedule the given folder to be automatically cleaned up when the JavaScript process finishes running.
     *
     * @param {String} folder the folder to cleanup
     */

  }, {
    key: 'autoclean',
    value: function autoclean(folder) {
      var _this4 = this;

      var cleanupStarted = false;

      this._process.on('beforeExit', function () {
        if (!cleanupStarted) {
          _this4._del(folder);
          cleanupStarted = true;
        }
      });
    }
  }]);

  return TarUtils;
}();

exports.default = TarUtils;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRhci11dGlscy5qcyJdLCJuYW1lcyI6WyJUYXJVdGlscyIsIl9kZWwiLCJfb3MiLCJfdGFyIiwiX3Byb2Nlc3MiLCJwcm9jZXNzIiwibWFwcGluZyIsInRlbXAiLCJ0ZW1wRm9sZGVyIiwiYXV0b2NsZWFuIiwiY29weUFsbCIsInRoZW4iLCJwYWNrIiwidG1wZGlyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiYmFzZURpciIsInByb21pc2VzIiwibWFwIiwic3ViRGlyIiwic291cmNlIiwiY29weSIsIlByb21pc2UiLCJhbGwiLCJmcm9tIiwidG8iLCJyZXNvbHZlIiwicmVqZWN0IiwiZXh0cmFjdCIsIm9uIiwicGlwZSIsImZvbGRlciIsImNsZWFudXBTdGFydGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUVBOzs7Ozs7Ozs7Ozs7SUFZTUEsUTs7QUFFSjs7Ozs7Ozs7QUFRQSxzQkFBa0U7QUFBQSxRQUF0REMsSUFBc0Q7O0FBQUEsUUFBMUNDLEdBQTBDOztBQUFBLFFBQWhDQyxJQUFnQzs7QUFBQSxRQUFwQkMsUUFBb0IsdUVBQVRDLE9BQVM7O0FBQUE7O0FBQ2hFLFNBQUtKLElBQUwsR0FBWUEsSUFBWjtBQUNBLFNBQUtDLEdBQUwsR0FBV0EsR0FBWDtBQUNBLFNBQUtFLFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0EsU0FBS0QsSUFBTCxHQUFZQSxJQUFaO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7d0JBTUlHLE8sRUFBUztBQUFBOztBQUNYLFVBQUlDLE9BQU8sS0FBS0MsVUFBTCxFQUFYO0FBQ0EsV0FBS0MsU0FBTCxDQUFlRixJQUFmOztBQUVBLGFBQU8sS0FBS0csT0FBTCxDQUFhSixPQUFiLEVBQXNCQyxJQUF0QixFQUNKSSxJQURJLENBQ0MsWUFBTTtBQUFFLGVBQU8sTUFBS1IsSUFBTCxDQUFVUyxJQUFWLENBQWVMLElBQWYsQ0FBUDtBQUE4QixPQUR2QyxDQUFQO0FBRUQ7O0FBRUQ7Ozs7Ozs7O2lDQUthO0FBQ1gsYUFBTyxLQUFLTCxHQUFMLENBQVNXLE1BQVQsS0FBb0IsY0FBcEIsR0FBcUNDLEtBQUtDLEtBQUwsQ0FBV0QsS0FBS0UsTUFBTCxLQUFnQixLQUEzQixDQUE1QztBQUNEOztBQUVEOzs7Ozs7Ozs7OzRCQU9RVixPLEVBQVNXLE8sRUFBUztBQUFBOztBQUN4QixVQUFJQyxXQUFXLGlCQUFFQyxHQUFGLENBQU1iLE9BQU4sRUFBZSxVQUFDYyxNQUFELEVBQVNDLE1BQVQsRUFBb0I7QUFDaEQsZUFBTyxPQUFLQyxJQUFMLENBQVVELE1BQVYsRUFBa0JKLFVBQVUsR0FBVixHQUFnQkcsTUFBbEMsQ0FBUDtBQUNELE9BRmMsQ0FBZjs7QUFJQSxhQUFPRyxRQUFRQyxHQUFSLENBQVlOLFFBQVosQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7O3lCQU9LTyxJLEVBQU1DLEUsRUFBSTtBQUFBOztBQUNiLGFBQU8sSUFBSUgsT0FBSixDQUFZLFVBQUNJLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN0QyxZQUFJQyxVQUFVLE9BQUsxQixJQUFMLENBQVUwQixPQUFWLENBQWtCSCxFQUFsQixDQUFkO0FBQ0FHLGdCQUFRQyxFQUFSLENBQVcsUUFBWCxFQUFxQixZQUFNO0FBQUVIO0FBQVksU0FBekM7QUFDQSxlQUFLeEIsSUFBTCxDQUFVUyxJQUFWLENBQWVhLElBQWYsRUFBcUJNLElBQXJCLENBQTBCRixPQUExQjtBQUNELE9BSk0sQ0FBUDtBQUtEOztBQUVEOzs7Ozs7Ozs4QkFLVUcsTSxFQUFRO0FBQUE7O0FBQ2hCLFVBQUlDLGlCQUFpQixLQUFyQjs7QUFFQSxXQUFLN0IsUUFBTCxDQUFjMEIsRUFBZCxDQUFpQixZQUFqQixFQUErQixZQUFNO0FBQ25DLFlBQUksQ0FBQ0csY0FBTCxFQUFxQjtBQUNuQixpQkFBS2hDLElBQUwsQ0FBVStCLE1BQVY7QUFDQUMsMkJBQWlCLElBQWpCO0FBQ0Q7QUFDRixPQUxEO0FBTUQ7Ozs7OztrQkFHWWpDLFEiLCJmaWxlIjoidGFyLXV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBvcyBmcm9tICdvcyc7XG5pbXBvcnQgZGVsIGZyb20gJ2RlbCc7XG5pbXBvcnQgdGFyIGZyb20gJ3Rhci1mcyc7XG5cbi8qKlxuICogVXRpbGl0aWVzIGZvciBnZW5lcmF0aW5nIGEgbW9yZSBjb21wbGV4IHRhciBzdHJlYW0uIFNwZWNpZmljYWxseSwgdGhpcyBhbGxvd3MgZm9yIHB1dHRpbmcgbXVsdGlwbGVcbiAqIHNvdXJjZSBmb2xkZXJzIGludG8gYSBzaW5nbGUgc3RyZWFtIHdpdGggcG90ZW50aWFsIGN1c3RvbSBtYXBwaW5ncy4gVGhpcyB1c2VzIGEgdGVtcG9yYXJ5IGZpbGUgZm9yXG4gKiBpbnRlcm1lZGlhdGUgc3RhZ2luZyB3aGljaCB3aWxsIGJlIGF1dG9tYXRpY2FsbHkgY2xlYW5lZCB1cCBvbiBwcm9jZXNzIGV4aXQuXG4gKlxuICogQGV4YW1wbGVcbiAqIGxldCB0YXJVdGlscyA9IG5ldyBUYXJVdGlscygpO1xuICogbGV0IHN0cmVhbSA9IHRhclV0aWxzLmFsbCh7XG4gKiAgICcvZnVsbHkvcXVhbGlmaWVkL3BhdGgnIDogJy4nLFxuICogICAncmVsYXRpdmUvcGF0aCcgOiAnc3ViZm9sZGVyJ1xuICogfSk7XG4gKi9cbmNsYXNzIFRhclV0aWxzIHtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3Igd2l0aCBvcHRpb25hbCBpbmplY3Rpb24gb2YgZGVwZW5kZW5jaWVzIGZvciBwdXJwb3NlcyBvZiB0ZXN0aW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbX2RlbD1kZWxdXG4gICAqIEBwYXJhbSB7b3N9IFtfb3M9b3NdXG4gICAqIEBwYXJhbSB7dGFyfSBbX3Rhcj10YXJdXG4gICAqIEBwYXJhbSB7cHJvY2Vzc30gW19wcm9jZXNzPXByb2Nlc3NdXG4gICAqL1xuICBjb25zdHJ1Y3RvcihfZGVsID0gZGVsLCBfb3MgPSBvcywgX3RhciA9IHRhciwgX3Byb2Nlc3MgPSBwcm9jZXNzKSB7XG4gICAgdGhpcy5fZGVsID0gX2RlbDtcbiAgICB0aGlzLl9vcyA9IF9vcztcbiAgICB0aGlzLl9wcm9jZXNzID0gX3Byb2Nlc3M7XG4gICAgdGhpcy5fdGFyID0gX3RhcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBhIHNpbmdsZSB0YXIgc3RyZWFtIHRoYXQgY29udGFpbnMgbXVsdGlwbGUgaW5wdXRzIHRoYXQgY2FuIGJlIG1hcHBlZCB0byByZWxhdGl2ZSBwYXRocy5cbiAgICpcbiAgICogQHBhcmFtIHt7U3RyaW5nLCBTdHJpbmd9fSBtYXBwaW5nIGEgbWFwIG9mIHNvdXJjZSBmb2xkZXJzIHRvIHRhcmdldCByZWxhdGl2ZSBwYXRoc1xuICAgKiBAcmV0dXJuIHtQcm9taXNlPHN0cmVhbS5SZWFkYWJsZSwgRXJyb3I+fSBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSBnZW5lcmF0ZWQgY29tYmluZWQgc3RyZWFtXG4gICAqL1xuICBhbGwobWFwcGluZykge1xuICAgIHZhciB0ZW1wID0gdGhpcy50ZW1wRm9sZGVyKCk7XG4gICAgdGhpcy5hdXRvY2xlYW4odGVtcCk7XG5cbiAgICByZXR1cm4gdGhpcy5jb3B5QWxsKG1hcHBpbmcsIHRlbXApXG4gICAgICAudGhlbigoKSA9PiB7IHJldHVybiB0aGlzLl90YXIucGFjayh0ZW1wKTsgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgYSBwYXRoIGZvciBhIHRlbXBvcmFyeSBmaWxlIHRoYXQgaXMgYXBwcm9wcmlhdGUgZm9yIHRoZSBjdXJyZW50IE9TLlxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGZ1bGwtcXVhbGlmaWVkIGZvbGRlciBwYXRoXG4gICAqL1xuICB0ZW1wRm9sZGVyKCkge1xuICAgIHJldHVybiB0aGlzLl9vcy50bXBkaXIoKSArICcvdGFyLXV0aWxzX18nICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlY3Vyc2l2ZWx5IGNvcHkgZmlsZXMgZnJvbSB0aGUgc291cmNlIG1hcHBpbmcgb250byB0aGUgZGVzdGluYXRpb24gYmFzZURpciBhcHBseWluZyB0aGUgYWRkaXRpb25hbCBzdWJmb2xkZXJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7TWFwPFN0cmluZywgU3RyaW5nPn0gbWFwcGluZyBhIG1hcCBvZiBzb3VyY2UgZm9sZGVycyB0byB0YXJnZXQgcmVsYXRpdmUgcGF0aHNcbiAgICogQHBhcmFtIHtTdHJpbmd9IGJhc2VEaXIgdGhlIGJhc2Ugb3V0cHV0IGZvbGRlciB3aGVyZSBhbGwgb2YgdGhlIHNvdXJjZXMgc2hvdWxkIGJlIGNvcGllZCB0b1xuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIGFsbCBmaWxlcyBoYXZlIGJlZW4gY29waWVkXG4gICAqL1xuICBjb3B5QWxsKG1hcHBpbmcsIGJhc2VEaXIpIHtcbiAgICB2YXIgcHJvbWlzZXMgPSBfLm1hcChtYXBwaW5nLCAoc3ViRGlyLCBzb3VyY2UpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmNvcHkoc291cmNlLCBiYXNlRGlyICsgJy8nICsgc3ViRGlyKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gIH1cblxuICAvKipcbiAgICogQ29weSBmaWxlcyBmcm9tIHRoZSBzb3VyY2UgZm9sZGVyIHRvIHRoZSBkZXN0aW5hdGlvbiBmb2xkZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBmcm9tIHRoZSBzb3VyY2UgZm9sZGVyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0byB0aGUgZGVzdGluYXRpb24gZm9sZGVyXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gYWxsIGZpbGVzIGhhdmUgYmVlbiBjb3BpZWRcbiAgICovXG4gIGNvcHkoZnJvbSwgdG8pIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdmFyIGV4dHJhY3QgPSB0aGlzLl90YXIuZXh0cmFjdCh0byk7XG4gICAgICBleHRyYWN0Lm9uKCdmaW5pc2gnLCAoKSA9PiB7IHJlc29sdmUoKTsgfSk7XG4gICAgICB0aGlzLl90YXIucGFjayhmcm9tKS5waXBlKGV4dHJhY3QpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNjaGVkdWxlIHRoZSBnaXZlbiBmb2xkZXIgdG8gYmUgYXV0b21hdGljYWxseSBjbGVhbmVkIHVwIHdoZW4gdGhlIEphdmFTY3JpcHQgcHJvY2VzcyBmaW5pc2hlcyBydW5uaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZm9sZGVyIHRoZSBmb2xkZXIgdG8gY2xlYW51cFxuICAgKi9cbiAgYXV0b2NsZWFuKGZvbGRlcikge1xuICAgIHZhciBjbGVhbnVwU3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5fcHJvY2Vzcy5vbignYmVmb3JlRXhpdCcsICgpID0+IHtcbiAgICAgIGlmICghY2xlYW51cFN0YXJ0ZWQpIHtcbiAgICAgICAgdGhpcy5fZGVsKGZvbGRlcik7XG4gICAgICAgIGNsZWFudXBTdGFydGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUYXJVdGlscztcbiJdfQ==
