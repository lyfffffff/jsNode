[TOC]

## 二、javaScript

#### js 标签的属性

- defer
  推迟执行脚本，从上至下按顺序执行和下载，若多个推迟执行脚本，会按照**顺序**执行
- async
  异步执行脚本，没有顺序影响，若有多个异步脚本引入，不能确保执行顺序
- type
  默认为 'text/javascript' ，当使用导入导出 export 和 import 时，可能会修改，变成 'module'
- src
  设置外部文件的源地址，脚本没有跨域限制
- integrity
  因为没有跨域限制，所以为了防止同一个源地址的 js 文件被恶意修改，integrity 可以设置一个签名，对比 js 文件返回的签名，若不同则报错

#### defer 和 async 的异同

同：都在**引入**外部脚本时有效，在页面加载完才执行，不影响页面加载,
异：异步没有顺序可言，延迟还受顺序影响

#### 动态加载脚本

- 浏览器预加载器
  浏览器对所有资源进行划分优先级，并按优先级加载资源，包含：Highest、High、Medium、Low、Lowest。
  css、html 优先级最高；font 资源优先级为 Highest/High；图片资源，如果出现在**视口**中，则优先级为 High，否则为 Low；
  而 script 脚本优先级不一：

  - 在**第一个图片资源**之前阻塞的脚本在网络优先级中是 High
  - 在第一个图片资源之后阻塞的脚本在网络优先级中是 Medium
  - 异步/延迟/插入的脚本（无论在什么位置）在网络优先级中是 Low
    当动态加载资源时，浏览器无法确认该资源优先级，需设置浏览器预加载器。预加载器通过 link 标签设置 rel 属性为 preload/prefetch ，此外还有 as 属性，表示该资源是什么类型，以便浏览器按优先级加载。
  - preload 主要用于预加载**当前页面**需要的资源；而 prefetch 主要用于加载**将来页面**可能需要的资源；在 vue 项目中进行打包上线之后，index.html 中对一些 css 和 js 资源进行预加载。

  ```js
  <link rel='preload' href='index.js' as="script"> // 预加载 index.js，且此资源是 script 脚本
  ```

动态加载脚本即需要时才加载此脚本，但是**浏览器预加载器**不知道，需要设置 link 标签让浏览器有所准备，提前下载，动态加载脚本步骤如下：
1，创建一个 script 节点
2，给该节点添加属性
3，将节点加入到 dom 结构中

```js
let script = document.createElement("script");
script.src = "index.js";
document.head.appendChild(script);
```

#### js 补充

- 行内脚本（即在 script 标签中写逻辑）的缺点
  1，不能使用`</script>`字符串，当做脚本结束标签，需要使用转义字符变成`<\/script>`
  2，在 XTML 标签中，将 < （小于号）当做标签
  3，页面间脚本代码不互通，即多个页面使用同一段代码时，造成资源浪费
  4，在 head 标签中使用脚本，脚本代码没有加载完，页面也不会执行
- 外部文件脚本的优点
  1，多个页面使用，文件只下载一次
  2，设置了 defer/async 的外部脚本文件不会影响页面加载
- noscript 标签
  在不支持脚本的页面中显示标签内容，支持脚本的浏览器**永远不**显示

## 三、语言语法

### 七种数据类型

| Number                | String   | Boolean   | Symbol                              | Null     | undefined   | Object（衍生出 Fuction 和 Array） |
| --------------------- | -------- | --------- | ----------------------------------- | -------- | ----------- | --------------------------------- |
| 原始                  | 原始     | 原始      | 原始                                | 原始     | 原始        | 引用                              |
| typeof 检查: 'number' | 'string' | 'boolean' | 'symbol'                            | 'object' | 'undefined' | 'object'                          |
| instanceof 检查： 无  | 无       | 无        | 无（因为 Symbol 也是非 new 构造的） | 无       | 无          | Object                            |

- typeof 缺点
  typeof 有七种取值：number、string、function、object、boolean、symbol、undefined。而 Array、Null 数据都会检测为 Object，原理：typeof 实际上检测的是数据指向的**地址**，null 为空指针对象指向 000 ，所以判为对象

| 000->对象 | 1->整数 | 010->浮点数 | 100->字符串 | 110->布尔

- 构造函数与调用函数
  数据可以使用构造函数创建实例（new F()）和直接调用函数（F()）返回，表现相同，但类型不同，一个是原始型，一个是 Object 型。Number、Boolean、String 皆是，但是 Symbol 没有 new 构造函数

```js
// Number 为例
let num = Number(1); // num = 1
typeof num; // 'number'
let num_1 = new Number(1); // num = 1
typeof num; // 'object'
```

#### Number 数据类型

支持十进制、十六进制（0x 开头 0-9 | a-f ）、八进制（0 开头，后面数字不大于 7）、浮点值。拥有最大值（Number.MAX_VALUE）和最小值（Number.MIN_VALUE），超过则为 +-infinity，对于本该是数字但不是数字的表示为 NaN，例如：分母为 +-0，式子包含 NaN 等，注意每个 NaN 都互不相等

```js
NaN == NaN; // false
```

- 非数值转为数值
  - Number(param)
    缺点：空字符串返回 0 ，前数字后非数字（'10b'）返回 NaN
  - \*parseInt(param，scale)
    常用。scale 表示 param 进制，选值为 2，8，16（输入其他值也可以，但是比个位数小返回 1 ，输入 1 返回 NaN），并将其转为十进制。若不定义，长得像什么（0x0、07 开头），就当做什么。从第一个非空开始检测，若为非数字，返回 NAN（纯空字符串也为 NaN），若为数字，截取到**非数值字符串**之前，并作为结果返回，自然 `.` 也当做非数值字符串，遇到也返回。
  - parseFloat(param)
    弥补 parseInt 遇到 `.` 返回

```js
Number(""); // 0
Number("10b"); // NaN
parseInt(""); // NaN
parseInt("10b"); // 10
```

#### null 和 undefined

null 表示空指针对象，undefined 则是声明但未定义，但是 null == undefined，例如数组 Array(4)，若定义为 Array(4).fill(undefined)，遍历时还是会返回 undefined 的

#### String 数据类型

使用 单、双引号包裹的都是字符串，不能换行，但可以解析类似于 \n \t 的转义字符进行换行，若不想解析，使用 String.row(str)。反引号 ` 也可以表示字符串，还可以使用 ${} 在字符串中进行插值

- 非字符串转为字符串
  - num/boolean/symbol/obj.toString()
    null 和 undefined 没有此方法，数值型的 toString 方法还有参数，num.toString(log)，log 表示将数值先转为几进制，再转为字符串
  - String(param)
    null 和 undefined 时，使用此函数，返回 'null' 和 'undefined'

```js
// 模板字面量
let html_code = `
<a>我是链接</a>
`;
// 模板字面量插值
var variable = "我是链接";
let html_code_1 = `
<a>${variable}</a>
`;
// html_code == html_code_1
```

#### Symbol

符号类型。使用 Symbol(param) 创建，虽然不是引用值但每个 Symbol 实例都是唯一的，参数 param 只起到描述功能，并不做区别标识符，本质都是唯一的。

```js
let symbol = Symbol();
typeof symbol; // Symbol
console.log(symbol); // Symbol
let symbol_s = Symbol("symbol_ 1"); // 参数非必须
let symbol_1 = Symbol("symbol_ 1"); // 传一样的参数
symbol_1 == symbol_s; // false，宛如长相相同，指向地址不相同的 Object
```

- Symbol.for(param) 全局注册
  按需存取，没有就全局注册，有就直接从全局拿取，改善了长相相同却永不相同的缺点。param 必须传一个字符串，没传就当做传入 'undefined'，传入非字符串则报错。
  对于 Symbol.for 全局注册的符号，Symbol.keyFor(symbol) 可以返回符号的字符串参数，若参数不是全局注册的符号，返回 undefined，若传入非符号则报错。

  ```js
  // 全局注册
  let symbol = new Symbol.for("symbol"); // 此时没有，全局注册
  let symbol_1 = new Symbol.for("symbol"); // 此时全局有，直接拿取，也就是上面的
  symbol == symbol_1; // true

  let symbol_f = new Symbol("symbol"); // 非全局，只是新创建一个符号实例
  symbol_f == symbol_1; // false

  Symbol.keyFor(symbol); // 'symbol'
  Symbol.keyFor(symbol); // 'undefined' 不是全局注册
  Symbol.keyFor(1); // error
  ```

- 符号作为对象属性
  因为符号的唯一性，可以作为对象的键值，不会覆盖，就连访问也只能使用该符号作为唯一访问标识。
  Object.getOwnPropertyNames、for/in 无法访问符号属性。
  Object.getOwnPropertySymbols(obj)返回符号属性集；Reflect.ownKeys() 返回普通属性和符号属性集；Object.getOwnPropertyDescriptors()返回所有属性的描述符对象。

  ```js
  symbol = Symbol('xxx')
  symbol_1 = Symbol('xxx') // symbol_1 != symbol
  obj[symbol] = 1 // 直接赋值
  Object.defineProperty(obj，symbol_1,{value:1}) // 使用 defineProperty 定义
  obj === {
    Symbol(xxx): 1
    Symbol(xxx): 1
  }

  obj[symbol] // 唯一访问标识
  obj[Symbol('xxx')] // 报错

  Object.getOwnPropertyNames(obj) // [] 获取所有属性值，但是不包括 Symbol 属性
  Object.getOwnPropertySymbols(obj) // [Symbol(xxx)， Symbol(xxx)]
  ```

- Symbol 属性
  有些 Symbol 属性内置在某些对象（string、Array）中，当且仅当这些对象的某些方法（instanceof、match、concat）被调用时，才被使用

  - symbol.description
    读取调用 Symbol 生成实例时传入的**描述参数**，若无则返回一个 undefined

  ```js
  Symbol("desc").toString(); // "Symbol(desc)"
  Symbol("desc").description; // "desc"
  Symbol("").description; // ""
  Symbol().description; // undefined
  ```

  - Symbol.hasInstance
    x instanceof X 本质是调用 X[Symbol.hasInstance](x)，直接修改对象/函数的 Symbol.hasInstance 属性**不起作用**，自定义类内部修改（class A{ static [Symbol.hasInstance](item){}} }）起作用。

  ```js
  a instanceof B === B[Symbol.hasInstance](a);

  // 在类内部修改 Symbol.hasInstance
  class Array1 {
    static [Symbol.hasInstance](item) {
      return Array.isArray(item);
    }
  }
  console.log([] instanceof Array1); // [] 虽不是由 Array1 构造的，但仍为 true
  ```

  - match、matchAll、repelace、serach、split
    内置在**字符串**实例中，作为属性，与字符串对象方法所对照，在字符串调用 str.replace 时，其实会使用到 symbol.replace，可自定义，例如 symbol.match 决定传入参数形如 /xxx/ 时，是字符串还是表达式，默认为表达式

  ```js
  let test = "test i am what";
  let str = /test/;
  str[Symbol.match] = false; // 设置 str 不为表达式，而是字符串
  test.match(str); // error，因为禁止作为表达式
  ```

  - isConcatSpreadable
    内置为**数组**的属性，判断数组是否可展开，默认数组为 true，类数组为 false，影响 Array.concat 合并数组的方式，若不可展开则整个数组作为某数组项 a[xx]

  ```js
  let arr = ["name", "age"];
  let arr_1 = ["height"];
  arr.concat(arr_1); // 正常展开，为[...arr，...arr_1]
  arr_1[Symbol.isConcatSpreadable] = false; // 设置为不可展开
  arr.concat(arr_1); // 不展开，为[...arr，arr]
  let fakeArray = {
    length: 1,
    0: "hello",
  };
  fakeArray[Symbol.isConcatSpreadable] = true; // 设置为展开
  arr.concat(fakeArray); // 展开，为[...arr，'hello']
  ```

  - toPrimitive
    内置为**对象**的属性，即操作对象时，将对象当做什么类型，参数 hint 表示当前对象被当做 xx 类型，例如 +- 运算操作将对象当做'number'，console 当做字符串'string'

  ```js
  let Num = {
    [Symbol.toPrimitive](hit) {
      let res;
      switch (hit) {
        case "number":
          res = 11;
          break;
        case "string":
          res = "111";
          break;
        default:
          res = "show me flowers";
      }
      return res;
    },
  };
  console.log(+Num); // number  11
  console.log(`${Num}`); // string '111'
  console.log(Num + ""); // default 'show me flowers'
  ```

#### 三种声明方式

- var
  使用 var 声明的变量，都会提升到作用域顶部，全局变量提升至 DOM$，$，$，$，例如 if 为 false$，return$，也会提升。使用**声明式**声明的函数（function xxx）$，$，比 var 要早。$，$，当做隐式的 var.

  ```js
  // 定义与赋值
  age = 10; // 等同于 var age = 10
  console.log(age); // 10
  console.log(name); // error

  // 变量提升
  console.log(age); // ƒ test(){} 因为变量提升优先级 函数 > var
  function age() {}
  var age;

  var age = 10;
  function age() {}
  console.log(age); // 10 $，先函数后 var，最后赋值 age = 10

  // 无法抵达仍提升
  if (1 != 1) {
    var a;
  }
  console.log(a); // undefined

  function test() {
    console.log(a); // undefined
    return;
    var a;
  }
  ```

- let
  拥有块级作用域，即存在 {} 就存在作用域。不会变量提升，所以在**未声明前**就使用会造成暂时性死区（即未声明就使用）。

```js
// 暂时性死区
var temp;
function testDead() {
  temp = 1; // 此时局部有 temp，优先级比全局 temp$，但是因为 let$，所以出现暂时性死区
  let temp;
}
```

##### var 和 let 的对比

for 循环定义的变量是局部还是全局，影响到渲染

```js
for (let i = 0; i < 5; i++) {} // i 是局部变量，在 for 循环之后销毁，在 for 内部的 i 绑定的也是局部的，当时的那个 i
for (var i = 0; i < 5; i++) {} // i 是全局变量，不会销毁，最后以 i = 5 的形式存储，for 内部最终绑定的也是全局的 i，会变
```

- const
  与 let 相同，但是声明即需初始化，之后不能修改，常量则使用 const，或只修改对象的属性，可以使用 const

#### 函数参数

函数作用域内声明的变量都为局部变量，跟随函数结束而销毁。在函数中使用声明式函数/var 声明的变量也会进行变量提升。$，$，$，等同于在函数中复制了实参的值并保存在局部变量中。$，$，故会影响。

```js
// 形参的本质
function concactName(f，e){
    return f+e
}
function concactName(f，e){
    var f = f
    var e = e
    return f+e
}

// 函数与变量提升
var a = 1;
function foo() {
    a = 10;
    console.log(a); // 10
    return;
    function a() {};
}
foo();
console.log(a); // 1
// foo 函数等同于
function foo() {
    function a() {}; // 故根本没有影响全局的 a
    a = 10;
    console.log(a); // 10
    return;
}

