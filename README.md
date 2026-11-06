# 花园来信 · Garden Letter

面向新人的 3D 纸艺婚礼邀请函原型。工作室录入资料、生成预览和发布独立链接，宾客通过网页翻阅花园、新人故事、照片与婚礼信息。

## 当前进度

- React + TypeScript + Three.js / React Three Fiber；Express + SQLite + Sharp。
- 四章浏览、随书页夹角展开的纸层、低机位花园场景。
- 工作室编辑、最多六张照片及裁剪、草稿隔离、预览、核对、发布与撤回。
- 分享封面、访问码、到期、婚礼地图与时区日历。
- 钢琴背景音乐和真实翻页声；用户主动开启。
- 第一幕新增蝴蝶、花瓣及花叶互动代码，已构建，浏览器验收待完成。

当前为开发原型：第一幕美术未定稿，微信真机、公网部署及付费试单仍待验证。

## 本地运行

Node.js 24.15 或兼容的新版本。

```sh
cd app
npm ci
npm run dev
```

打开 http://127.0.0.1:4173/demo ，工作室位于 /studio 。首次启动自动初始化示例与本机管理员资料，密码见 app/.data/管理员登录.txt。

```sh
npm test
npm run build
npm start
```

生产模式重新构建后须重启服务。应用默认监听本机地址，公网使用需配置 HTTPS 代理及持久数据目录。

## 文档

- [项目交接文档](项目交接文档.md)：目标、明确反馈、实现状态、关键文件、验证边界和后续任务。
- [PRD](docs/PRD-立体婚礼邀请函-v1.0.md)
- [应用运行说明](app/README.md)
- [纸层联动记录](app/docs/翻页与声音-2026-11-05.md)
- [音乐来源与署名](app/docs/音频来源.md)

交接文档保留原工作区路径与历史记录，其中本地研究资料、第三方参考视频/截图及浏览器操作记录未上传。公开仓库保存应用代码、生成美术、音频、产品文档和少量项目效果截图；不包含本机密码、数据库、会话、客户照片、依赖目录或构建产物。

## 素材说明

项目美术由图像生成工具制作，源图与提示词保存在 app/art/ 和 app/docs/。参考作品的名称及链接只用于说明设计过程。

音乐 **Midsummer Sky — Kevin MacLeod (incompetech.com)**，使用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)；[曲目来源](https://incompetech.com/music/royalty-free/index.html?Search=Search&isrc=USUAN1100158)。已做音量调整、淡入淡出和 MP3 转码，交付时保留网页署名。

翻页声 **Page Turn — davidbain**，[Freesound 来源](https://freesound.org/people/davidbain/sounds/136778/)，CC0。完整处理与许可记录见音频文档。
