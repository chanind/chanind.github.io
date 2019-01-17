---
layout: post
title:  "Linking Tencent Cloud Alarms with Slack"
date:   2019-01-17
categories: Tencent slack
---

The most essential place for server alerts to report to is, of course, Slack. While there is unfortunately not a built-in way for Tencent cloud alerts to integrate with Slack, it's doable using Tencent cloud serverless functions combined with a callback URL when configuring an alarm policy in Tencent monitoring. Below is the function I used as the callback code in node.js:

{% highlight js %}
const https = require('https');

module.exports.main_handler = function(event, context, callback) {
    // uncomment the below and add your Tencent verification string if needed
    // return callback(null, {
    //   body: "your-verification-code",
    //   statusCode: 200,
    //   isBase64: false,
    //   headers: {},
    // };
    console.log(event.body);
    const data = JSON.parse(event.body);
    let status = data.alarmStatus;
    if (status === "1") status = 'ALARM';
    if (status === "0") status = 'OK';
    const name = data.alarmPolicyInfo.policyName
    const alarmDetails = JSON.stringify(data.alarmPolicyInfo.conditions, null, 2).slice(1).slice(0,-1).replace(/"/g, '');
    const deviceInfo = JSON.stringify(data.alarmObjInfo.dimensions, null, 2).slice(1).slice(0,-1).replace(/"/g, '');

    var options = {
      hostname: "hooks.slack.com",
      method: "POST",
      path: "/services/YOUR/SLACK/WEBHOOK",
    };

    const attachments = [{
        title: "Device info",
        text: deviceInfo,
    }, {
        title: "Alarm details",
        text: alarmDetails,
    }];

    const payload = JSON.stringify({
        text: `*${name}*\n${status}`,
        username: "Tencent cloud server alert",
        icon_emoji: ":warning:",
        attachments: attachments,
    });

    const response = {
        sessionId: data.sessionId,
        retCode: 0,
    };
    const slackReq = https.request(options, (res) => res.on("data", () => callback(null, {
        body: JSON.stringify(response),
        statusCode: 200,
        isBase64: false,
        headers: {},
    })))
    slackReq.write(payload);
    slackReq.on("error", (error) => callback(null, {
        body: JSON.stringify(error),
        statusCode: 500,
        isBase64: false,
        headers: {},
    }));
    slackReq.end();
}
{% endhighlight %}

You'll need to replace the Slack webhook path with your own Slack webhook and you should be good to go! You can of course customize the content and formatting of what's pushed to slack by editing the code above, but this should be a good start.

In order for this function to be triggered via a HTTP request, you'll need to set up an API Gateway trigger (API网关触发器 in Chinese) for your serverless function. Once that's set up, you should be able to get a URL that you can use as a callback for your alarms. Tencent usually requires you return a verification code the first time you try to use a callback for an alarm, so you can uncomment the verification section above to return their code if you hit that issue. Enjoy!
