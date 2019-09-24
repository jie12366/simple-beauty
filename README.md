# 简约博客网站

> 一个坚持简约美的在线博客网站，可以实现博客的在线编辑，预览，发布功能。
提供用户登录注册功能，登录后可以发布文章，对文章进行点赞、评论、收藏等功能。文章可以根据分类或者标签查询，更是提供了全文检索功能。项目是采用前后端分离设计思想，前台界面采用响应式布局，在多端浏览都会有良好的视觉体验。前后端分开部署，采用了docker+jenkins自动化部署。

## 技术栈

 - vue2
 - vue-router
 - vuex
 - webpack
 - es6/eslint
 - axios
 - sass
 - Element-ui

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
后端用springboot+mongod构建，采用restful风格api，使用swagger生成在线api文档，JWT生成token，redis作为缓存以及内存数据库。

项目地址：[simple-beauty-after](https://github.com/jie12366/simple-blog-after.git)
## 目标功能
- [x] 登录注册  -- 完成
- [x] 修改密码  -- 待完成
- [x] 第三方登录(暂时只支持QQ、github、码云)  -- 完成
- [x] 个人中心  -- 完成
- [x] 消息提醒  -- 完成
- [ ] 关注好友  -- 待完成
- [x] 在线编辑文章  -- 完成
- [x] 文章详情展示  -- 完成
- [x] 管理博客  -- 完成
- [ ] 自定义主题  -- 待完成
- [x] 评论回复系统  -- 完成
- [x] 点赞、收藏  -- 完成
- [x] 分类、标签、归档展示  -- 完成
- [x] 照片墙、关于我  -- 完成
- [ ] 全文检索  -- 待完成
## 项目演示
项目演示地址为：[Canary](http://jie12366.xyz:8081)
## 部分截图
### 1、首页
![首页](http://cdn.jie12366.xyz/home.png)
### 2、文章详情
![文章详情](http://cdn.jie12366.xyz/details.png)
### 3、照片墙
![照片墙](http://cdn.jie12366.xyz/photo-wall.png)
## 开源协议
MIT LICENSE
![MIT](http://cdn.jie12366.xyz/license.png)