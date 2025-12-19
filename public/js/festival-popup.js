(function () {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  // 依赖 SweetAlert2
  if (typeof window.Swal === "undefined") {
    console.warn("SweetAlert2 (Swal) not found, festival popup script disabled.");
    return;
  }

  try {
    var d = new Date();
    var m = d.getMonth() + 1;
    var dd = d.getDate();
    var y = d.getFullYear();

    // 公祭日
    function setMemorialGray() {
      document.getElementsByTagName("html")[0].setAttribute("style", "filter: grayscale(60%);");
    }

    // 只弹一次
    function showOnce(message) {
      if (sessionStorage.getItem("isPopupWindow") !== "1") {
        Swal.fire(message);
        sessionStorage.setItem("isPopupWindow", "1");
      }
    }

    if (m === 9 && dd === 18) {
      setMemorialGray();
      showOnce("今天是九一八事变" + (y - 1931).toString() + "周年纪念日\n🪔勿忘国耻，振兴中华🪔");
    }
    if (m === 7 && dd === 7) {
      setMemorialGray();
      showOnce("今天是卢沟桥事变" + (y - 1937).toString() + "周年纪念日\n🪔勿忘国耻，振兴中华🪔");
    }
    if (m === 12 && dd === 13) {
      setMemorialGray();
      showOnce("今天是南京大屠杀" + (y - 1937).toString() + "周年纪念日\n🪔勿忘国耻，振兴中华🪔");
    }
    if (m === 8 && dd === 14) {
      setMemorialGray();
      showOnce("今天是世界慰安妇纪念日\n🪔勿忘国耻，振兴中华🪔");
    }

    // 节假日
    if (m === 10 && dd <= 3) {
      // 国庆节
      showOnce("祝祖国" + (y - 1949).toString() + "岁生日快乐！");
    }
    if (m === 8 && dd === 15) {
      // 搞来玩的，小日子投降
      showOnce("小日子已经投降" + (y - 1945).toString() + "年了😃");
    }
    if (m === 1 && dd === 1) {
      // 元旦节
      showOnce(y.toString() + "年元旦快乐！🎉");
    }
    if (m === 3 && dd === 8) {
      // 妇女节
      showOnce("各位女神们，妇女节快乐！👩");
    }

    var l = [
      "非常抱歉，因为不可控原因，博客将于明天停止运营！",
      "好消息，日本没了！",
      "美国垮了，原因竟然是川普！",
      "微软垮了！",
      "你的电脑已经过载，建议立即关机！",
      "你知道吗？站长很喜欢你哦！",
      "一分钟有61秒哦",
      "你喜欢的人跟别人跑了！",
    ];

    if (m === 4 && dd === 1) {
      // 愚人节，随机谎话
      showOnce(l[Math.floor(Math.random() * l.length)]);
    }
    if (m === 5 && dd === 1) {
      // 劳动节
      showOnce("劳动节快乐\n为各行各业辛勤工作的人们致敬！");
    }
    if (m === 5 && dd === 4) {
      // 青年节
      showOnce("青年节快乐\n青春不是回忆逝去,而是把握现在！");
    }
    if (m === 5 && dd === 20) {
      // 520
      showOnce("今年是520情人节\n快和你喜欢的人一起过吧！💑");
    }
    if (m === 7 && dd === 1) {
      // 建党节
      showOnce("祝中国共产党" + (y - 1921).toString() + "岁生日快乐！");
    }
    if (m === 9 && dd === 10) {
      // 教师节
      showOnce("各位老师们教师节快乐！👩‍🏫");
    }
    if (m === 12 && dd === 25) {
      // 圣诞节
      showOnce("圣诞节快乐！🎄");
    }

    // 下面是农历和节气计算代码
    var lunarInfo = [19416,19168,42352,21717,53856,55632,91476,22176,39632,21970,19168,42422,42192,53840,119381,46400,54944,44450,38320,84343,18800,42160,46261,27216,27968,109396,11104,38256,21234,18800,25958,54432,59984,28309,23248,11104,100067,37600,116951,51536,54432,120998,46416,22176,107956,9680,37584,53938,43344,46423,27808,46416,86869,19872,42416,83315,21168,43432,59728,27296,44710,43856,19296,43748,42352,21088,62051,55632,23383,22176,38608,19925,19152,42192,54484,53840,54616,46400,46752,103846,38320,18864,43380,42160,45690,27216,27968,44870,43872,38256,19189,18800,25776,29859,59984,27480,23232,43872,38613,37600,51552,55636,54432,55888,30034,22176,43959,9680,37584,51893,43344,46240,47780,44368,21977,19360,42416,86390,21168,43312,31060,27296,44368,23378,19296,42726,42208,53856,60005,54576,23200,30371,38608,19195,19152,42192,118966,53840,54560,56645,46496,22224,21938,18864,42359,42160,43600,111189,27936,44448,84835,37744,18936,18800,25776,92326,59984,27424,108228,43744,41696,53987,51552,54615,54432,55888,23893,22176,42704,21972,21200,43448,43344,46240,46758,44368,21920,43940,42416,21168,45683,26928,29495,27296,44368,84821,19296,42352,21732,53600,59752,54560,55968,92838,22224,19168,43476,41680,53584,62034,54560],
      solarMonth = [31,28,31,30,31,30,31,31,30,31,30,31],
      Gan = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"],
      Zhi = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"],
      Animals = ["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"],
      solarTerm = ["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"],
      sTermInfo = ["9778397bd097c36b0b6fc9274c91aa","97b6b97bd19801ec9210c965cc920e","97bcf97c3598082c95f8c965cc920f","97bd0b06bdb0722c965ce1cfcc920f","b027097bd097c36b0b6fc9274c91aa","97b6b97bd19801ec9210c965cc920e","97bcf97c359801ec95f8c965cc920f","97bd0b06bdb0722c965ce1cfcc920f","b027097bd097c36b0b6fc9274c91aa","97b6b97bd19801ec9210c965cc920e","97bcf97c359801ec95f8c965cc920f","97bd0b06bdb0722c965ce1cfcc920f","b027097bd097c36b0b6fc9274c91aa","9778397bd19801ec9210c965cc920e","97b6b97bd19801ec95f8c965cc920f","97bd09801d98082c95f8e1cfcc920f","97bd097bd097c36b0b6fc9210c8dc2","9778397bd197c36c9210c9274c91aa","97b6b97bd19801ec95f8c965cc920e","97bd09801d98082c95f8e1cfcc920f","97bd097bd097c36b0b6fc9210c8dc2","9778397bd097c36c9210c9274c91aa","97b6b97bd19801ec95f8c965cc920e","97bcf97c3598082c95f8e1cfcc920f","97bd097bd097c36b0b6fc9210c8dc2","9778397bd097c36c9210c9274c91aa","97b6b97bd19801ec9210c965cc920e","97bcf97c3598082c95f8c965cc920f","97bd097bd097c35b0b6fc920fb0722","9778397bd097c36b0b6fc9274c91aa","97b6b97bd19801ec9210c965cc920e","97bcf97c3598082c95f8c965cc920f","97bd097bd097c35b0b6fc920fb0722","9778397bd097c36b0b6fc9274c91aa","97b6b97bd19801ec9210c965cc920e","97bcf97c359801ec95f8c965cc920f","97bd097bd097c35b0b6fc920fb0722","9778397bd097c36b0b6fc9274c91aa","97b6b97bd19801ec9210c965cc920e","97bcf97c359801ec95f8c965cc920f","97bd097bd097c35b0b6fc920fb0722","9778397bd097c36b0b6fc9274c91aa","97b6b97bd19801ec9210c965cc920e","97bcf97c359801ec95f8c965cc920f","97bd097bd07f595b0b6fc920fb0722","9778397bd097c36b0b6fc9210c8dc2","9778397bd19801ec9210c9274c920e","97b6b97bd19801ec95f8c965cc920f","97bd07f5307f595b0b0bc920fb0722","7f0e397bd097c36b0b6fc9210c8dc2","9778397bd097c36c9210c9274c920e","97b6b97bd19801ec95f8c965cc920f","97bd07f5307f595b0b0bc920fb0722","7f0e397bd097c36b0b6fc9210c8dc2","9778397bd097c36c9210c9274c91aa","97b6b97bd19801ec9210c965cc920e","97bd07f1487f595b0b0bc920fb0722","7f0e397bd097c36b0b6fc9210c8dc2","9778397bd097c36b0b6fc9274c91aa","97b6b97bd19801ec9210c965cc920e","97bcf7f1487f595b0b0bb0b6fb0722","7f0e397bd097c35b0b6fc920fb0722","9778397bd097c36b0b6fc9274c91aa","97b6b97bd19801ec9210c965cc920e","97bcf7f1487f595b0b0bb0b6fb0722","7f0e397bd097c35b0b6fc920fb0722","9778397bd097c36b0b6fc9274c91aa","97b6b97bd19801ec9210c965cc920e","97bcf7f1487f531b0b0bb0b6fb0722","7f0e397bd097c35b0b6fc920fb0722","9778397bd097c36b0b6fc9274c91aa","97b6b97bd19801ec9210c965cc920e","97bcf7f1487f531b0b0bb0b6fb0722","7f0e397bd07f595b0b6fc920fb0722","9778397bd097c36b0b6fc9274c91aa","97b6b97bd19801ec9210c9274c920e","97bcf7f0e47f531b0b0bb0b6fb0722","7f0e397bd07f595b0b0bc920fb0722","9778397bd097c36b0b6fc9210c91aa","97b6b97bd197c36c9210c9274c920e","97bcf7f0e47f531b0b0bb0b6fb0722","7f0e397bd07f595b0b0bc920fb0722","9778397bd097c36b0b6fc9210c8dc2","9778397bd097c36c9210c9274c920e","97b6b7f0e47f531b0723b0b6fb0722","7f0e37f5307f595b0b0bc920fb0722","7f0e397bd097c36b0b6fc9210c8dc2","9778397bd097c36b0b70c9274c91aa","97b6b7f0e47f531b0723b0b6fb0721","7f0e37f1487f595b0b0bb0b6fb0722","7f0e397bd097c35b0b6fc9210c8dc2","9778397bd097c36b0b6fc9274c91aa","97b6b7f0e47f531b0723b0b6fb0721","7f0e27f1487f595b0b0bb0b6fb0722","7f0e397bd097c35b0b6fc920fb0722","9778397bd097c36b0b6fc9274c91aa","97b6b7f0e47f531b0723b0b6fb0721","7f0e27f1487f531b0b0bb0b6fb0722","7f0e397bd097c35b0b6fc920fb0722","9778397bd097c36b0b6fc9274c91aa","97b6b7f0e47f531b0723b0b6fb0721","7f0e27f1487f531b0b0bb0b6fb0722","7f0e397bd07f595b0b0bc920fb0722","9778397bd097c36b0b6fc9274c91aa","97b6b7f0e47f531b0723b0787b0721","7f0e27f0e47f531b0b0bb0b6fb0722","7f0e397bd07f595b0b0bc920fb0722","9778397bd097c36b0b6fc9210c91aa","97b6b7f0e47f149b0723b0787b0721","7f0e27f0e47f531b0723b0b6fb0722","7f0e397bd07f595b0b0bc920fb0722","9778397bd097c36b0b6fc9210c8dc2","977837f0e37f149b0723b0787b0721","7f07e7f0e47f531b0723b0b6fb0722","7f0e37f5307f595b0b0bc920fb0722","7f0e397bd097c35b0b6fc9210c8dc2","977837f0e37f14998082b0787b0721","7f07e7f0e47f531b0723b0b6fb0721","7f0e37f1487f595b0b0bb0b6fb0722","7f0e397bd097c35b0b6fc9210c8dc2","977837f0e37f14998082b0787b06bd","7f07e7f0e47f531b0723b0b6fb0721","7f0e27f1487f531b0b0bb0b6fb0722","7f0e397bd097c35b0b6fc920fb0722","977837f0e37f14998082b0787b06bd","7f07e7f0e47f531b0723b0b6fb0721","7f0e27f1487f531b0b0bb0b6fb0722","7f0e397bd097c35b0b6fc920fb0722","977837f0e37f14998082b0787b06bd","7f07e7f0e47f531b0723b0b6fb0721","7f0e27f1487f531b0b0bb0b6fb0722","7f0e397bd07f595b0b0bc920fb0722","977837f0e37f14998082b0787b06bd","7f07e7f0e47f531b0723b0b6fb0721","7f0e27f1487f531b0b0bb0b6fb0722","7f0e397bd07f595b0b0bc920fb0722","977837f0e37f14998082b0787b06bd","7f07e7f0e47f149b0723b0787b0721","7f0e27f0e47f531b0b0bb0b6fb0722","7f0e397bd07f595b0b0bc920fb0722","977837f0e37f14998082b0723b06bd","7f07e7f0e37f149b0723b0787b0721","7f0e27f0e47f531b0723b0b6fb0722","7f0e397bd07f595b0b0bc920fb0722","977837f0e37f14898082b0723b02d5","7ec967f0e37f14998082b0787b0721","7f07e7f0e47f531b0723b0b6fb0722","7f0e37f1487f595b0b0bb0b6fb0722","7f0e37f0e37f14898082b0723b02d5","7ec967f0e37f14998082b0787b0721","7f07e7f0e47f531b0723b0b6fb0722","7f0e37f1487f531b0b0bb0b6fb0722","7f0e37f0e37f14898082b0723b02d5","7ec967f0e37f14998082b0787b06bd","7f07e7f0e47f531b0723b0b6fb0721","7f0e37f1487f531b0b0bb0b6fb0722","7f0e37f0e37f14898082b072297c35","7ec967f0e37f14998082b0787b06bd","7f07e7f0e47f531b0723b0b6fb0721","7f0e27f1487f531b0b0bb0b6fb0722","7f0e37f0e37f14898082b072297c35","7ec967f0e37f14998082b0787b06bd","7f07e7f0e47f531b0723b0b6fb0721","7f0e27f1487f531b0b0bb0b6fb0722","7f0e37f0e366aa89801eb072297c35","7ec967f0e37f14998082b0787b06bd","7f07e7f0e47f149b0723b0787b0721","7f0e27f1487f531b0b0bb0b6fb0722","7f0e37f0e366aa89801eb072297c35","7ec967f0e37f14998082b0723b06bd","7f07e7f0e47f149b0723b0787b0721","7f0e27f0e47f531b0723b0b6fb0722","7f0e37f0e366aa89801eb072297c35","7ec967f0e37f14998082b0723b06bd","7f07e7f0e37f14998083b0787b0721","7f0e27f0e47f531b0723b0b6fb0722","7f0e37f0e366aa89801eb072297c35","7ec967f0e37f14898082b0723b02d5","7f07e7f0e37f14998082b0787b0721","7f07e7f0e47f531b0723b0b6fb0722","7f0e36665b66aa89801e9808297c35","665f67f0e37f14898082b0723b02d5","7ec967f0e37f14998082b0787b0721","7f07e7f0e47f531b0723b0b6fb0722","7f0e36665b66a449801e9808297c35","665f67f0e37f14898082b0723b02d5","7ec967f0e37f14998082b0787b06bd","7f07e7f0e47f531b0723b0b6fb0721","7f0e36665b66a449801e9808297c35","665f67f0e37f14898082b072297c35","7ec967f0e37f14998082b0787b06bd","7f07e7f0e47f531b0723b0b6fb0721","7f0e26665b66a449801e9808297c35","665f67f0e37f1489801eb072297c35","7ec967f0e37f14998082b0787b06bd","7f07e7f0e47f531b0723b0b6fb0721","7f0e27f1487f531b0b0bb0b6fb0722"],
      nStr1 = ["日","一","二","三","四","五","六","七","八","九","十"],
      nStr2 = ["初","十","廿","卅"],
      nStr3 = ["正","二","三","四","五","六","七","八","九","十","冬","腊"];

    function lYearDays(b) {
      var f, c = 348;
      for (f = 32768; f > 8; f >>= 1) c += lunarInfo[b - 1900] & f ? 1 : 0;
      return c + leapDays(b);
    }
    function leapMonth(b) {
      return 15 & lunarInfo[b - 1900];
    }
    function leapDays(b) {
      return leapMonth(b) ? (65536 & lunarInfo[b - 1900] ? 30 : 29) : 0;
    }
    function monthDays(b, f) {
      return f > 12 || f < 1 ? -1 : (lunarInfo[b - 1900] & (65536 >> f) ? 30 : 29);
    }
    function solarDays(b, f) {
      if (f > 12 || f < 1) return -1;
      var c = f - 1;
      return c === 1 ? (b % 4 === 0 && b % 100 !== 0 || b % 400 === 0 ? 29 : 28) : solarMonth[c];
    }
    function toGanZhiYear(b) {
      var f = (b - 3) % 10, c = (b - 3) % 12;
      f === 0 && (f = 10);
      c === 0 && (c = 12);
      return Gan[f - 1] + Zhi[c - 1];
    }
    function toAstro(b, f) {
      return "魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯".substr(2 * b - (f < [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22][b - 1] ? 2 : 0), 2) + "座";
    }
    function toGanZhi(b) {
      return Gan[b % 10] + Zhi[b % 12];
    }
    function getTerm(b, f) {
      if (b < 1900 || b > 2100) return -1;
      if (f < 1 || f > 24) return -1;
      var c = sTermInfo[b - 1900],
        e = [
          parseInt("0x" + c.substr(0, 5)).toString(),
          parseInt("0x" + c.substr(5, 5)).toString(),
          parseInt("0x" + c.substr(10, 5)).toString(),
          parseInt("0x" + c.substr(15, 5)).toString(),
          parseInt("0x" + c.substr(20, 5)).toString(),
          parseInt("0x" + c.substr(25, 5)).toString(),
        ],
        a = [
          e[0].substr(0, 1),
          e[0].substr(1, 2),
          e[0].substr(3, 1),
          e[0].substr(4, 2),
          e[1].substr(0, 1),
          e[1].substr(1, 2),
          e[1].substr(3, 1),
          e[1].substr(4, 2),
          e[2].substr(0, 1),
          e[2].substr(1, 2),
          e[2].substr(3, 1),
          e[2].substr(4, 2),
          e[3].substr(0, 1),
          e[3].substr(1, 2),
          e[3].substr(3, 1),
          e[3].substr(4, 2),
          e[4].substr(0, 1),
          e[4].substr(1, 2),
          e[4].substr(3, 1),
          e[4].substr(4, 2),
          e[5].substr(0, 1),
          e[5].substr(1, 2),
          e[5].substr(3, 1),
          e[5].substr(4, 2),
        ];
      return parseInt(a[f - 1]);
    }
    function toChinaMonth(b) {
      if (b > 12 || b < 1) return -1;
      var f = nStr3[b - 1];
      f += "月";
      return f;
    }
    function toChinaDay(b) {
      var f;
      switch (b) {
        case 10:
          f = "初十";
          break;
        case 20:
          f = "二十";
          break;
        case 30:
          f = "三十";
          break;
        default:
          f = nStr2[Math.floor(b / 10)];
          f += nStr1[b % 10];
      }
      return f;
    }
    function getAnimal(b) {
      return Animals[(b - 4) % 12];
    }
    function solar2lunar(b, f, c) {
      if (b < 1900 || b > 2100) return -1;
      if (b === 1900 && f === 1 && c < 31) return -1;
      var e, a, r = null, t = 0;
      r = b ? new Date(b, parseInt(f) - 1, c) : new Date();
      b = r.getFullYear();
      f = r.getMonth() + 1;
      c = r.getDate();
      var dDiff = (Date.UTC(r.getFullYear(), r.getMonth(), r.getDate()) - Date.UTC(1900, 0, 31)) / 864e5;
      for (e = 1900; e < 2101 && dDiff > 0; e++) dDiff -= t = lYearDays(e);
      if (dDiff < 0) {
        dDiff += t;
        e--;
      }
      var n = new Date(),
        s = false;
      if (n.getFullYear() === b && n.getMonth() + 1 === f && n.getDate() === c) s = true;
      var u = r.getDay(),
        o = nStr1[u];
      if (u === 0) u = 7;
      var lYear = e;
      a = leapMonth(e);
      var isLeap = false;
      for (e = 1; e < 13 && dDiff > 0; e++) {
        if (a > 0 && e === a + 1 && !isLeap) {
          --e;
          isLeap = true;
          t = leapDays(lYear);
        } else {
          t = monthDays(lYear, e);
        }
        if (isLeap && e === a + 1) isLeap = false;
        dDiff -= t;
      }
      if (dDiff === 0 && a > 0 && e === a + 1) {
        if (isLeap) {
          isLeap = false;
        } else {
          isLeap = true;
          --e;
        }
      }
      if (dDiff < 0) {
        dDiff += t;
        --e;
      }
      var month = e,
        day = dDiff + 1,
        g = f - 1,
        v = toGanZhiYear(lYear),
        yTerm = getTerm(b, 2 * f - 1),
        mTerm = getTerm(b, 2 * f),
        p = toGanZhi(12 * (b - 1900) + f + 11);
      if (c >= yTerm) p = toGanZhi(12 * (b - 1900) + f + 12);
      var M = false,
        T = null;
      if (yTerm === c) {
        M = true;
        T = solarTerm[2 * f - 2];
      }
      if (mTerm === c) {
        M = true;
        T = solarTerm[2 * f - 1];
      }
      var I = toGanZhi(Date.UTC(b, g, 1, 0, 0, 0, 0) / 864e5 + 25567 + 10 + c - 1),
        C = toAstro(f, c);
      return {
        lYear: lYear,
        lMonth: month,
        lDay: day,
        Animal: getAnimal(lYear),
        IMonthCn: (isLeap ? "闰" : "") + toChinaMonth(month),
        IDayCn: toChinaDay(day),
        cYear: b,
        cMonth: f,
        cDay: c,
        gzYear: v,
        gzMonth: p,
        gzDay: I,
        isToday: s,
        isLeap: isLeap,
        nWeek: u,
        ncWeek: "星期" + o,
        isTerm: M,
        Term: T,
        astro: C,
      };
    }

    var calendarFormatter = {
      solar2lunar: function (b, f, c) {
        return solar2lunar(b, f, c);
      },
      lunar2solar: function (b, f, c, e) {
        e = !!e;
        if (e && leapMonth !== f) return -1;
        if ((b === 2100 && f === 12 && c > 1) || (b === 1900 && f === 1 && c < 31)) return -1;
        var a = monthDays(b, f),
          r = a;
        if (e) r = leapDays(b, f);
        if (b < 1900 || b > 2100 || c > r) return -1;
        for (var t = 0, dYear = 1900; dYear < b; dYear++) t += lYearDays(dYear);
        var n = 0,
          s = false;
        for (dYear = 1; dYear < f; dYear++) {
          n = leapMonth(b);
          if (!s && n <= dYear && n > 0) {
            t += leapDays(b);
            s = true;
          }
          t += monthDays(b, dYear);
        }
        if (e) t += a;
        var u = Date.UTC(1900, 1, 30, 0, 0, 0),
          o = new Date(864e5 * (t + c - 31) + u);
        return solar2lunar(o.getUTCFullYear(), o.getUTCMonth() + 1, o.getUTCDate());
      },
    };

    // 传统节日部分（公历日期）
    if ((y === 2023 && m === 4 && dd === 5) || (y === 2024 && m === 4 && dd === 4) || (y === 2025 && m === 4 && dd === 4)) {
      // 清明节
      showOnce("清明时节雨纷纷,一束鲜花祭故人💐");
    }
    if ((y === 2023 && m === 12 && dd === 22) || (y === 2024 && m === 12 && dd === 21) || (y === 2025 && m === 12 && dd === 21)) {
      // 冬至
      showOnce("冬至快乐\n快吃上一碗热热的汤圆和饺子吧🧆");
    }

    // 农历节日
    var lunar = calendarFormatter.solar2lunar();

    // 兔兔的农历生日：对应公历 2010-02-09 当天的农历日期
    // 每年当农历日期与这一天相同时，弹出生日祝福
    try {
      var birthLunar = calendarFormatter.solar2lunar(2010, 2, 9);
      if (
        lunar["IMonthCn"] === birthLunar.IMonthCn &&
        lunar["IDayCn"] === birthLunar.IDayCn
      ) {
        var age = y - 2010;
        if (age > 0 && age < 150) {
          showOnce(
            "祝兔兔" +
              age.toString() +
              "岁生日快乐！🎂🐰🎉\n\n" +
              "愿你永远保持好奇与热爱，✨\n" +
              "像现在这样认真生活、认真快乐。💖\n" +
              "今天可以多偷懒一点，把时间留给自己~ ☕️🍰"
          );
        } else {
          // 防止年份计算异常时依然给个简单祝福
          showOnce("祝兔兔生日快乐！🎂🐰 愿你天天都被温柔以待～💫");
        }
      }
    } catch (e) {
      console.error("Birthday lunar calculation error", e);
    }

    // 农历采用汉字计算，防止出现闰月导致问题
    if (
      (lunar["IMonthCn"] === "正月" && lunar["IDayCn"] === "初六") ||
      (lunar["IMonthCn"] === "正月" && lunar["IDayCn"] === "初五") ||
      (lunar["IMonthCn"] === "正月" && lunar["IDayCn"] === "初四") ||
      (lunar["IMonthCn"] === "正月" && lunar["IDayCn"] === "初三") ||
      (lunar["IMonthCn"] === "正月" && lunar["IDayCn"] === "初二") ||
      (lunar["IMonthCn"] === "正月" && lunar["IDayCn"] === "初一") ||
      (lunar["IMonthCn"] === "腊月" && lunar["IDayCn"] === "三十") ||
      (lunar["IMonthCn"] === "腊月" && lunar["IDayCn"] === "廿九")
    ) {
      // 春节：大年三十到初六，有时除夕是腊月二十九
      showOnce(y.toString() + "年新年快乐\n🎊祝你心想事成，诸事顺利🎊");
    }
    if (lunar["IMonthCn"] === "正月" && lunar["IDayCn"] === "十五") {
      // 元宵节
      showOnce("元宵节快乐\n送你一个大大的灯笼🧅");
    }
    if (lunar["IMonthCn"] === "五月" && lunar["IDayCn"] === "初五") {
      // 端午节
      showOnce("端午节快乐\n请你吃一条粽子🍙");
    }
    if (lunar["IMonthCn"] === "七月" && lunar["IDayCn"] === "初七") {
      // 七夕节
      showOnce("七夕节快乐\n黄昏后,柳梢头,牛郎织女来碰头");
    }
    if (lunar["IMonthCn"] === "八月" && lunar["IDayCn"] === "十五") {
      // 中秋节
      showOnce("中秋节快乐\n请你吃一块月饼🍪");
    }
    if (lunar["IMonthCn"] === "九月" && lunar["IDayCn"] === "初九") {
      // 重阳节
      showOnce("重阳节快乐\n独在异乡为异客，每逢佳节倍思亲");
    }
  } catch (err) {
    console.error("Festival popup script error:", err);
  }
})();
