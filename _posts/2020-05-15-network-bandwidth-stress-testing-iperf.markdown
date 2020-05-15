---
layout: post
title: "Network bandwidth stress testing with iperf"
date: 2020-05-15
---

If you need to stress test a network connection between 2 servers there's no easier tool than [iperf](https://iperf.fr/). Iperf is a really simple yet powerful CLI that can be used to both determine how much bandwidth is available between your servers, and can also be used to stress the connection by flooding it with traffic. It runs on linux/unix, osx, and even windows.

## Testing available network bandwidth with TCP

To run a quick TCP bandwidth test, first start iperf in server mode from a server you control:

```
iperf -s
```

Then, you can test the connection to that server by running iperf in client mode from another server with `iperf -c <host>` where `<host>` is the address of the iperf server you just started above. That's all it takes! This will run for 10 seconds by default, but you can increase the time it runs with the `-t` option. For example, to run a test for 5 minutes:

```
iperf -c <host> -t 300
```

## Flooding a conection with UDP

TCP will automatically do rate-limiting to adapt to the available bandwidth a connection can handle, so it's difficult to truly stress a connection using TCP. If you just want to hammer the connection between the client and server with packets as a stress test, you can send UDP packets at a bandwidth far above what the connection can handle. To do this, you can use the `-u` flag on both client and server to send UDP packets, and also set the `-b` flag to set a bandwidth that's above network capacity. For example, you can start the server with `iperf -s -u`. Then, if you wanted to stress a 5 Mbps connection, you could try sending 100 Mbps across it for 5 minutes with:

```
iperf -c <host> -u -t 300 -b 100M
```

This will report on packet loss as well at the end of the test.

## Using a public iperf server

If you just want to see what your internet connection bandwidth is, you can test against a public iperf server. There's a list of available public servers at [iperf.fr/iperf-servers.php](https://iperf.fr/iperf-servers.php). These servers don't work with UDP to avoid getting completely DOSed, but it's easy to run a quick TCP test. For example, from your local computer or server you test against the public iperf server at `ping.online.net`, located in France, with `iperf -c ping.online.net`.

iperf has a number of other advanced options you can explore to run bandwidth tests aside from what we discussed here. There's `-P` to run multiple streams in parallel, `-w` to customize the TCP window size, any many more.

## Happy bandwidth testing!
