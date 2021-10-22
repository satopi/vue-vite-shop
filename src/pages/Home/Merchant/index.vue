<template>
  <div id="merchant-home" class="flex-column">
    <section class="justify-between top-box">
      <transition name="el-zoom-in-top" v-for="(item, index) in cardData" :key="index">
        <el-card class="card" v-show="showAnimation">
          <i :class="['iconfont', 'data-icon', item.icon, item.color]" :style="{ color: item.color }"></i>
          <p class="flex-column m-l-30">
            <span class="f-s-16 title f-bold">
              {{ item.title }}
              <i class="iconfont icon-shangsheng animated fadeInUpBig infinite m-l-10 f-s-12 f-color-danger" v-show="item.trend == 'up'"></i>
              <i class="iconfont icon-xiajiang1 animated fadeInDownBig infinite m-l-10 f-s-12 f-color-success" v-show="item.trend == 'down'"></i>
            </span>
            <span class="data">
              <GrowNum :value="item.num" :fixed="index == 1 || index == 2 ? 0 : 2" :time="5" class="f-s-20 f-bold" />
              <span class="f-s-14 m-l-8">{{ item.unit }}</span>
            </span>
          </p>
        </el-card>
      </transition>
    </section>
    <section class="flex m-t-10 center-box">
      <transition name="el-zoom-in-top">
        <el-card v-show="showAnimation" class="flex-1 flex-column left m-r-10">
          <ul class="flex-center">
            <li class="l-h-30 flex-column flex-center p-10" style="width: 40%">
              <div>
                <h4 class="f-s-20 m-b-10 text-center f-bold">商店信息</h4>
                <p>名称：Lucky Star</p>
                <p>注册人：萧策安</p>
                <p>注册账号：5645656564</p>
                <p>注册时间：2016-03-04</p>
                <p>违规警告：0次</p>
                <p>运营人数：3人</p>
              </div>
            </li>
            <li class="flex-1" style="height: 100%" id="assess"></li>
          </ul>
        </el-card>
      </transition>
      <transition name="el-zoom-in-top">
        <el-card v-show="showAnimation" class="m-r-10 p-10" id="year" />
      </transition>
      <transition name="el-zoom-in-top">
        <el-card v-show="showAnimation" class="right">
          <p class="f-s-16 f-bold" style="text-shadow: 3px 4px 2px rgba(0, 0, 0, 0.3)">搜索关键字</p>
          <ul class="flex flex-center">
            <li class="flex-column flex-center">
              <span class="p-5" style="color: #73c0de; text-shadow: 3px 4px 3px rgba(115, 192, 222, 0.5)">默读</span>
              <span class="p-5 f-s-18 vertical" style="color: #fac858; text-shadow: 3px 4px 3px rgba(250, 200, 88, 0.5)">伪装学渣</span>
              <span class="p-5" style="color: #fb854f; text-shadow: 3px 4px 3px rgba(251, 133, 79, 0.5)">准点狙击</span>
              <span class="p-5 f-s-24" style="color: #ef6667; text-shadow: 3px 4px 3px rgba(239, 102, 103, 0.5)">杀破狼</span>
            </li>
            <li class="flex-column flex-center">
              <span class="p-5 f-s-16 vertical" style="color: #3ca272; text-shadow: 3px 4px 3px rgba(60, 162, 114, 0.5)">广播剧</span>
              <span class="p-5" style="color: #9a60b4; text-shadow: 3px 4px 3px rgba(154, 96, 180, 0.5)">Priest</span>
              <span class="p-5 f-s-22" style="color: #fb854f; text-shadow: 3px 4px 3px rgba(251, 133, 79, 0.5)">剧集周边</span>
              <span class="p-5 f-s-22 vertical" style="color: #b1742a; text-shadow: 3px 4px 3px rgba(177, 116, 42, 0.5)">粘土人偶</span>
            </li>
          </ul>
        </el-card>
      </transition>
    </section>
    <section class="m-t-10 flex bottom-box">
      <transition name="el-zoom-in-top">
        <el-card v-show="showAnimation" class="m-r-10 time-card p-10" id="time" />
      </transition>
      <transition name="el-zoom-in-top">
        <el-card v-show="showAnimation" class="flex-1 order-card">
          <el-table :data="tableData" height="0" class="flex-1">
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
        </el-card>
      </transition>
    </section>
  </div>