```

- 局部变量和形参同名
  首先是局部变量不能使用 let $，因为等同于 var 和 let 重复声明。$，$，$，$，类似于声明语句无效。$，$，$，$，$，$，故会响应对方的修改。

```js
// 重复宣告
var a = 1;
var a; // 以最近的赋值为替换
console.log(a); // 1

// 形参与局部变量同名
foo = { n: 1 }(function (foo) {
  console.log(foo.n);
  foo.n = 3;
  var foo = { n: 2 };
  console.log(foo.n);
})(foo)(
  // 输出 1 2 3
  // 以上等同为
  function (foo) {
    var foo; // $，foo 仍指向所传入的对象的地址
    console.log(foo.n); // 1
    foo.n = 3; // 修改全局 foo
    foo = { n: 2 }; // $，此时与外界的 foo 失去联系
    console.log(foo.n); // 2
  }
)(foo)(
  // 亦等同为
  function (foo) {
    console.log(foo.n); // 1
    foo.n = 3; // 修改全局 foo
    foo = { n: 2 }; // $，此时与外界的 foo 失去联系
    console.log(foo.n); // 2
  }
)(foo);
```

##### for 与 continue 和 break

- for(初始表达式;条件表达式;末尾循环体){中间循环体} ---- 条件表达式->中间循环体->末尾循环体
- continue 只是跳过这一次循环
- break 是跳出这**一层**循环
- return $，但是只能在**函数**$，若在函数的 for$，$，for 循环也终止

#### for/of 和 for/in

for-in 遍历 key for-of 遍历 value。for/of 是**可迭代(iterator)**$，即是 value，for/in $，即是 key。
因 for-of$，$，使用 for-in 稳妥。
$，因为不常操作 index，故使用 for-of，但是要改变数组原始值(num，string)选项 item$，for of $，只能修改数组引用值(对象属性)选项的属性

```js
for (let key in obj) {
}
for (let item of arr) {
}
```

#### with(obj){}

比较少接触，将作用域全部限制在参数对象中，只能操作对象已有的属性，若是对象内部没有该属性，会沿着**作用域链**寻找，可能会影响全局变量，比较 bug.with 不能调用，故只有它访问其他变量，没有其他变量访问它的，也不能重复调用，不知道算不算局部变量。

```js
let a = 1;
let obj = {};
let obj_1 = { a: 1 };
with (obj) {
  a = 2; // 此处因为 obj 没有 a 属性，修改的是全局的 a
}
with (obj_1) {
  a = 2; // 此处因为 obj 有 a 属性，修改的是 obj_1
}
// a == 2 ; obj == {}; obj_1 = {a : 2}
```

## 四、变量、作用域和内存

#### 引用值和原始值

原始值有 undefined、symbol、null、string、number、boolean，引用值有对象 object，操作的是对对象的引用。对于**复制**来说，原始值直接将 a 的值赋值给 b，但是对于引用值来说，是将 a 所指向的引用地址赋给 b，故两者有联系，改其一变二者。**函数传参是按值传参**，相当于复制了参数，a 作为参数传给函数，在函数内部操作参数‘a’，对外部 a 是没有影响的，但是引用值传给函数的仍是地址，故还是会影响外部 a，但是当函数内部参数不再指向该地址时，二者就没有关系了。对于**动态属性**来说，原始值没有动态属性，引用值可以随意增删查改属性值。

#### 上下文和作用域

函数和 window 产生上下文，其中 window 为全局上下文，上下文产生作用域链，作用域链是栈操作，越里层越早出栈，也就能访问到越外层的变量，当变量在当前上下文没有找到时，沿着作用域链往外寻找，直到找到全局上下文。

#### 内存

垃圾回收(GC)
计数回收法:产生引用时，计数加一，清除引用时，计数减一，若计数为 0，则进行垃圾回收，整个过程是不可见的，故容易有未清除引用导致浪费内存的情况

```js
let obj = { name: "lyf" }; // 右边定义了一个对象 0x10000 而 obj 指向了该地址，即引用了它 计数为 1
let test = obj; // test 也指向了 obj 指向的地址，即也对对象 0x10000 进行引用了 计数加 1 为 2
obj = null; // 计数减 1 为 1 0x1000 仍未被回收
test = null; // 计数减 1 为 0 0x1000 被回收
```

内存泄漏
对象引用一直无法达到 0,也就一直无法回收。检查内存，可以使用终端 process.memoryUsage()，或者控制台 Memory，打印快照前要 GC

## 五、基本引用类型

#### Date 对象

创建日期对象，返回标准日期格式(Mon Jan 31 2022 00:00:00 GMT+0800 (中国标准时间))，当传一个参数时，可以传字符串和数字，数字代表时间戳，即 1970 年 1 月 1 日午夜至某日期所经过的毫秒数，字符串有多种格式，较常使用的是 'yyyy/MM/dd 00:00:00' ，另一种较为相似的 'yyyy-MM-dd 00:00:00' 在火狐和 IE 中不兼容。Date 函数中有许多方法，常用的是将 Date 转为形如 'xxxx-xx-xx xx:xx:xx' 的格式，其中获取日期月份、周几的方法也从 0 开始的，需 + 1。

```js
// new Date 的参数
let d = new Date(); // 后台默认调用 Date.parse()
let d = new Date(milliseconds); // 数字，毫秒数
let d = new Date(dateString); // '月/日/年'、'年/月/日 时间'、'年-月-日 时间'、'标椎日期格式'、'月(英) 日，年'
let d = new Date(year， month， day， hours， minutes， seconds， milliseconds);

// Date 实例的方法
time = d.getTime() // 获取总毫秒数
year = d.getFullYear() // 获取年份
month = d.getMonth() // 获取月份，0-11  +1
date = d.getDate() // 获取日，1-31
day = d.getDay() // 获取星期几，0~6      +1
hour = d.getHours() // 获取小时，0~23
minutes = d.getMinutes() // 获取分钟，0~59
seconds = d.getSeconds() // 获取秒，0~59

// 标准日期格式转换为 xxxx-xx-xx xx:xx:xx
let d = new Date()
year = d.getFullYear()
let obj = {
    month : d.getMonth()+1,
    date : d.getDate()，
    hour : d.getHours()，
    minutes : d.getMinutes()，
    seconds : d.getSeconds()
}
for(let key in obj) {
    obj[key] = ('00'+obj[key]).slice((obj[key]+'').length)
    }
let result = year + '-' + obj.month + '-' + obj.date + ' ' + obj.hour + ':' + obj.minutes + ':'+ obj.seconds
```

#### RegExp 函数

RegExp(regular expression)，正则表达式对象，通常模式为 /xxx/xx ，其中 xxx 表示需要匹配的模式，xx 表示属性，例如是否全局，是否区分大小写，正则 A 常常用来检查一个字符串 B 是否符合预期，即 B 至少要满足 A。

```js
let pattern = new RegExp(".at", "g"); // 全局匹配所有以 at 结尾的字符串
let pattern = /.at/g;
pattern.lastIndex; // 实例有一个 lastIndex 属性，表示上次匹配的结尾位置，只在全局匹配 +y 下起作用
```

- 匹配属性
  g、i、y、m 分别表示全局匹配、不区分大小写、从 lastIndex 开始匹配、匹配多行
- 实例属性
  用于检查匹配属性，例如 pattern.global 返回一个 Boolean 值，检查正则表达式是否设置全局匹配。此外还有 ingoreCase（忽略大小写）、lastIndex（上一个匹配的结尾下标）等
- 实例方法
  检查参数字符串是否满足 RegExp 匹配条件。
  - pattern.exec(str) 返回一个 Array 对象或 null（无匹配时），Array 对象有额外属性：input（参数字符串）、index（匹配初始下标） 和 groups（不知道啥用，undefined），Array 的数组项为**捕获组**，一个括号表示一个捕获组，例如 /a(b)?/，参数包含 ab 或 a 即为可匹配，若能够匹配 ab， exec 为 ['ab','b'],若只匹配到 a，exec 为['a',undefined].若是全局匹配（//g），则下一次调用 exec 方法，从 lastIndex 开始匹配；
  - pattern.test(str) 返回 true、false，表示是否可匹配。

```js
let pattern = /.at/g; // 匹配'es'
let test = "cat.gat";
// 第一次匹配
let match = pattern.exec(test); // ['cat', index: 0, input: 'cat.gat', groups: undefined]
match.input = "cat.gat";
match.index = 0;
match[0] = "cat";
pattern.lastIndex = 3;

// 第二次匹配
let match_1 = pattern.exec(test); // 从 lastIndex 往后匹配
match_1.input = "cat.gat";
match.index = 4;
match[0] = "gat";
pattern.lastIndex = 7;
```

#### 原始值的类型

即 Boolean、Number、String 的构造函数，原始值在使用到其构造函数的属性方法时，其实是手动生成一个实例，完成操作，并在下一行之前销毁。有一些是实例方法，有一些是函数方法。

```js
let s = "hello";
s.hello = "xixi"; // 其实等于 new String(s).hello = 'xixi'
// 先销毁上面的 new String
console.log(s.hello); // 为空，因为被销毁了
```

- Boolean 函数
  形如 new Boolean(true)，传入一个 true 或 false，不传默认为 false，改写 toString 和 valueOf，返回 'true' 和 true；但是 Boolean 对象和 Boolean 值不一样，因为**对象的布尔值**默认为 true，故 new Boolean(false) == true，但是我本意是想设置一个 false，只能使用 new Boolean(false).valueOf，所以会造成歧义，不建议使用。
  此外，使用构造函数实例化原始类型，还造成 typeof 和 instanceof 判断失效，即判断为 object 而不是 number，故都不建议使用。

  ```js
  let b1 = new Boolean(true);
  let b2 = true;
  typeof b1; // 'object'
  typeof b2; // 'boolean'
  b1 instanceof Boolean; // true
  b2 instanceof Boolean; // false
  ```

- Number 函数
  下列方法都会将数值转为字符串，注意直接使用数值调用不起作用。例如 10.toFixed(2) // 报错。
  Number.isInteger() 传入一个数值，判断是否是整数，小数位为 0 也认为是整数
  num.toString(num) 参数 num 表示将数值先转为**n 进制**后才转为字符串
  num.toFixed(num) 参数 num 表示数值保留几位小数后转为字符串，没有小数也要制造小数
  num.toExponential(num) 参数 num 表示**小数位数**,使用科学计数法将数值转为字符串
  num.toPrecision(num)，参数 num 表示**总保留位数**,表示将数值转为科学计数法并转为字符串

  ```js
  let num = 1233;
  num.toFixed(2); // 1233.00
  num.toExponential(2); // 1.23e+3
  num.toPrecision(2); // 1.2e+3
  Number.isInteger(1.0); // true
  ```

- String 函数
  同样改写了 valueOf、toString、和 toLocaleString 方法。还有一个 length 属性，表示字符串长度。
  String.fromCharCode(unicode)，表示将 Unicode 转为字符串，可以传多个 Unicode，该方法会将其拼接并返回。
  str.charAt(num)，表示字符串指定索引的字符，传入一个数值，表示索引，从 0 开始计算。
  str.charCodeAt(num)，表示字符串指定索引的字符的 Unicode 值，返回值为一个十进制的数值，可将其转为 16 进制的，就可以对照 Unicode 表。

  ```js
  let str = "abcde";
  str.chatAt(2); // 'c'
  str.chatCodeAt(2); // 99 == 0x63
  String.fromCharCode(0x61, 0x62, 0x63); // 'abc'
  ```

  - 截取字符串的方法
    str.concat 拼接字符串，可以传 1~n 个参数，参数为字符串，按参数顺序拼接在调用此方法的字符串后。截取字符串的方法有 slice、substr、subString，主要使用 slice，皆可以传 1~2 个数值参数。
    区分 substr 和 substring：短（方法名）距（参数 2）。substr 第二位表示截取长度，且不为负数，因为长度不能小于 0 ；substring 功能和 slice 类似，但有两个 bug ，当参数前者大于后者时交换位置、当参数为负数时索引值为 0 ；

| 属性            | slice                                 | substr                          | substirng                                        |
| --------------- | ------------------------------------- | ------------------------------- | ------------------------------------------------ |
| 参数 1          | 截取开始，表示字符串的索引，从 0 开始 |
| 参数 1\_负数    | 参数 1 + 字符串长度                   | 参数 1 + 字符串长度             | **索引下标为 0**                                 |
| 参数 2          | 截取结束的字符串索引                  | **截取长度**                    | 截取结束的字符串索引                             |
| 参数 2\_负数    | 参数 2 + 字符串长度                   | 长度不能为负值，故截取为空''    | **索引下标为 0，必然小于等于参数 1，故交换位置** |
| 参数 2 < 参数 1 | 空字符串                              | 没影响，因为参数 2 表示截取长度 | 交换位置                                         |

```js
let str = "hello";
str.slice(1, 2); // 'e'
str.substr(1, 2); // 'el'
str.substring(1, 2); // 'e'
str.slice(-1); // 'o'
str.substr(-1); // 'o'
str.substring(-1); // 'hello'
str.slice(-1, -2); // 等价于 str.slice(4,3) == ''
str.substr(-1, -2); // 等价于 str.subsr(4,0) == ''
str.substring(-1, -2); // 等价于 str.substring(0,0) == ''
```

- str.indexOf(str，index) 和 str.lastIndexOf(str，index)
  返回字符串匹配的索引，indexOf 返回首次匹配的索引，lastIndx 返回最后一次匹配的索引。参数 1 表示需匹配的字符串，从 0 开始。参数 2 表示开始搜索位置
- 判断是否包含字符串
  常使用 str.indexOf 判断是否包含某字符串，但其主要功能是返回匹配索引值，该使用的是 str.includes。
  现有 str.startsWith、str.endsWith、str.includes 判断是否包含，但前两种有缺点，str.startsWith 必须从索引 0 开始匹配(即匹配头部)，str.endsWith 必须从索引 str.length - sub.length 开始匹配(即匹配尾巴)，而 str.includes 直接检查整个字符串，str.includes 和 str.startsWith 可以传第二个参数，表示开始匹配的索引，str.endsWith 的第二个参数代替 str.length。
  其中，includes 对比 indexOf ，选择 includes。

  ```js
  let test = "name";
  test.startsWith("na"); // true
  test.startsWith("a"); // false
  test.endsWith("e"); // 4-1 = 3 == e true
  test.endsWith("m"); // false
  ```

- str.trim()、str.repeat(num)
  trim 删除字符串前后所有空格，repeat 的参数 num 表示重复次数，将重复的字符串拼接，并返回。

- str.padStart(length，concatStr) 和 str.padEnd(length，concatStr)
  即将参数 2 拼接在字符串前/后，使其扩展至参数 1 长度，参数 1 表示最终字符串长度，若小于原本长度，则返回原字符串，若大于原本长度，padStart/padEnd 决定在字符串前后填充，参数 2 默认为空格，可以传一个字符串，循环填充。

- 改变字符串大小写
  toLowerCase、toLocaleLowerCase、toUpperCase、toLocaleUpperCase。前两个将字符串小写，后两个将字符串大写。加 Locale 表示地区

- 字符串匹配正则表达式
  除了 RegExp.exec(str) 和 RegExp.test(str)，字符串本身也有匹配正则的方法
  str.match(str)，参数表示匹配，功能与 RegExp.exec 类似，但是没有 lastIndex 的概念(故没有下次匹配从 lastIndex 开始)，若直接匹配，返回一个包含 index、input 属性的数组，包含所有匹配项;若给正则表达式添加全局(g)，则没有属性 index 和 input
  str.search(str)，参数表示匹配，返回匹配到的索引值，不匹配返回 -1
  str.replace(str，str) 匹配替换字符串，参数 1 表示匹配项，参数 2 表示将匹配项替换成该项;若有多处匹配，只修改第一次匹配到的项，但是若参数 1 是正则表达式，且有全局标识 g，就会修改整个字符串。
  str.split(str，length)，匹配字符串切割数组，参数 1 是需匹配项，参数 2 为数组长度，若切割超过，也只保留这么多。

```js
let str = 'test one test two'
let p1 = /te/g
let p2 = /te/
str.padStart(20,'1') // '111test one test two'
str.padEnd(5,'.') // 'test one test two'

