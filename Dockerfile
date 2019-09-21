# 安装环境
FROM node:8.11.2
RUN apt-get update  && apt-get install -y nginx
# 建立临时工作目录
WORKDIR /usr/src/app
# 下载依赖
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install
# 编译打包
COPY . .
RUN npm run build
# 重定向标准输出和标准错误
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
	&& ln -sf /dev/stderr /var/log/nginx/error.log
# 删除nginx 默认配置
RUN rm /etc/nginx/conf.d/default.conf
# 添加我们自己的配置 default.conf 在下面
ADD nginx.conf /etc/nginx/conf.d/ 
# 启动端口为80
EXPOSE 80
# 移出打包后的目录，删除项目源文件
RUN cp -r dist/* /var/www/html \
&& rm -rf /user/src/app
# 启动
CMD ["nginx","-g","daemon off;"]