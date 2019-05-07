---
layout: post
title: "The Best Time to Submit To Hacker News 2018 - 2019"
date: 2019-05-07
---

I recently came across the [Hacker News Dataset on Bigquery](https://console.cloud.google.com/marketplace/details/y-combinator/hacker-news), so naturally, my first question was: When is the best time to submit to Hacker News? Naturally, I'm not the first person to ask this question, and a quick Google seach shows [an article from 2017](https://medium.com/@mi.schaefer/what-is-the-best-time-to-post-to-hacker-news-829fad3eac71) on the topic. That article focuses on determining what time of the day most top posts were made, and concludes that the most active times are the best times to post. However, I wanted to frame the question a bit differently: What posting time of the week gives the greatest chance of an article making it to the frontpage?

The dataset doesn't show the top rank achieved by posts, but it gives the total number of upvotes for posts which is a good proxy. For the analysis, I defined "frontpage" posts as posts having 50 or more upvotes. Then, the goal is to figure out which hour of the week has the greatest proportion of posts that make it to 50 votes. I used Jan 1, 2018 as the start date of the analysis, ending at the current time (May, 2019).

First, I ran the following to get the number of stories posted per hour for every hour since Jan 1, 2018:

```SQL
SELECT TIMESTAMP_TRUNC(timestamp, HOUR) hour, count(*) total
FROM `bigquery-public-data.hacker_news.full`
WHERE `type` = "story"  AND `timestamp` > "2018-01-01"
GROUP BY hour
ORDER BY hour DESC
```

Then, I tweaked the query to find the number of frontpage stories per hour:

```SQL
SELECT TIMESTAMP_TRUNC(timestamp, HOUR) hour, count(*) total
FROM `bigquery-public-data.hacker_news.full`
WHERE `type` = "story"  AND `timestamp` > "2018-01-01" AND `score` > 50
GROUP BY hour
ORDER BY hour DESC
```

Next, I exported these results as JSON and wrote a quick script to get the final counts of new and frontpage posts per hour of the week, and then divided those numbers to get the chance of any post making it to the frontpage. The results are shown in the table below:

<table id="data-table-results">
  <thead>
    <tr>
      <th>Time (UTC)</th>
      <th>Total Posts</th>
      <th>Front Page Posts</th>
      <th>Chance of Front Page</th>
    </tr>
  </thead>
  <tbody></tbody>
</table>

<br />
<br />

<div style="width:90%;">
  <canvas id="time-chart"></canvas>
</div>

<br />

Interestingly, this analysis comes up with the opposite answer compared with the [article from 2017](https://medium.com/@mi.schaefer/what-is-the-best-time-to-post-to-hacker-news-829fad3eac71) - it's best to post on weekends and times of low activity for Hacker News so as to minimize the competition that your post will face. Articles posted on Sunday, 6am UTC are 2.5x more likely to make it to the front page than posting on Wednesday, 9am UTC. Of course, these posts will likely get less views than posting at a more popular time, so it's a tradeoff.

The data and scripts used here are available at [https://github.com/chanind/hn_post_time_analysis](https://github.com/chanind/hn_post_time_analysis)

<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css" />
<script type="text/javascript" src="//cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0/dist/Chart.min.js"></script>

<script type="text/javascript">
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  formatRow = (row) => `${days[row.weekday]} ${row.hour.toString().padStart(2, '0')}:00`
  $(document).ready(() => {
    $.getJSON('/assets/hn_time_counts.json', (data) => {
      $('#data-table-results').DataTable({
        data,
        columns: [
          {
            data: 'hour_num',
            render: (val, type, row) => {
              if (type === 'display') {
                return formatRow(row);
              }
              return val;
            }
          },
          { data: 'total' },
          { data: 'front_page' },
          { data: 'fp_chance', render: val => val.toFixed(3) },
        ],
        order: [[3, 'desc']]
      });

      var ctx = document.getElementById('time-chart').getContext('2d');
      const points = data.slice(0);
      points.sort((a, b) => a.hour_num - b.hour_num);
      window.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: points.map(formatRow),
          datasets: [{
            label: 'Chance',
            data: points.map(row => Math.round(row.fp_chance * 1000) / 1000),
          }]
        },
        options: {
          responsive: true,
          title: {
            display: true,
            text: 'Chance of Reaching HN Frontpage by Posting Time'
          },
          legend: {
            display: false,
          },
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Posting Time of Week (UTC)'
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Chance of Reaching Frontpage'
              },
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    });
  });
</script>
