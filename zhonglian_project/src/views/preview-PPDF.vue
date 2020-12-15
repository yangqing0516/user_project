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
            <canvas v-for="page in pages" :id="'the-canvas'+page" :key="page"></canvas>
        </div>
    </div>
  </div>
</template>

<script>
import PDFJS from 'pdfjs-dist';
const Base64 = require('js-base64').Base64;
console.log(PDFJS)
import {
    viewFile
} from '@/api/index';
export default {
    name: 'pdf-component',
    data () {
        return {
            title: '查看合同',
            pdfDoc: null,
            pages: 0
        }
    },
    mounted () {
        document.title = this.title
        let url = this.$route.query.url;
        this._loadFile(url)
    },
    methods: {
        goBack(){
            this.$router.go(-1)
        },
        _renderPage (num) {
            this.pdfDoc.getPage(num).then((page) => {
                let canvas = document.getElementById('the-canvas' + num)
                let ctx = canvas.getContext('2d')
                let dpr = window.devicePixelRatio || 1
                let bsr = ctx.webkitBackingStorePixelRatio ||
                        ctx.mozBackingStorePixelRatio ||
                        ctx.msBackingStorePixelRatio ||
                        ctx.oBackingStorePixelRatio ||
                        ctx.backingStorePixelRatio || 1
                let ratio = dpr / bsr
                let viewport = page.getViewport(screen.availWidth / page.getViewport(1).width)
                canvas.width = viewport.width * ratio
                canvas.height = viewport.height * ratio
                canvas.style.width = viewport.width + 'px'
                canvas.style.height = viewport.height + 'px'
                ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
                let renderContext = {
                canvasContext: ctx,
                viewport: viewport
                }
                page.render(renderContext)
                if (this.pages > num) {
                this._renderPage(num + 1)
                }
            })
        },
        _loadFile (url) {
            console.log(PDFJS)
            // PDFJS.getDocument(url).then((pdf) => {
            //     this.pdfDoc = pdf
            //     this.pages = this.pdfDoc.numPages
            //     this.$nextTick(() => {
            //     this._renderPage(1)
            //     })
            // })
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