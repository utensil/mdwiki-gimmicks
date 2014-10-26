function xlsworker(data, cb) {
  if(false /* window.Worker */)
  {
    var worker = new Worker('./js/xlsworker.js?_=' + Math.random());
    worker.onmessage = function(e) {
      switch(e.data.t) {
        case 'ready': break;
        case 'log': console.log(e.data.d);
        case 'e': console.error(e.data.d);
        case 'xls_json': cb(e.data.d); break;
      }
    };
    worker.postMessage(data);
  }
  else
  {
    try
    {
      //console.log(JSON.stringify(data.file_content, null, 2));
      var cfb = XLS.CFB.read(data.file_content, {type: 'binary'});
      var wb = XLS.parse_xlscfb(cfb);
      var v = process_wb(wb, data.opts); 
      cb(v);
    }
    catch(err)
    {
      console.error(err);
    }
  }
}

function render_wb(href, workbook, opts, cb) {
  var tab_nav = $('<ul class="nav nav-tabs"></ul>');
  var tab_content = $('<div class="tab-content"></div>');

  var index = 0;

  $.each(workbook, function (sheet_name) {
    var sheet_id = href + '-' + sheet_name;
    sheet_id = sheet_id.replace(/[-.#/\\ \t]+/g, '');                

    tab_nav.append(
      $('<li></li>').
        addClass(index == 0 ? 'active' : '').
        append(
            $('<a></a>').
              text(sheet_name).                      
              attr('href', '#' + sheet_id).
              attr('data-toggle', 'tab')
          )
        );

    var tb = workbook[sheet_name];

    var table = $('<table class="table table-bordered table-hover table-condensed table-striped"></table>');

    var thead = $('<thead></thead>');

    var max_c = Math.min(tb.range.w, opts.max_col);

    for (var r = 0; r < tb.header.length; r++)
    {
      var tr = $('<tr></tr>');

      for (var c = 0; c < max_c; c++)
      {
        tr.append($('<th></th>').text(tb.header[r][c]));
      }

      thead.append(tr);                
    }

    table.append(thead);

    var tbody = $('<tbody></tbody>');

    for (var r = 0; r < tb.body.length; r++)
    {
      var tr = $('<tr></tr>');
      
      for (var c = 0; c < max_c; c++)
      {
        tr.append($('<td></td>').text(tb.body[r][c]));
      }

      tbody.append(tr);                
    }

    table.append(tbody);

    $('td, th', table).css({
      'min-width': '7em'
    });

    tab_content.append(
      $('<div class="tab-pane"></div>').
        addClass(index == 0 ? 'active' : '').
        attr('id', sheet_id).
        append(
          $('<div class="table-responsive"></div>').
            append(table)
          )
      );

    index++;

  });              

  var preview = $('<div></div>').
      css('margin-top', '1em').
      append(tab_nav).
      append(tab_content);  

  //only one tab
  if(index == 1)
  {
    tab_nav.hide();
  }
  else
  {
    $('a', tab_nav).click(function (e) {
      e.preventDefault();
      $(this).tab('show');
    });
  }

  if(cb)
  {
    cb(preview);
  }
}

function load_binary_resource(url, cb) {
  httpinvoke(url, 'GET', {
    outputType: 'bytearray'
  }, function(err, body, statusCode, headers) {
      if(err) {
          return console.error('Failure', err);
      }
      //console.log('Success', body, statusCode, headers);

      var binary_string = "";
      for (var i = 0; i < body.length; i++) {
        binary_string += String.fromCharCode(body[i]);
      };
      //console.log(binary_string);
      cb(binary_string);
  });
}

(function($){
    'use strict';
    var xlsPreviewGimmick = {
        name: 'xlspreview',
        version: $.md.version,
        once: function() {
            $.md.linkGimmick(this, 'xlspreview', xlsPreview);
            //console.log("xlspreview");
        }
    };
    $.md.registerGimmick(xlsPreviewGimmick);

    function xlsPreview($links, opts, href) {
        opts.text = opts.text || '<i class="fa fa-download"></i>&nbsp;下载';
        opts.preview = opts.preview || '<i class="fa fa-eye"></i>&nbsp;预览';
        opts.open = opts.open || 'auto'; // or 'toggle'
        opts.header_row_count = opts.header_row_count || 1;
        opts.max_col = opts.max_col || 20;

        if (!href.endsWith('/'))
            href += '/';
        return $links.each(function(i,link) {            
            var href = $(link).attr('href');

            console.log(i, link, href); 

            var load_and_render = function (url, cb) {
              load_binary_resource(encodeURI(url), function (file_content) {

                var data = {
                  file_content: file_content,
                  opts: opts
                };

                //console.log(data);

                xlsworker(data, function (workbook) {
                  render_wb(href, workbook, opts, cb);
                });

              }); 
            }           

            if(opts.open == 'toggle')
            {
              var preview_button = $('<a class="btn btn-default"></a>');

              var rendered_preview = null;

              preview_button.
                html(opts.preview).
                css('margin-left', '1em');

              $(link).after(preview_button);

              preview_button.              
                click(function (e) {
                  if(rendered_preview && rendered_preview != '')
                  {
                    rendered_preview.toggle();
                  }
                  else if(rendered_preview == '')
                  {
                    return;
                  }
                  else
                  {
                    preview_button.html(opts.preview + '<i class="fa fa-spinner fa-spin"></i>');
                    rendered_preview = '';

                    load_and_render(href, function (preview) {
                      rendered_preview = preview;                      
                      preview_button.after(rendered_preview);
                      preview_button.html(opts.preview);
                    });
                  }                  
                });                            
            }
            else
            {
              load_and_render(href, function (preview) {
                $(link).after(preview);
              });   
            }

            $(link).
              html(opts.text || href).
              addClass('btn').
              addClass('btn-default');

            if(opts.open != 'toggle')
            {
              $(link).css({
                float: 'right'
              });              
            }
          });
    }
}(jQuery));
