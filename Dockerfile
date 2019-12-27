# 获取node镜像
FROM node:latest as build-stage
# 维护者信息
LABEL maintainer="2263509062@qq.com"
# 建立临时工作目录
WORKDIR /usr/src/app
COPY package.json package.json
# 设置淘宝npm镜像
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN cnpm install
# 拷贝项目到app目录下
COPY . .
# 编译打包
RUN cnpm run build

# nginx镜像
FROM nginx:1.15.3-alpine as production-stage
# 维护者信息
LABEL maintainer="2263509062@qq.com"
# 移除nginx容器的default.conf文件、nginx配置文件
RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/nginx.conf
# 把主机的nginx.conf文件复制到nginx容器的/etc/nginx文件夹下
COPY ./nginx.conf /etc/nginx/
# 拷贝前端vue项目打包后生成的文件到nginx下运行
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
# 启动端口为8081
EXPOSE 8081
# 启动,使用daemon off的方式将nginx运行在前台保证镜像不至于退出
CMD ["nginx","-g","daemon off;"]