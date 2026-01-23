import { z } from "@hono/zod-openapi";

export const WeatherResponseSchema = z.object({
  temperature: z.object({
    max_temp: z.number().openapi({
      description: "最高気温。その日の最高気温",
      example: 30.0
    }),
    min_temp: z.number().openapi({
      description: "最低気温。その日の最低気温",
      example: 20.0
    }),
    current_temp: z.number().openapi({
      description: "現在の気温。その日の現在の気温",
      example: 25.0
    }),
    wheather: z.string().openapi({
      description: "天気",
      example: "晴れ"
    }),
    icon_url: z.string().openapi({
      description: "天気アイコンのURL",
      example: "https://tpf.weathernews.jp/wxicon/152/100.png"
    })
  }).openapi({
    description: "topページで表示する気温情報。最高気温、最低気温、現在の気温",
    example: {
      max_temp: 30.0,
      min_temp: 20.0,
      current_temp: 25.0,
      wheather: "晴れ",
      icon_url: "https://tpf.weathernews.jp/wxicon/152/100.png"
    }
  }),
  feel_temperature: z.object({
    temp: z.number().openapi({
      description: "体感温度。",
      example: 25.0
    }),
    message: z.string().openapi({
      description: "体感温度のメッセージ。",
      example: "むし暑い"
    }),
    status: z.number().int().min(1).max(10).openapi({
      description: "体感温度のステータス。10段階で表現。10が最も暑い、1が最も寒い。",
      example: 6
    })
  }).openapi({
    description: "topページで表示する体感温度情報。体感温度、メッセージを返す。",
    example: {
      temp: 25.0,
      message: "むし暑い",
      status: 6
    }
  }),
  humidity: z.object({
    current_h: z.number().openapi({
      description: "現在の湿度。",
      example: 50.0
    }),
    message: z.string().openapi({
      description: "現在の湿度のメッセージ。",
      example: "全体的に乾燥した空気が感じられます。"
    })
  }).openapi({
    description: "topページで表示する湿度情報。現在の湿度とその湿度のメッセージを返す。",
    example: {
      current_h: 50.0,
      message: "全体的に乾燥した空気が感じられます。"
    }
  }),
  wind: z.object({
    current_w: z.number().openapi({
      description: "現在の風速。",
      example: 5.0
    }),
    message: z.string().openapi({
      description: "現在の風速のメッセージ。",
      example: "風は穏やかで、過ごしやすい一日になりそうです。"
    }),
    direction: z.string().openapi({
      description: "風向き。",
      example: "北"
    }),
  }).openapi({
    description: "topページで表示する風情報。現在の風速とその風速のメッセージを返す。",
    example: {
      current_w: 5.0,
      message: "風は穏やかで、過ごしやすい一日になりそうです。",
      direction: "北"
    }
  }),
  rain: z.object({
    current_r: z.number().openapi({
      description: "現在の降水量。",
      example: 0.0
    }),
    message: z.string().openapi({
      description: "現在の降水量のメッセージ。",
      example: "雨は降っていません。"
    })
  }).openapi({
    description: "topページで表示する降水量情報。現在の降水量とその降水量のメッセージを返す。",
    example: {
      current_r: 0.0,
      message: "雨は降っていません。"
    }
  }),
  laundry: z.object({
    status: z.number().int().min(1).max(3).openapi({
      description: "洗濯を干していいかどうか。1: 干すことができる、2: 注意が必要、3: 干すことができない",
      example: 1
    }),
    message: z.string().openapi({
      description: "洗濯を干していいかどうかのメッセージ。",
      example: "洗濯物を干すことができます。"
    }),
  }).openapi({
    description: "topページで表示する洗濯情報。洗濯を干していいかどうかのインデックスとそのメッセージを返す。",
    example: {
      status: 1,
      message: "洗濯物を干すことができます。"
    }
  }),
  atomos: z.object({
    current_a: z.number().openapi({
      description: "現在の気圧。hPa単位",
      example: 1013.25
    }),
    status: z.number().int().min(1).max(3).openapi({
      description: "天気痛リスクのステータス。1: 安定（影響少ない）、2: 注意（やや影響あり）、3: 影響大（症状が出やすい）",
      example: 1
    }),
    message: z.string().openapi({
      description: "天気痛（気象病）の方向けのメッセージ。気圧の状態や変化に基づいた体調管理のアドバイス。",
      example: "気圧は安定しています。快適にお過ごしいただけそうです。"
    })
  }).openapi({
    description: "天気痛（気象病）向けの気圧情報。気圧の値、リスクステータス、体調管理のメッセージを返す。",
    example: {
      current_a: 1013.25,
      status: 1,
      message: "気圧は安定しています。快適にお過ごしいただけそうです。"
    }
  }),
  hair: z.object({
    message: z.string().openapi({
      description: "ヘアスタイルに関わるメッセージ、湿度や気温、風速などによって判断",
      example: "本日は風が大変強いため、前髪に注意してください"
    })
  }).openapi({
    description: "ヘアスタイルに関わるメッセージ、湿度や気温、風速などによって判断",
    example: {
      message: "本日は風が大変強いため、前髪に注意してください"
    }
  })
})




export const SearchResponseSchema = z.object({
  places: z.array(z.object({
    name: z.string().openapi({
      description: '検索結果の候補地',
      example: '名古屋市緑区'
    }),
    lat: z.number().openapi({
      description: '候補地の緯度',
      example: 35.123456
    }),
    lon: z.number().openapi({
      description: '候補地の経度',
      example: 139.123456
    })
  })),
  is_empty: z.boolean().openapi({
    description: '検索結果がヒットしたかどうか。ヒットしなかった場合はtrue',
    example: false
  })
})

export const ErrorResponseSchema = z.object({
  message: z.string()
    .openapi({
      description: 'エラーメッセージ。クライアントに表示を想定',
      example: "検索に失敗しました。"
    }),
  error_details: z.string()
    .openapi({
      description: "エラーの詳細。開発者向け。",
      example: "MAPBOX_API_KEYが設定されていません。"
    })
})

// 短期予報スキーマ
export const SrfSchema = z.object({
  date: z.string().datetime(),
  wx: z.number().int(),
  temp: z.number(),
  prec: z.number(),
  arpress: z.number(),
  wndspd: z.number(),
  wnddir: z.number().int(),
  rhum: z.number().int(),
  feelidx: z.number().int(),
  feeltmp: z.number()
});

// 中期予報スキーマ
export const MrfSchema = z.object({
  date: z.string().datetime(),
  wx: z.number().int(),
  maxtemp: z.number(),
  mintemp: z.number(),
  pop: z.number().int()
});

// 気象データスキーマ
export const WxDataSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  srf: z.array(SrfSchema),
  mrf: z.array(MrfSchema)
});

// メインレスポンススキーマ
export const WeatherApiResponseSchema = z.object({
  requestId: z.string().uuid(),
  wxdata: z.array(WxDataSchema)
});

// 型をエクスポート
export type Srf = z.infer<typeof SrfSchema>;
export type Mrf = z.infer<typeof MrfSchema>;
export type WxData = z.infer<typeof WxDataSchema>;
export type WeatherApiResponse = z.infer<typeof WeatherApiResponseSchema>;