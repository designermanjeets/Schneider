You might have noticed that there are two versions of Highcharts installed -- one in the lib directory, and one in the bower_components directory. Here is the reason why.

The version of Highcharts in lib is the one that has historically been in this project (from before Evan started working on it). lib/highcharts is missing most of the Highcharts modules, most notably no-data-to-display.js.

In order to get access to the missing modules, we installed Highcharts from Bower. That's why bower_components/highcharts exists. We started out using a mix of lib/highcharts and bower_components/highcharts. Over time, we needed more modules and ended up using bower_components/highcharts for everything.

So why are we keeping lib/bower around? Because there are small differences between lib/bower and bower_components/highcharts. They don't seem like they're important -- but they also might have something to do with the free version vs. the paid version. Evan wasn't comfortable deleting lib/highcharts entirely.

