importScripts('xls.js');
importScripts('xlsutils.js');
postMessage({t:"ready"});

onmessage = function (oEvent) {
  var v, cfb, wb;

  var file_content = oEvent.data.file_content;
  var opts = oEvent.data.opts;

  //postMessage({
  //  t: "log",
  //  d: oEvent
  //});

  try
  {
    cfb = XLS.CFB.read(file_content, {type: 'binary'});
    wb = XLS.parse_xlscfb(cfb);
    v = process_wb(wb, opts); 
  }
  catch(e)
  {
    postMessage({
      t: "e",
      d: e.stack
    }); 
  }

  postMessage({
    t: "xls_json",
    d: v
  });

};
