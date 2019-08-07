<template>
  <section class="bed-poster-wall">
    <div class="box-container" :style="{ left: -360 * activeIndex + 'px' }">
      <div class="box-poster" :class="[activeIndex === index ? 'lg' : '']" :style="[poster.avatar ? { backgroundImage: `url(${poster.avatar})` } : '']" v-for="(poster, index) in list" :key="index" @click="view(poster)">
        <div class="box-intro">
          <div class="title">{{ poster.title }}</div>
          <div class="author">
            <img v-if="poster.icon" :src="poster.icon" alt="">
            <div class="name">{{ poster.author }}</div>
          </div>
        </div>
      </div>

      <div class="box-poster lg sample-show" v-if="!list.length">
        <div class="box-btn">
          <div class="btn" @click="addFeed()">Add First Feed</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import system from '@/models/system'

export default {
  name: 'posterWall',
  data () {
    return {
      activeIndex: 0,
      system
    }
  },
  computed: {
    list () {
      if (this.system.chapters.length) {
        let list = []
        if (this.system.chapters.length >= 5) {
          list = this.system.chapters.map(cat => cat.list[0])
        } else {
          let count = Math.ceil(5 / this.system.chapters.length)
          list = this.system.chapters.reduce((soFar, cat) => {
            return [...soFar, ...cat.list.slice(0, count)]
          }, [])
        }
        // console.log(list)
        return list
      } else {
        return []
      }
    }
  },

  mounted () {
    setInterval(() => {
      this.autoToggle()
    }, 5000)
  },

  methods: {
    addFeed () {
      // TODO
    },
    view (chapter) {
      let url = chapter.link || ''
      // console.log(url)
      if (url) {
        this.$router.push({
          name: 'read',
          query: {
            url: encodeURIComponent(url)
          }
        })
      }
    },
    autoToggle () {
      if (this.list.length && this.activeIndex <= this.list.length - 2) {
        this.activeIndex++
      } else {
        this.activeIndex = 0
      }
    }
  }
}
</script>

<style scoped lang="scss">
.bed-poster-wall {
  height: 340px;
  background: #eee;
  overflow: hidden;
  .box-container {
    position: relative;
    margin-left: 426px;
    height: 100%;
    padding-top: 50px;
    white-space: nowrap;
    transition: all 0.6s;
    .box-poster {
      position: relative;
      display: inline-block;
      margin: 0 30px;
      width: 300px;
      height: 240px;
      border-radius: 8px;
      background: linear-gradient(1deg, #414141, #bebebe);
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
      box-shadow: 0 0 18px 1px rgba(122, 122, 122, .6);
      // filter: blur(1px);
      opacity: 0.7;
      overflow: hidden;
      // transform: skewY(2deg);
      // transform: rotateY(180deg);
      transition: all 0.6s;
      cursor: pointer;
      user-select: none;
      &:hover {
        background: linear-gradient(1deg, #414141, #bebebe);
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
        // filter: none;
        opacity: 1;
      }
      &.lg {
        background: linear-gradient(1deg, #414141, #bebebe);
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
        // filter: none;
        opacity: 1;
        transform: scale(1.3);
      }
      &.sample-show {
        cursor: default;
      }
      .box-intro {
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        padding: 32px 6px 6px;
        background: linear-gradient(0deg, rgba(255, 255, 255, .9), rgba(255, 255, 255, .0));
        z-index: 1;
        .title {
          color: #000;
          font-weight: 500;
          text-shadow: 1px 1px 3px rgba(255, 255, 255, .5);
          white-space: normal;
        }
        .author {
          display: flex;
          align-items: center;
          margin-top: 6px;
          img {
            margin-right: 6px;
            max-width: 14px;
            max-height: 14px;
          }
          .name {
            color: #666;
            font-size: 12px;
          }
        }
      }
      .box-btn {
        padding-top: 40%;
        text-align: center;
        .btn {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          background: rgba(234, 236, 101, .7);
          color: #666;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          user-select: none;
          transition: all 0.4s;
          &:hover {
            background: rgba(234, 236, 101, 1);
            color: #333;
          }
        }
      }
    }
  }
}
</style>
