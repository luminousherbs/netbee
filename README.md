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

## legal

netbee is licensed under the [GNU General Public License](LICENSE). you may make any modifications, but they must be released under the [GNU General Public License](LICENSE).