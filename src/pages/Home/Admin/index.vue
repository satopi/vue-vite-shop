<template>
  <div id="data-admin" class="flex-column">
    <ul class="justify-between card-list">
      <transition name="el-zoom-in-top" v-for="(item, index) in cardData" :key="index">
        <li class="card flex-center f-color-white" v-show="showAnimation">
          <i :class="['iconfont', 'data-icon', item.icon]"></i>
          <p class="flex-column m-l-30">
            <span class="f-s-16 title f-bold">
              {{ item.title }}
              <i class="iconfont icon-shangsheng animated fadeInUpBig infinite m-l-10 f-s-12 f-color-danger" v-show="item.trend == 'up'"></i>
              <i class="iconfont icon-xiajiang1 animated fadeInDownBig infinite m-l-10 f-s-12 f-color-success" v-show="item.trend == 'down'"></i>
            </span>
            <span class="data" :style="index == 0 ? 'color: #9d4ee9' : ''">
              <GrowNum :value="item.num" :fixed="index == 0 || index == 4 ? 2 : 0" :time="5" class="f-s-20 f-bold" />
              <span class="f-s-12 m-l-8 f-color-white">{{ item.unit }}</span>
            </span>
          </p>
        </li>
      </transition>
    </ul>
    <section class="flex-column center-box">
      <ul class="main-box flex">
        <transition name="el-zoom-in-top">
          <li v-show="showAnimation" class="year-card flex-1 align-center">
            <div class="year-box p-10" id="year"></div>
          </li>
        </transition>
        <transition name="el-zoom-in-top">
          <li v-show="showAnimation" class="today-card m-l-10 m-r-10 m-t-10 m-b-15 relative">
            <Circle />
            <p class="absolute text-box f-color-white flex-center flex-column">
              <span class="f-bold f-s-26"
                >今日成交量<i class="iconfont icon-shangsheng animated fadeInUpBig infinite m-l-10 f-color-danger"></i
              ></span>
              <span style="color: #e8cc16">
                <GrowNum :value="todayData.order" :time="5" class="f-s-40 f-bold" />
                <span class="f-s-18 m-l-8 f-color-white">笔</span>
              </span>
            </p>
          </li>
        </transition>
        <transition name="el-zoom-in-top">
          <li v-show="showAnimation" class="today-card m-l-10 m-r-10 m-t-10 m-b-15 relative">
            <Circle />
            <p class="absolute text-box f-color-white flex-center flex-column">
              <span class="f-bold f-s-26"
                >今日交易额<i class="iconfont icon-shangsheng animated fadeInUpBig infinite m-l-10 f-color-danger"></i
              ></span>
              <span style="color: #9d4ee9">
                <GrowNum :value="todayData.money" :time="5" :fixed="2" class="f-s-40 f-bold" />
                <span class="f-s-18 m-l-8 f-color-white">万元</span>
              </span>
            </p>
          </li>
        </transition>
        <transition name="el-zoom-in-top">
          <li v-show="showAnimation" class="goods-card flex-1 align-center"><div class="goods-box p-10" id="goods"></div></li>
        </transition>
      </ul>
      <ul class="bottom-box justify-between">
        <transition name="el-zoom-in-top">
          <li v-show="showAnimation" class="time-card p-10 m-r-20" id="time"></li>
        </transition>
        <transition name="el-zoom-in-top">
          <li v-show="showAnimation" class="order-card flex-1 flex-column relative">
            <el-table
              :data="tableData"
              height="0"
              class="flex-1 order-table"
              :header-row-class-name="'order-header-row'"
              :header-cell-class-name="'order-header-cell'"
              :row-class-name="'order-row'"
              :cell-class-name="'order-cell'"
            >
              <el-table-column prop="dateTime" label="交易时间" width="180" :align="'center'" />
              <el-table-column prop="headImg" label="头像" :align="'center'">
                <template #default="scope">
                  <el-avatar size="large" :src="scope.row.headImg" @error="() => true">
                    <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
                  </el-avatar>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="昵称" :align="'center'" />
              <el-table-column prop="type" label="商品类型" :align="'center'" />
              <el-table-column prop="money" label="成交额/元" />
            </el-table>
            <div class="absolute blur"></div>
          </li>
        </transition>
      </ul>
    </section>
  </div>
</template>

