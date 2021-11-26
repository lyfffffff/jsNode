// 测试JSON.stringify
function testJSONStringify() {
  const target = { a: 1, b: 2 };
  const source = { b: 4, c: 5 };
  const obj = {
    name: function () {
      // 丢失
      target.a = 2;
    },
    name: 1,
    age: 18,
  };
  let _obj = JSON.stringify(obj);

  console.log(_obj);
}

// 测试JSON.stringify的参数
function testJSONStringifyParams() {
  var data = {
    info: {
      age: 18,
      sex: "male",
    },
    name: "niuzai",
  };

  JSON.stringify(data, function (key, val) {
    // 过滤函数一层层遍历属性，第一层是整个对象
    console.log("key is %s", key);
    console.log("val is %s", typeof val);
    return val;
  });
}

// 数组过滤 过滤出合法的属性（id）数组
function filterIdArr() {
  let list = [];
  for (let i = 0; i < 20; i++) {
    list.push({ id: i, status: i % 5 });
  }
  let arr = [2, 5, 7, 8, 9, 17, 18, 12];
  console.log(list);
  console.log(arr);
  let result = arr.filter((id) => {
    let item = list.find((item) => item.id == id);
    return !(item.status == 3 || item.status == 4);
  });
  console.log(result);
}

// 数组过滤 过滤出合法的list数组
function filterList() {
  let list = [];
  for (let i = 0; i < 20; i++) {
    list.push({ id: i, status: i % 5 });
  }

  let arr = [2, 5, 7, 8, 9, 17, 18, 12];
  let result = list.filter((listitem) => {
    if (arr.some((item) => listitem.id == item)) {
      return listitem.status < 3;
    }
  });

  let result_1 = [];
  arr.forEach((id) => {
    let item = list.find((item) => item.id == id);
    item.status < 3 && result_1.push(item);
  });

  console.log(result);
  console.log(result_1);
}

// 私有属性的类
// class Foo {
//     #a;
//     #b;
//     #sum() { return this.#a + this.#b; }
//     printSum() { console.log(this.#sum()); }
//     constructor(a, b) { this.#a = +a; this.#b = +b; }
//   }

// testJSONStringify()
// testJSONStringifyParams()

filterIdArr();
filterList();

