# netbee

on [codeberg](https://codeberg.org/luminousherbs/netbee) and [github](https://github.com/luminousherbs/netbee)

## setup

clone the repo
```bash
git clone https://github.com/luminousherbs/netbee
```

update [config/network.js](config/network.js) to use your network settings
```js
export const host = {
    ip: "...", // enter your ip
    port: "...", // pick a port
}
```

run the server
```bash
node server/server.js
```