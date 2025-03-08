let uniq = require('uniq')
let module1 = require('./module/1')
let module2 = require('./module/2')
let module3 = require('./module/3')

module1.foo() 
module2() 
module3.foo() 
console.log(uniq(module3.arr)) //[ 1, 2, 3 ]