str.match(p1) // ['te'] 当添加全局时，没有额外属性
str.match(p2) // ['te', index: 0, input: 'test', groups: undefined]
str.search(p1) // 0
str.replace('t','l') // 'lest one test two'
str.replace(/t/g，'h') // 'lesl one lesl two' 修改整个字符串
str.split(' ',2) // ['test','one'] 保留前两个
```

- 比较两个字符串大小
  str.localeCompare(str)，根据字符串在字符表的排序，决定大小，若比参数字符串大，返回-1 ,比参数字符串小，返回 1,一样大返回 0

```js
let str = "apple";
str.localeCompare("appla"); // 1
str.localeCompare("bbb"); // -1
str.localeCompare("apple"); // 0
```

#### 其他内置对象

最熟悉的就是 Math 和 Global 对象，何时何地都能使用的内置对象。Global 表示全局作用域对象，有一个函数是 eval，接收一个字符串，字符串相当于要执行的表达式。
常见使用是比较数组的哪一项最大

- Math.min(num...)/max(num....)
- Math.floor(num)
- Math.round(num)
- Math.random() // 若要找到范围 [n，m) ,使用 n + Math.rondom()\*(m-n)
- Math.ceil(num) // 向上取整
- Math.abs(num) // 绝对值

```js
eval("console.log('hi')"); // 'hi'
eval("Math.max(" + arr.toString() + ")"); // 先拼接字符串，然后整体字符串 变成 'Math.max(...arr)'
```

## 六、集合引用类型

### Object

创建对象有两种方式，一个是实例化，一是对象字面量。注意，修改对象时，若直接是 obj = xxx，其实不是修改，而是替换，因为指向的地址已经修改，需使用 obj.xxx

```js
let obj = new Object();
let obj = {
  name: "lyf",
};
```

### Array

创建也有两种方式，实例化和数组字面量，使用数组字面量创建数组不会调用 Array 构造函数。
new Array 实例化可以传参数，传不同的参数，实例化的数组也不同。可以使用 Array.of(item...) 方法（ES6），of 创建数组，且不论参数类型，都当做数组项。
Array.from(likeArray，callback，this)，将类数组转为数组，参数 1 表示类数组;参数 2 表示**将参数 1 转为数组后**进行操作的回调函数，类似 Array.map()；参数 3 为参数 2 中的 this 指向，当参数 2 不是箭头函数时起作用。

- 类数组
  拥有 length 属性，且 length 属性为数值且有限，且属性为索引值（'0',0）,常见的类数组有字符串

```js
// 判断是否是类数组
function isLikeArray(o) {
  if (
    typeof o === "object" &&
    isFinite(o.length) &&
    o.length >= 0 &&
    o.length < 4294967296
  ) {
    return true;
  } else {
    return false;
  }
}
```

```js
let arr = new Array(3) // [ , , ]
let arr = new Array('3') // ['3']
let arr = new Array('3','2') // ['3','2']
Array.from('test') // ['t','e','s','t']
Array.of(3) // [3]
let likeArray = {
    0:1,
    1:3,
    length:2
}
Array.from(likeArray，function(item){return item*this.attribute},{attribute:2}) // {length:2,0:1,1:3} -(from)> [1,3] -(function)> [2,6]
Array.from(likeArray，item => item*this.attribute，{attribute:2}) // 参数 2 是箭头函数，则 this 指向 window {length:2,0:1,1:3} -(from)> [1,3] -(function)> [NaN，NaN]
```

#### 数组的迭代器

即遍历整个数组，返回数组的属性迭代器，有 arr.keys、arr.values、arr.entries，因为返回是迭代器对象，所以需要 Array.from 将迭代器显示。

```js
let arr = [1, 2, 3];
Array.from(arr.keys()); // [0,1,2]
Array.from(arr.values()); // [1,2,3]
Array.from(arr.entries()); // [[0,1],[1,2],[2,3]]
```

#### 复制和填充

arr.copyWith(startIndex，startCutIndex，[endCutIndex]) ES6 新增，类似于基因重组，将数组的某段变成数组的另一段，会改变原数组，但是数组大小不会变。
参数 1 表示开始被覆盖的索引;参数 2 表示剪下的数组起始位置，不填则默认为索引 0;参数 3 表示结束剪下的数组位置，只改变[参数 1~参数 1+(参数 3-参数 2)]
arr.fill(str，[startIndex],[endIndex]) 指定填充内容，参数 1 表示填充内容，参数 2 表示开始填充位置，若不填则表示从索引值 0 开始填充所有，参数 3 表示结束填充位置，不包含。

```js
[0, 1, 2, 3, 4, 5]
  .copyWith(0, 3) // [3,4,5,3,4,5]
  [(0, 1, 2, 3, 4, 5)].copyWith(0, 3, 4); // [3,1,2,3,4,5]
Array.prototype.copyWith
  .call({ length: 5, 1: 1, 2: 2, 3: 3 }, 0, 3)
  [
    // likeArr -(call)> [ , 1 , 2 , 3 ,  ] -(copyWith)> [3, , 2 , 3 , ] -(likeArr)> {length : 5 , 0 : 3, 2 : 2, 3 : 3}
    (0, 1, 2, 3, 4, 5)
  ].fill(0) // [0,0,0,0,0,0]
  [(0, 1, 2, 3, 4, 5)].fill(0, 2) // [0,1,0,0,0,0]
  [(0, 1, 2, 3, 4, 5)].fill(0, 2, 3); // [0,1,0,3,4,5]
```

#### 严格相等

即比较数组和方法参数时，使用 === 表示严格相等。包括 lastIndexOf、indexOf 和 includes（ES7）。参数一表示需要查找的元素，参数二表示开始查找的索引。但是 lastIndexOf 的参数二表示从该索引后往前搜索。若有找到就返回索引，没有就返回 -1。

#### 迭代方法

every、filter、forEach、map、some。

#### 归并方法

即每次操作的都是前面项的结果，例如数组项相加，最终返回一个结果。
arr.reduce(function，) 参数 1 为归并回调函数，function(prveRes，now，index，arr) 回调函数参数 1 表示上一次归并的结果，参数 2 表示本次的数组 item，参数 3 表示 item 索引，参数 4 表示本数组。参数 2 表示第一次迭代时的 prev，若不填则默认 arr[0] 为 prev，归并函数从第二项开始。
arr.reduceRight() 功能与 reduce 相同，但从数组最后一位遍历至第一位。

```js
let arr = [1,2,3]
arr.reduce((prev，now，index，arr) => { return prev + now}) // 1 + 2 + 3 = 6
arr.reduceRight((prev，now，index，arr) => {return prev - now}) // 3 - 2 - 1 = 0
```

#### 所有归类

| 类型           | 方法                                            |
| -------------- | ----------------------------------------------- |
| 检测           | isArray、instanceof                             |
| 迭代器方法     | entries、keys、values                           |
| 复制和填充     | copyWithin、fill                                |
| 转换方法       | valueOf、toString、toLocaleString               |
| 栈方法         | push、pop                                       |
| 队列方法       | push、shift                                     |
| 排序方法       | reserve、sort                                   |
| 操作方法       | slice、splice、concat                           |
| 搜索和位置方法 | indexOf、lastIndexOf、includes、find、findIndex |
| 迭代方法       | filter、map、forEach、some、every               |
| 归并方法       | reduce、reduceRight                             |

### 定型数组

#### ArrayBuffer

在内存中分配特定数量的字节空间。作为所有定型数组和视图引用的基本单位。对于文件对象，需使用 ArrayBuffer.

#### DataView

视图对象，创建时必须要有 ArrayBuffer 作为参数。

### Map

俗称字典，以**键值对**形式存储数据，实例化 new Map(arr) 可传一个数组参数，数组格式为 [[key1,value1],[key2,value2]]。
常用方法皆在实例上， map.set(key，value)、map.get(key)、map.has(key)、map.delete(key)、map.clear() 属性方法操作字典，map.size 属性表示字典的长度。
字典的键是不限类型的，即函数、对象也能作为键，修改函数和对象时，键值和键同等改变。

```js
let map = new Map()
map.size // 0
map.has('name') // false
map.set('name','lyf')
map.has('name') // true
map.get('name') // 'lyf'
map.set('age',18)
map.set('height',188)
map.size // 3
map.delete('height')
map.size // 2
map.clear()
map.size // 0
let fn = function(){
    console.log('xxx')
}
map.set(fn，'fn') // 函数作为键
```

#### 迭代器

字典也有 entries 迭代器，等价于 Symbol.iterator，即 map.entries == map[Symbol.iterator]，返回一个按插入顺序的键值数组。包括 keys 和 value

### WeakMap

弱字典，拥有的功能和字典稍有不同
没有迭代器（entries、values、keys）、size 属性和 clear 方法，且只接受**对象**作为键名，即**只有存取键和 delete**功能。
null 虽然是对象，但是作为特殊对象，也不可以作为键滴，因为 WeakMap.set(key， val) 是通过 Object.definePoperty 给 key 加了一个新属性 this.name，key 必需是个 Object 才能使用 defineProperty。
弱的概念是对**对象的引用**是偏弱的，对象回收机制中，只有该对象及该对象的引用都移除(计数为 0)，才会进行垃圾回收，但弱字典的引用不计入引用。
在 Map 中，被当做键名/键值的对象，即使在外部进行清除，Map 仍保持对其的引用，故不会被回收
当被当做**键值**的对象被清除后，WeakMap 仍保持对其的引用，即不会回收
当被当做**键名**的对象被清除后，WeakMap 会对键名和键值对象进行回收
但是，打印 WeakMap/Map 对象，仍可以找到被回收的键值对，但是没有迭代，键名也被清除了，故按道理也访问不了

```js
let weak = new WeakMap();
let obj = { name: "lyf" };
let res = { age: 18 };
weak.set(obj, res); // 设置键
weak.get(obj); // 获取键 { age :18 }
res.age = 20;
weak.get(obj); // 获取键 { age :20 }
obj.name = "zzz";
weak.get(obj); // 获取键 { age :20 }
res = null;
weak.get(obj); // {age: 20} // 还存在
obj = null; // 销毁了 obj
weak; // WeakMap {0: {key: {name: 'zzz'},value: {age: 20}} // 仍在内部
```

- 使用 node.js 检查是否进行垃圾回收

```js
> node --expose-gc
// 手动执行一次垃圾回收，保证获取的内存使用状态准确
> global.gc();
// 查看内存占用的初始状态，heapUsed 为 4M 左右
> process.memoryUsage();
> let wm = new WeakMap();
// 新建一个变量 key，指向一个 5*1024*1024 的数组
> let key = new Array(5 * 1024 * 1024);
// 设置 WeakMap 实例的键名，也指向 key 数组
// 这时，key 数组实际被引用了两次，
// 变量 key 引用一次，WeakMap 的键名引用了第二次
// 但是，WeakMap 是弱引用，对于引擎来说，引用计数还是 1
> wm.set(key， 1);
> global.gc();
// 这时内存占用 heapUsed 增加到 45M 了
> process.memoryUsage();
// 清除变量 key 对数组的引用，
// 但没有手动清除 WeakMap 实例的键名对数组的引用
> key = null;
// 再次执行垃圾回收
> global.gc();
// 内存占用 heapUsed 变回 4M 左右，
// 可以看到 WeakMap 的键名引用没有阻止 gc 对内存的回收
> process.memoryUsage();
```

### Set

集合数据，非键值对，而是存储键的，每一个键都是唯一的，即多次添加同一个键，只会保存一次，实例化 Set 函数创建，可以传一个参数，为数组，数组的格式为 [key1,key2]。使用 add 添加，delete 和 clear 删除。delete 返回一个 boolean 值，若集合有此元素，返回 true ，否则返回 false。也有迭代器 entries、keys、values。

```js
let set = new Set();
set.add("111");
```

## 第七章、迭代器与生成器

### 迭代器 Iterator

自己调用自己称递归，重复执行一段代码叫迭代，不断使用前者为归并，且三者都有特定的退出执行指令。
迭代器模式即具备 Iterable 接口的可迭代对象， 有 Array、Map、Set、String、TypedArray，函数 arguments 对象和 NodeList 对象，这些对象**元素有限且具有无歧义的遍历顺序**；
可迭代对象有一个属性 arr[Symbol.iterator]()，类型为函数，调用返回一个迭代器；
迭代器的 arr[Symbol.iterator]().next() 方法，返回一个迭代结果（IteratorResult）的对象 obj = {done:,value:}；
-| 其中 done 为 Boolean 值，表示是否迭代完成，遍历到末尾时为 true；value 表示可迭代对象的值，当 done 为 true 时 value 为 undefined。
一般不会使用 arr[Symbol.iterator]().next() 操作迭代器，而是在某些方法内部调用迭代器，例如 for...of、数组解构、扩展运算符、Array.from()、创建 Set、Map，Promise.all()、Promise.race()、yield\*。
对于没有迭代器的 js 结构，使用迭代器方法，会报错。
![迭代器](./img/Symbol_int.png)
总结：拥有 Iterable 接口 -> 可迭代对象（拥有 Symbol.iterator 属性）-> 调用 Symbol.iterator 属性 -> 返回迭代器 -> 调用迭代器的 next 方法 -> 返回迭代结果对象

```js
let arr = ['a','b','c'];
let iter = arr[Symbol.iterator](); // 执行迭代器属性函数，返回迭代器
iter.next() // 调用迭代器的 next 返回迭代器结果 {value:'a',done:false}
iter.next() // {value: 'b',done:false}
iter.next() // {value:'c',done:false}
iter.next() // {value:undefined，done:true} 接下来调用 next()都返回此

