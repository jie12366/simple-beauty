<template>
  <div id="loading">
    <div id="loading-center">
      <div id="loading-center-absolute">
        <div class="object"></div>
        <div class="object"></div>
        <div class="object"></div>
        <div class="object"></div>
        <div class="object"></div>
        <div class="object"></div>
        <div class="object"></div>
        <div class="object"></div>
        <div class="object"></div>
        <div class="object"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
#loading {
  background-color: #ffffff;
  position: relative;
  height: 100%;
  width: 100%;
  top: 50px;
}
#loading-center {
  width: 100%;
  height: 100%;
  position: relative;
}
#loading-center-absolute {
  position: relative;
  left: 50%;
  height: 120px;
  width: 300px;
  margin-top: -25px;
  margin-left: -75px;
}
.object {
  width: 8px;
  height: 150px;
  margin-right: 5px;
  background-color: #99BBFF;
  -webkit-animation: animate 1s infinite;
  animation: animate 1s infinite;
  float: left;
}

.object:last-child {
  margin-right: 0px;
}

.object:nth-child(10) {
  -webkit-animation-delay: 0.9s;
  animation-delay: 0.9s;
}
.object:nth-child(9) {
  -webkit-animation-delay: 0.8s;
  animation-delay: 0.8s;
}
.object:nth-child(8) {
  -webkit-animation-delay: 0.7s;
  animation-delay: 0.7s;
}
.object:nth-child(7) {
  -webkit-animation-delay: 0.6s;
  animation-delay: 0.6s;
}
.object:nth-child(6) {
  -webkit-animation-delay: 0.5s;
  animation-delay: 0.5s;
}
.object:nth-child(5) {
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}
.object:nth-child(4) {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}
.object:nth-child(3) {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
.object:nth-child(2) {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}

@-webkit-keyframes animate {
  50% {
    -ms-transform: scaleY(0);
    -webkit-transform: scaleY(0);
    transform: scaleY(0);
  }
}

@keyframes animate {
  50% {
    -ms-transform: scaleY(0);
    -webkit-transform: scaleY(0);
    transform: scaleY(0);
  }
}
</style>
