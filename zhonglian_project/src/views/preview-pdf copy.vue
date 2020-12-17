<template>
  <div class="container view-pdf wrapper">
    <!--预览-->
    <div class="goback1">
        <div class="goBtn">
            <van-nav-bar title="附件查看" left-arrow @click-left="goBack" />
        </div>
    </div>
    <div class="section">
        <div class="pdf-file">
            <!-- <pdf 
                ref="pdf"
                :src="path"
            >
            </pdf> -->
            <iframe :src="path" frameborder="0"></iframe>
            <!-- <pdf  v-for="i in numPages" :key="i"  :src="url" :page="i"></pdf>	 -->
        </div>
    </div>
  </div>
</template>

<script>
import pdf from "vue-pdf"; // 引入pdf组件
export default {
    components: { pdf }, // 引入pdf组件
    data() {
        return {
            numPages: 1,
            path: this.$route.query.url,//pdf的地址，例如：/testFile.pdf
        };
    },
    methods: {
        // 返回上级
        goBack() {
            this.$router.go(-1);
        },
        beforeMount() {
            console.log(this.numPages)   
        }
    },
};
</script>
<style lang="scss">
.view-pdf {
  .van-nav-bar .van-icon {
    color: #323232;
  }
  .van-nav-bar__arrow {
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
<style scoped lang="scss">
/* .pdf-box {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    max-width: 1024px;
    width: 100%;
    margin: 0 auto;
    overflow-x: hidden;
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    font-size: 0.28rem;
    span {
        width: 100%;
    }
} */

.view-pdf {
  display: flex;
  flex-direction: column;
  .goback1 {
    width: 100%;
    height: 0.9rem;
  }
  .section {
    flex: 1;
    overflow-y: scroll;
    .pdf-file {
      height: 100%;
      span {
        height: 100%;
      }
    }
  }
}
</style>