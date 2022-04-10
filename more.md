<!-- 额外的笔记 -->
document.querySelector('#test')
document.querySelectorAll('#test')

十六章 DOM2和DOM3
### DOM的演进
#### XML命名空间
用于混入不同XML语言。DOM根据有XML命名空间的文件推出更多属性。
#### 其他演变
- documentType
增加三个属性，publiId systemId internalSubset，分别对应doctype的三个信息。
- document
新增importNode()用于导入其他文档的节点，