// 修改迭代器
class newArray{
    constructor(stop){
        this.stop = stop;
    }
    [Symbol.iterator](){ // 返回 this
        return this;
    }
    next(){ // 在调用迭代器时使用
            if(this.stop > 0){
                this.stop--
                return {done : false，value : 'xxx'}
            }
            return {done : true，value : 'xxx'}
    }
}
for (var value of new newArray(3)) { // [Symbol.iterator] -> next
  console.log(value); // 'xxx'
}
```

### 生成器 Generator

生成器 Generator 是函数，为了区分生成器和普通函数，生成器函数名一般带星号 function \*test(){}.
生成器不可以使用 new 实例化，调用生成器函数返回**迭代器**，每次调用产生的实例相互不影响，且继承生成器的原型属性，但是没有 this 的概念。
调用生成器函数时，并不执行函数内部代码，而是返回迭代器对象，指向函数内部。
当调用生成的迭代器 next() 时，才执行函数内部代码，并返回对象 { done:true， value:undefined }，value 是生成器函数的**返回值**，默认是 undefined，可以在生成器中修改。
生成器执行返回一个迭代器，迭代器本身也有 Symbol.iterator 属性，执行后返回自身。
在需要添加迭代器的 js 结构，将生成器添加到 js 结构的 Symbol.iterator 属性上。

```js
function *generatorFn(){
}
const g = generatorFn()
g.next() // {value:undefined，done:true}
g[Symbol.iterator]() === g // 本身就是一个迭代器

// 自定义 return
function *generatorFn(){
    return 'xxxx'
}
const g = generatorFn()
g.next() // {value:'xxxx', done:true}

let obj = {name:'',age:18}
obj[Symbol.iterator] = function* test() {
    let keys = Object.keys(this)
    for(let key of keys){
        yield [key，this[propKey]]
    }
}
```

#### yield

控制生成器开启和暂停，在遇到此关键词前，函数内部正常执行，遇到时执行停止，需再次调用迭代器 next() 激活接下代码。
yield 必须在生成器函数中使用，且不能在嵌套在非生成器函数里。
当迭代器调用 next 传参数时，会被 yield 接收，即 yield === 参数，第 n 个 yield 存储着 第 n + 1 次调用 next() 时所传的参数，因为一次调用 next() 时执行到 yield 之前，传参无法接收。
yield 后面可以跟一个表达式，表示 next() 至此的返回值，会先计算表达式再返回，同样，也只有函数执行到这一行时，才计算。若 yield 在其他表达式中，也需要计算，且其后面的表达式作为返回值不作数，不传参就是 undefined，影响表达式的值。

```js
// yeild 的功能
function *generatorFn(){
    console.log('xxxx')
    yield 1+1       // 第一次 next() 至此，先计算表达式
    console.log('ssss')
    yield 'ssss'       // 第二次 next() 至此
    return 'finally'   // 执行至此，退出
}
const g = generatorFn()
g.next() // 'xxxx' {value:2, done:false}
g.next() // 'ssss' {value:'ssss',done:false}
g.next() // {value:'finally',done:true}

// yield 使用限制
function *test(){
    function test(){
        yield '' // 虽在生成器函数中，但嵌套在普通函数中，报错
    }
}

// return + yeild + 表达式
function *test(){
    return yield 'test'
}
t.next() // 执行至 yield，返回 {value:'test',done:false }
t.next('change') // 将 ‘change’ 传给 yield，变成 return 'changhe'，返回 {value:'change',done:true}

// yeild 在表达式里
function * f(x){
    let y = yield (x + 1)// yield 3 -> yield
    return y
}
let g = f(2)
g.next() // {value : 3, done: false}
g.next() // {value : undefined， done: true}，因为 yield 为 undefined，表达式 yield  (2 + 1) == undefined
```

#### Generator.prototype.throw()、Generator.prototype.return()

生成器返回的迭代器对象有一个 throw 方法，调用时在生成器函数内抛出错误，需在生成器函数中进行 try...catch 捕获，捕获只能一次，因为抛出错误后就不执行 try 代码，且必须在至少执行一次 next() 后，不然不会再函数内部捕获。throw 方法被捕获以后，会附带执行 try...ctach 后下一条 yield 表达式，也就是说，会附带执行一次 next 方法，并不影响下一次遍历。但是第二次执行 throw 后，无法再执行接后代码，即抛出错误不是内部捕获的话，停止执行代码。return 则是直接终结生成器，可以有一个参数，表示 value，done 也是 true。现在 next、throw、return 都是操作关键字 yeild，next 表示将 yeild 替换成方法参数，throw 表示将 yeild 替换成 throw 语句，return 替换 yeild 为 return 语句。

```js
var g = function* () {
  try {
    yield console.log("我是第 0 个");
    yield console.log("我是第一个");
    yield console.log("我是第 x 个");
  } catch (e) {
    console.log("内部捕获", e);
  }
  yield console.log("我是第二个");
  yield console.log("我是第三个");
  yield console.log("我是第四个");
  yield console.log("我是第五个");
  yield console.log("我是第六个");
};

var i = g();
i.next(); // '我是第 0 个'
i.throw("第一次出错"); // '内部捕获''第一次出错''我是第二个'
i.next(); // '我是第三个'
try {
  i.throw("第二次出错");
} catch (e) {
  console.log("外部捕获", e);
} // '外部捕获', '第二次出错'
i.next(); // 直接返回 value-done 对象
```

#### yield\*

在生成器内部调用其他生成器，一是使用 for...of 手动遍历其他生成器，一是使用 yield\* 执行生成器函数。

```js
function* f() {
  yield "xxx";
  yield "test";
}
function* f1() {
  yield "hello";
  yield* f(); // 调用生成器，并遍历迭代 类似于 for(let key of f()){ yield key}
  yield f(); // $， 返回迭代器 {value: f， done: false}
}
let iterator = f1();
iterator.next(); // {value:'hello'}
iterator.next(); // {value:'xxx'}
iterator.next(); // {value:'test'}
iterator.next(); // {value:f}
iterator.next(); // {value:undefined，done:true}
```

#### 对象属性

生成器可以作为对象的属性

```js
let obj = {
  *Generator() {},
};
let obj = {
  Generator: function* () {},
};
```

## 第八章、类和对象以及面向对象编程

对象拥有属性，属性也有属性，包括**数据属性**和**访问器属性**，

### 对象属性

#### 数据属性

有 Configurable（可否删除 delete、修改）、Enumerable（可否枚举）、Writable（可否修改）、Value，前三个默认为 true，value 默认为 undefined。数据属性存储在属性描述符对象中，需使用 Object.defineProperty 修改，使用 Object.getOwnPropertyDescriptor 查看。若使用 Object.defineProperty() **定义属性**，会将 configurable、enumerable、writable 的值设置为 false，若将 Configurable 设置为 false，不能再使用 Object.defineProperty 修改数据属性。可以使用 Object.defineProperties(obj，{property1:{},property2:{}}) 定义对象的多个属性的描述符对象。可以使用 Object.getOwnPropertyDescriptors(obj) 获取一个对象的所有属性的属性描述符，该方法会遍历对象的所有属性。

```js
let obj = {name:'lyf'}
Object.defineProperty(obj，'name',{configurable:false}) // 修改数据属性
Object.getOwnPropertyDescriptor(obj，'name') // 获取数据属性
Object.defineProperty(obj，'show',{writable:true})// 使用 defineProperty 生成的，默认将数据属性设为 false -> {value: undefined， writable: true， enumerable: false， configurable: false}
```

#### 访问器属性

有 Configurable（可否删除、修改、变为数据属性）、Enumerable（可否枚举）、Get（获取函数）、Set（设置函数）。属性是拥有数据属性还是访问器属性是根据 Object.defineProperty 设置的，默认是数据属性，若设置了 set、get 函数，则变为访问器，失去数据功能即 value 和 Writable，若设置了 writable 和 value，则变成数据属性。

#### 合并对象 Object.assign(mainObj，otherObj...)

将资源对象的属性混入目标对象，Object.assign(mainObj，otherObj...)，将其余对象中可枚举、自有属性（使用 Object.propertyIsEnumerable() 和 Object.hasOwnProperty() 检测皆返回 true）复制到目标对象。但是是浅拷贝

```js
let mainObj = {}
let otherObj = {name:''}
Object.assign(mainObj，otherObj)
// 真实步骤
// 1. otherObj.propertyIsEnumerable('name') // true
// 2. otherObj.hasOwnProperty('name') // true
// 3. Object.getOwnPropertyDescriptor(other，'name').set = Object.getOwnPropertyDescriptor(other，'name').get
```

#### 相等判定 Object.is()

用于判断两个数是否全等，接收两个参数，但参数不限制类型。若全等返回 true，不全等返回 false，可以判断边界情况，如 +-0 和 0 ，NaN 与 NaN 的全等性。

```js
Object.is(true，1) //false
Object.is(+0 ,-0) // false
Object.is(NaN ,NaN) // true
+0 === -0 // true
NaN === NaN // false
```

### 创建对象

#### 工厂函数

即调用一个函数返回一个对象，根据传入的参数不同，返回不同值的对象，缺点是创建出来的对象拥有一毛一样的属性，优点是整齐。

```js
function createObj(name，age){
    let obj = new Object()
    obj.name = name
    obj.age = age
}
let obj1 = createObj('lyf',18) // {name:'lyf',age:18}
let obj2 = createObj('zzz',10) // {name:'zzz',age:10}
```

#### 构造函数

构造函数的本质也是创建拥有一毛一样的属性的系列对象，但是使用 new 关键词实例化函数，且函数内部不用使用 new Object 创建 obj，而是使用 this 关键词赋值，也不需要 return 一个对象，因为 new 关键词帮助我们做了这些。使用 new 创建的实例拥有**proto**属性，指向原型对象，原型对象有 constructor 属性指向构造其的构造函数，可以直接简写为 obj.constructor。

```js
function CreateObj(name，age){
  this.name = name
  this.age = age
}
let obj1 = new CreateObj('lyf',18) // {name:'lyf',age:18}
let obj2 = new CreateObj('zzzz',10) // {name:'zzzz',age:10}
obj1.constructor == obj1.__proto__.constructor == CreateObj.prototype.constructor ==  CreateObj // construstor 属性
```

#### new 关键字的本质

- 将构造函数作为参数传入 new
- 创建对象：let obj = new Object()
- 该对象的 prototype 指向构造函数的 prototype
- 该对象的 this 指向构造函数的 this
- 执行构造函数代码
- 返回 obj

```js
function newFun(createFun){
    return function(){
        let obj = new Object()
        obj.__proto__ = createFun.prototype // 指向构造函数的原型对象，故构造函数原型上的属性，new 实例也可以继承
        createFun.call(obj，...arguments)
        return obj
    }
}

newFun(app)('name',10)
```

#### 原型

实例拥有 **proto** 指向构造函数的 prototype。在 625 页有详情
若自定义构造函数的 prototype 对象，设为 B，会修改实例的 constructor 指向，指向 B 的构造函数，若想指回原本的构造函数，直接设置 prototype.constructor 属性
若在构造实例后重新定义 prototype 对象，即改变 prototype 指向地址，此前的实例依然指向原本地址，会造成错误

```js
function Test() {}
let test_1 = new Test();
Test.prototype = [];
let test_2 = new Test();
test_2.constructor == Array; // true 且此时 test_1 和 test_2 指向的原型不同
Test.prototype.constructor = Test; // 修改回来
```

- 原型、实例和构造函数的关系
  每个对象都有一个**proto**属性，并且指向它的 prototype 原型对象
  每个构造函数都有一个 prototype 原型对象
  prototype 原型对象里的 constructor 指向构造函数本身

![关系](./img/proto_prototype.png)

- 属性遍历 (?)
  若想默认为不可枚举的属性，需使用 Object.defineProperty 定义 constructor 属性，对于**遍历**对象方法（keys、getOwnPropertyNames、for-in 等），遍历是**有序**的，按照属性名： 数值排序 - 字符串插入顺序（b，1,0,a -> 0,1,b，a）

- 原型相关方法与属性
  | 调用对象 | 方法 | 作用|
  | - | - | - |
  | Object | Object.create(obj)| 创建一个对象，将参数 obj 作为对象所指向的原型对象 |
  | Object | Object.setPrototypeOf(obj，prototypeObj) | 传入两个对象，将参数 2 对象作为参数 1 的原型对象 |
  | Object | Object.getPrototypeOf(obj) | 获取参数 obj 所指向的原型对象 |
  | Object | Object.keys(obj) | 返回参数 obj**自身**不包括原型对象上的可枚举属性 |
  | Object | Object.getOwnPropertyNames(obj) | 返回参数 obj 不包括原型上的所有属性，**包括不可枚举**,但是不包括 Symbol 命名的属性 |
  | Object | Object.getOwnPropertySymbols(symbol) | 一样返回参数自身不包括原型上的所有属性，不过参数是符号类型 Symbol |
  | obj | obj.hasOwnProperty(attribute) | 传入一个字符串属性，返回一个 Boolean 值，判断是**自身属性**还是原型对象上的属性 |
  | prototype | xxx.prototype.isPrototypeOf(obj) | 传一个实例对象，判断该实例是不是在原型链中 |
  | prototype | xxx.prototype.constructor | 指回构造函数 |
  | instanceof | xxx instanceof xxx | 左边是实例，右边是构造函数，判断实例的原型链中是否有该构造函数 |

```js
// 手写一个 L instanceof R 判断
function Instanceof(L，R){
    // 当检测对象是基本类型时，返回 false
    if((typeof L != 'Object' && typeof L != 'Function')|| L === null){
        return false
    }
    // 类型为基本类型时，抛出错误
    if ((typeof R !== 'object' && typeof R !== 'function')||R === null)
        throw Error("Right-hand side of instanceof is not an object")
    while(true){
        // 找到检测对象 L 指向的原型对象，判断是否与 R 相等，相等则返回 true， 不相等则往原型链后面找，直到找到 null 仍不相等，返回 false
        if(Object.getProtopeOf(L) === null){
            return false
        }
        if(Object.getProtopeOf(L) === R.prototype){
            return true
        }
        L = Object.getPrototypeOf(L)
    }
}
```

#### 对象迭代

即 Object.values、entries、keys，皆是传一个对象，返回一个数组。

### 继承

有很多语言支持接口继承和实现继承，但是 js 只能实现继承，一般通过修改原型链实现，即子类的**原型**指向父类的**实例**从而实现原型共享，或借用构造函数，即通过 apply、call 实现子类调用父类的属性、方法。就可以继承父类原型上的属性，但是父类实例属性也会继承，且若属性是引用值时，父类修改也会改变子类。原型对象指向父类实例后，子类可以覆盖父原型的函数，但是父构造函数的原型变量不受影响。若使用另一个对象覆盖继承的 prototype，则相当于不继承了，因为所指的地址修改了。JS 高级教程给出几种常见的继承方法，包括 6 种：原型链继承（new Farther）、构造函数继承（call）、组合继承（call + new Farther）、原型式继承（Fun.prototype = obj）、寄生式继承（Fun.prototype = obj + 属性）、寄生组合式继承（call + Fun.prototype = obj）等。

- 构造函数通过修改 this 指向，故使用 call、apply，即继承父类的实例属性
- 实例是通过 constructor 属性，修改子类构造函数的原型对象指向的构造函数，即修改 Son.prototype.constructor 指向

#### 原型链继承

即子类的构造函数指向父类，原型链添加父类原型对象，且实例的 son.**proto**.constructor == son.constructor

```js
function Son() {
  this.son = "son";
}
function Farther(a) {
  this.farther = "farther";
  this.a = a;
}
Farther.prototype.sayHi = function () {
  return true;
};
Son.prototype.sayHi = function () {
  // 覆盖所继承的 sayHi 方法，但是不改变父类的原型对象
  return false;
};
Son.prototype = new Farther(); // 修改子类的原型对象指向父类实例
// 右式为父类实例，因为实例会继承原型上的属性，即子类实例继承了父类实例
// 实例有属性 constructor 指向构造其的构造函数 Farther，也有__proto__属性，指向父类原型对象，
// Son.prototype.constructor == Farther ，故 son.__proto__.constructor == Farther，即 son.constructor = Farther
// Son.prototype.__proto__ == Farther.prototype ，故 son.__proto__.__proto__ == Farther.prototype
// 故严格来说， 虽然是 Son 构造 son 实例， 但 son 的 构造属性 constructor 指向 Farther ,son 的__proto__指向父类实例对象，且 Farther 的原型被添加在子类原型链中

