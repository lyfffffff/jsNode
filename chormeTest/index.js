red = document.querySelector('.red')
yellow = document.querySelector('.yellow')

// 修改长度
function changeHeight(){
    red.style.height = parseInt(red.offsetHeight)+50+'px'
}

// 点击按钮时，red方块的长度增加50px
red.addEventListener('click',clickEvent2)



// 1.直接调用
function clickEvent1(){
    // 调用一次和多次的区别
    changeHeight()
    // changeHeight()
}

// 2.微任务调用
function clickEvent2(){
    new Promise(res=>{
        res(true)
    }).then(changeHeight)
}

// 3.宏任务
function clickEvent3(){
    setTimeout(()=>{
        new Promise(res=>{
            res(true)
        }).then(changeHeight)
        changeHeight()
    })
}



