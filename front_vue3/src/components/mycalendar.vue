<!-- my-calendar.vue -->
<template>
  <!-- @datesSet="handleDatesRender" -->
  <div class="my-calendar">
    <FullCalendar ref="myCalendar" :options="calendarOptions" />
    <el-dialog
      :title="optTitle"
      v-model="dialogFormVisible"
      @close="DialogClosed"
    >
      <el-form :model="form" ref="FormRef">
        <el-form-item label="事件名称" label-width="110px">
          <el-input
            v-model="form.title"
            auto-complete="off"
            placeholder="请输入事件名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="开始时间" label-width="110px">
          <el-date-picker
            v-model="form.rrule.dtstart"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动时长(小时)" label-width="110px">
          <el-input-number
            v-model="form.duration"
            :precision="1"
            :step="0.5"
            controls-position="right"
            :min="1"
          >
          </el-input-number>
        </el-form-item>
        <el-form-item label="事件地点" label-width="110px">
          <el-input
            v-model="form.area"
            auto-complete="off"
            placeholder="请输入事件地点"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="事件描述" label-width="110px">
          <el-input
            v-model="form.detail"
            auto-complete="off"
            placeholder="请输入事件描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="重复事件" label-width="110px">
          <el-checkbox label="是" name="type" v-model="form.more"></el-checkbox>
        </el-form-item>
        <el-form v-show="form.more" label="重复事件">
          <el-form-item label="重复类型" label-width="110px">
            <el-select v-model="form.rrule.freq" placeholder="请选择重复类型">
              <el-option label="年" value="yearly"></el-option>
              <el-option label="月" value="monthly"></el-option>
              <el-option label="周" value="weekly"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="重复间隔" label-width="110px">
            <el-input-number
              v-model="form.rrule.interval"
              controls-position="right"
              :min="1"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="结束时间" label-width="110px">
            <el-date-picker
              v-model="form.rrule.until"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="warning"
          @click="delEvent"
          v-if="form.id"
          style="float: left"
          >删 除</el-button
        >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEvent">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
<script setup>
// 引入已经安装好的，项目中所需要的 FullCalendar 插件
import { ElMessage, ElNotification } from "element-plus";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import rrulePlugin from "@fullcalendar/rrule";
import axios from "axios";
import moment from "moment";
import { ref, onMounted } from "vue";
import { useStore } from "vuex"; // 导入 useStore 函数

const store = useStore(); // 获取 store 对象

const form = ref({
  user_id: "",
  id: null, //事件id
  title: "", //事件标题
  area: "", //地点
  detail: "", //描述
  duration: "10:00", //事件持续时间
  more: false, //是否为周期时间 默认为false
  rrule: {
    freq: "weekly", //rrule是周期时间的一个对象 freq为按xx为周期有['weekly','monthly','yearly']
    interval: 1, //周期循环的间隔,1就是没有间隔 2就是隔一个周期加一个时间
    dtstart: "2024-02-13T00:15:00Z", //开始时间
    until: "2025-02-10T11:30:00Z", // 周期事件结束时间,空的时候就是无限周期
    count: 1, //周期循环几次,1的时候代表循环一次就是普通事件,""的时候就是周期事件
  },
});
const userid = ref("");
const calendarEventDrop = ref((info) => {
  dropEvent(info);
});
const calendarEvents = ref([
  {
    id: 1,
    title: "周事件",
    area: "北京",
    detail: "大商家",
    more: true,
    duration: "1:00",
    rrule: {
      freq: "weekly",
      interval: 1,
      dtstart: "2024-02-13T00:00:00",
      until: "2025-02-10T11:30:00",
      count: "",
    },
  },
  {
    id: 2,
    title: "月事件",
    area: "北京",
    detail: "大商家",
    duration: "8:00",
    rrule: {
      freq: "monthly",
      interval: 1,
      // bymonthday:[7],//如果不加就按每月的这一天开始算
      dtstart: "2024-02-10T10:30:00", // will also accept '20120201T103000'
      until: "2024-06-01", // will also accept '20120201'
    },
    more: true,
  },
  {
    id: 3,
    title: "年事件",
    duration: "8:00",
    more: true,
    rrule: {
      freq: "yearly",
      interval: 1,
      // byyearday:[7],
      dtstart: "2024-02-19T10:30:00", // will also accept '20120201T103000'
      until: "2025-06-01", // will also accept '20120201'
    },
  },
  {
    id: 4,
    title: "节假日",
    duration: "8:00",
    area: "北京",
    detail: "大商家",
    more: false,
    rrule: {
      count: 1,
      freq: "weekly",
      interval: 1,
      // bymonthday: ['mo'],
      dtstart: "2024-02-02T10:30:00", // will also accept '20120201T103000'
      until: "2050-06-01", // will also accept '20120201'
    },
  },
  {
    id: 5,
    title: "K日",
    duration: "8:00",
    area: "北京",
    detail: "大商家",
    more: false,
    rrule: {
      count: 1,
      freq: "weekly",
      interval: 1,
      // bymonthday: ['mo'],
      dtstart: "2024-02-02T10:30:00", // will also accept '20120201T103000'
      until: "2050-06-01",
    },
  },
  {
    id: 6,
    title: "双休日",
    area: "北京",
    duration: "8:00",
    detail: "大商家",
    more: false,
    rrule: {
      count: 1,
      freq: "weekly",
      interval: 1,
      // bymonthday: ['mo'],
      dtstart: "2024-02-02T10:30:00", // will also accept '20120201T103000'
      until: "2050-06-01",
    },
  },
]);
const optTitle = ref("添加事件");
const dialogFormVisible = ref(false);

