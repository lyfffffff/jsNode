// 测试JSON.stringify
function testJSONStringify(){
    const target = { a: 1, b: 2 };
    const source = { b: 4, c: 5 };
    const obj = {
    name: function () {// 丢失
    target.a = 2;
    },
    name:1,
    age:18
    };
    let _obj = JSON.stringify(obj);

    console.log(_obj);
}
// 测试JSON.stringify的参数
function testJSONStringifyParams(){
    var data = {
        info:{
            age:18,
            sex:"male"
        },
        name:"niuzai",
    };
    
    JSON.stringify(data, function(key, val){// 过滤函数一层层遍历属性，第一层是整个对象
        console.log("key is %s", key);
        console.log("val is %s", typeof(val));
        return val
    });
}

testJSONStringify()
testJSONStringifyParams()