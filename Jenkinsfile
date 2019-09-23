pipeline {
  agent any
  stages {
    stage('启动前准备') {
      steps {
        echo 'remove image'
        // 停止容器
        sh 'docker stop canary'
        // 删除容器
        sh 'docker rm canary'
        // 删除镜像
        sh 'docker rmi registry.cn-hangzhou.aliyuncs.com/jie12366/simple-beauty-front:1.0'
      }
    }
    stage('获取镜像') {
      steps {
        echo 'get image'
        sh 'docker login --username=熊义杰的docker registry.cn-hangzhou.aliyuncs.com --password=LOVEjie@1111'
        sh 'docker pull registry.cn-hangzhou.aliyuncs.com/jie12366/simple-beauty-front:1.0'
      }
    }
    stage('启动服务') {
      steps {
        echo 'start simple-beauty-front'
        sh 'docker run -d -p 8081:80 --name canary -e VIRTUAL_HOST=jie12366.xyz registry.cn-hangzhou.aliyuncs.com/jie12366/simple-beauty-front:1.0'
      }
    }
  }
}