let son = new Son();
son.sayHi(); // false
son.farther; // 'farther'，这是 farther 实例属性，但是继承了
let father = new Farther();
father.sayHi(); // true
```

#### 盗用构造函数继承

在子类构造函数中调用父类构造函数，使用 call 和 apply 以实例为上下文，则每次实例化子类实例时，将父类的实例属性和原型属性初始化到自身去了，但是不会继承父类的原型对象。

```js
function Farther() {}
function Son() {
  Farther.call(this); // 每构造一个实例，都会执行一次父类，且将属性放入本实例中
}
```

#### 组合继承

原型链和盗用构造函数结合，使用原型链继承原型上的属性和方法，而通过盗用构造函数继承实例属性。缺点是会调用两次父类函数

```js
function Farther(name){
    this.name = name
}
function Son(){
    Farther.call(this，'lyf') // 继承父类的实例属性，可以传参数实例化
}
Son.prototype = new Farther() // 原型链继承
Son.prototype.constructor = Son
```

#### 原型式继承

不再拘泥于 Farther，在函数内部定义一个工具函数，工具函数的原型对象 prototype 指向参数 obj，返回构造工具函数实例，目的是将传入参数 obj 作为原型对象。效果等同于 Object.create(obj)，但为浅拷贝。即传入同样的 obj 参数时，实例数据互通。
适用情况:对原有的 obj 进行统一操作

```js
function fun(obj) {
  function Fun() {
    this.show = true;
  }
  Fun.prototype = obj;
  return new Fun(); // 返回对象 returnObj.__proto__ = obj
}
let obj = {
  name: ["kobe"],
};
let son1 = fun(obj);
let son2 = fun(obj);
son1.name.push("james");
son2.name; // ['kobe','james']
```

#### 寄生式继承

结合原型式继承，在原型式继承的基础下，让这个对象拥有更多的功能。

```js
// 原型式继承
function fun(obj) {
  function Fun() {}
  Fun.prototype = obj;
  return new Fun();
}
function Get(obj) {
  var clone = fun(obj); // 获取原型式继承后
  clone.sayHi = function () {
    // 使用工厂模式进行增强
  };
  return clone; // 返回
}
```

#### 寄生组合式继承 - 最常用

组合继承虽然合理，但是父类构造函数在 call 和 new 中被调用了两次，且 call 已经继承了父类实例属性，new 的作用只有继承父类实例，有改进空间。
使用寄生式继承代替 new 继承父类原型，即不调用父类函数（new Farther()）,而是调用一个寄生函数，将父类函数原型放置在寄生函数原型中，本质还是有 new 调用的。
但是对于父类原型也是浅拷贝，即多个子实例可以修改共享父类原型的引用值属性。

```js
// 原型式继承
function Fun(obj){
    function fun(){}
    fun.prototype = obj
    return new fun()
}
// 利用原型式继承父类原型
function inherit(Son，Farther){
    let prototype = Fun(Farther.prototype) // 调用原型继承函数，将父类原型拷贝(just copy)放置在结果的__proto__属性上 -- prototype === fun.__proto__ === Farther.prototype
    Son.prototype = prototype // Son.prototype = fun ---> son.__proto__ = fun ---> son.__proto__.__proto__ = Farther.prototype
    prototype.constructor = Son // 解决由于重写原型导致默认 constructor 丢失的问题 --- Farther.prototype.constructor = Son
}

function son(){
    Farther.call(this) // 继承父类实例属性
}
function Farther(){this.name = ['a man']}
Farther.prototype.show = ['show me flowers']
inherit(Son，Farther)
let ccc = new son()
ccc.show.push('xxxx') // ['show me flowers','xxx']
let ddd = new son()
ddd.show // ['show me flowers','xxx']
```

### 类

ES6 的新属性，定义时有 let Class = class{} 和 class Class{}，不具备变量提升，函数使用声明式时可以变量提升。若不定义构造函数，构造函数默认为空 constructor(){}，使用 new 构造时，调用 constructor 对象，默认返回 this 对象，可以修改 return 值。其实类就是一种特殊函数，使用 typeof 检测类，返回 'function'。类也有 prototype 属性指向原型，而原型也有一个 constructor 属性指回类。

- 类构造函数和普通构造函数的区别
  使用普通构造函数时，若不使用 new 关键字，则 this 作为全局变量 window 的属性。但是不使用 new 关键字构造类时，会报错。
- 构造函数
  虽然 new 构造类实例时调用 constructor 方法，但是其并不是构造函数，而是**类本身是构造函数**，对类的构造函数进行 instanceof 操作时，返回 false

```js
class Person {}
Person.prototype.constructor == Person; // true
let p = new Person();
p instanceof Person; // true
p instanceof Person.constructor; // false
```

#### 类的成员

类中有三类成员：实例成员、原型成员、类本身的成员。一个同名属性可在类中定义 3 个不同功能的成员。成员可以是生成器和迭代器。

- 实例成员
  放置在构造函数 constructor 中，因为默认返回 this，故实例成员使用 this 关键字定义，**不会共享**，而是每次实例化时重新构造，必须使用赋值式定义，即使用 = 号赋值。

  ```js
  class Person {
    constructor() {
      this.names = ["lyf"];
    }
  }
  let p1 = new Person();
  p1.name; // ['lyf']
  let p2 = new Person();
  p2.name; // ['lyf']
  p1.name == p2.name; // false
  ```

- 原型成员
  在类中定义的属性或方法为原型成员，被每个实例共享，实例遵循先在实例成员中搜索，若没有则在原型中搜索。

  ```js
  class Person {
    sayName() {
      console.log("i am groot");
    }
    name = "lyf"; // 不能使用 : ，此符号表示对象
  }
  let p1 = new Person();
  let p2 = new Person();
  p1.sayName == p2.sayName; // true
  ```

- 类自身的成员
  类的实例没有该成员，并不能访问，此成员仅在类中存在，使用 static 为前缀，使用类名 + 成员名调用。

  ```js
  class Person {
    constructor() {
      this.sayName = function () {
        console.log("i am constructor");
      };
    }
    sayName() {
      console.log("i am prototype");
    }
    static sayName() {
      console.log("i am static");
    }
  }
  p.sayName(); // 实例成员 'i am constructor'
  Person.prototype.sayName(); // 原型成员，实例也可以访问，当实例成员找不到时 'i am prototype'
  Person.sayName(); // 只有类本身可以调用 'i am static'
  ```

- 添加成员
  可以直接在原型和类上添加成员

  ```js
  Person.name = "lyf"; // 等价于 static name = 'lyf'
  Person.prototype.name = "test"; // 等价于在类内部定义
  ```

#### 类的继承

类的出现很大目的是修改继承机制，本质依然是原型链继承。extends 关键字继承类，可以继承类的实例成员（constructor）、原型成员和自身成员（static），此时使用 instanceof 检测父类和子类，都返回 true，证明父类在原型链中。

```js
class Farther {
  constructor() {
    this.name = "nono";
  }
  sayName() {
    console.log("show me flowers");
  }
  static sayName() {
    console.log("show me flowers too");
  }
}
class Son extends Farther {
  constructor() {
    super(); // 调用父类的构造函数
    this.age = 22;
  }
}
let son = new Son();
Son.sayName(); // `show me flowers too`
son instanceof Son; // true
son instanceof Farther; // true
```

- super [Object | Function]
  super 关键字只可以在 extends 中使用，且只能在构造函数中使用函数调用 super() 或在类方法中使用对象属性调用 super.sayName()，否则报错。
  当子类有 constructor 函数时，必须先调用父类的构造函数，使用 super() 函数，可以传**参数**作为父类构造函数的参数，其将子类的 this 传入父构造函数调用后再返回。此时 this 上有父类的实例属性，然后再操作子类实例属性，以免冲突。
  当想覆盖父类的原型方法和自身属性时，直接在子类上定义一个同名同类型的方法，在函数内部通过 super 调用该方法进行覆盖。

  ```js
  class Farther {
    constructor() {
      this.name = "nono";
    }
  }
  class Son extends Farther {
    constructor() {
      super(); // 此时，this == {name:'nono'}
      console.log(this instanceof Farther); // true
      this.age = 22; // this == {name:'nono',age:22}
    }
  }
  // 静态方法
  class Farther {
    static sayName() {}
    static sayHi() {}
  }
  class Son extends Farther {
    static sayName() {
      super.sayName();
      console.log("i am son");
    }
  }
  let son = new Son();
  Son.sayName(); // 此时调用的就是子类的 sayName，但是子类中引用了父类，故也有继承
  Son.sayHi(); // 未经修改，直接调用父类的 sayHi 方法
  ```

- 抽象基类
  即父类只用来被继承，不被实例化，需使用 new.target 属性检测，new.target 表示当前作用在哪个构造函数，若不是使用 new 构造的实例，为 undefined。

  ```js
  class Person {
    constructor() {
      if (new.target == Person) {
        throw new Error("i am warng");
      }
    }
  }
  let per = new Person(); // 抛出错误
  ```

- 内置类型
  调用某些内置实例的方法会返回新实例，即子类继承父类，调用父类上的方法，仍返回一个子类实例。可以通过 Symbol.species，是一个函数，在构造实例时返回实例的类。

  ```js
  class newArray extends Array {}
  let nArray = new newArray(1, 2, 3, 4);
  let n2 = n.filter((x) => !!(x % 2)); // 调用实例的方法 filter
  n2 instanceof newArray; // 构造了一个新的 newArray 实例，仍为 true

  class newArray extends Array {
    static get [Symbol.species]() {
      return Array;
    }
  }
  let n2 = n.filter((x) => !!(x % 2));
  n2 instanceof newArray; // false
  ```

- 类混入
  若要灵活实现继承，可以使用函数，将要继承的类作为参数传入。

  ```js
  let newClass = (newclass) =>{
      class extends newclass {}
  }
  ```

## 九、代理和反射

类似于秘书，若想操作目标对象，必须通过一层代理，将操作放置在代理对象，由代理对象传达给目标函数，创建代理的关键字是 Proxy。new Proxy(target，handler) 参数 1 表示需要被代理的目标对象，对象类型不限制。参数 2 表示一个属性为函数的对象，函数表示执行操作时代理的行为，通常有 get、set 等。Proxy.prototype 是 undefined ,不能使用 instanceof 检测是否是代理实例

```js
let obj = {} // 目标对象
let p = new Proxy(obj，{
    get:function(obj，prop){// 获取对象属性时调用
        return obj.hasOwnProperty(prop) ? obj[prop] : 22
    }})
    p.a // 22
    obj.a // undefined
    obj.a = 10
    obj == p // false
    p.a // 10 此时 obj 中有此属性
    p instanceof Proxy // throw error