<script lang="ts" setup>
  import Circle from '@/plugins/Circle.vue';
  import GrowNum from '@/components/GrowNum/index.vue';
  import { inject, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
  import { cloneDeep } from 'lodash-es';

  const echarts: any = inject('ec');
  const showAnimation = ref(false);

  // 卡片数据
  const cardData = ref([
    { title: '交易总额', icon: 'icon-qiandai', num: 23659.89, unit: '万元', trend: 'up' },
    { title: '订单总量', icon: 'icon-dingdanliang', num: 465465, unit: '笔', trend: 'up' },
    { title: '入驻商家', icon: 'icon-jiaoyi', num: 236595, unit: '个', trend: 'up' },
    { title: '注册会员', icon: 'icon-huiyuan', num: 1365982, unit: '个', trend: 'up' },
    { title: '人均消费', icon: 'icon-renjunchanzhi', num: 2369.21, unit: '元/人', trend: 'up' }
  ]);
  // 初始化人均消费数据
  cardData.value[4].num = parseFloat(((cardData.value[0].num * 10000) / cardData.value[3].num).toFixed(2));

  // 今日数据
  const todayData = reactive({
    order: 23332, // 今日成交量
    money: 63259.32 // 今日交易额
  });

  // 大额订单表格数据
  const tableData = ref([
    {
      dateTime: '2016-05-03 15:08',
      headImg: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
      name: '王小虎',
      type: '电器',
      money: '￥8963.23'
    },
    {
      dateTime: '2016-05-03 15:38',
      headImg: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
      name: '周娜',
      type: '厨房用品',
      money: '￥5962.36'
    },
    {
      dateTime: '2016-05-03 16:21',
      headImg: 'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
      name: '雷凌',
      type: '宠物用品',
      money: '￥7963.25'
    },
    {
      dateTime: '2016-05-03 16:24',
      headImg: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
      name: '莉娜',
      type: '化妆品',
      money: '￥16873.23'
    },
    {
      dateTime: '2016-05-03 17:11',
      headImg: 'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
      name: '王宇',
      type: '衣服鞋饰',
      money: '￥9326.21'
    },
    {
      dateTime: '2016-05-03 17:56',
      headImg: 'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
      name: '林荫',
      type: '文创玩具',
      money: '￥3267.56'
    },
    {
      dateTime: '2016-05-03 18:26',
      headImg: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
      name: '奈莉',
      type: '化妆品',
      money: '￥11563.98'
    }
  ]);

  // 获取年度交易额图表配置
  const getYearOptions = () => {
    let base = +new Date(1988, 9, 3);
    const oneDay = 24 * 3600 * 1000;
    const data: any = [[base, Math.random() * 3000]];

    for (var i = 1; i < 4015; i++) {
      var now = new Date((base += oneDay));
      data.push([[now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'), Math.round((Math.random() - 0.46) * 200 + data[i - 1][1])]);
    }

    return {
      tooltip: {
        trigger: 'axis',
        position: function (pt: any[]) {
          return [pt[0], '10%'];
        }
      },
      title: {
        left: 'center',
        text: '年度交易额',
        textStyle: {
          color: '#fff'
        }
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#97a1bc'
          }
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        axisLine: {
          lineStyle: {
            color: '#97a1bc'
          }
        },
        splitLine: {
          lineStyle: {
            opacity: 0.5
          }
        }
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 20
        },
        {
          start: 0,
          end: 20
        }
      ],
      series: [
        {
          name: '模拟数据',
          type: 'line',
          smooth: true,
          symbol: 'none',
          areaStyle: {
            opacity: 0.8,
            color: '#062677'
          },
          data: data
        }
      ]
    };
  };

  // 获取商品类型图表配置
  const getGoodsOptions = () => {
    return {
      title: {
        text: '商品类型占比',
        left: 'center',
        textStyle: {
          color: '#ffffff'
        }
      },

      tooltip: {
        trigger: 'item',
        formatter: '{a}<br/>{b0}: {c0}%'
      },

      visualMap: {
        show: false,
        min: 0,
        max: 70,
        inRange: {
          colorLightness: [0.3, 1]
        }
      },
      series: [
        {
          name: '商品类型',
          type: 'pie',
          radius: '70%',
          center: ['50%', '55%'],
          data: [
            { value: 24, name: '生活用品' },
            { value: 17, name: '衣服鞋饰' },
            { value: 21, name: '文创玩具' },
            { value: 14, name: '厨房用品' },
            { value: 13, name: '宠物用品' },
            { value: 11, name: '零食生鲜' }
          ].sort(function (a, b) {
            return a.value - b.value;
          }),
          roseType: 'radius',
          label: {
            color: 'rgba(255, 255, 255, 1)'
          },
          labelLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            },
            smooth: 0.2,
            length: 5,
            length2: 20
          },
          itemStyle: {
            color: '#541396',
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },

          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function () {
            return Math.random() * 200;
          }
        }
      ]
    };
  };

  // 获取时段成交量图表配置
  const getTimeOptions = () => {
    return {
      title: {
        text: '实时成交统计',
        textStyle: {
          color: '#ffffff'
        }
      },
      legend: {
        data: ['成交总金额', '订单数量'],
        textStyle: {
          color: '#ffffff'
        }
      },
      grid: {
        top: 70,
        bottom: 20,
        left: '6%'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#283b56'
          }
        }
      },
      dataZoom: {
        show: false,
        start: 0,
        end: 100
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: true,
          data: (function () {
            var now: any = new Date();
            var res = [];
            var len = 10;
            while (len--) {
              res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
              now = new Date(now - 2000);
            }
            return res;
          })(),
          axisLine: {
            lineStyle: {
              color: '#97a1bc'
            }
          }
        },
        {
          type: 'category',
          boundaryGap: true,
          data: (function () {
            var res = [];
            var len = 10;
            while (len--) {
              res.push(10 - len - 1);
            }
            return res;
          })(),
          axisLabel: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#97a1bc'
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          scale: true,
          name: '总金额/万元',
          nameGap: 20,
          max: 30,
          min: 0,
          axisLine: {
            lineStyle: {
              color: '#97a1bc'
            }
          },
          splitLine: {
            lineStyle: {
              opacity: 0.5
            }
          }
        },
        {
          type: 'value',
          scale: true,
          name: '订单数/笔',
          max: 1200,
          min: 0,
          axisLine: {
            lineStyle: {
              color: '#97a1bc'
            }
          },
          splitLine: {
            lineStyle: {
              opacity: 0.5
            }
          }
        }
      ],
      series: [
        {
          name: '订单数量',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: (function () {
            var res = [];
            var len = 10;
            while (len--) {
              res.push(Math.round(Math.random() * 1000));
            }
            return res;
          })(),
          itemStyle: {
            color: '#3f159f',
            borderColor: '#612ee7',
            borderWidth: 2,
            opacity: 0.8
          }
        },
        {
          name: '成交总金额',
          type: 'line',
          data: (function () {
            var res = [];
            var len = 0;
            while (len < 10) {
              res.push(parseInt((Math.random() * 10 + 5).toFixed(1)) - 0);
              len++;
            }
            return res;
          })(),
          itemStyle: {
            color: '#892fe5'
          },
          lineStyle: {
            color: '#892fe5'
          }
        }
      ]
    };
  };

  // 所有图表
  const charts = [
    { id: 'year', options: getYearOptions(), chart: null },
    { id: 'goods', options: getGoodsOptions(), chart: null },
    { id: 'time', options: getTimeOptions(), chart: null }
  ];

  // 定时器
  let cardTimer: NodeJS.Timer | null = null;
  let chartTimer: NodeJS.Timer | null = null;
  let tableTimer: NodeJS.Timer | null = null;

  onMounted(() => {
    showAnimation.value = true;

    // 拿到表格中承载数据的div元素
    const container = document.querySelector('.el-table__body-wrapper');
    // 拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每50毫秒移动1像素)
    tableTimer = setInterval(() => {
      if (container) {
        // 元素自增距离顶部1像素
        container.scrollTop += 1;
        // 判断元素是否滚动到底部(可视高度+距离顶部=整个高度)
        if (container.clientHeight + container.scrollTop == container.scrollHeight) {
          // 重置table距离顶部距离
          container.scrollTop = 0;
        }
      }
    }, 50);
  });

  // 销毁定时器
  onUnmounted(() => {
    clearInterval(Number(cardTimer));
    clearInterval(Number(chartTimer));
    clearInterval(Number(tableTimer));
  });

  nextTick(() => {
    // 卡片数字递增
    let num = 0;
    cardTimer = setInterval(() => {
      const count = (Math.random() * 10).toFixed(0);
      const money = Math.random() * 50;

      // 随机新增会员人数
      if (num % 2 == 0) cardData.value[3].num += parseInt(Math.random() >= 0.5 ? count : `-${count}`);
      else cardData.value[2].num += parseInt(Math.random() >= 0.5 ? count : `-${count}`); // 随机新增入驻商家

      // 今日销量/成交额
      todayData.order += parseInt(count);
      todayData.money += (parseFloat(count) * money) / 10000;

      cardData.value[1].num += parseInt(count); // 订单总量
      cardData.value[0].num += (parseFloat(count) * money) / 10000; // 总成交额
      cardData.value[4].num = parseFloat(((cardData.value[0].num * 10000) / cardData.value[3].num).toFixed(2)); // 人均消费
      num++;
    }, 2100);

    // 初始化图表
    charts.forEach((p: any) => {
      p.chart = echarts.init(document.getElementById(p.id));
      p.chart.setOption(p.options);
      if (p.id == 'time') {
        var count = 11;
        chartTimer = setInterval(() => {
          var axisData = new Date().toLocaleTimeString().replace(/^\D*/, '');

          var data0 = p.options.series[0].data;
          var data1 = p.options.series[1].data;
          data0.shift();
          data0.push(Math.round(Math.random() * 1000));
          data1.shift();
          data1.push(parseInt((Math.random() * 10 + 5).toFixed(1)) - 0);

          p.options.xAxis[0].data.shift();
          p.options.xAxis[0].data.push(axisData);
          p.options.xAxis[1].data.shift();
          p.options.xAxis[1].data.push(count++);
          p.chart.setOption(p.options);
        }, 2100);
      }
    });
  });

  watch(
    () => cloneDeep(cardData.value),
    (newVal, oldVal) => {
      newVal.map((p, index) => {
        // 监听数据上升/下降趋势
        if (p.num > oldVal[index].num) p.trend = 'up';
        else if (p.num < oldVal[index].num) p.trend = 'down';
        if (p.num != oldVal[index].num) cardData.value = newVal;
      });
    }
  );
