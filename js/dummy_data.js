// dummy data goes here
// first is the result returned by the geocoder
// i will limit result to one, so the returned result should be
// an array with one object
// obviously got to factor not getting any results
var geocoderArr = [
  {
    country: 'GB',
    lat: 51.4538,
    local_names: {
      ar: 'برستل',
      be: 'Брысталь',
      bg: 'Бристъл',
      br: 'Bryste',
      cy: 'Bryste',
      el: 'Μπρίστολ',
      en: 'Bristol',
      eo: 'Bristolo',
      ja: 'ブリストル',
      ko: '브리스틀',
      ks: 'برسٹل',
      lt: 'Bristolis',
      mk: 'Бристол',
      pa: 'ਬਰਿਸਟਲ',
      ru: 'Бристоль',
      sr: 'Бристол',
      uk: 'Бристоль',
      ur: 'برسٹل',
      zh: '布里斯托',
    },
    lon: -2.5973,
    name: 'Bristol',
    state: 'England',
  },
];

// the second thing is going to a single object that returns weather info about
// that city giving weather info about that day
var cityObj = [
  {
    base: 'stations',
    clouds: {
      all: 100,
    },
    cod: 200,
    coord: {
      lat: 51.4538,
      lon: -2.5973,
    },
    dt: 1671459672,
    id: 3333134,
    main: {
      feels_like: 13.17,
      humidity: 96,
      pressure: 1002,
      temp: 13.28,
      temp_max: 14.36,
      temp_min: 12.31,
    },
    name: 'Bristol',
    rain: {
      onehour: 1.3,
    },
    sys: {
      country: 'GB',
      id: 2029649,
      sunrise: 1671437534,
      sunset: 1671465756,
      type: 2,
    },
    timezone: 0,
    visibility: 4900,
    weather: [
      {
        description: 'drizzle rain',
        icon: '09d',
        id: 311,
        main: 'Drizzle',
      },
      {
        description: 'moderate rain',
        icon: '10d',
        id: 501,
        main: 'Rain',
      },
    ],
    wind: {
      deg: 190,
      speed: 8.23,
    },
  },
];

