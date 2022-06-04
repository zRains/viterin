#### BroadCast Channel

BroadCast Channel 可以帮我们创建一个用于广播的通信频道。当所有页面都监听同一频道的消息时，其中某一个页面通过它发送的消息就会被其他所有页面收到。它的 API 和用法都非常简单。

创建一个标识为`Test`的频道：

```js
const bc = new BroadcastChannel('Test')
```

各个页面可以通过`onmessage`来监听被广播的消息：

```js
bc.onmessage = function (e) {
  const data = e.data
  const text = '[receive] ' + data + ' —— tab ' + data
  console.log('[BroadcastChannel] receive message:', text)
}
```

发送页面不会触发`onmessage`。

要发送消息时只需要调用实例上的`postMessage`方法即可：

```js
bc.postMessage(mydata)
```

#### Service Worker

待详细了解。

#### LocalStorage

当 LocalStorage 变化时，会触发`storage`事件。利用这个特性，我们可以在发送消息时，把消息写入到某个 LocalStorage 中；然后在各个页面内，通过监听`storage`事件即可收到通知。

在各个页面添加如上的代码，即可监听到 LocalStorage 的变化。当某个页面需要发送消息时，只需要使用我们熟悉的`setItem`方法即可：

```js
mydata.st = +new Date()
window.localStorage.setItem('ctc-msg', JSON.stringify(mydata))
```

注意，这里有一个细节：我们在 mydata 上添加了一个取当前毫秒时间戳的`.st`属性。这是因为，`storage`事件只有在值真正改变时才会触发。举个例子：

```js
window.localStorage.setItem('test', '123')
window.localStorage.setItem('test', '123')
```

由于第二次的值`'123'`与第一次的值相同，所以以上的代码只会在第一次`setItem`时触发`storage`事件。因此我们通过设置`st`来保证每次调用时一定会触发`storage`事件。