//获取所有事件
const getlist = async () => {
  userid.value = store.getters.getUserId;
  //先拿id
  const { data: res } = await axios.post("/get_event", {
    user_id: userid.value,
  }); //发请求

  if (res.code !== 200) {
    return ElMessage.error(res.msg);
  }

  calendarEvents.value = res.data;
  // console.log('请求结果', calendarEvents.value )

  calendarOptions.value.events = calendarEvents.value;
  ElNotification.closeAll();

  mynotify();
};

const handleEvents = (info) => {};

// 日期点击
const handleDateClick = (selectInfo) => {
  // console.log(selectInfo.dateStr)
  if (confirm("您是否要在【" + selectInfo.dateStr + "】添加一个新的事件？")) {
    //数据初始化
    optTitle.value = "新增事件";
    form.value.title = "";
    form.value.id = "";
    form.value.duration = "10:00";
    let durationArr = form.value.duration.split(":");
    form.value.duration = parseInt(durationArr[0], 10);
    form.value.area = "";
    form.value.detail = "";
    form.value.more = false;
    // 创建一个正则表达式，用于匹配日期字符串中是否包含字母 T
    let regex = new RegExp("T");
    if (regex.test(selectInfo.dateStr)) {
      form.value.rrule.dtstart = selectInfo.dateStr;
      console.log("true");
    } else {
      console.log("测试", selectInfo.dateStr);

      form.value.rrule.dtstart = selectInfo.dateStr + "T08:00:00+08:00";
      console.log(form.value.rrule.dtstart);
    }
    form.value.rrule.freq = "weekly";
    form.value.rrule.interval = 1;
    form.value.rrule.until = "";
    dialogFormVisible.value = true;
  }
};