// the third result is the forecast array.
// 40 weather forecasts
var forecastArr = [
  {
    clouds: {
      all: 100,
    },
    dt: 1671462000,
    dt_txt: '2022-12-19 15:00:00',
    main: {
      feels_like: 13.23,
      grnd_level: 1000,
      humidity: 96,
      pressure: 1002,
      sea_level: 1002,
      temp: 13.33,
      temp_kf: 0.04,
      temp_max: 13.33,
      temp_min: 13.29,
    },
    pop: 0.85,
    rain: {
      threehour: 0.63,
    },
    sys: {
      pod: 'd',
    },
    visibility: 10000,
    weather: [
      {
        description: 'light rain',
        icon: '10d',
        id: 500,
        main: 'Rain',
      },
    ],
    wind: {
      deg: 211,
      gust: 17.96,
      speed: 9.57,
    },
  },
  {
    clouds: {
      all: 100,
    },
    dt: 1671472800,
    dt_txt: '2022-12-19 18:00:00',
    main: {
      feels_like: 13.03,
      grnd_level: 1001,
      humidity: 95,
      pressure: 1002,
      sea_level: 1002,
      temp: 13.18,
      temp_kf: 0.29,
      temp_max: 13.18,
      temp_min: 12.89,
    },
    pop: 0.97,
    rain: {
      threehour: 0.82,
    },
    sys: {
      pod: 'n',
    },
    visibility: 10000,
    weather: [
      {
        description: 'light rain',
        icon: '10n',
        id: 500,
        main: 'Rain',
      },
    ],
    wind: {
      deg: 205,
      gust: 15.53,
      speed: 8.36,
    },
  },
  {
    clouds: {
      all: 100,
    },
    dt: 1671483600,
    dt_txt: '2022-12-19 21:00:00',
    main: {
      feels_like: 12.88,
      grnd_level: 1000,
      humidity: 94,
      pressure: 1003,
      sea_level: 1003,
      temp: 13.06,
      temp_kf: 0.14,
      temp_max: 13.06,
      temp_min: 12.92,
    },
    pop: 0.98,
    rain: {
      threehour: 0.92,
    },
    sys: {
      pod: 'n',
    },
    visibility: 10000,
    weather: [
      {
        description: 'light rain',
        icon: '10n',
        id: 500,
        main: 'Rain',
      },
    ],
    wind: {
      deg: 199,
      gust: 17.44,
      speed: 9.68,
    },
  },
  {
    clouds: {
      all: 100,
    },
    dt: 1671494400,
    dt_txt: '2022-12-20 00:00:00',
    main: {
      feels_like: 12.38,
      grnd_level: 999,
      humidity: 93,
      pressure: 1001,
      sea_level: 1001,
      temp: 12.63,
      temp_kf: 0,
      temp_max: 12.63,
      temp_min: 12.63,
    },
    pop: 1,
    rain: {
      threehour: 4.33,
    },
    sys: {
      pod: 'n',
    },
    visibility: 10000,
    weather: [
      {
        description: 'moderate rain',
        icon: '10n',
        id: 501,
        main: 'Rain',
      },
    ],
    wind: {
      deg: 196,
      gust: 17.57,
      speed: 9,
    },
  },
  {
    clouds: {
      all: 100,
    },
    dt: 1671505200,
    dt_txt: '2022-12-20 03:00:00',
    main: {
      feels_like: 6.8,
      grnd_level: 1001,
      humidity: 93,
      pressure: 1003,
      sea_level: 1003,
      temp: 9.14,
      temp_kf: 0,
      temp_max: 9.14,
      temp_min: 9.14,
    },
    pop: 1,
    rain: {
      threehour: 5.57,
    },
    sys: {
      pod: 'n',
    },
    visibility: 10000,
    weather: [
      {
        description: 'moderate rain',
        icon: '10n',
        id: 501,
        main: 'Rain',
      },
    ],
    wind: {
      deg: 274,
      gust: 9.69,
      speed: 4.31,
    },
  },
  {
    clouds: {
      all: 100,
    },
    dt: 1671516000,
    dt_txt: '2022-12-20 06:00:00',
    main: {
      feels_like: 5.91,
      grnd_level: 1002,
      humidity: 91,
      pressure: 1005,
      sea_level: 1005,
      temp: 8.17,
      temp_kf: 0,
      temp_max: 8.17,
      temp_min: 8.17,
    },
    pop: 0.8,
    sys: {
      pod: 'n',
    },
    visibility: 10000,
    weather: [
      {
        description: 'overcast clouds',
        icon: '04n',
        id: 804,
        main: 'Clouds',
      },
    ],
    wind: {
      deg: 231,
      gust: 10.17,
      speed: 3.69,
    },
  },
  {
    clouds: {
      all: 37,
    },
    dt: 1671526800,
    dt_txt: '2022-12-20 09:00:00',
    main: {
      feels_like: 4.11,
      grnd_level: 1005,
      humidity: 91,
      pressure: 1007,
      sea_level: 1007,
      temp: 6.99,
      temp_kf: 0,
      temp_max: 6.99,
      temp_min: 6.99,
    },
    pop: 0,
    sys: {
      pod: 'd',
    },
    visibility: 10000,
    weather: [
      {
        description: 'scattered clouds',
        icon: '03d',
        id: 802,
        main: 'Clouds',
      },
    ],
    wind: {
      deg: 218,
      gust: 10.79,
      speed: 4.38,
    },
  },
  {
    clouds: {
      all: 22,
    },
    dt: 1671537600,
    dt_txt: '2022-12-20 12:00:00',
    main: {
      feels_like: 6.22,
      grnd_level: 1006,
      humidity: 84,
      pressure: 1008,
      sea_level: 1008,
      temp: 9.07,
      temp_kf: 0,
      temp_max: 9.07,
      temp_min: 9.07,
    },
    pop: 0,
    sys: {
      pod: 'd',
    },
    visibility: 10000,
    weather: [
      {
        description: 'few clouds',
        icon: '02d',
        id: 801,
        main: 'Clouds',
      },
    ],
    wind: {
      deg: 226,
      gust: 10.17,
      speed: 5.55,
    },
  },
  {
    clouds: {
      all: 52,
    },
    dt: 1671548400,
    dt_txt: '2022-12-20 15:00:00',
    main: {
      feels_like: 5.97,
      grnd_level: 1006,
      humidity: 82,
      pressure: 1008,
      sea_level: 1008,
      temp: 8.59,
      temp_kf: 0,
      temp_max: 8.59,
      temp_min: 8.59,
    },
    pop: 0.2,
    rain: {
      threehour: 0.12,
    },
    sys: {
      pod: 'd',
    },
    visibility: 10000,
    weather: [
      {
        description: 'light rain',
        icon: '10d',
        id: 500,
        main: 'Rain',
      },
    ],
    wind: {
      deg: 227,
      gust: 9.46,
      speed: 4.66,
    },
  },
  {
    clouds: {
      all: 71,
    },
    dt: 1671559200,
    dt_txt: '2022-12-20 18:00:00',
    main: {
      feels_like: 4,
      grnd_level: 1006,
      humidity: 90,
      pressure: 1009,
      sea_level: 1009,
      temp: 6.23,
      temp_kf: 0,
      temp_max: 6.23,
      temp_min: 6.23,
    },
    pop: 0,
    sys: {
      pod: 'n',
    },
    visibility: 10000,
    weather: [
      {
        description: 'broken clouds',
        icon: '04n',
        id: 803,
        main: 'Clouds',
      },
    ],
    wind: {
      deg: 193,
      gust: 7.29,
      speed: 2.97,
    },
  },
  {
    clouds: {
      all: 100,
    },
    dt: 1671570000,
    dt_txt: '2022-12-20 21:00:00',
    main: {
      feels_like: 3.8,
      grnd_level: 1006,
      humidity: 88,
      pressure: 1008,
      sea_level: 1008,
      temp: 6.04,
      temp_kf: 0,
      temp_max: 6.04,
      temp_min: 6.04,
    },
    pop: 0,
    sys: {
      pod: 'n',
    },
    visibility: 10000,
    weather: [
      {
        description: 'overcast clouds',
        icon: '04n',
        id: 804,
        main: 'Clouds',
      },
    ],
    wind: {
      deg: 180,
      gust: 6.91,
      speed: 2.94,
    },
  },
  {
    clouds: {
      all: 94,
    },
    dt: 1671580800,
    dt_txt: '2022-12-21 00:00:00',
    main: {
      feels_like: 3.18,
      grnd_level: 1004,
      humidity: 89,
      pressure: 1007,
      sea_level: 1007,
      temp: 5.9,
      temp_kf: 0,
      temp_max: 5.9,
      temp_min: 5.9,
    },
    pop: 0,
    sys: {
      pod: 'n',
    },
    visibility: 10000,
    weather: [
      {
        description: 'overcast clouds',
        icon: '04n',
        id: 804,
        main: 'Clouds',
      },
    ],
    wind: {
      deg: 168,
      gust: 10.58,
      speed: 3.63,
    },
  },
  {
    clouds: {
      all: 95,
    },
    dt: 1671591600,
    dt_txt: '2022-12-21 03:00:00',
    main: {
      feels_like: 4.71,
      grnd_level: 1002,
      humidity: 88,
      pressure: 1005,
      sea_level: 1005,
      temp: 7.75,
      temp_kf: 0,
      temp_max: 7.75,
      temp_min: 7.75,
    },
    pop: 0.27,
    rain: {
      threehour: 0.23,
    },
    sys: {
      pod: 'n',
    },
    visibility: 10000,
    weather: [
      {
        description: 'light rain',
        icon: '10n',
        id: 500,
        main: 'Rain',
      },
    ],
    wind: {
      deg: 199,
      gust: 12.06,
      speed: 5.15,
    },
  },
  {
    clouds: {
      all: 98,
    },
    dt: 1671602400,
    dt_txt: '2022-12-21 06:00:00',
    main: {
      feels_like: 4.76,
      grnd_level: 1000,
      humidity: 86,
      pressure: 1003,
      sea_level: 1003,
      temp: 8.18,
      temp_kf: 0,
      temp_max: 8.18,
      temp_min: 8.18,
    },
    pop: 0.4,
    rain: {
      threehour: 0.46,
    },
    sys: {
      pod: 'n',
    },
    visibility: 10000,
    weather: [
      {
        description: 'light rain',
        icon: '10n',
        id: 500,
        main: 'Rain',
      },
    ],
    wind: {
      deg: 196,
      gust: 13.26,
      speed: 6.49,
    },
  },
  {
    clouds: {
      all: 99,
    },
    dt: 1671613200,
    dt_txt: '2022-12-21 09:00:00',
    main: {
      feels_like: 3.62,
      grnd_level: 1004,
      humidity: 85,
      pressure: 1006,
      sea_level: 1006,
      temp: 6.66,
      temp_kf: 0,
      temp_max: 6.66,
      temp_min: 6.66,
    },
    pop: 0.98,
    rain: {
      threehour: 2.69,
    },
    sys: {
      pod: 'd',
    },
    visibility: 10000,
    weather: [
      {
        description: 'light rain',
        icon: '10d',
        id: 500,
        main: 'Rain',
      },
    ],
    wind: {
      deg: 256,
      gust: 10.69,
      speed: 4.56,
    },
  },
  {
    clouds: {
      all: 61,
    },
    dt: 1671624000,
    dt_txt: '2022-12-21 12:00:00',
    main: {
      feels_like: 4.75,
      grnd_level: 1005,
      humidity: 76,
      pressure: 1008,
      sea_level: 1008,
      temp: 8.52,
      temp_kf: 0,
      temp_max: 8.52,
      temp_min: 8.52,
    },
    pop: 0.74,
    sys: {
      pod: 'd',
    },
    visibility: 10000,
    weather: [
      {
        description: 'broken clouds',
        icon: '04d',
        id: 803,
        main: 'Clouds',
      },
    ],
    wind: {
      deg: 255,
      gust: 14.09,
      speed: 8,
    },
  },
  {
    clouds: {
      all: 38,
    },
    dt: 1671634800,
    dt_txt: '2022-12-21 15:00:00',
    main: {
      feels_like: 4.58,
      grnd_level: 1007,
      humidity: 77,
      pressure: 1009,
      sea_level: 1009,
      temp: 8.28,
      temp_kf: 0,
      temp_max: 8.28,
      temp_min: 8.28,
    },
    pop: 0,
    sys: {
      pod: 'd',
    },
    visibility: 10000,
    weather: [
      {
        description: 'scattered clouds',
        icon: '03d',
        id: 802,
        main: 'Clouds',
      },
    ],
    wind: {
      deg: 252,
      gust: 13.45,
      speed: 7.5,
    },
  },
  {
    clouds: {
      all: 61,
    },
    dt: 1671645600,
    dt_txt: '2022-12-21 18:00:00',
    main: {
      feels_like: 3.76,
      grnd_level: 1008,
      humidity: 80,
      pressure: 1010,
      sea_level: 1010,
      temp: 7.49,
      temp_kf: 0,
      temp_max: 7.49,
      temp_min: 7.49,
    },
    pop: 0,
    sys: {
      pod: 'n',
    },
    visibility: 10000,
    weather: [
      {
        description: 'broken clouds',
        icon: '04n',
        id: 803,
        main: 'Clouds',
      },
    ],
    wind: {
      deg: 241,
      gust: 13.63,
      speed: 6.85,
    },
  },
  {
    clouds: {
      all: 99,
    },
    dt: 1671656400,
    dt_txt: '2022-12-21 21:00:00',
    main: {
      feels_like: 4.24,
      grnd_level: 1007,
      humidity: 84,
      pressure: 1010,
      sea_level: 1010,
      temp: 7.93,
      temp_kf: 0,
      temp_max: 7.93,
      temp_min: 7.93,
    },
    pop: 0.03,
    sys: {
      pod: 'n',
    },
    visibility: 10000,
    weather: [
      {
        description: 'overcast clouds',
        icon: '04n',
        id: 804,
        main: 'Clouds',
      },
    ],
    wind: {
      deg: 216,
      gust: 13.95,
      speed: 7.14,
    },
  },
  {
    clouds: {
      all: 86,
    },
    dt: 1671667200,
    dt_txt: '2022-12-22 00:00:00',
    main: {
      feels_like: 4.75,
      grnd_level: 1005,
      humidity: 91,
      pressure: 1008,
      sea_level: 1008,
      temp: 8.56,
      temp_kf: 0,
      temp_max: 8.56,
      temp_min: 8.56,
    },
    pop: 0.37,
    rain: {
      threehour: 0.46,
    },
    sys: {
      pod: 'n',
    },
    visibility: 10000,
    weather: [
      {
        description: 'light rain',
        icon: '10n',
        id: 500,
        main: 'Rain',
      },
    ],
    wind: {
      deg: 211,
      gust: 16.87,
      speed: 8.17,
    },
  },
  {
    clouds: {
      all: 99,
    },
    dt: 1671678000,
    dt_txt: '2022-12-22 03:00:00',
    main: {
      feels_like: 9.83,
      grnd_level: 1004,
      humidity: 86,
      pressure: 1006,
      sea_level: 1006,
      temp: 10.48,
      temp_kf: 0,
      temp_max: 10.48,
      temp_min: 10.48,
    },
    pop: 0.97,
    rain: {
      threehour: 0.38,
    },
    sys: {
      pod: 'n',
    },
    visibility: 10000,
    weather: [
      {
        description: 'light rain',
        icon: '10n',
        id: 500,
        main: 'Rain',
      },
    ],
    wind: {
      deg: 232,
      gust: 15.95,
      speed: 8.63,
    },
  },
  {
    clouds: {
      all: 98,
    },
    dt: 1671688800,
    dt_txt: '2022-12-22 06:00:00',
    main: {
      feels_like: 9.59,
      grnd_level: 1005,
      humidity: 92,
      pressure: 1007,
      sea_level: 1007,
      temp: 10.12,
      temp_kf: 0,
      temp_max: 10.12,
      temp_min: 10.12,
    },
    pop: 0.68,
    rain: {
      threehour: 0.39,
    },
    sys: {
      pod: 'n',
    },
    visibility: 10000,
    weather: [
      {
        description: 'light rain',
        icon: '10n',
        id: 500,
        main: 'Rain',
      },
    ],
    wind: {
      deg: 248,
      gust: 13,
      speed: 6.7,
    },
  },
  {
    clouds: {
      all: 95,
    },
    dt: 1671699600,
    dt_txt: '2022-12-22 09:00:00',
    main: {
      feels_like: 7.19,
      grnd_level: 1005,
      humidity: 91,
      pressure: 1008,
      sea_level: 1008,
      temp: 9.83,
      temp_kf: 0,
      temp_max: 9.83,
      temp_min: 9.83,
    },
    pop: 0,
    sys: {
      pod: 'd',
    },
    visibility: 10000,
    weather: [
      {
        description: 'overcast clouds',
        icon: '04d',
        id: 804,
        main: 'Clouds',
      },
    ],
    wind: {
      deg: 233,
      gust: 12.1,
      speed: 5.5,
    },
  },
  {
    clouds: {
      all: 97,
    },
    dt: 1671710400,
    dt_txt: '2022-12-22 12:00:00',
    main: {
      feels_like: 10.08,
      grnd_level: 1004,
      humidity: 90,
      pressure: 1007,
      sea_level: 1007,
      temp: 10.61,
      temp_kf: 0,
      temp_max: 10.61,
      temp_min: 10.61,
    },
    pop: 0,
    sys: {
      pod: 'd',
    },
    visibility: 10000,
    weather: [
      {
        description: 'overcast clouds',
        icon: '04d',
        id: 804,
        main: 'Clouds',
      },
    ],
    wind: {
      deg: 216,
      gust: 10.39,
      speed: 5.04,
    },
  },
  {
    clouds: {
      all: 100,
    },
    dt: 1671721200,
    dt_txt: '2022-12-22 15:00:00',
    main: {
      feels_like: 9.76,
      grnd_level: 1002,
      humidity: 95,
      pressure: 1004,
      sea_level: 1004,
      temp: 10.2,
      temp_kf: 0,
      temp_max: 10.2,
      temp_min: 10.2,
    },
    pop: 0.71,
    rain: {
      threehour: 0.99,
    },
    sys: {
      pod: 'd',
    },
    visibility: 10000,
    weather: [
      {
        description: 'light rain',
        icon: '10d',
        id: 500,
        main: 'Rain',
      },
    ],
    wind: {
      deg: 195,
      gust: 10.91,
      speed: 5.23,
    },
  },
  {
    clouds: {
      all: 100,
    },
    dt: 1671732000,
    dt_txt: '2022-12-22 18:00:00',
    main: {
      feels_like: 10.97,
      grnd_level: 999,
      humidity: 97,
      pressure: 1001,
      sea_level: 1001,
      temp: 11.26,
      temp_kf: 0,
      temp_max: 11.26,
      temp_min: 11.26,
    },
    pop: 1,
    rain: {
      threehour: 3.88,
    },
    sys: {
      pod: 'n',
    },
    visibility: 10000,
    weather: [
      {
        description: 'moderate rain',
        icon: '10n',
        id: 501,
        main: 'Rain',
      },
    ],
    wind: {
      deg: 216,
      gust: 14.22,
      speed: 6.29,
    },
  },
  {
    clouds: {
      all: 100,
    },
    dt: 1671742800,
    dt_txt: '2022-12-22 21:00:00',
    main: {
      feels_like: 11.6,
      grnd_level: 1000,
      humidity: 95,
      pressure: 1002,
      sea_level: 1002,
      temp: 11.88,
      temp_kf: 0,
      temp_max: 11.88,
      temp_min: 11.88,
    },
    pop: 0.3,
    rain: {
      threehour: 0.32,
    },
    sys: {
      pod: 'n',
    },
    visibility: 10000,
    weather: [
      {
        description: 'light rain',
        icon: '10n',
        id: 500,
        main: 'Rain',
      },
    ],
    wind: {
      deg: 246,
      gust: 15.27,
      speed: 8.14,
    },
  },
  {
    clouds: {
      all: 100,
    },
    dt: 1671753600,
    dt_txt: '2022-12-23 00:00:00',
    main: {
      feels_like: 11.16,
      grnd_level: 1000,
      humidity: 95,
      pressure: 1002,
      sea_level: 1002,
      temp: 11.48,
      temp_kf: 0,
      temp_max: 11.48,
      temp_min: 11.48,
    },
    pop: 0.31,
    rain: {
      threehour: 0.13,
    },
    sys: {
      pod: 'n',
    },
    visibility: 10000,
    weather: [
      {
        description: 'light rain',
        icon: '10n',
        id: 500,
        main: 'Rain',
      },
    ],
    wind: {
      deg: 243,
      gust: 12.25,
      speed: 5.99,
    },
  },
  {
    clouds: {
      all: 100,
    },
    dt: 1671764400,
    dt_txt: '2022-12-23 03:00:00',
    main: {
      feels_like: 10.7,
      grnd_level: 999,
      humidity: 97,
      pressure: 1001,
      sea_level: 1001,
      temp: 11.01,
      temp_kf: 0,
      temp_max: 11.01,
      temp_min: 11.01,
    },
    pop: 0.37,
    rain: {
      threehour: 0.25,
    },
    sys: {
      pod: 'n',
    },
    visibility: 10000,
    weather: [
      {
        description: 'light rain',
        icon: '10n',
        id: 500,
        main: 'Rain',
      },
    ],
    wind: {
      deg: 223,
      gust: 8.67,
      speed: 3.2,
    },
  },
  {
    clouds: {
      all: 100,
    },
    dt: 1671775200,
    dt_txt: '2022-12-23 06:00:00',
    main: {
      feels_like: 10.1,
      grnd_level: 996,
      humidity: 99,
      pressure: 998,
      sea_level: 998,
      temp: 10.42,
      temp_kf: 0,
      temp_max: 10.42,
      temp_min: 10.42,
    },
    pop: 0.84,
    rain: {
      threehour: 2.3,
    },
    sys: {
      pod: 'n',
    },
    visibility: 10000,
    weather: [
      {
        description: 'light rain',
        icon: '10n',
        id: 500,
        main: 'Rain',
      },
    ],
    wind: {
      deg: 151,
      gust: 2.15,
      speed: 1.79,
    },
  },
  {
    clouds: {
      all: 100,
    },
    dt: 1671786000,
    dt_txt: '2022-12-23 09:00:00',
    main: {
      feels_like: 10.66,
      grnd_level: 992,
      humidity: 98,
      pressure: 995,
      sea_level: 995,
      temp: 10.95,
      temp_kf: 0,
      temp_max: 10.95,
      temp_min: 10.95,
    },
    pop: 1,
    rain: {
      threehour: 4.29,
    },
    sys: {
      pod: 'd',
    },
    visibility: 5549,
    weather: [
      {
        description: 'moderate rain',
        icon: '10d',
        id: 501,
        main: 'Rain',
      },
    ],
    wind: {
      deg: 180,
      gust: 9.63,
      speed: 3.31,
    },
  },
  {
    clouds: {
      all: 100,
    },
    dt: 1671796800,
    dt_txt: '2022-12-23 12:00:00',
    main: {
      feels_like: 12.06,
      grnd_level: 991,
      humidity: 81,
      pressure: 994,
      sea_level: 994,
      temp: 12.63,
      temp_kf: 0,
      temp_max: 12.63,
      temp_min: 12.63,
    },
    pop: 1,
    rain: {
      threehour: 1.59,
    },
    sys: {
      pod: 'd',
    },
    visibility: 10000,
    weather: [
      {
        description: 'light rain',
        icon: '10d',
        id: 500,
        main: 'Rain',
      },
    ],
    wind: {
      deg: 227,
      gust: 16.88,
      speed: 9.79,
    },
  },
  {
    clouds: {
      all: 100,
    },
    dt: 1671807600,
    dt_txt: '2022-12-23 15:00:00',
    main: {
      feels_like: 9.66,
      grnd_level: 991,
      humidity: 83,
      pressure: 993,
      sea_level: 993,
      temp: 10.4,
      temp_kf: 0,
      temp_max: 10.4,
      temp_min: 10.4,
    },
    pop: 0.77,
    rain: {
      threehour: 0.71,
    },
    sys: {
      pod: 'd',
    },
    visibility: 10000,
    weather: [
      {
        description: 'light rain',
        icon: '10d',
        id: 500,
        main: 'Rain',
      },
    ],
    wind: {
      deg: 227,
      gust: 21.27,
      speed: 11.29,
    },
  },
  {
    clouds: {
      all: 100,
    },
    dt: 1671818400,
    dt_txt: '2022-12-23 18:00:00',
    main: {
      feels_like: 5.52,
      grnd_level: 992,
      humidity: 84,
      pressure: 994,
      sea_level: 994,
      temp: 9.98,
      temp_kf: 0,
      temp_max: 9.98,
      temp_min: 9.98,
    },
    pop: 0.82,
    rain: {
      threehour: 2.09,
    },
    sys: {
      pod: 'n',
    },
    visibility: 10000,
    weather: [
      {
        description: 'light rain',
        icon: '10n',
        id: 500,
        main: 'Rain',
      },
    ],
    wind: {
      deg: 243,
      gust: 22.99,
      speed: 13.63,
    },
  },
  {
    clouds: {
      all: 100,
    },
    dt: 1671829200,
    dt_txt: '2022-12-23 21:00:00',
    main: {
      feels_like: 5.4,
      grnd_level: 994,
      humidity: 81,
      pressure: 997,
      sea_level: 997,
      temp: 9.86,
      temp_kf: 0,
      temp_max: 9.86,
      temp_min: 9.86,
    },
    pop: 0.55,
    rain: {
      threehour: 0.49,
    },
    sys: {
      pod: 'n',
    },
    visibility: 10000,
    weather: [
      {
        description: 'light rain',
        icon: '10n',
        id: 500,
        main: 'Rain',
      },
    ],
    wind: {
      deg: 246,
      gust: 21.63,
      speed: 13.34,
    },
  },
  {
    clouds: {
      all: 97,
    },
    dt: 1671840000,
    dt_txt: '2022-12-24 00:00:00',
    main: {
      feels_like: 5.17,
      grnd_level: 998,
      humidity: 80,
      pressure: 1000,
      sea_level: 1000,
      temp: 9.55,
      temp_kf: 0,
      temp_max: 9.55,
      temp_min: 9.55,
    },
    pop: 0.35,
    rain: {
      threehour: 0.16,
    },
    sys: {
      pod: 'n',
    },
    visibility: 10000,
    weather: [
      {
        description: 'light rain',
        icon: '10n',
        id: 500,
        main: 'Rain',
      },
    ],
    wind: {
      deg: 248,
      gust: 20.13,
      speed: 12.28,
    },
  },
  {
    clouds: {
      all: 35,
    },
    dt: 1671850800,
    dt_txt: '2022-12-24 03:00:00',
    main: {
      feels_like: 4.62,
      grnd_level: 1001,
      humidity: 83,
      pressure: 1003,
      sea_level: 1003,
      temp: 8.7,
      temp_kf: 0,
      temp_max: 8.7,
      temp_min: 8.7,
    },
    pop: 0,
    sys: {
      pod: 'n',
    },
    visibility: 10000,
    weather: [
      {
        description: 'scattered clouds',
        icon: '03n',
        id: 802,
        main: 'Clouds',
      },
    ],
    wind: {
      deg: 242,
      gust: 16.74,
      speed: 9.45,
    },
  },
  {
    clouds: {
      all: 46,
    },
    dt: 1671861600,
    dt_txt: '2022-12-24 06:00:00',
    main: {
      feels_like: 4.93,
      grnd_level: 1002,
      humidity: 83,
      pressure: 1004,
      sea_level: 1004,
      temp: 8.71,
      temp_kf: 0,
      temp_max: 8.71,
      temp_min: 8.71,
    },
    pop: 0.2,
    rain: {
      threehour: 0.14,
    },
    sys: {
      pod: 'n',
    },
    visibility: 10000,
    weather: [
      {
        description: 'light rain',
        icon: '10n',
        id: 500,
        main: 'Rain',
      },
    ],
    wind: {
      deg: 236,
      gust: 14.79,
      speed: 8.24,
    },
  },
  {
    clouds: {
      all: 49,
    },
    dt: 1671872400,
    dt_txt: '2022-12-24 09:00:00',
    main: {
      feels_like: 4.23,
      grnd_level: 1003,
      humidity: 85,
      pressure: 1006,
      sea_level: 1006,
      temp: 7.81,
      temp_kf: 0,
      temp_max: 7.81,
      temp_min: 7.81,
    },
    pop: 0,
    sys: {
      pod: 'd',
    },
    visibility: 10000,
    weather: [
      {
        description: 'scattered clouds',
        icon: '03d',
        id: 802,
        main: 'Clouds',
      },
    ],
    wind: {
      deg: 219,
      gust: 13.31,
      speed: 6.68,
    },
  },
  {
    clouds: {
      all: 71,
    },
    dt: 1671883200,
    dt_txt: '2022-12-24 12:00:00',
    main: {
      feels_like: 6.52,
      grnd_level: 1004,
      humidity: 79,
      pressure: 1006,
      sea_level: 1006,
      temp: 9.73,
      temp_kf: 0,
      temp_max: 9.73,
      temp_min: 9.73,
    },
    pop: 0.04,
    sys: {
      pod: 'd',
    },
    visibility: 10000,
    weather: [
      {
        description: 'broken clouds',
        icon: '04d',
        id: 803,
        main: 'Clouds',
      },
    ],
    wind: {
      deg: 218,
      gust: 13.47,
      speed: 7.24,
    },
  },
];
