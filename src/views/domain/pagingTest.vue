<template>
  <!--  绑定数据，需要以这种形式，子组建需要定义好msg 这个变量-->
  <Paging :msg="msg"></Paging>
</template>


<script>
import Paging from "../../components/Paging";

export default {
  name: "PAGING",
  props: {},
  data() {
    return {
      msg: "我是父亲",
      terminal: {
        testUrl: "12222222",
        testUrl2: "00000000"
      }
    }
  },
  components: {
    Paging
  },

}
</script>