// 日程点击信息展示
const handleEventClick = (info) => {
  // console.log("事件点击:", info);
  info.el.style.borderColor = "red";
  dialogFormVisible.value = true;
  optTitle.value = "修改事件";
  calendarEvents.value.forEach((item, index, arr) => {
    if (item.id == info.event.id) {
      form.value = item;
      if (typeof form.value.duration != "number") {
        let durationArr = form.value.duration.split(":");
        console.log(durationArr);

        form.value.duration = parseInt(durationArr[0], 10);
        form.value.duration += parseInt(durationArr[1]) == 30 ? 0.5 : 0;
        console.log(form.value.duration);
      }
    }
  });
};
// 日程拖动事件
const handleEventDrop = (info) => {
  calendarEvents.value.forEach((item, index, arr) => {
    if (item.id == info.event.id) {
      form.value = item;
      if (typeof form.value.duration != "number") {
        let durationArr = form.value.duration.split(":");
        form.value.duration = parseInt(durationArr[0], 10);
        form.value.duration += parseInt(durationArr[1]) == 30 ? 0.5 : 0;
      }
    }
  });
  form.value.rrule.dtstart = info.event.startStr;
  saveEvent();
};
// 日程缩放事件
const eventResize = (info) => {
  calendarEvents.value.forEach((item, index, arr) => {
    if (item.id == info.event.id) {
      form.value = item;
      if (typeof form.value.duration != "number") {
        let durationArr = form.value.duration.split(":");
        form.value.duration = parseInt(durationArr[0], 10);
        form.value.duration += parseInt(durationArr[1]) == 30 ? 0.5 : 0;
      }
    }
  });
  console.log(form.value);

  // console.log(form.value.rrule.dtstart, info.event.startStr);
  // 给定的UTC时间字符串和带时区信息的时间字符串
  var utcTimeString = form.value.rrule.dtstart;
  //持续时间转为时间戳
  var durationtamp = form.value.duration * 60 * 60 * 1000;
  
  var startTimeString = info.event.startStr;
  var endTimeString = info.event.endStr;
  // 将UTC时间字符串转换为时间戳
  var utcTimestamp = Date.parse(utcTimeString); // 时间戳单位为毫秒
  // 将带时区信息的时间字符串转换为时间戳
  var endTimestamp = Date.parse(endTimeString);
  var startTimestamp = Date.parse(startTimeString);
  
  var formEndtamp = utcTimestamp + durationtamp
  //拖动尾部
  if (startTimestamp == utcTimestamp) {
    console.log("拖动了尾部");
    //由尾部时间减去开始时间得出新的时间戳进行替换。
    var newDuration = endTimestamp-startTimestamp
    console.log((newDuration)/ (1000 * 60 * 60));
    form.value.duration =(newDuration)/ (1000 * 60 * 60)

  }
  //拖动头部
  if (endTimestamp == formEndtamp) {
    console.log("拖动了头部");
    form.value.duration =
      form.value.duration + (utcTimestamp - startTimestamp) / (1000 * 60 * 60);
    form.value.rrule.dtstart = info.event.startStr;
  }

  //新的持续时间

  saveEvent();
  // form.value = {
  //   id: info.event.id,
  //   title: info.event.title,
  //   start: info.event.startStr,
  //   end: info.event.endStr,
  //   area: info.event._def.extendedProps.area,
  //   detail: info.event._def.extendedProps.detail,
  // };
  // saveEvent();
  // console.log(form.value)
};
//保存事件
const saveEvent = async () => {
  form.value.user_id = userid.value;
  //判断是否为周期事件
  if (form.value.more == false) {
    form.value.rrule.count = 1;
  } else {
    // console.log("是周期事件")
    delete form.value.rrule.count;
  }
  //将持续时间字段格式化
  if (form.value.rrule.until === "") {
    // console.log("触发了",delete form.value.rrule.until)
    delete form.value.rrule.until;
  }
  var duration = form.value.duration;
  var integerPart = Math.floor(duration); // 整数部分
  var decimalPart = duration - integerPart; // 小数部分
  // 将小数部分转换为分钟
  var minutes = decimalPart === 0.5 ? "30" : "00";
  var durationString = integerPart.toString() + ":" + minutes;
  // console.log('新增form', form.value)
  if (form.value.id === undefined || form.value.id == "") {
    //新增
    // form.value.id = res.id;
    const { data: res } = await axios.post("/add_event", {
      ...form.value,
      // duration: form.value.duration.toString() + ":00",
      duration: durationString,
    });
    if (res.code !== 200) {
      return ElMessage.error(res.msg);
    }
    ElMessage.success(res.msg);
  } else {
    //修改
    const { data: res } = await axios.post("/update_event", {
      ...form.value,
      duration: durationString,
    });
    // console.log(res)
    if (res.code !== 200) {
      return ElMessage.error(res.msg);
    }
    ElMessage.success('事件更新成功');
  }
  dialogFormVisible.value = false;
  getlist();
};

