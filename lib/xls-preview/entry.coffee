XLS = require 'imports?require=>undefined!exports?XLS!xlsjs'

process_wb = require './old_imp/xlsutils'

http_invoke = require 'httpinvoke'

require 'imports?http_invoke=>http_invoke&XLS=>XLS&process_wb=>process_wb!./old_imp/xlspreview'
