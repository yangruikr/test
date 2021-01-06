# 小程序

## 开发规范

#### 关于新建页面

新建页面直接在对应模块主目录文件下添加，不单独添加，避免层级太深。如：home/index,home/sale

#### 关于别名使用

在同一级目录使用采用相对路径，在其他目录引用采用绝对路径

#### 解构

解构时，括号前后空格，数组前后空格。

```
// 解构前后空格
const { id, name } = {id: 1, name: 2};
const [ a, b ] = [1, 2];
```

#### css命名

class命名使用“-”连接，命名不要太长，最多三个‘-’连接

#### 命名

组件命名采用大驼峰，其他采用小驼峰
变量命名应当采用小驼峰命名格式
函数命名也采用小驼峰命名格式
常量的命名应当是所有字母大写，不同字母之间用单个下划线隔开

#### import

Import 3个或者3个以下的组件可以不需换行，3个以上需换行写在每个文件的开头

```
import { Message } from 'element-ui';
import { mapActions, mapState, mapGeeters } from 'vuex';
import {
    list,
    get,
    update,
    add
} from '@/api/lib/order';
```

#### 注释

功能注释,写在每个函数的命名的前一行

```
// 获取用户基本信息
function getUserInfo() {}
```


