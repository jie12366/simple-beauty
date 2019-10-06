# 简约博客网站

> 一个坚持简约美的在线博客网站，可以实现博客的在线编辑，预览，发布功能。
提供用户登录注册功能，登录后可以发布文章，对文章进行点赞、评论、收藏等功能。文章可以根据分类或者标签查询，更是提供了全文检索功能。项目是采用前后端分离设计思想，前台界面采用响应式布局，在多端浏览都会有良好的视觉体验。前后端分开部署，采用了docker+jenkins自动化部署。

## 技术栈

 - vue2   用于构建用户界面的渐进式框架
 - vue-router   Vue.js 官方的路由管理器
 - vuex   专为 Vue.js 应用程序开发的状态管理模式
 - webpack   模块打包器
 - es6/eslint   采用es6语法，并使用eslint检查语法
 - axios   尤雨溪推荐使用axios来完成ajax请求
 - sass   对CSS的扩展，让CSS语言更强大、优雅
 - Element-ui   基于Vue 2.0 的桌面端组件库
 - mavon-editor   一个开源的markdown编辑器
 - highlight   代码语法高亮库
 - moment   js的时间处理工具
 - viewer   强大的图片预览组件
 - fortawesome/iconfont   字体图标库

## 项目构建运行

``` bash
# clone项目到本地
git clone https://github.com/jie12366/simple-beauty.git

# 进入项目根路径
cd simple-beauty

# 安装相关依赖
npm install (或yarn)
 
# 本地运行
npm run dev
```
## 关于后端
后端用springboot+mongod构建，采用restful风格api，使用swagger生成在线api文档，JWT生成token，redis作为缓存以及内存数据库，使用websocket通信。

项目地址：[simple-beauty-after](https://github.com/jie12366/simple-blog-after.git)
## 目标功能
- [x] 登录注册  -- 完成
- [x] 修改密码  -- 完成
- [x] 第三方登录(暂时只支持QQ、github、码云)  -- 完成
- [x] 个人中心  -- 完成
- [x] 消息提醒  -- 完成
- [x] 在线编辑文章  -- 完成
- [x] 文章详情展示  -- 完成
- [x] 管理博客  -- 完成
- [x] 自定义主题  -- 完成
- [x] 评论回复系统  -- 完成
- [x] 点赞、收藏  -- 完成
- [x] 分类、标签、归档展示  -- 完成
- [x] 照片墙、关于我  -- 完成
- [x] 全文检索/站内搜索  -- 完成
## 项目演示
项目演示地址为：[Canary](http://jie12366.xyz:8081)
## 部分截图
### 1、首页
![首页](http://cdn.jie12366.xyz/FrFNYifRJ40vgAVE1jJ3FtAj3mI4)
### 2、文章详情
![文章详情](http://cdn.jie12366.xyz/FspW12rKpMAl33T9dYfCjC25mRia)
### 3、照片墙
![照片墙](http://cdn.jie12366.xyz/photo-wall.png)
## 开源协议
MIT LICENSE
![MIT](http://cdn.jie12366.xyz/license.png)