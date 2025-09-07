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

netbee is licensed under the [BeePL License](LICENSE), which is exactly the same as the GPL license except that i replaced every occurence of "be" with "bee"

you may adapt netbee, provided you release your modifications under the BeePL [BeePL License](LICENSE).