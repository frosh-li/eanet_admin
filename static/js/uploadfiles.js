/**
 * 批量上传文件
 * 依赖文件：jquery、underscore、plupload
 *
 * 用法
 * html: 任意要触发上传浮层的元素
 *   <button id="batchUpload" type="button">批量上传</button>
 * js文件依赖:
 *   <script src="__PUBLIC__/js/jquery-2.1.0.min.js"></script>
 *   <script src="__PUBLIC__/js/underscore-min.js"></script>
 *   <script src="__PUBLIC__/js/plupload-2.1.2/js/plupload.full.min.js"></script>
 *   <script src="__PUBLIC__/js/uploadfiles.js"></script>
 * js文件调用示例：
 *   <script>
 *     var uf = new UploadFiles({
 *       url: '/sample/upload/upload', // 该url目前仅支持图片
 *       trigger: '#batchUpload',
 *       typeTitle: '图片文件',
 *       delUploadFiles: '每次点击上传图片按钮时是否清空已经选择的照片',
         shortFileName: '短文件名类型：1为XXXX...XX.jpg,空则不使用短文件名',
 *       typeExtensions: 'jpg,jpeg,png',
 *       size: '5mb'
 *     });
 *     uf.completed = function(files) {
 *       // 获取本次上传文件的md5名称
 *       var names = [];
 *       _.each(files, function(file) {
 *         names.push(file.picsrc);
 *       });
 *     };
 *
 *     如果批量初始化很多每次只传一张的按钮，只要在创建时添加 single:true 即可。
 *     如果页面js更新，需要重新初始化按钮，则调用 uf.initSingleButtons() 即可。
 *   </script>
 *
 *
 * @author chenlinfei@wanda.cn
 * @since 2015-01-05
 */