```

### 代理捕获器

代理捕获器以函数形式存储在构造代理实例的参数 2 中，在处理操作时触发， get() 捕获器在实例 proxy[xxx] 和 object.create[proxy](xxx) 中触发，可以传入三个参数 get(target，property，proxy)，分别是目标对象，获取的对象属性名，代理对象。在捕获器中使用 Reflect 反射，每一个捕获器都有同名称的反射 API，例如 Reflect.get(target，property，proxy).

```js
let obj = {}
let p = new Proxy(obj，{
    get(obj，prop，proxy){
        console.log(obj == obj)
        console.log(p == proxy)
    }
})
p.name // true true
```

#### 捕获器错误

当为目标对象设置了一个属性描述对象为不可操作时，此时使用捕获器修改 get 操作时，会抛出错误，类似这种不允许捕获器越界的行为称为 '捕获器不变式'

```js
let obj = {} // 目标对象
Object.defineProperty(obj，'name',{
    configurable:false，
    writable:false，
    value:'zzz'
})
let p = new Proxy(obj，{get(){
    return 'lyf' // 获取参数时，将其赋值为'lyf'
}})
p.name // throw error
```

#### 撤销代理

即中断代理和目标函数的联系，使用 Proxy.revocable() 创建代理，会返回一个对象，有属性 proxy 和 revoke，表示代理对象和撤销代理函数，撤销是不可逆的操作，不论撤销几次，都是一样会抛出错误。

```js
let obj = {name:'lyf'}
let { proxy，revoke } = new Proxy.revocable(obj，{
    get(){
        return 'xxx'
    }
})
proxy.name // 'xxx'
obj.name // 'lyf'
revoke() // 撤销代理
proxy.name // throw error
```

#### 反射 Reflect

内部有很多方法，并不是为了代理而生，下面还会有更详细的介绍

- 捕获代理，且在 Object 有对应 API

- 状态标记，即在不成功时返回布尔值，而不是 Object 抛出错误

- 代理操作符，例如 get、set、has、deleteProperty、construct

#### 代理某代理

即秘书找了一个秘书，要达到目标对象，通过层层拦截与操作。

```js
let obj = {money:100} // 老板给了 100 块
let fproxy = new Proxy(obj，{
    get(obj，prop){
        if(prop.includes('money')){
            console.log('一层代理吃了 90%回扣')
            return obj[prop]/10 // 一层代理吃了 90%回扣
        }
    }
})
let sproxy = new Proxy(fproxy，{
    get(obj，prop){
        if(prop.includes('money')){
            console.log('二层代理吃了 90%回扣')
            return obj[prop]/10 // 二层代理吃了 90%回扣
        }
    }
})
sproxy.money // '二层代理吃了 90%回扣' '一层代理吃了 90%回扣' 1
```

#### 代理的问题

一些细节，懒得看了，TODO

### 代理捕获器

基本上就是改写 Object 的方法

- get(target，property，proxy)
  对应的反射为 Reflect.get.
- set(target，property，value，proxy)
  对应的反射为 Reflect.set，返回一个布尔值，表示设置成功与否。
- has(target，property)
  对应的反射为 Relect.has()，必须返回一个布尔值
- defineProperty()
  对应的反射为 Relect.defineProperty()
- getOwnPropertyDescritor()
- getPrototypeOf()

## 十、函数

#### 声明函数的方式

- 声明式 function xxx(){}
  可以提升到顶部
- 表达式 let xxx = function(){}
- 箭头函数 let xxx = ()=>{}
  当只有一行时，默认作为 return 值，当只有一个参数时不需要括号，多个或 0 个时需要。当只有一行代码时不需要{}号
- 实例化 Function 函数 let xxx = new Function()
  所有参数都是字符串，前 n-1 个参数作为函数的参数，最后一个参数作为函数体

#### 函数属性

Function.name 属性保存函数名，箭头函数返回空字符串，new Function 创建的函数返回 'anonymous' 字符串。
Function.arguments 属性存储所有参数，是一个类数组对象，但是箭头函数没有此属性。
Function.length 属性表示参数个数
Function.prototype 属性表示实例的所有共享属性，指向原型对象
js 中函数没有重载，即同名的函数只有一个。
ES6 中支持**参数默认值**，即在定义时赋值 function sayName(name= 'lyf')，不传参时 name 默认为'lyf'，参数默认值可以将前参数默认值赋值给后面的参数，反之报错。还有可以使用**扩展操作符**传入数组

```js
function Name(name = "lyf", show = name) {}
function Name(...arr) {}
```

#### 函数内部

即在函数内部直接使用，arguments、this、和 new.target（表示是否是 new 实例化）。arguments 有一个属性 callee，指向函数，可以用来递归解耦。此外还有一个 caller 属性，这个属性引用的是调用当前函数的函数

```js
function deepcopy(obj) {
  if (
    (typeof obj.name == "object" || typeof obj.name == "function") &&
    obj.name !== null
  )
    deepcopy(obj.name); // 满足一定条件时递归，但是当函数修改名称时，内部也需跟着修改，否则报错
  arguments.callee(obj.name); // 在严格模式下报错
  test();
}
function test() {
  console.log(test.caller); // 即为 deepcopy 函数
}
arguments.callee.caller == Function.caller;
```

#### 函数方法

Function.call(thisObj，...arguments)
参数 1 为 this 指向的上下文，参数 2 ~ n 表示传给函数的参数，调用返回函数执行结果 return
Function.apply(thisObj，arguments)
参数 1 为 this 指向的上下文，参数 2 表示传给函数的参数，为一个数组，调用返回函数执行结果 return
Function.bind(thisObj，...arguments)
参数 1 为 this 指向的上下文，参数 2 ~ n 表示传给函数的参数，调用时返回一个上下文为 thisObj 的函数 B，需调用此返回值 B，且 B 仍可以传参数，排在 ...arguments 后面

```js
let obj = {name:'lfy'}
let name = 'zzz'
function testName(a，b){
    console.log(this.name，a，b)
}
testName.call(obj，10) // 'lfy' 10 undefined
testName.apply(obj，[10,20]) // 'lfy' 10 20
let testBind = testName.bind(obj，10)
testBind(20) // 等于 testName.call(obj，10,20) // 'lfy' 10 20
```

#### 尾调用

即在函数 A 尾巴进行 return 时，返回的是一个函数 B 调用，由于函数 A 结束了，故 A 先销毁并弹出栈，此时只剩一个栈帧，执行完 B，B 销毁弹出栈下，即无论调用多
少次嵌套函数，都只有一个栈帧。

- 必须有 return
- 必须在 return 中调用外部函数
- 外部函数没有其他逻辑，例如加减乘除，toString()

  ```js
  function testFun() {
    return test() + 1; // 存在其他逻辑、表达式
  }
  ```

#### 闭包

即在函数中引用了其他函数的变量，通常是嵌套函数由内部函数 B 引用外部函数 A。
函数形成上下文，上下文形成作用域链，作用域链自下往上记录当前上下文可以操作的变量，作用域上的节点构成变量对象，函数的变量对象在函数执行完毕后销毁，故称为活动对象。
因为被函数 B 引用，函数 A 在调用完毕后仍不能被回收，虽然作用域链断了，但是活动对象一直保存，需手动释放内存。

```js
function Farther() {
  let num = 10;
  return function () {
    let num_1 = num * 10;
    console.log(num_1);
  };
}
let son = Farther();
son(); // 100
son(); // 100 不论调用多少次，仍能访问到 Farther 函数的变量 num = 10
son = null; // 释放内存
```

- 闭包中的 this 指向
  this 对象会在运行时绑定到执行函数的上下文。若在全局函数中调用，则 this 为 window。如果作为某个对象的方法调用，则 this 等于这个对象。
  但嵌套函数 B 无法访问到函数 A 的 this，故若在嵌套函数中使用 this，仍访问 window，故需要将 this 赋值给 that

```js
var name = "lyf"; // 使用 let 的不会变成 window
let obj = {
  name: "kobe",
};
function Farther() {
  console.log(this.name); // this 指向上下文
  return function () {
    console.log(this.name); // this 指向 window
  };
}
obj.showName = Farther;

let son = Farther();
son(); // 'lyf' 'lyf'
let oson = obj.showName();
oson(); // 'Kobe' 'lyf' 虽是 obj 调用函数，但此时 this 仍指向 window

// 修改 this 赋值给 that
function Farther_1() {
  console.log(this.name);
  let that = this;
  return function () {
    console.log(that.name); // that 一直指向函数 A 的 this
  };
}
let obj_1 = {
  name: "kobe",
};
obj_1.showName = Farther_1;

let son_1 = Farther_1();
son_1(); // 'lyf' 'lyf'
let oson = obj_1.showName();
oson(); // 'Kobe' 'kobe'
```

#### IIFE

与之相反的是立即执行函数，即生成就调用，一般无法访问 IIFE 内部的变量，除非有意抛出

#### 私有变量和静态私有变量

私有变量包括函数参数、局部变量，以及函数内部定义的其他函数，但是又能通过闭包进行访问变成公有的，所以很 bug 啊，可以访问私有变量的公共方法叫作特权方法。
特权方法可以使用构造函数或原型模式通过自定义类型中实现，也可以使用模块模式或模块增强模式在单例对象上实现。

- 构造函数 在函数内部中定义一个全局函数，里面访问函数的私有变量
- 原型模式 在函数内部中定义一个全局函数，在函数原型上访问函数的私有变量
- 模块模式 在函数中返回一个对象字面量{},属性包含函数的私有变量
- 单例对象 创建对象，给它添加额外函数的私有变量属性或方法，将操作完的对象返回

```js
(function () {
  publish = function () {};
  function myPersonal() {
    return false;
  }
  publish.prototype.showFarther = function () {
    return myPersonal();
  };
})();

let my = new publish();
my.showFarther(); // false 原型模式 虽然可以访问函数内部的私有变量，但是放置在函数的原型对象上，即静态的
```

## 十一、期约（Promise）和异步函数

同步（sync）和异步（async），常见异步为 setTimeout，但异步有许多缺点，比如**回调地狱**。期约即 Promise，介于直接同步和异步之间，使用 new 调用，需传一个作为**执行器**的函数参数。期约有三种状态，待定（pending）、成功（fulfilled）、拒绝（rejected），最初是待定状态，一旦从待定状态脱离不可逆，且不一定能脱离待定。`new Promise((resolve，reject)=>{})` 期约状态转换通过调用**参数函数**的两个参数（resolve/reject）实现，惯例命名为 resolve 和 reject，**调用**前者期约状态自动变为成功，**调用**后者为失败。

```js
// setTimeout 的参数
setTimeout(function，delay，...arguments) // arguments 为传给 function 的参数
// promise 的参数
new Promise((resolve，reject)=>{}) // 参数为一个函数，函数参数为 resolve 和 reject，也是函数
```

- 回调地狱
  即函数调用嵌套多层，**递归**也是一种回调地狱，嵌套具有局限性，即虽然有多个函数，但后者函数就是为前者服务的，无法复原或独立，且一旦前者函数失败，则后者函数永远不会被使用。
  异步回调本身是非线性的、非顺序的，加上某环节可能会失败，导致致命问题。

#### Promise.resolve(arg)

期望的初始状态不一定非是待定（pending），可以直接创建一个状态为成功（fulfilled）的期约，与 `new Promise((resolve)=>{resolve(arg)})` 等价，参数 arg 不论传几个，只有第一个有效，作为期约的值。同理还有 Promise.reject()，但是 reject 会抛出错误。

#### 期约的实例方法

- Promise.prototype.then(onResolved，onRejected)
  返回一个新的期约实例。参数为函数，表示进入成功和拒绝状态时执行，即在 resolve 和 reject 被调用时，立即执行 then 上的参数，且 resolve 返回的值，会作为 onResolved 和 onRejected 的参数，且因为状态是互斥的，所有两函数最终必然只会执行一个。

- Promise.prototype.catch(onRejected)
  返回一个新的期约实例。参数为期约的状态为失败时执行，是 Promise.prototype.then(null，onRejected) 的语法糖。

- Promise.prototype.finally()
  返回一个期约实例。参数为函数，不论期约进入何种状态(失败/成功)都会调用

#### 非重入期约

期约在改变完状态后，回调函数并不会立即执行，而是排期，在同步程序执行完后执行，称为'非重入'。

#### 期约连锁

因为实例方法（catch/then/finally）将**返回值**封装成新的期约实例，故可以调用返回实例的实例方法（catch、then、finally），将多个期约组合连锁，若在实例方法中没有返回值，则默认返回 `undefined`。注意resolve或reject是期约还没有修改状态的参数，并不会进入到（then、catch、finally）中，故then中的参数就是return的数据，不可在then中进行再次调用resolve或reject，因为不存在，调用不存在的东西抛出错误，故实例的状态为`rejected`。

```js
let p = Promise.resolve().then(); // 也是一个期约实例
p.then();
Promise.resolve().then().then(); // 结合一式和二式
```

#### 期约合成

- Promise.all(arr)
  也是一个 Promise.resolve()，待参数 arr 中的所有期约状态变为成功后(即调用 resolve)才执行，arr 可为空数组，但不可以不传(报错)，一般也是结合 then 调用。
- Promise.race(arr)
  参数 arr 中哪一个期约最先改变状态，race 就返回该状态，变成 Promise.resolve 或 Promise.reject，arr 可为空数组，但不可以不传(报错)，一般也是结合 then 调用。

```js
let p = Promise.race([
 Promise.reject(4)，
 new Promise((resolve， reject) => setTimeout(resolve， 1000))
]);
setTimeout(console.log， 0, p); // Promise <rejected>: 4  返回一个 Promise.reject(4)
```

### 期约拓展

非 ES6 自带的，而是其他库中实现的：期约取消和进度追踪。

- 期约取消
  并不是内部取消 Promise 转变状态的过程，而是设置定时器延迟返回 resolve()，在想取消时，移除定时器。ajax 的 cancelTonken 也是返回一个 Promise 实例。

  ```js
  // 期约取消实例
  class CancelToken {
            constructor(cancelFn) {
                this.promise = new Promise((resolve， reject) => {
                    cancelFn(() => {
                        setTimeout(console.log， 0, "delay cancelled");
                        resolve();
                    }); // 为 cancelToken 点击事件绑定回调函数
                });
            }
        }
    const startButton = document.querySelector('#start');
    const cancelButton = document.querySelector('#cancel');

    function cancellableDelayedResolve(delay) {
        setTimeout(console.log， 0, "set delay");
        return new Promise((resolve， reject) => {

            // 定时器设置延时期约状态转为成功
            const id = setTimeout((() => {
                setTimeout(console.log， 0, "delayed resolve");
                resolve();
            })， delay);

            //
            const cancelToken = new CancelToken((cancelCallback) =>
                cancelButton.addEventListener("click", cancelCallback)); // 需传一个 cancelCallback 回调函数

            // 当点击取消按钮时，取消定时器 id
            cancelToken.promise.then(() => clearTimeout(id));
        });
    }

    startButton.addEventListener("click", () => cancellableDelayedResolve(2000));
  ```

  ```js
  // axios 中 cancelToken 的原理

  // 参数 executor(function) function
  // 返回 null
    function CancelToken(executor) {
        // 若传入的参数不为函数，抛出错误
        if (typeof executor !== 'function') {
            throw new TypeError('executor must be a function.');
        }

        var resolvePromise;
        this.promise = new Promise(function promiseExecutor(resolve) {
            resolvePromise = resolve; // 将改变期约的回调暴露
        });

        // 调用传入的执行器 executor ,传入的函数 cancel，到 CancelToken.source 中
        var token = this; // token.reason 取消理由，为取消的文字说明，若存在，表示已取消
        executor(function cancel(message) {
            if (token.reason) { // 当响应已取消时，进行返回
                return;
            }
            token.reason = new Cancel(message); // 将 message 作为取消信息传入
            resolvePromise(token.reason);
        });
    }

    // 参数 null
    // 返回 对象:{token:Object，cancel:function} -- function 触发 Object.promise 的 resolve
    CancelToken.source = function source() {
        var cancel;
        // 使用 new 实例化 CancelToken，token 返回一个对象，且包含 this.promise 属性
        var token = new CancelToken(function executor(c) {
            cancel = c; // function cancel
        });
        return {
            token: token，
            cancel: cancel
        };
    }

    // axios 的 cancelToken 的用法
  let cancelToken = axios.CancelToken;
  let  source = cancelToken.source() // 返回一个对象，包含 token 和 cancel 属性
  axios.post('',data，{cancelToken:source.token}) // 一个包含 promise 属性的对象
  source.cancel('取消请求'); // 调用 cancel，执行 cancel 函数，promise 期约进入成功状态，返回 token.reason

  ```

- 期约进度
  也不是获取 Promise 状态调用 resolve()转为成功的进度，而是手动给期约设置延时装置，每触发一个定时器，进度条减少，直到减为 0，才触发 resolve()，调用 notify 显示进度条

```js
    // 继承 Promise 类，修改执行器函数，使其从 (resolve，reject)=>{} 变成(resolve，reject，(status)=>{})
    class TrackablePromise extends Promise {
        constructor(executor) { // 一个函数
            const notifyHandlers = [];
            super((resolve， reject) => {// 表示 new promise 的函数
                return executor(resolve， reject， (status) => {
                    notifyHandlers.map((handler) => handler(status)); // (status)=>{} 是函数
                }); // 调用了 executor 函数
            });
            this.notifyHandlers = notifyHandlers;
        }
        notify(notifyHandler) {
            this.notifyHandlers.push(notifyHandler);
            return this;
        }
    }

    //
    let p = new TrackablePromise((resolve， reject， notify) => { // 实例传了一个函数
        function countdown(x) { // 函数
            if (x > 0) {
                notify(`${20 * x}% remaining`); // 调用参数 3 notify()  表示进度条 100% 80% 60% 40% 20% 0%
                setTimeout(() => countdown(x - 1)， 1000); // 不断减少进度条
            } else {
                resolve(); // 当进度条加载完毕后，期约的状态为成功，resolve 也是参数
            }
        }
        countdown(5);
    });
    // p.notify((x) => setTimeout(console.log， 0, 'progress:', x)); // 参数函数作为 notifyHandlers 的项
    // p.notify((x) => setTimeout(console.log， 0, 'progress@:', x)); // 作为 notifyHandlers 项
    // p.then(() => setTimeout(console.log， 0, 'completed')); // 完毕后跳出
    // p.notify((x) => setTimeout(console.log， 0, 'a:', x))
    //     .notify((x) => setTimeout(console.log， 0, 'b:', x));
    // p.then(() => setTimeout(console.log， 0, 'completed'));
