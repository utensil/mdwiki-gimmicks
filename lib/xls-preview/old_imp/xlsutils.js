function sheet_to_row_array(sheet, opts){
  var val, row, r, isempty, R, C, v;
  var header = [];
  var body = [];
  var range = { w: 0, h: 0};
  var out = {
    range: range,
    header: header,
    body: body
  };

  opts = opts || {};  

  //determine the range
  if(!sheet["!ref"]) return out;
  r = XLS.utils.decode_range(sheet["!ref"]);
  range.w = r.e.c - r.s.c + 1;
  range.h = r.e.r - r.s.r + 1;  
  var header_row_count = opts.header_row_count || 1;

  //header
  for (R = r.s.r; R < r.s.r + header_row_count; ++R) {
    isempty = true;
    row = [];
    for (C = r.s.c; C <= r.e.c; ++C) {
      val = sheet[XLS.utils.encode_cell({c: C,r: R})];
      if(val) isempty = false;
      val = val || { v: '', t: 's'};
      row.push( opts.raw ? v||val.v : XLS.utils.format_cell(val, v) );      
    }
    if(!isempty) header.push(row);
  }

  //body
  for (R = r.s.r + header_row_count; R <= r.e.r; ++R) {
    isempty = true;
    row = [];
    for (C = r.s.c; C <= r.e.c; ++C) {
      val = sheet[XLS.utils.encode_cell({c: C,r: R})];
      if(val) isempty = false;
      val = val || { v: '', t: 's'};
      row.push( opts.raw ? v||val.v : XLS.utils.format_cell(val, v) );
      
    }
    if(!isempty) body.push(row);
  }

  out = {
    range: range,
    header: header,
    body: body
  };

  return out;
}

function to_json(workbook, opts) {
  var result = {};
  workbook.SheetNames.forEach(function(sheetName) {
    var roa = sheet_to_row_array(workbook.Sheets[sheetName], opts);
    if(roa.range.h > 0){
      result[sheetName] = roa;
    }
  });
  return result;
}

function process_wb(wb, opts) {
  //if(typeof Worker !== 'undefined') XLS.SSF.load_table(wb.SSF);
  var output = "";

  output = to_json(wb, opts); 

  return output;
}

if(typeof module != 'undefined')
{
    module.exports = process_wb;
}