//弹窗
const myCalendar = ref(null);
const mynotify = async () => {
  let calendarApi = myCalendar.value.getApi();
  let Events = calendarApi.getEvents();
  let hasRecentEvent = false; // 定义一个变量，表示是否有近期活动
  let time = moment().format("YYYY-MM-DDTHH:mm:ss");
  // console.log('所有事件', Events);
  for (let event of Events) {
    // 创建一个新的 Date 对象，表示当前系统时间
    let now = new Date(time);
    let nowstamp = now.getTime(); //当前时间戳
    let startstamp = event.start.getTime(); //事件开始时间戳
    let endstamp = event.end.getTime(); //事件结束时间戳
    let minutesDifference = (startstamp - nowstamp) / (1000 * 60); //事件开始时间-当前时间
    if (minutesDifference <= 30 && minutesDifference > 0) {
      ElNotification({
        title: "提示",
        message: event.title + "活动即将开始",
        type: "warning",
        duration: 5000,
        customClass: "mynotify",
      });
      hasRecentEvent = true; // 将 hasRecentEvent 设置为 true
    } else if (startstamp < nowstamp && nowstamp < endstamp) {
      ElNotification({
        title: "提示",
        message: event.title + "活动已经开始",
        type: "warning",
        duration: 5000,
        customClass: "mynotify",
      });
      hasRecentEvent = true; // 将 hasRecentEvent 设置为 true
    }
  }
};
const delEvent = async () => {
  const { data: res } = await axios.post("/del_event", { id: form.value.id });
  if (res.code !== 200) {
    return ElMessage.error(res.msg);
  }
  ElMessage.success(res.msg);
  dialogFormVisible.value = false;
  ElNotification.closeAll();
  getlist();
};
const FormRef = ref(null);
const DialogClosed = () => {
  // console.log('guan')
  FormRef.value.resetFields();
  ElNotification.closeAll();
  getlist();
};
//日程拖动

const calendarOptions = ref({
  plugins: [
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin,
    listPlugin,
    rrulePlugin,
  ],

  // 日历头部按钮位置
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth, timeGridWeek, timeGridDay",
  },
  // 日历头部按钮中文转换
  buttonText: {
    today: "今天",
    month: "月",
    week: "周",
    day: "天",
  },

  initialView: "dayGridMonth", // 指定默认显示视图
  firstDay: "1",
  weekNumberCalculation: "ISO", // 与firstDay配套使用
  eventColor: "#3d8eec", // 全部日历日程背景色
  // timeGridEventMinHeight: '20', // 设置事件的最小高度
  aspectRatio: "2.2", // 设置日历单元格宽高比
  displayEventTime: true, // 是否显示事件时间
  allDaySlot: false, // 周、日视图时，all-day不显示
  // eventLimit: true, // 设置月日程，与all-day slot 的最大显示数量，超过的通过弹窗展示
  eventTimeFormat: {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  },
  slotLabelFormat: {
    hour: "2-digit",
    minute: "2-digit",
    meridiem: false,
    hour12: false, // 设置时间为24小时制
  },
  locale: "zh-cn",
  eventTimeFormat: {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  },
  events: [],
  editable: true, // 是否可以进行（拖动、缩放）修改
  eventResizableFromStart: true,
  eventStartEditable: true, // Event日程开始时间可以改变，默认为true，若为false,则表示开始结束时间范围不能拉伸，只能拖拽
  eventDurationEditable: true, // Event日程的开始结束时间距离是否可以改变，默认为true,若为false，则表示开始结束时间范围不能拉伸，只能拖拽
  selectable: true, // 是否可以选中日历格
  selectMirror: true,
  selectMinDistance: 0, // 选中日历格的最小距离
  weekends: true,
  navLinks: true, // 天链接
  // selectHelper: false,
  // selectEventOverlap: false, // 相同时间段的多个日程视觉上是否允许重叠，默认为true，允许
  dayMaxEvents: true,
  dateClick: handleDateClick, // 日期点击
  eventsSet: handleEvents, // 事件点击
  eventClick: handleEventClick, // 日程点击信息展示
  eventDrop: handleEventDrop, // 日程拖动事件
  eventResize: eventResize, // 日程缩放事件
});
onMounted(() => {
  getlist();
  ElNotification.closeAll();
});
</script>
<style lang="less">
// .mynotify {
//   left: 50%;
//   // transform: translateX(55%);
// }
/* 自定义数字输入框append  */
</style>