```

#### 期约源码解析

```js
// Promise(fn) -> fn(f1,f2) -> 外部调用 res() 等同于内部调用f1 -> f1调用内部的 res() 
function Promise(fn) {
  if (typeof this !== 'object') // 抛出错误
  if (typeof fn !== 'function') // 抛出错误
  doResolve(fn, this); // 此处调用
}
Promise.prototype.then = function(onFulfilled, onRejected) {
  if (this.constructor !== Promise) {
    return safeThen(this, onFulfilled, onRejected);
  }
  var res = new Promise(noop);
  handle(this, new Handler(onFulfilled, onRejected, res));
  return res;
};
function doResolve(fn, promise) {
  var res = tryCallTwo(fn, function (value) { // tryCallTwo(fn, a, b) 调用 fn(a,b)
    resolve(promise, value);
  }, function (reason) {
    reject(promise, reason);
  });
}
function resolve(self, newValue) { // 调用 res(1) 时内部触发 resolve(this,1)
  if (
    newValue &&
    (typeof newValue === 'object' || typeof newValue === 'function')
  ) {
    var then = getThen(newValue);
    if (
      then === self.then &&
      newValue instanceof Promise
    ) {
      self._state = 3;
      self._value = newValue;
      finale(self);
      return;
    } else if (typeof then === 'function') {
      doResolve(then.bind(newValue), self);
      return;
    }
  }
  self._state = 1;
  self._value = newValue;
  finale(self);
}
function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  if (Promise._onReject) {
    Promise._onReject(self, newValue);
  }
  finale(self);
}
```

### 异步函数

即使用 async/await 声明的函数，称为异步函数。

#### async

在函数声明前加入关键字，函数内部的普通代码是同步的，按顺序执行，但无论有没有返回语句，皆返回一个 Promise 实例，且状态为 resolve.

```js
async function Test() {}
let Test = async function () {};
let Test = async () => {};

async function Test() {
  console.log(1);
}
let tt = Test();
console.log(2);
// 1 2 tt:Promise
```

#### await

await 只能在异步函数中使用，遇到 await 时 async 函数暂停执行，await 后可以接一个表达式/变量，将其当做是 Promise.resolve(表达式/变量)，等待函数外部同步代码执行完毕后，才执行 await，若 await 等来一个状态为成功的期约，继续执行异步函数剩余代码，因为 await 也可以接一个 Promise.reject(arg)，此时停止执行剩余代码，并将失败状态的期约返回

```js
async function testAsync() {
  console.log(1);
  let a = await 2;
  console.log(a);
  let b = await Promise.resolve(3);
  console.log(b);
  let c = await Promise.reject(4);
  console.log(c);
  console.log(5);
}
testAsync().then(console.log).catch(console.log); // 在 let c 中抛出一个失败状态的期约，若 testAsync 完整执行，触发 then，参数为 return 的变量，若无则为 undefined
console.log(6);
// 1 6 2 3 4

async function foo() {
  console.log(await Promise.resolve("foo"));
}
async function bar() {
  console.log(await "bar");
}
foo();
bar();
// 'bar' 'foo'
```

- 平行执行 await
  必须等到表达式完成才 await，期间堵塞后续代码，若有多个异步的 await 时，等待时间是叠加的，即第一个 await 等待时间 1,第二个 await 等待时间为 1+2,可先执行异步，将结果放置在 await 中。

  ```js
  let a = await test(1); // 若等待时间为 3000ms，后续代码被阻塞
  let b = await test(2); // 自 3000ms 开始，执行自身的等待 2000ms

  let a = test(1); // 3000ms 后得到答案
  let b = test(2); // 2000ms 后得到答案，此时 b 比 a 快
  let aa = await a;
  let bb = await b;
  ```

- 栈追踪和内存
  在使用期约时，js 引擎会尽可能保留完整的调用栈，而异步函数则会完整返回当前的调用栈。

## 十二、BOM(浏览器对象模型 Browser Object Model)

介绍了几个浏览器对象，window 中视口表示页面，窗口表示浏览器。

### window 对象

为浏览器实例，内部的全局方法调用时可以省略 window. 前缀，例如 window.parseInt == parseInt，作为 ECMAScript 的 Global 对象，使用 var 声明的变量，会被提升到 window 对象中。window 常用来操作浏览器窗口，还有一些工具属性/方法(定时器)，还有弹出对话框

#### 窗口关系(窗口与窗口)

- top 对象
  表示最上层窗口，即浏览器本身，故 top == window

- parent 对象
  表示当前窗口的父窗口，若当前窗口就是最上层窗口 top == parent

- self 对象
  指向 window 对象，即 self == window

#### 窗口位置(窗口与屏幕)

- window.screenLeft/screenTop
  属性，返回当前浏览器离屏幕的距离

- window.moveTo(x，y)/moveBy(x，y)
  moveTo 表示窗口移动到坐标(x，y)，但好像没有用。moveBy 表示相对于当前位置，窗口移动 xy 距离，正负代表上下左右

- window.devicePixelRatio 像素比
  物理像素(DP，设备像素，device pixels)，屏幕是由一个个小的像素块组成的，控制像素块颜色可以出现图像和动画，但是每个小像素块的大小和个数都是物理固定的。css 像素是一个相对的长度单位，在同一个设备/不同的设备中，1px 所代表的物理像素是变化的，例如分辨率高的，一个物理像素小，需多占几个物理像素，分辨率低的，少占几个物理像素，最终显示的大小一样，但是清晰度会有所不同。控制像素比的属性为 window.devicePixelRatio，表示物理像素与逻辑像素之间的缩放系数。

#### 窗口大小

- screen.width/height
  表示屏幕分辨率，不会变

- innerWidth/innerHeight
  当前可视窗口(即页面)的大小，若工具栏遮挡，也改变大小

- outerWidth/outerHeight
  返回浏览器窗口自身大小

- document.documentElement.clientWidth
  同样返回可视窗口的大小，若工具栏遮挡，也改变大小

  - document.documentElement.clientWidth 和 innerWidth 的区别
  - 前者属于 DOM，后者属于 BOM
  - 前者不包括滚动条宽度，后者包括滚动条宽度，故后者 = 前者 || 前者+17px(滚动条宽度)

- window.resizeTo(x，y)/resizeBy(x，y)
  方法，前者表示将窗口缩放到 x-y 大小，后者表示基于当前宽高，调整 x-y

#### 视口位置(页面与窗口)

- window.pageXoffset/pageYoffset 和 window.scrollX/scrollY
  表示滚动距离，即现在显示的最顶端离页面最顶端的距离，二者相等

- window.scrollBy(x，y)/scrollTo(x，y)/scroll(x，y)
  方法，前者表示基于当前坐标滚动 x-y 距离，后两者表示滚动到某坐标。三个方法参数可替换为一个对象，属性为 left/top/behavior，其中 behavior 表示移动效果，值为 auto(自动)/smooth(匀速)

```js
window.scroll({
  left: 100, // 离左端 100px
  top: 100, // 离顶端 100px
  behavior: smooth, // 匀速
});
```

| window 属性                          | 概念                     |
| ------------------------------------ | ------------------------ |
| window.screenLeft/screenRight        | 窗口距离屏幕左顶点的距离 |
| screen.width/height                  | 屏幕分辨率               |
| window.innerWidth/innerHeight        | 视口大小                 |
| document.documentElement.clientWidth | 视口大小                 |
| window.outerWidth/outerHeight        | 窗口大小                 |
| window.pageXOffset/pageYOffset       | 视口滚动距离             |

| window 方法                                           | 概念                                       |
| ----------------------------------------------------- | ------------------------------------------ |
| window.moveTo(x，y)                                   | 将窗口移动到离屏幕的 x-y 坐标              |
| window.moveBy(x，y)                                   | 基于现在坐标水平移动 x，垂直移动 y         |
| window.resizeTo(x，y)                                 | 将窗口缩放到 x-y 大小                      |
| window.resizeBy(x，y)                                 | 基于窗口大小，将窗口水平缩放 x，垂直缩放 y |
| window.scroll(x.y)/scroll({left:,right:,behavior:})   | 滚动到 left/right 坐标                     |
| window.scrollTo(x.y)/scrollTo({left:,top:,behavior:}) | 滚动到 left/top 坐标                       |
| window.scrollBy(x.y)/scrollBy({left:,top:,behavior:}) | 向下滚动 top 位置，向左滚动到 left 位置    |

#### 导航与打开新窗口

- window.open(url，targetWindow，data，isReplaceNowPage)
  返回一个 window 对象，这个 window 指向被打开的浏览器，所有方法也通用。可以使用 window.close()关闭
  - url url 地址，为地址字符串
  - targetWindow 为窗口名字字符串，所指向的 url 将会在此窗口打开(等同于 a 标签的 target，可为 frame 标签，可选项也相同，比如\_self、\_parent、\_top 或\_blank。)，若不存在这样的窗口，则新打开一个窗口，并将窗口命名为 targetWindow
  - data 字符串，形如'attributes_1=xxx，attributes_2=xxx，attributes_3=xxx',当 url 在新窗口打开时有效，常用属性值如下表
    | 属性 | 值 | 说明 |
    | height/width | 数值 | 新窗高度/宽度 |
    | left/top | 数值 | 窗口距离屏幕的 x-y 坐标，非负 |
    | resizeable | yes/no | 是否可以改变窗口大小，接下来都好像没啥用 |
    | Menubar | yes/no | 是否显示菜单栏 |
    | scrollbars | yes/no | 是否显示滚动栏 |
    | status | yes/no | 是否显示状态栏 |
    | toolbar | yes/no | 是否显示工具栏 |

```js
<a href="http://www.baidu.com" target="myFrame" /> ==
  window.open("http://www.baidu.com", "myFrame");