</script>

<style lang="scss">
  #data-admin {
    width: 100%;
    // height: 100%;
    padding: 10px;
    box-sizing: border-box;
    background-image: radial-gradient(#0b3580, #142156, #10183f, #0c0d20);
    overflow-y: scroll;

    // 顶部卡片
    .card-list {
      // 动画效果
      .el-zoom-in-top-enter-active {
        transition: all 0.3s ease;
      }
      @for $i from 2 through 5 {
        & .el-zoom-in-top-enter-active:nth-child(#{$i}) {
          transition-delay: ($i - 1) * 80 * 1ms;
        }
      }

      .card {
        width: calc(25% - 40px);
        padding: 16px 10px;
        line-height: 1.8;
        border-radius: 5px;
        background-image: radial-gradient(#124364, #04285b, #041745);
        margin-right: 10px;
        &:nth-last-of-type(1) {
          margin-right: 0;
        }
        .data-icon {
          font-size: 55px;
          color: #00fdfe;
        }
        .data {
          color: #00fdfe;
          letter-spacing: 2px;
        }
      }
    }

    .center-box {
      width: 100%;
      height: 100%;
      overflow: hidden;
      // 中部卡片
      .main-box {
        width: 100%;
        // 动画效果
        .el-zoom-in-top-enter-active {
          transition: all 0.5s ease;
        }
        @for $i from 1 through 4 {
          & .el-zoom-in-top-enter-active:nth-child(#{$i}) {
            transition-delay: (($i - 1) * 80 + 400) * 1ms;
          }
        }
        .goods-card {
          justify-content: flex-end;
        }
        .year-card,
        .goods-card {
          // width: 25%;
          border-radius: 8px;
          .year-box,
          .goods-box {
            background-image: radial-gradient(#021f4c, #042a5e, #012f53);
            margin-top: -10px;
            width: 100%;
            height: 85%;
            border-radius: 6px;
          }
        }
        .today-card {
          border-radius: 50%;
          width: 25%;
          padding-bottom: 40vh;

          .text-box {
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            line-height: 1.6;
          }
        }
      }

      // 底部卡片
      .bottom-box {
        width: 100%;
        // margin-top: -10px;
        overflow: hidden;
        height: 40vh;
        // 动画效果
        .el-zoom-in-top-enter-active {
          transition: all 0.5s ease;
        }
        @for $i from 1 through 2 {
          & .el-zoom-in-top-enter-active:nth-child(#{$i}) {
            transition-delay: (($i - 1) * 80 + 720) * 1ms;
          }
        }
        .time-card,
        .order-card {
          width: calc((100% - 20px) / 2);
          background-image: linear-gradient(to bottom, #124364, #042a5e, #012f53);
          border-radius: 6px;
        }
        .order-card {
          box-shadow: inset 0 -15px 20px 10px #083160;
          background-image: linear-gradient(to bottom, #083160, #042a5e, #012f53);
          &::after {
            content: '';
            position: absolute;
            width: 100%;
            bottom: 0;
            left: 0;
            height: 5%;
            filter: blur(6px);
            background-image: linear-gradient(to top, #083160, #04285b, #041745);
          }
          .blur {
            bottom: 0;
            left: 0;
            width: 100%;
            height: 3%;
            background-image: linear-gradient(to top, #083160, #04285b, rgba($color: #041745, $alpha: 0.5));
            box-shadow: 0 -15px 20px 10px rgba(8, 49, 96, 0.5);
          }
          // 大额订单表格
          .order-table,
          .order-table .order-row,
          .order-table .order-cell.el-table__cell {
            background: transparent;
            color: rgba($color: #ffffff, $alpha: 0.8);
          }
          .el-table th.order-header-cell {
            background-image: linear-gradient(to top, #042a5e, #021f4c, #0b3761);
            color: white;
          }
          .order-card .el-table--enable-row-hover .el-table__body tr:hover > td.order-cell {
            background-color: rgba($color: #062677, $alpha: 0.5);
          }
          .order-table td.el-table__cell,
          .order-table th.el-table__cell.is-leaf {
            border-bottom: 1px solid #29397d;
          }
          .order-table::before {
            display: none;
          }
        }
      }
    }
  }
</style>