(function() {
  // 检查是否有jquery、underscore、plupload
  if (!jQuery || !_ || !plupload) {
    throw new Error('运行该文件依赖 jQuery,underscore,plupload ，请检查是否缺少');
  }

  var UploadFiles,
      TPL_MODAL, TPL_FILE;


  UploadFiles = function(opts) {
    _.extend(this, {
        url: '/sample/upload/upload',
        container: 'body',
        trigger: '',
        delUploadFiles: '',
        shortFileName: '',
        size: '5mb',
        quality: 70,
        typeTitle: '文件',
        typeExtensions: '*',

        single: false,

        // 内部使用变量
        modal: null,
        uploader: null,
        uploadInit: false
      }, opts || {});
    this.container = $(this.container);
    this.trigger = $(this.trigger);

    if (!this.trigger.length) { return; }
    this.init();
  };
  _.extend(UploadFiles.prototype, {
    init: function() {
      if (this.single) {
        this.initSingleButtons();
      } else {
        this.trigger.on('click', _.bind(this.onTriggerClick, this));
        this.container
          .on('click', '[data-role=upload]', _.bind(this.onUploadClick, this))
      }
    },
    initSingleButtons: function() {
      var btns = this.container.find(this.trigger.selector);

      btns.each(_.bind(function(i, btn) {
        var up = new plupload.Uploader({
          multi_selection: false,
          browse_button : btn,
          url : this.url,
          resize : { quality : this.quality },
          filters : {
            max_file_size : this.size,
            mime_types: [
              {title: this.typeTitle, extensions: this.typeExtensions},
            ]
          }
        });
        up.browse_button = btn;
        up.bind('FilesAdded', _.bind(function(u,fs) {this.filesAdded(u,fs);}, this));
        up.bind('UploadFile', _.bind(function(u,f) {this.uploadFile(u,f);}, this));
        up.bind('FileUploaded', _.bind(function(u,f,h) {
              var r = $.parseJSON(h.response);
              if (r && r.status == 0) { f.picsrc = r.data.name; }
              else { f.error = r && r.info || '发生错误'; }
              this.fileUploaded(u,f,h);
            }, this));
        up.init();
        this.filesAdded = function(u, fs) { u.start(); };
      }, this));
    },
    initUploadModal: function() {
      this.uploaderInit = false;
      this.modal = $(TPL_MODAL);
      this.container.append(this.modal);
      // 初次显示modal后，初始化uploader
      this.modal.on('shown.bs.modal', _.bind(function() {
          if (!this.uploaderInit) {
            this.uploaderInit = true;
            this.uploader.init();
          }
        }, this));

      this.uploader = new plupload.Uploader({
        browse_button : $('[data-role=pick]').get(0),
        url : this.url,
        resize : { quality : this.quality },
        filters : {
          max_file_size : this.size,
          mime_types: [
            {title: this.typeTitle, extensions: this.typeExtensions},
          ]
        }
      });
      this.uploader.bind('FilesAdded', _.bind(this.onUploadFilesAdded, this));
      this.uploader.bind('UploadFile', _.bind(this.onUploadFile, this));
      this.uploader.bind('UploadProgress', _.bind(this.onUploadProgress, this));
      this.uploader.bind('FileUploaded', _.bind(this.onUploadFileUploaded, this));
      this.uploader.bind('UploadComplete', _.bind(this.onUploadComplete, this));
      this.uploader.bind('Error', _.bind(this.onUploadError, this));
    },
    onTriggerClick: function() {
      if (!this.modal) {
        this.initUploadModal();
      }
      if(this.delUploadFiles == 1) {
        this.modal.find('[data-role=files]').html('');
      }
      this.modal.modal('show');
    },
    onUploadClick: function(e) {
      this.uploader.start();
    },
    onUploadFilesAdded: function(up, files) {
      var htmls = [];
      var that = this;
      _.each(files, function(file) {
          file.name = that.formatFileName(file.name);
          htmls.push(TPL_FILE(file));
        });
      this.modal.find('[data-role=files]').append(htmls.join(''));

      var scrollBody = this.modal.find('[data-role=listWrap]');
      scrollBody.scrollTop(scrollBody.get(0).scrollHeight - scrollBody.height());
      this.filesAdded(up, files);
    },
    onUploadFile: function(up, file) {
      var tr = this.modal.find('#'+file.id);
      tr.addClass('active')
        .find('td.info').text('uploading...');
      this.uploadFile(up, file);
    },
    onUploadProgress: function(up, file) {
      var tr = this.modal.find('#'+file.id);
      tr.find('[data-role=percent]')
        .attr('aria-valuenow', file.percent)
        .width(file.percent + '%')
        .text(file.percent + '%');
    },
    onUploadFileUploaded: function(up, file, http) {
      var res = http.response;
      var tr = this.modal.find('#'+file.id),
          info = tr.find('td.info');
      res = $.parseJSON(res);
      tr.removeClass('active');
      if (res && res.status == 0) {
        file.picsrc = res.data.name;
        tr.addClass('success');
        info.addClass('text-success').html('成功')
      } else {
        var msg = res && res.info || '发生错误';
        file.error = msg;
        tr.addClass('danger');
        info.addClass('text-danger').text(msg);
      }
      this.fileUploaded(up, file, http);
    },
    onUploadComplete: function(up, files) {
      var infoDom = this.modal.find('[data-role=complete]')
        .text('共上传 ' + files.length +' 个 ');
      setTimeout(function() { infoDom.text(''); }, 4000);
      this.completed(files);
    },
    onUploadError: function(up, err) {
      if(err.code == '-600') {
        alert('请上传大小不超过'+this.size.toUpperCase()+'的图片！');
      }else if(err.code == '-601') {
        alert('请上传'+this.typeExtensions.replace(/,/g,'、')+'格式的图片！');
      }else {
        alert(err.code + ': ' + err.message);
      }
      return;
      var tr = this.modal.find('#'+file.id);
      tr.removeClass('active').addClass('danger')
        .find('td.info').addClass('text-danger').text(err.code + ': ' + err.message);
    },

    /**
     * 需要调用者覆盖
     */
    filesAdded: function(up, files) {},
    uploadFile: function(up, file) {},
    fileUploaded: function(up, file, http) {},
    completed: function(files) {}, // files 队列中所有文件

    /**
     * 获取当前文件列表
     */
    getFiles: function() {
      return this.uploader.files;
    },
    /**
     * 获取已经上传的图片返回名称
     */
    getUploadedNames: function() {
      var names = [];
      _.each(this.getFiles, function(file) {
        if (file && file.picsrc) {
          names.push(file.picsrc);
        }
      });
      return names;
    },
    /**
     * 格式化文件名称
     */
    formatFileName: function(name) {
      switch(this.shortFileName) {
        case 1://文件名称格式化为XXXX...XX.jpg格式
          var index = name.lastIndexOf('.');
          var fname = name.substr(0,index);
          var suffix = name.substr(index+1);
          if(fname.length > 6) {
            name = fname.substr(0,4) + '...' + fname.substr(-2) + '.' + suffix;
          }
          break;
        default:
          break;
      }
      return name;
    },

  });

;
  TPL_MODAL =
'<div class="modal fade uploadModal">' +
'<style type="text/css">' +
'  .uploadModal{background:none;top:0;left:0;margin-left:0;width:auto;}' +
'  .uploadModal .modal-content{border-radius:6px;box-shadow:0 5px 15px rgba(0, 0, 0, 0.5);}' +
'  .uploadModal .scrollable{max-height:300px;overflow:auto;}' +
'  .uploadModal .modal-footer{background:none;}' +
'  .uploadModal .btn{border-radius:4px;}' +
'  .uploadModal .progress{width:100px;margin-bottom:0;}' +
'</style>' +
'<div class="modal-dialog">' +
'  <div class="modal-content">' +
'  <div class="modal-header"><button class="close" data-dismiss="modal" type="button">&times;</button><h4 class="modal-title">文件上传</h4></div>' +
'  <div class="modal-body">' +
'    <strong>文件列表：</strong>' +
'    <div class="scrollable" data-role="listWrap"><table class="table table-condensed" data-role="files"></table></div>' +
'  </div>' +
'  <div class="modal-footer">' +
'    <span data-role="complete" class="text-success"></span>' +
'    <button class="btn" type="button" data-dismiss="modal">取消</button>' +
'    <button class="btn btn-info" type="button" data-role="pick">添加文件</button>' +
'    <button class="btn btn-primary" type="button" data-role="upload">上传</button>' +
'  </div>' +
'  </div>' +
'</div>' +
'</div>';

  TPL_FILE = _.template(
'<tr id="<%=id%>">' +
'  <td><%=name%></td>' +
'  <td><%=plupload.formatSize(size)%></td>' +
'  <td><div class="progress"><div class="progress-bar" aria-valuenow="<%=percent%>" aria-valuemin="0" aria-valuemax="100" style="width:<%=percent%>%;" data-role="percent"><%=percent%>%</div></div></td>' +
'  <td class="info"></td>' +
//'  <td><i>&times;</i></td>' +
'</tr>'
  );

  window.UploadFiles = UploadFiles;
})();
