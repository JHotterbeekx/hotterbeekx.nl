---
title: "Getting speed back, my Webpack debugging journey"
description: 
date: '2018-11-11'
image: 'cover.png'
---


I want to take you on a journey, through a land of slowness. Where everything lost its motivation to go fast, where hope seems lost. I want to take you through debugging the speed issues we were having with Webpack. Usually I'll try and write articles about processes, giving people advice and tips and get them to think about certain subject. For this article I'm trying a different direction, my goal is to share the process I went through while working on this problem, describing my thought process, but without any judgement. Just what I did, and why. Hoping to inspire and remove the illusion that experienced developers know everything. I'd love to hear your thoughts about the format.

![Debugging](https://thepracticaldev.s3.amazonaws.com/i/hk4knli19og1vk6ijrsh.png)

## Background
I've been working with React for around two years now. While our project uses a lot of libraries the one I'll be looking into today is Webpack. Webpack is a package we use to bundle our project, it takes all the javascript and typescript code we've written, transpiles, minimizes, and optimizes it into a file that browsers can use, while also processing stuff like CSS, HTML, images and other files we are using. For more information you can find a lot of information on [their website](https://webpack.js.org/).

Webpack is a widely used package, very widely, as in 4+ million downloads per week. While it has gotten somewhat easier, every time I have to work on it, it feels like going on a jungle expedition...on an island where some old guy managed to recreate some dinosaurs... which manage to escape... We've tried alternatives, but out of all of them Webpack matches our needs the most. The documentation is pretty good, there are a lot of tutorials and examples online, but at the same time a lot of them are outdated and no longer work. But for me the biggest issue may be that debugging can be pretty hard, fighting a lion with your hands tied behind your back hard.

## The problem
When we finish a user story we first deploy our solution to our test environment, so our automated test suite can do it's magic. We had a story where we happened to find some issues while testing on this environment, resulting in having to do this process several times. But I started to notice that I took pretty long, longer than usual. When looking on Team City to confirm this feeling, I noticed our 'Run unit test & build' took up to 15 minutes, while this usually is around 7 / 8 max. When diving into the logs I found that our build step took between 8 and 10 minutes, at some moments even going up to 12. Our solution is not that big, it should not take this long. Even better, it didn't use to take that long. Something took its mojo!

![Waiting for build](https://thepracticaldev.s3.amazonaws.com/i/wxmfdpwf4k4pnuuxxb3s.png)

## Where to start?
My first instinct was to check the history on team city. It saves the information of the last couple of builds, so if the problem was introduced in one of the last few stories, I should be able to see a big increase in time here. But all of them were slow, so this wasn't caused recently. 

What next? It could be a problem of our CI environment, so I want to check if it's also slow on my own machine. This was quite easy to confirm, building on my own machine takes 8+ minutes.

Could it be an update? We update all our packages at the beginning of our sprints. We do two week sprints, so I decided to take a look at the release notes of Webpack. There was no change in the last sprint that should have caused this. To be sure I tried downgrading it to a version of a few weeks ago, but still it stayed as slow as it was. I quickly checked out the change logs of other major packages we used, but there were no mentions of anything that made me suspect them. Since it was quite some work to revert all the packages to a earlier version I decided to skip this, and follow my feeling that this is probably some issue in Webpack itself.

## Getting to the core
The next tool I was going to use was Google. First trying to find somebody with the same issue, looking up terms like "Webpack slow", "Webpack performance problem" and "Webpack speed". I found a lot of results, really a lot. Okay so now I know that a lot of people find Webpack slow, still that doesn't explain a sudden big drop in performance. I looked through some results, most of them being guides to increase performance through caching and pre-building, which wasn't what I was looking for. Since I didn't want a general performance guide, but a way to find the reason of our sudden bad performance I decided to change my search direction, going for "Webpack debug performance".

## Debugging 
The first suggestion that took my attention was a [plugin](https://www.npmjs.com/package/speed-measure-webpack-plugin) that would show you the build times of the different parts of the process. "Just what I need!" is what I thought. So I installed the plugin, and started building again. When it was finally done I hopefully scrolled up through the build result looking for the times. And what did it tell me, nothing... The total build time was shown as a little over 8 minutes, it showed a few build steps, but their combined time didn't even touch the 3 minutes. I went to google to check for some examples, maybe I used it wrong, but came up empty handed. Going back to my earlier searched for performance debugging help I found a discussion, somewhere on github where the person was showing the slowness by using the '--progress' flag in webpack. So I decided to give that I try and see what it does.

## I'm not alone
When running webpack with the progress flag I got real-time information about what it was doing and instantly noticed I stayed at "92% Chunk asset optimization" for almost 90% of the build time. This has to be the problem! So I opened up Google again and searched for "webpack 92% chunk asset optimization". There were a lot of people having the same issue, finally!

![Not alone](https://thepracticaldev.s3.amazonaws.com/i/2xtpkdx7ausk8ag1tsqv.jpg)

## Trial and error
I found massive discussions on github projects about this issue, some spanning more then a year and some with the last message in the last few days. So this issue has been in there for a long time, and it may be still not solved. But there were a lot of suggestions in the replies, people saying "This fixes it for me", and a lot of different things fixed the same issue for different people. My next instinct was to use trial and error by just trying out the solutions posted there, starting of with the most mentioned solutions. The most mentioned solutions were disabling source maps and disabling compression (and some other options) in UglifyJS. So I went back to basics with build mode, disabling source maps and installed a separate version of UglifyJS so I could disable the compression. My next build, was 80 seconds!

## The first sign of hope
This build time got me fired up, it was fixable! But in the ideal world I wanted to have the source maps we had, because we use them to get stack traces when errors happen on production. So I tried enabling source maps again, and BAM! an error happened. An error? How is that possible? Panic, confusion, frustration, thoughts about leaving software engineering to become a farmer, they all pasted my mind. I first tried to change the different settings for the source maps, but I got errors every time. So I decided to take a look at the errors, they were syntax errors on type script parts. That is weird, this is valid javascript! Let's google this error, so I searched for "typescript includes does not exist on type" and low and behold I found people with the same issue again.

## Transpiling
We recently added typescript to our solution, which was working fine. But the suggestions were to add some parts to the typescript config, so I did just that. Build again, and now...different errors. Hmm, so it impacted something, let's check the new errors out. They were syntax errors again, but it looked like something messed up the type script translation to javascript. Now the pieces were falling into place. We are already using babel to transpile our javascript, can't we just let babel do the typescript as well? I quickly Googled how to do this, set the typescript configuration to just sent out the latest syntax version and updated the webpack config to send the typescript code to babel. Excitedly running the build command again, and...it....worked! I now had a build time of around 120 seconds, with source maps.

![Fast again](https://thepracticaldev.s3.amazonaws.com/i/pt2yuh4corj4j9yrh13i.jpg)

## Tweaking and confirming
I was very close now, it worked. My next step was figuring out what was causing the slowness. Since the thing I read most was the compression flag on UglifyJS, I started by turning that off. The build time instantly jumped back to 8 minutes. Okay, so this causes the slowness, but why wasn't it an issue before? I think it just slowly got slower while the project grew, adding typescript as well eventually impacted it even more and slowly it reached this point. If it wasn't for having to deploy the same story multiple times to our test environment we probably wouldn't even have noticed this issue until it was even worse.

## Can we make it even better?
Now that everything is working it's time to tweak it even more, see if we can get it to go even faster! First I slowly started to change settings back to what they were, so I ended up with only the settings on the UglifyJS part where the compression was disabled being the only real change made. Once this was confirmed to be working, I was at a build time of around 120 seconds. Remember the performance guides I found in my first searches? The ones I didn't need? Well, I was glad I found them now. Skimming back through these guides I saw one easy step that made a lot of sense to me. When using loaders the most efficient way is to use include paths, to make sure it only processes the files it needs to process. With this in mind I looked at the webpack configuration and saw that js / jsx and ts / tsx files were not limited to a folder. That could mean that every module file is put through the loader. I updated the settings to make sure paths were defined where possible. Time for one more build, and our new build time is...79 seconds!

## Conclusion
Looking back at this process you'll notice a lot of different techniques. I like to follow my gut feeling, sometimes I just start trying solutions that I find even if I don't understand them. But I always try to understand the actual problem and solution in the end. I use Google, a lot, it would be insane, even impossible to figure this stuff out without using it. Other times I'll take a more structured approach, this all depends on the problem. No two issues are the same, no two developers work the same, but this was my way. I wrote this article to inspire, but also to see if people find these real world though processes on paper interesting, helpful or any thing else. I'd love to hear your thoughts about it.