```

#### 系统对话框

无关视口和 html，是浏览器自带的，常用的有 alert(mes)、confirm(mes)、prompt(mes).
alert(mes)只接收一个参数，在警告框中显示，只有一个确认按钮。
confirm(mes)为确认框，有取消和确认两个选项，根据选择返回 true/false.
prompt(mes，input)为提示框，mes 为文字提示，参数 2 input 表示在输入框中的默认值，可不传，为空字符串，点击确认时将文本框内的值返回，点击取消时返回 null

### location 对象

即是 window 对象的属性，也是 document 对象的属性，即 window.location == document.location。location 对象保存了当前文档的信息，也保存了当前页面 URL 的信息。

- 解析 URL 字符串
  协议://用户名:密码@域名:端口/路径?查询参数#锚点
  protocol://username:password@host:port/path?query#hash
  对于例子:'http://foouser:barpassword@www.wrox.com:80/WileyCDA/?q=javascript#contents'，location 可以找出所有信息。

| location 的 url 属性 | 作用                               |
| -------------------- | ---------------------------------- |
| location.hash        | 锚点，用于定位页面，'#contents'    |
| location.host        | 服务器和端口名， 'www.wrox.com:80' |
| location.hostname    | 服务器名， 'www.wrox.com'          |
| location.href        | 完整 url                           |
| location.pathname    | 路径名称，'/WileyCDA/'             |
| location.port        | 端口名，'80'                       |
| location.protocol    | 协议名，'http:'                    |
| location.search      | 查询参数，'?q=javascript'          |
| location.username    | 域名钱的用户名，'foouser'          |
| location.password    | 域名前的密码，'barpassword'        |
| location.origin      | 源地址，'http://www.wrox.com'      |

#### 查询字符串解析

使用 location.search 获取的字符串形如:qs = '?name=value&name=value',可以实例化 URLSearchParams(qs)方法解析查询字符串，返回一个实例，有 toString/get/set/delete 等方法

```js
let qs = "?name=lyf&age=18&height=165";
let search = new URLSearchParams(qs);
search.toString(); // '?name=lyf&age=18&height=165'
serach.get("name"); // 'name'
search.set("grade", "2");
search.toString(); // '?name=lyf&age=18&height=165&grade=2'
search.delete("age"); // '?name=lyf&height=165&grade=2'
```

#### 操作地址

设置 window.location、location.href 和调用 location.assign(url)，都可以修改当前浏览器的地址，并可在历史记录中回退

### navigator 对象

用来了解当前浏览器，不是 window 位置向，而是硬件数值上。

### screen 对象

屏幕数据

### history 对象

查询导航历史，并进行前进后退。

- history.go(num)
  表示基于当前页面，前进/后退 num 页，前进后退取决于 num 的正负
- history.back(num)
  表示回退 num 页
- history.forward(num)
  表示前进 num 页

#### 历史状态管理

改变 url 地址，默认去到新页面，触发 hashchange 事件，修改页面信息。执行 pushState()方法后，新的状态信息会被加入到历史状态栈中，浏览器地址栏也会改变，但浏览器并不会真的向服务器发送请求，除了 location 相关属性依赖于 url，故会修改。

- history.pushState(stateObj，title，url)
  - stateObj 状态对象
  - title 新页面的标题，现在也无法实现
  - url 修改端口后的路径

## 十三、客户端检测

检测当前页面所处在什么类型的浏览器中，因为不同浏览器的能力不同。能力检测使用函数差异检测，例如判断是否有函数 XMLHttpRequest，就能知道是不是 IE8 以下。用户代理检测为，用户代理字符串在请求 url 的 http 中，可通过 navigator.userAgent 获取。服务器判断用户代理字段确认浏览器，但有可能被浏览器欺骗。

## 十四、DOM(文档对象模型)

DOM 由节点构成的层级结构，类似于一颗树，通常为 HTML 和 XML 文档。document 表示文档的根节点，其包含一个子节点，在 html 中为标签 <html> ,称为文档元素，一个文档只有一个文档元素。

### Node 类型

文档中任意节点都有 Node 类型的特性，即拥有 Node 属性。someNode.nodeType 表示节点类型，为一个常数（1-12），与 Node.ELEMENT_NODE 等属性相对应、nodeName 表示节点名称、nodeValue 表示节点信息，一般来说元素节点该属性为 null.

```js
(divNode.nodeType == 1) == Node.ELEMENT_NODE;
divNode.nodeName == "DIV";
```

#### 节点关系

一般是父子、兄弟，获取一个节点的子节点集使用 childNodes，返回一个有 length 属性的类数组，可以使用 item(index)和[index]的形式访问子节点。获取一个节点的父节点使用 parentNode.获取兄弟节点使用 nextSibling 和 previousSibling，当自己作为兄长时，previousSibling 为 null，当自己作为幼弟时，nextSibling 为 null.当父节点想要获取大儿子和小儿子时，使用 firstChild 和 lastChild.

```js
let childs = divNode.childNodes;
childs[0] == childs.item(0);
childs.length;
childs[0].parentNode == divNode;
```

#### 操纵节点

即每个节点的属性方法，someNode.xxx()。也就是节点的增删改查，一般操作的是某个节点的子节点，将新节点作为参数传入方法中。appendChild(newNode)、removeChild(newNode)、replaceChild(newNode)、insertBefore(newNode)。还有两个较少使用的方法 cloneNode()，传入一个 Boolean 值参数，表示是否深克隆节点。和 normalize()，操作后代节点中的文本节点，文本节点为空时，进行移除。

### Documnet 类型

指代整体页面，其中一个子节点表示 html 标签，使用 document.documentElement 获取。另一个虽不是子节点，但也可以直接获取，document.body 表示 body 标签。

#### 常见属性

### Element 类型

元素节点

### Text 类型

文本节点

```js
let comment = document.createTextNode("A comment"); // 创建注释节点
```

### Comment 类型

注释节点， <!--  -->

```js
let comment = document.createComment("A comment"); // 创建注释节点
```

### DocumentFragment 类型

虚拟仓库，可用于暂时放置节点，避免多次渲染页面

```js
let fragment = document.createDocumentFragment(); // 创建 DocumentFragment 节点
```

### DocumentType

和 doctype 有关，<!DOCTYPE html>

### 动态创建

### MutationObserver 接口

变化观察者，即 DOM 变化时，进行回调

#### Mutation events

即 MutationsObserver 的前身，为每个节点的一些公共事件，事件列表包括 DOMAttrModified、DOMAttributeNameChanged、DOMCharacterDataModified、DOMElementNameChanged、DOMNodeInserted、DOMNodeRemoved、DOMNodeInsertedIntoDocument、DOMSubtreeModified，常用的事件为 DOMNodeRemoved，DOMNodeInserted 和 DOMSubtreeModified。分别用于 监听元素子项的删除，新增，修改(包括删除和新增。但由于 IE 兼容，部分属性在浏览器上不兼容，且有性能问题

- 1.Mutation Events 是同步执行的，它的每次调用，都需要从事件队列中取出事件，执行，然后事件队列中移除，期间需要移动队列元素。如果事件触发的较为频繁的话，每一次都需要执行上面的这些步骤，那么浏览器会被拖慢。
- 2.Mutation Events 本身是事件，所以捕获是采用的是事件冒泡的形式，如果冒泡捕获期间又触发了其他的 MutationEvents 的话，很有可能就会导致阻塞 Javascript 线程，甚至导致浏览器崩溃。

```js
document.getElementById("list").addEventListener(
  "DOMSubtreeModified",
  function () {
    console.log("列表中子元素被修改");
  },
  false
);
```

#### MutationObserver 使用

- 构造 mutation observer 实例
  使用 new 构造观察者实例，参数为回调函数，回调函数有两个参数，参数 1 表示变化记录数组,数组中的每一项都是 MutationRecord 实例，参数 2 为观察者本身
- 调用实例的 observer.observe(node,config)
  初始化的观察者没有监听功能,需调用 observe 方法挂载元素,一个实例可以观察多个元素,指向一个地址但变量名不同的元素发生变化时也会触发观察者,对同一个元素进行多次监听会进行覆盖,若节点被操作后没有变化也会触发观察者事件,即多次实行同样操作,也都会记录在变化记录数组中。
  参数 1 为元素节点，参数 2 为观察者属性对象，即表明哪些情况需要监听,参数都是必需的。
  *childLIst 新增和删除子节点，是否观察
  *attributes 新增或删除了某属性，是否观察
  characterData 如果目标节点为 characterData 节点(一种抽象接口，具体可以为文本节点，注释节点，以及处理指令节点)时，是否观察
  \*subtree 子树上所有变化，是否变化观察
  attributeOldValue 在 attributes 属性已经设为 true 的前提下， 监听时是否记录旧属性值(记录到 MutationRecord 的 oldValue 属性中)
  characterDataOldValue 在 characterData 属性已经设为 true 的前提下，监听时是否记录旧属性值(记录到 MutationRecord 的 oldValue 属性中)
  attributeFilter 属性名数组,只有该数组中包含的属性名发生变化时才会被观察到
- 停止观察
  调用观察者的 disconnect() 方法取消观察元素,再次开启调用 observe 方法

```js
let div = document.getElementById("test");
let testDiv = document.getElementById("test"); // 指向同一个元素
let callback = function (mutations, itself) {
  console.log(mutations);
  // mutations.forEach(item=>{
  //     console.log(item.type)
  // })
};
var config = { attributes: true, childList: true, characterData: true }; // 这三者必须有一个为 true,否则报错
let observer = new MutationObserver(callback); // 回调函数
observer.observe(div, config); // 监听 div
testDiv.setAttributes("foo", "bar"); // 虽没有监听`testDiv`但是指向同一元素的变量`div`被监听,故会触发观察者事件
observer.observe(div, { attributes: true, childList: true }); // 新的监听覆盖旧的监听
testDiv.setAttributes("foo", "bar"); // 此时没有触发回调
observer.disconnrct(); // 停止监听 div
```

#### 观察者观察范围

若设置观察属性对象的所有属性为 true,观察可观察的事件有

- 节点属性
  attributes 属性设置为 true，
- 观察字符数据
  characterData 属性设置为 true,即节点的字符增删改,例如 Text,Comment 字符。
- 观察子节点
  childList 属性设置为 true,即子节点的增删
- 观察子树
  subtree 属性设置为 true,即所有后代节点及上面的增删改查

#### 异步回调和执行队列

执行顺序是:同步代码 > 观察者前的微任务 > 观察者 > 观察者后的微任务 > 宏任务

```js
setTimeOut(() => {
  console.log(3);
}, 0);
Promise.resolve(1).then((res) => {
  console.log(res);
});
testDiv.setAttribute("foo", "1");
Promise.resolve(2).then((res) => {
  console.log(2);
});
console.log(0);
// 0 1 [MutationRecord] 2 3
```

- takeRecords()
  用于清空变化者记录队列,若该方法是同步的,会在作为微任务的 callback 事件之前,调用时返回变化者记录数组

  ```js
  testDiv.setAttribute("foo", "1");
  testDiv.setAttribute("foo", "1");
  testDiv.setAttribute("foo", "1");
  observer.takeRecords(); // 返回 [MutationRecord,MutationRecord,MutationRecord] 并且清空,则上面的监听无效
  observer.takeRecords(); // []
  ```

## DOM 扩展

### Selectors API

通过 CSS 进行查询,常见的方法是 querySelector() 和 querySelectorAll(),前者获取首个匹配,后者获取所有匹配,若没有匹配就返回 null,可以传类选择器、id 选择器、标签选择器

### getElementBy 和 querySelector 的区别

getElementBy 拿到的是 HTMLCollection 数组,是进行浅拷贝，querySelector 拿到的 NodeList 数组,且是进行深拷贝，但是数组中的元素都是 dom 对象。当动态的添加元素时，querySelector 仍然只能拿到 n 个，但 getElementBy 能拿到 n+1 个，但就已获取的元素中，修改元素的属性两者都能体现，因为操作的都是 dom 对象

```js
let g_div = $('.div') != document.getElementsByClassName('div')
let q_div = $('.div').[0] == document.getElementsByClassName['div'](0)
// 再添加一个选择器为 `.div` 的元素
let test = document.createElement('div')
test.setAttribute('class','.div')
document.appendChild(test)
q_div.length // 不变
g_div.length // +1
```

- 效率问题
  因为 querySelector 进行的是深拷贝,故效率没有 getElementBy 好,但是方便,因为不论传何种选择器都可以找到相应匹配项。

- div.matches(css selector)
  传入一个 css 选择器，判断该节点是否有该选择器，有返回 true，无返回 false

### 元素遍历

因为 firstChild 等方法将空白文本节点当做子节点，故 DOM 推出获取元素节点的方法

- firstElementChild
- lastElementChild
- childElementCount
- previousElementSibling
- nextElementSibling

### HTML5

#### CSS 拓展

添加了 getElementsByClassName 方法。添加了 classList 属性替代 className 属性，包含 add、remove、toggle、contains 方法操作选择器。

#### 焦点管理

document.activeElement 获取当前处于焦点的元素，加载好的页面默认焦点元素是 body。当点击输入框、a 链接时，切换焦点元素。document.hasFocus() 返回当前文档是否是焦点，切换焦点通过点击当前文档和点击其他地方

```js
setTimeout(() => {
  if (document.hasFocus()) {
    console.log(true); // 操作页面时
  } else {
    console.log(false); // 不在页面时
  }
}, 3000);
```

#### HTMLDocument

即额外的 document 属性

- readyState 属性
  获取浏览器状态，有四个值 uninitialized 表示还未开始载入、loading 表示载入中、interactive 表示已加载文档与用户可以开始交互、complete 表示载入完成

- compatMode 属性
  获取当前的文档模式（标准模式和混杂模式），标准模式下 document.compatMode 的值是"CSS1Compat"，而在混杂模式下，document.compatMode 的值是"BackCompat"：

- head 属性
  之前只有 document.body，现在新增 document.head 获取 head 标签

- characterSet
  字符集属性，可以修改，一般常为 `UTF-8`

- dataset
  dataset 属性返回一个 DOMStringMap 实例，包含所有使用 data-作为前缀的属性

- 插入标记
  - innerHTML
    节点的所有子节点，包含字符串和标签和空白
  - outerHTML
    相当于 innerHTML + 自身
  - insertAdjacentHTML(where,div) 和 insertAdjacentText(where,div)
    插入元素节点或文本节点，参数 where 表示插入节点的位置，`beforebegin`表示当前节点前、`afterbegin`表示第一个子节点前，`beforeend`表示最后一个子节点前，`afterend`表示当前节点后。div 表示一个节点字符串，不能传一个 DOM 节点，因为是修改节点的 innerHTML，即字符串，会将 DOM 节点解析为字符串，形如`[object HTMLDivElement]`
- 内存与性能
  移除节点并不会将节点相关的事件移除，造成内存泄漏，需手动移除。

- scrollIntoView(config)
  滚动浏览器窗口至 调用此方法的元素 进入视口。config 为空时，默认将元素顶端与视口最顶端对齐；config 为 Boolean 值时，true 表示元素顶端与视口最顶端对齐，false 表示元素底端与视口最底端对齐。config 为一个对象时，有三个属性：behavior 定义过渡动画，可取值为"smooth"和"auto"，默认为"auto"，即直接跳转，'smooth'则是平缓的移动窗口；
  block 定义垂直方向的对齐，可选值为"start"（顶对顶）、"center"（中对中）、"end"（底对底）和"nearest"（没出现就出现，故底对底，因为底对底刚出现），默认为 "start"；
  inline 定义水平方向的对齐，可取值为"start"、"center"、"end"和"nearest"，默认为 "nearest"，但是水平滚动条较少，故常常没有效果；

#### 专有扩展

- children 属性
  获取节点的所有元素节点，返回 HTMLCollection 实例，

  - children 与 childNodes 差别
    childNodes 属性返回所有的节点，包括文本节点、注释节点；children 属性只返回元素节点；
    childNodes 返回 HTMLCollection 实例，children 返回 NodeList 实例；

    ```js
    $0.childNodes; // NodeList(3) [li, text, li]
    $0.children; // HTMLCollection(2) [li, li]
    ```

- contains(div) 属性
  传入一个节点，若调用节点的后代包含 div，返回 true，否则返回 false。

- innerText 和 outerText 属性
  innerText 返回所有文本，包括后代中所有文本，赋值时替换节点所有内容变成一个 text 节点。outerText 取值类似，但是赋值会将节点本身也覆盖。

  ```js
  div>
    i am farther
    p> i am son
  $0.innerText // 'i am farther\ni am son'
  $0.innerText = 'new' // div>new
  $0.innerText == $0.outerText // true
  $0.outerText = 'new' // new // div不见了
  ```

## 十六、DOM2和DOM3

DOM1 定义html结构，DOM2和DOM3提升交互能力

### DOM的演进

#### XML命名空间

用于混入不同XML语言。引入规则是 :xmlns:name="url"，其中name表示命名空间，url表示语言地址，使用命名空间的段落，标签名都需要name作为前缀。

```html
<xhtml:html xmlns:xhtml=""> //命名空间为 `xhtml`
  <xhtml:head>
    <xhtml:body>
<xhtml:html>
```

#### 其他演变

- documentType
增加三个属性，publiId systemId internalSubset，分别对应doctype的三个信息。
- document
新增document.importNode(node,boolean)用于导入其他文档的节点，参数2表示是否引入该节点的后代
新增document.implementation.creatHtmlDocument(title)创建一个完整的HTML文档，title表示文档的标题。
新增node.isSameNode(node)node.isEqualNode(node)方法，用于比较两节点，但是前者表示相同，后者表示相等，有元素虽相等但不相同，相等表示外表，相同表示本质。

### 样式

节点新增style属性，为一个对象，包含元素的所有css属性，对于横杠链接的属性，改用大驼峰，例如background-color 变成backgroundColor。

#### 元素尺寸

- 偏移尺寸
包含 offsetHeight、offsetTop、offsetLeft、offsetWidth，表示元素距页面视口的左顶点的距离。
- 客户端尺寸
包含 clientWidth、clientHeight，不包含border。
- 滚动尺寸
包含scrollHeight、scrollWidth表示页面真实宽高，scrollLeft和scrollTop表示页面隐藏的宽高，即滚动距离，若页面小于浏览器视口，则scrollHeight == clientHeight

### 遍历

遍历一颗节点树。

### 范围

## 十七、事件

### 事件流

事件分为三个阶段，分别是捕获阶段，即从document一步步深入到目标元素、事件处理，即在目标元素上进行事件处理、冒泡阶段，即目标元素向上到最外层的document。

### 事件处理程序

- html属性处理
响应程序有两个特殊属性，函数中this表示触发事件的元素（但是我打印出来是window），参数event表示事件本身。

```js
<div onclick="console.log(true)"> // 行内
<div onclick="clickHandle(event)"> // 调用脚本，event不可使用其他名称
```
