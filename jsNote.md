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

- Number数据类型
支持十进制、十六进制（0x开头）、八进制（0开头，后面数字不大于7）、浮点值。拥有最大值（Number.MAX_VALUE）和最小值（Number.MIN_VALUE），超过则为+-infinity，对于本该是数字但不是数字的表示为NaN，例如：分母为+-0，式子包含NaN等，但是每个NaN都互不相等

-

```js
NaN == NaN // false
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
