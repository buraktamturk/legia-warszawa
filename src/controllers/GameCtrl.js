
const fileDialog = require('file-dialog');

function getOrientation(file, callback) {
  var reader = new FileReader();

  reader.onload = function(event) {
    var view = new DataView(event.target.result);

    if (view.getUint16(0, false) != 0xFFD8) return callback(-2);

    var length = view.byteLength,
        offset = 2;

    while (offset < length) {
      var marker = view.getUint16(offset, false);
      offset += 2;

      if (marker == 0xFFE1) {
        if (view.getUint32(offset += 2, false) != 0x45786966) {
          return callback(-1);
        }
        var little = view.getUint16(offset += 6, false) == 0x4949;
        offset += view.getUint32(offset + 4, little);
        var tags = view.getUint16(offset, little);
        offset += 2;

        for (var i = 0; i < tags; i++)
          if (view.getUint16(offset + (i * 12), little) == 0x0112)
            return callback(view.getUint16(offset + (i * 12) + 8, little));
      }
      else if ((marker & 0xFF00) != 0xFF00) break;
      else offset += view.getUint16(offset, false);
    }
    return callback(-1);
  };

  reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
};

function change_ext(filename, ext) {
  var dotted = filename.split('.');
  if(dotted.length) {
    dotted[dotted.length - 1] = ext;
    return dotted.join('.');
  }

  return filename + '.' + ext;
}

function resize_canvas(canvas, width, height) {
  //var ratio = canvas.width / canvas.height;

  /*
  var w = width;
  var h = Math.floor(w / ratio);
  
  if (h > height) {
      h = height;
      w = Math.floor(height * ratio);
  }
  */
  var elem = document.createElement('canvas');
  elem.width = width;
  elem.height = height;

  var ctx = elem.getContext('2d');
  ctx.drawImage(canvas, 0, 0, width, height);

  return elem;
}

function blob_to_canvas(blob) {
  return new Promise(function(resolve) {
    var canvas = document.createElement('canvas');

    var img = new Image();
    img.onload = function () {
      getOrientation(blob, function(srcOrientation) {
        var ctx;

        if(srcOrientation == -1) {
          canvas.width = img.width;
          canvas.height = img.height;

          ctx = canvas.getContext('2d');
        } else {
          if (4 < srcOrientation && srcOrientation < 9) {
            canvas.width = img.height;
            canvas.height = img.width;
          } else {
            canvas.width = img.width;
            canvas.height = img.height;
          }

          ctx = canvas.getContext('2d');
      
          switch (srcOrientation) {
            case 2: ctx.transform(-1, 0, 0, 1, img.width, 0); break;
            case 3: ctx.transform(-1, 0, 0, -1, img.width, img.height); break;
            case 4: ctx.transform(1, 0, 0, -1, 0, img.height); break;
            case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
            case 6: ctx.transform(0, 1, -1, 0, img.height, 0); break;
            case 7: ctx.transform(0, -1, -1, 0, img.height, img.width); break;
            case 8: ctx.transform(0, -1, 1, 0, 0, img.width); break;
          }
        }

        ctx.drawImage(img,0,0);
        resolve(canvas);
      });
    };

    img.src = URL.createObjectURL(blob);
  });
}

export default class {
  static get $inject() { return ['$scope', '$state', '$ottp', 'uploader']; }

  constructor($scope, $state, $ottp, uploader) {
    this.$scope = $scope;
    this.$state = $state;
    this.$ottp = $ottp;
    this.uploader = uploader;

    this.reset();
  }

  async uploadFile(name) {
    var file = await fileDialog({
      accept: 'image/*'
    });

    if(file[0]) {
      var canvas = await blob_to_canvas(file[0]);
      resize_canvas(canvas, 1000, 450)
        .toBlob(blob => {
          this.model[name].upload(change_ext(file[0].name, 'jpg'), blob.type, blob);
        }, 'image/jpeg', 1);
    }
  }

  reset() {
    this.step = 1;

    this.model = {
      selfie: this.uploader()
    };

    this.model.selfie.addListener(a => this.$scope.$applyAsync());
  }

  async submit() {
    await this.$ottp({
      method: 'PUT',
      path: '/template/legia-birthday/render',
      data: {
        body: {
          image1: this.model.selfie,
          text1: this.model.name
        },
        email: this.model.email,
        template_id: "legia-birthday"
      }
    });

    this.step = 3;
  }
};
