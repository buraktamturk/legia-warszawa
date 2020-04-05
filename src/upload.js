'use strict';

const angular = require('angular'),
      UploadControllerFactory = require('upload-controller-factory');

export default angular
  .module('pkp.uploader', [
    require('angular1-image-picker-component'),
    require('angular1-file-upload-component')
  ])
  .factory('uploader', ['$ottp', ($ottp) => UploadControllerFactory({
      uploader(name, blob, contentType, abort, progress) {
        return $ottp({
          method: 'PUT',
          endpoint: 'main',
          path: `/file/${name}`,
          data: blob,
          timeout: new Promise(function(resolve) {
            abort.onabort = resolve;
          }),
          merge: false,
          headers: {
            'Content-Type': contentType
          },
          uploadEventHandlers: {
            progress: (event) => progress(event.loaded / event.total)
          }
        }).then(a => a.data);
      },
      valueKey: '_id',
      fields: ['_id', 'access_url', 'name', 'size']
    })
  ])
  .name;
