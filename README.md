# ray

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

## Data Storage

### `raySavedRssFeeds`

Ray使用源生的LS作为数据存储方式，将当前已存的rss源数据存储在`raySavedRssFeeds`下面，内容为完整JSON字符串，结构如下：

```
[
  {
    id: '', // 前端生成，生成规则 = md5(title + '==' + link)
    active: true, // 是否激活
    title: '', // 名称
    source: '', // feed源
    link: '', // 网址url
    description: '',
    icon: ''
  }
]
```

### `raySavedConfig`

Ray使用源生的LS作为数据存储方式，将之前的配置信息存储在`raySavedConfig`下面，内容为完整JSON字符串，结构参考`models/config`
