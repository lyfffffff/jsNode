## 二、javaScript

#### js标签的属性

- defer
在外部文件中使用，推迟执行js脚本，虽然立即下载脚本，但是在页面加载完才执行，不影响页面加载，有顺序影响，若多个推迟执行脚本，会按照顺序执行
- async
在外部文件中使用，异步执行脚本，虽然立即下载脚本，但是在页面加载完才执行，不影响页面加载，没有顺序影响，若有多个异步执行，不能确保执行顺序
- type
默认为'text/javascript',当使用export和import时.可能会修改
- src
设置外部文件的源，脚本没有跨域限制
- integrity
因为没有跨域限制，所以为了防止同一个源的js文件被恶意修改，integrity可以设置一个签名，对比js文件返回的签名，若不同则报错

#### 动态加载脚本

即需要时才加载此脚本，但是浏览器预加载器不知道，需要设置'<link rel='pereload' href='index.js'>'
1，创建一个script节点
2，给该节点添加属性
3，将节点加入到dom结构中

```js
let script = document.createElement('script')
script.src = 'index.js'
document.head.appendChild(script)
```

#### js补充

- 行内脚本的缺点
1，不能使用'</script>'字符串，当做脚本结束标签，需要变成'<\/script>'
2，在XTML标签中，将 < (小于号)当做标签
3，多个页面使用同一段代码时，造成资源浪费
4，在head标签中使用脚本，脚本代码没有加载完，页面也不会执行，但是设置了defer/async的外部脚本文件不会影响页面加载
- 外部文件脚本的优点
1，多个页面使用，文件只下载一次
2，没有以上限制
- noscript标签
在不支持脚本的页面才显示，支持脚本的浏览器永远不显示标签的内容

## 三、语言语法

#### 七种数据类型

| Number | String | Boolean | Symbol | Null | undefined | Object |
|  ----  | ----  | ---- | ---- | ---- | --- | --- |
| 原始 | 原始 | 原始 | 原始 | 原始 | 原始| 引用 |
| typeof检查: Number | String | Boolean | Symbol | Object| undefined  | Object |

- typeof缺点
对于Array、Null数据，都会检测为Object，原理：typeof实际上检测的是数据类型指向的地址，其中000表示对象，而null恰好是空指针对象，所以判为对象

| 000->对象 | 1->整数 | 010->浮点数 | 100->字符串 | 110->布尔
|  ----  | ----  | ---- | ---- | ---- |

- 构造函数与对象
使用构造函数和对象创建实例的区别，虽然log打印相同，但是一个是Number型，一个是Object型，二者本质不相同。Number、Boolean、String皆是，但是Symbol没有new构造函数

```js
// Number 
let num = Number(1) // num = 1
typeof num // Number
let num_1 = new Number(1) // num = 1
typeof num // Object
```

##### Number数据类型

支持十进制、十六进制（0x开头）、八进制（0开头，后面数字不大于7）、浮点值。拥有最大值（Number.MAX_VALUE）和最小值（Number.MIN_VALUE），超过则为+-infinity，对于本该是数字但不是数字的表示为NaN，例如：分母为+-0，式子包含NaN等，但是每个NaN都互不相等

```js
NaN == NaN // false
```

- 非数值转为数值的方法
  - Number(param)
  - parseInt(param,scale)
  常用。参数二表示进制，可以选择二、八、十六进制。若不定义，则按照字符串命名显示，即长得像什么（x0、07），就当做什么。自动忽略空字符串，从第一个非空开始检测，若其为非数字，返回NAN（纯空字符串也为NaN），若为数字，截取到非数值字符串之前，并作为结果返回，自然‘.’也当做非数值字符串，遇到也返回。
  - parseFloat(param)
- Null和undefined
Null表示空指针对象，undefined则是声明但未定义，但是null == undefined

##### String数据类型

使用单、双、反引号（模板字面量，可换行，可使用${}插值）包裹的都是字符串，可以解析类似于‘\n’的转义字符，若不想解析，使用String.row(string)

- 非字符串转为字符串
  - xxx.toString()
   但是null和undefined没有此方法，对于数值，toString还有参数，Number.toString(log)，表示将数值先转为几进制，再转为字符串
  - String(param)
   当有可能是null和undefined时，使用此函数，返回'null'和'undefined'

##### Symbol

符号类型。使用Symbol(param)创建，每一次创建都是唯一的，主要用来确保**对象属性**唯一性，即虽然长得像，但不是一个东西，不会覆盖，因为参数只起到一个描述的功能，并不做区别标识符，本质都是唯一的。

```js
let symbol = Symbol()
typeof symbol // Symbol
console.log(symbol)// Symbol()
let symbol_s = Symbol('symbol_ 1')// 参数非必须
let symbol_1 = Symbol('symbol_ 1')// 传一样的参数
symbol_1 == symbol_s // false，宛如长相相同，指向地址不相同的Object
```

- Symbol.for(param)全局注册
  即没有就全局注册，有就直接全局拿过来，改善了长相相同却永不相同的缺点，但二者必须接皆使用for，否则不是全局注册。param必须传一个字符串给for方法，没传就当做传入'undefined'，传入非字符串则报错。对于for全局注册的符号，可以使用keyFor查询符号的字符串，若查询的不是全局注册的符号，返回undefined，若传入非符号，报错。

  ```js
  let symbol = new Symbol.for('symbol')// 此时没有，全局注册
  let symbol_1 = new Symbol.for('symbol)// 此时全局有，直接拿过来，也就是上面的
  symbol == symbol_1 // true

  let symbol_f = new Symbol('symbol)// 与全局不同，只是新创建一个符号实例
  symbol_f == symbol_1 // false
  
  Symbol.keyFor(symbol) // 'symbol'
  ```

