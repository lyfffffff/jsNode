# css
#### %百分比的使用
- ``width/height``
  基于父元素。对于一些需要占满的元素，例如nav、footer，直接设置``width:100%``，当父元素也没有设置具体高度时，此时子元素就算设置了百分比高度仍会变成auto。故在使用百分比时，同一个选择器控制的元素样式可能会不同，因为他们的父元素宽高不同。对于父元素也设置百分比的元素，依然是按照父元素的百分比计算，即和爷爷也有百分比关系
  ```css
  .grandpa {
      width:100px;
  }
  .father {
      with:50%;//100 * 0.5 = 50px
  }
  .son{
      width:50%;//50px * 0.5 = 25px 
  }
  ```
- ``left/right/top/bottom``
  基于父元素。对于一些左右布局，可以使用 ``position：left:50%`` 加 ``margin-left`` 偏移
- ``transform: translateX(-50%)``
- ``margin/padding``
  ``left/right/top/right`` 都是基于父元素宽度，和**父元素高度**没有关系
  ```html
  .father {
    width: 200px;
    height: 100px;
    border: 1px solid #000;
  }
  .son {
    width: 80%;
    height: 80%;
    margin: 10% 10%;//20px 20px 20px 20px
    background-color: #ff0000;
  }
  ```

- ``border-radius``
  基于自身宽高，设置 ``border-radius:50%`` 可以画出圆


gggggggggg
```plantuml
@startuml
Tomcat -> GitLab: Hello, my name is Tomcat
GitLab -> Tomcat: Hello, my name is GitLab
@enduml
 ```