</template>

<script lang="ts" setup>
  import GrowNum from '@/components/GrowNum/index.vue';
  import { cloneDeep } from 'lodash-es';
  import { inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

  const echarts: any = inject('ec');
  const showAnimation = ref(false);

  // 卡片数据
  const cardData = ref([
    { title: '交易总额', icon: 'icon-qiandai', color: '#ee6666', num: 125.63, unit: '千元', trend: 'up' },
    { title: '订单总量', icon: 'icon-dingdanliang', color: '#9a60b4', num: 621, unit: '笔', trend: 'up' },
    { title: '今日成交量', icon: 'icon-jiaoyi', color: '#5470c6', num: 125, unit: '笔', trend: 'up' },
    { title: '今日成交额', icon: 'icon-xiaoshoue', color: '#fac858', num: 365.26, unit: '千元', trend: 'up' },
    { title: '平均消费', icon: 'icon-renjunchanzhi', color: '#fc8452', num: 223.21, unit: '元/笔', trend: 'up' }
  ]);
  // 初始化平均消费数据
  cardData.value[4].num = parseFloat(((cardData.value[0].num * 1000) / cardData.value[1].num).toFixed(2));

  // 获取评价图表配置
  const getAssessOptions = () => {
    return {
      grid: {
        bottom: 10
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        show: false
      },
      series: [
        {
          name: '商店评价',
          type: 'pie',
          radius: '70%',
          data: [
            { value: 492, name: '好评', itemStyle: { color: '#fac858' } },
            { value: 86, name: '中评', itemStyle: { color: '#73c0de' } },
            { value: 28, name: '差评', itemStyle: { color: '#ef6667' } }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  };

  // 获取年度交易额图表配置
  const getYearOptions = () => {
    let base = +new Date(1988, 9, 3);
    const oneDay = 24 * 3600 * 1000;
    let date = [];
    let data = [Math.random() * 300];

    for (let i = 1; i < 4015; i++) {
      var now = new Date((base += oneDay));
      date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
      data.push(Math.round((Math.random() - 0.46) * 200 + data[i - 1]));
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
        text: '年度交易额'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 10
        },
        {
          start: 0,
          end: 10
        }
      ],
      series: [
        {
          name: '模拟数据',
          type: 'line',
          symbol: 'none',
          sampling: 'lttb',
          itemStyle: {
            color: 'rgb(255, 70, 131)'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(255, 158, 68)'
              },
              {
                offset: 1,
                color: 'rgb(255, 70, 131)'
              }
            ])
          },
          data: data
        }
      ]
    };
  };

  // 获取时段成交量图表配置
  const getTimeOptions = () => {
    return {
      title: {
        text: '实时成交统计'
      },
      legend: {
        data: ['成交总金额', '订单数量']
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
          })()
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
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          scale: true,
          name: '总金额/千元',
          nameGap: 20,
          max: 30,
          min: 0
        },
        {
          type: 'value',
          scale: true,
          name: '订单数/笔',
          max: 1200,
          min: 0
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
            color: '#fb854f'
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
            color: '#fac858'
          },
          lineStyle: {
            color: '#fac858'
          }
        }
      ]
    };
  };

  // 大额订单表格数据
  const tableData = ref([
    {
      dateTime: '2016-05-03 15:08',
      headImg: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
      name: '王小虎',
      type: '广播剧',
      money: '￥300'
    },
    {
      dateTime: '2016-05-03 15:38',
      headImg: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
      name: '周娜',
      type: '剧集周边',
      money: '￥1325.00'
    },
    {
      dateTime: '2016-05-03 16:21',
      headImg: 'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
      name: '雷凌',
      type: '书全册',
      money: '￥230.20'
    },
    {
      dateTime: '2016-05-03 16:24',
      headImg: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
      name: '莉娜',
      type: '手办',
      money: '￥2365.32'
    },
    {
      dateTime: '2016-05-03 17:11',
      headImg: 'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
      name: '王宇',
      type: '等身抱枕',
      money: '￥246.32'
    },
    {
      dateTime: '2016-05-03 17:56',
      headImg: 'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
      name: '林荫',
      type: '文创玩具',
      money: '￥150.32'
    },
    {
      dateTime: '2016-05-03 18:26',
      headImg: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
      name: '奈莉',
      type: '广播剧',
      money: '￥500.00'
    }
  ]);

  // 所有图表
  const charts = [
    { id: 'time', options: getTimeOptions(), chart: null },
    { id: 'assess', options: getAssessOptions(), chart: null },
    { id: 'year', options: getYearOptions(), chart: null }
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
    cardTimer = setInterval(() => {
      const count = (Math.random() * 10).toFixed(0);
      const money = Math.random() * 500;

      cardData.value[0].num += (parseFloat(count) * money) / 1000; // 交易总额
      cardData.value[1].num += parseInt(count); // 订单总量
      cardData.value[2].num += parseInt(count); // 今日成交量
      cardData.value[3].num += (parseFloat(count) * money) / 1000; // 今日成交额
      cardData.value[4].num = parseFloat(((cardData.value[0].num * 1000) / cardData.value[1].num).toFixed(2)); // 平均消费
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
  #merchant-home {
    width: 100%;
    // height: 100%;
    padding: 10px;
    box-sizing: border-box;
    overflow-y: scroll;

    // 顶部卡片
    .top-box {
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
        margin-right: 10px;
        --el-card-padding: 0;
        &:nth-last-of-type(1) {
          margin-right: 0;
        }
        .el-card__body {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .data-icon {
          font-size: 55px;
        }
        .data {
          letter-spacing: 2px;
        }
      }
    }

    // 中间卡片
    .center-box {
      width: 100%;
      // 动画效果
      .el-zoom-in-top-enter-active {
        transition: all 0.8s ease;
      }
      @for $i from 1 through 3 {
        & .el-zoom-in-top-enter-active:nth-child(#{$i}) {
          transition-delay: (($i - 1) * 80 + 400) * 1ms;
        }
      }
      .left {
        ul {
          width: 100%;
          height: 100%;
        }
        .el-card__body {
          width: 100%;
          height: 100%;
        }
      }
      #year {
        width: 42%;
      }
      .right {
        width: 18%;
        ul {
          width: 100%;
          position: relative;
          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            top: 0;
            z-index: 10;
            background-image: linear-gradient(to right bottom, rgba($color: #ffffff, $alpha: 0), rgba($color: #ffffff, $alpha: 0.5));
          }
        }
        li {
          // max-height: 280px;
          overflow: hidden;
          span {
            font-size: 20px;
            font-weight: 1000;
          }
        }
        .vertical {
          vertical-align: middle;
          writing-mode: vertical-lr;
          word-wrap: break-word;
        }
      }
    }

    // 底部卡片
    .bottom-box {
      width: 100%;
      height: 40vh;
      overflow: hidden;
      // 动画效果
      .el-zoom-in-top-enter-active {
        transition: all 0.5s ease;
      }
      @for $i from 1 through 2 {
        & .el-zoom-in-top-enter-active:nth-child(#{$i}) {
          transition-delay: (($i - 1) * 80 + 640) * 1ms;
        }
      }
      .time-card,
      .order-card {
        width: calc((100% - 20px) / 2);
        box-sizing: border-box;
        .el-card__body {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
      }
    }
  }
</style>