- 作为对象属性
  出现一个对象，两个键值长得一毛一样的，但是别担心冲突，访问也只能使用那个symbol实例。获取属性集也是只能通过Object.getOwnPropertySymbols()。但是获取属性描述符Object.getOwnPropertyDescriptors()和reflect.ownKeys()，是返回普通属性和符号属性的。

  ```js
  symbol = Symbol('xxx')
  symbol_1 = Symbol('xxx')
  obj[symbol] = 1
  Object.defineProperty(obj,symbol_1,1)
  obj === {
    Symbol(xxx): 1
    Symbol(xxx): 1
  }
  obj[symbol] // 唯一访问标识
  obj.Symbol(xxx) // 报错
  Object.getOwnPropertyNames(obj) // []
  Object.getOwnPropertySymbols(obj) // [Symbol(xxx), Symbol(xxx)]
  ```

- symbol属性
  内置在某些对象中，且在某些对象的某些方法被调用时，才被使用

  - description
  读取传入的描述参数，若无则返回一个undefined

  ```js
  Symbol('desc').toString();   // "Symbol(desc)"  
  Symbol('desc').description;  // "desc"
  Symbol('').description;      // ""
  Symbol().description;        // undefined
  ```

  - hasInstance
  xxx instanceof XXX 实际调用的是XXX内部的Symbol.hasInstance(xxx)，判断是否是某构造器（new）的实例，手动自定义就是修改instanceof的结果

  ```js
  class Array1 {
  static [Symbol.hasInstance](item) {
    return Array.isArray(item);
    }
  }
  console.log([] instanceof Array1);// 使用instanceof检验
  ```

  - match、matchAll、repelace、serach、split
  字符串对象的属性，在字符串调用上述方法时，其实就是使用symbol.xxx，可自定义，和instanceof用法一致，直接设置boolean值时决定：传入参数形如/xxx/时，是字符串还是表达式，默认为表达式

  ```js
  str.[symbol.match] = flase// 设置不作为表达式，而是字符串  
  ```

  - isConcatSpreadable
  内置为数组的属性，判断数组是否可展开，默认数组为true，类数组为false，影响Array.contact合并数组的方式

  ```js
  arr.contact(arr_1)// 正常展开，为[...arr,...arr_1]
  arr_1.[Symbol.isContcatSpreadable] = false
  arr.contact(arr_1)// 不展开，为[...arr,arr]
  let fakeArray = {
  length: 1,
  0: "hello",
  }
  arr.contact(fakeArray)// 展开，为[...arr,'hello']
  ```

  - toPrimitive
  当对象做操作时，根据情况决定类型，例如运算操作当做数值类型，console当做字符串

  ```js
  class Num{
      [Symbol.toPrimitive](hitn){
          swith(hitn){
              case 'number':{}
              case 'string':{}
              case 'default':{}
          }

      }
  } 
  ```

#### 三种声明方式

- var
使用var声明的变量，都会提升到顶部，只有函数作用域，作用域内声明的变量都为局部变量，跟随函数结束而销毁。
- let
拥有块级作用域，即存在{}就存在作用域。不会变量提升，所以在**未声明前**就使用会造成暂时性死区。

```js
var temp
function testDead(){
    temp = 1;
    let temp
}
```

-- var 和 let的对比
for循环定义的变量是局部还是全局，影响到渲染

```js
for(let i = 0;i<5;i++){}// i 是局部变量，在for循环之后销毁，在for内部的i绑定的也是局部的，当时的那个i
for(var i = 0;i<5;i++){}// i 是全局变量，不会销毁，最后以i = 5 的形式存储，for内部最终绑定的也是全局的i，会变
```

- const
与let相同，但是声明即需初始化，之后不能修改，常量则使用const，或只修改对象的属性，可以使用const

##### for与continue和break

- for(初始表达式;条件表达式;末尾循环体){中间循环体} ---- 条件表达式->中间循环体->末尾循环体
- continue只是跳过这一次循环
- break是跳出这**一层**循环

#### for/of和for/in

- for/of是**可迭代**对象遍历元素的，for/in是枚举对象的可枚举属性

#### with(obj){}

比较少接触，将作用域全部限制在某个对象中，只能操作对象已有的属性，若是对象内部没有该属性，会沿着作用域链寻找。比较bug，with不能调用，故只有它访问其他变量，没有其他变量访问它的，也不能重复调用，不知道算不算局部变量。

```js
let a = 1;
let obj = {}
let obj_1 = {a : 1}
with(obj){
    a = 2 // 此处因为obj没有a属性，修改的是全局的a
} 
with(obj_1){
    a = 2 // 此处因为obj有a属性，修改的是obj_1
}
// a == 2 ; obj == {}; obj_1 = {a : 2}
```

## 四、变量、作用域和内存

#### 引用值和原始值

原始值有undefined、symbol、null、string、number、boolean，引用值有对象object，操作的是对对象的引用。对于**复制**来说，原始值直接是将a的值赋值给b，但是对于引用值来说，是将a所指向的引用地址赋给b，故两者有联系，改其一变二者。**函数传参是按值传参**，相当于复制了参数，a作为参数传给函数，在函数内部操作参数‘a’，对外部a是没有影响的，但是引用值传给函数的仍是地址，故还是会影响外部a，但是当函数内部参数不再指向该地址时，二者就没有关系了。

#### 上下文和作用域

函数和window产生上下文，其中window为全局上下文，上下文产生作用域链

#### 内存
