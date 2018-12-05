---
title: "Livable code, embrace the practical mess" 
description: There is more to coding than clean code, try and make your code base livable. Work to love your code base.
date: '2018-09-04'
image: 'cover.jpg'
---

Let me start off with the fact that I've been interested in the clean code principles for quite some time, I think it's very important to keep these principles in mind while developing software. Other people should be able to read and understand your code without a decipher ring and you should not have to move mountains to add a simple feature. With this I've embraced the words from our [Uncle Bob](https://blog.cleancoder.com/) and tried to bring his words into practice. Until my last personal project where I found myself wondering, what can I do to clean this code even more, it felt like cleanliness itself had become somewhat of a burden, taking the enjoyment out of just writing the code, I felt it had to be as clean as possible. Was I taking it too far?

## The first extreme, the hoarder
![Hoarder](https://thepracticaldev.s3.amazonaws.com/i/u2p7iaqahp3pj34fbx1d.jpg)
In our career we will all come across the two extremes of cleanliness in the code bases we will work with. Let's start of with the most common of all, the hoarder code base. You know what I mean, that one project, where even by speaking it's name you'll see a tear running across the cheek of your fellow developers. Where you open a file, just to add a simple input field to a page and three hours later it feels like the code is swallowing you whole. It's a mess, there are classes of more then a thousand lines, changing one property in page one breaks pages five, six and eight and you have no idea why. Your feature or fix will be slapped in the code, maybe some duct tape is placed over it, just to keep it in place and even though you know you've probably made the code even worse, you close the file as fast as you can and deploy it. Hoping to never have to touch it again. How do you think this happens? Most people will probably say laziness. But it's not, at least in most cases. This cluttering happens one small decision at a time. You start of with a nice clean class, and just add a small thing here. It doesn't really belong here, but it's easy this way. The next person sees this and changes another small thing, there already was something in the class that didn't really belong there, and now there are several things in there. You see where this is going?

## The second extreme, the showroom
![Showroom](https://thepracticaldev.s3.amazonaws.com/i/w91ggvpuctk5pwvhl8ld.jpg)
This is the other extreme, not everybody will recognize this extreme as fast as they will the other one, but it is there. I like to call this code, the showroom code base. If you dig into your memory you'll find them, those projects where you kept cleaning and cleaning, making the code better. Adding some abstractions, a pattern here, another there, some more layers. Do I see a duplicate line there? Let's create a base class. More then 20 lines in the class? That has to be split up! This feels great when you are starting out, and you'll be able to keep this up for quite a while but then a new guy has to work on the project, or you have to switch to another project for a while. You come back and want to add that same simple input field. Knowing that the code is cleanliness itself you open the class, to find that you should go a layer deeper since it's not really the responsibility of that class. In the next one you go deeper as well, and deeper, and deeper, oh a factory. You just have to figure out which direction you should go and two hours later you think you have found it. But you can't just add this here, because it will appear in several places, you need to abstract it further only to find when creating the abstraction, other implementations need even more abstraction. What has happened here? The code got too clean, it's just like a showroom home, like in one of those catalogs ready to sell. It looks great, but if you look closely, it's not practical to use. There is no place to put your coat, not place to put your drink, no place to put the TV and is that even a full-size couch? But it does look great. This is mainly caused by software design books, articles and blogs that show us unrealistically clean code and give us the wrong goal. Code that follows all the rules and is perfectly consistent and abstracted is unattainable unless there is nobody living there. 

## Whats in between? Livable code
![Livable](https://thepracticaldev.s3.amazonaws.com/i/w2xlogyfmlj1q9qlw1an.jpeg)
When you take the analogies I used, between a hoarded living space and a showroom living space, there is the living space that's actually being lived in, the livable space. The beautiful decorated room, with some mess. It's might not be as pretty as the showroom, but at least there is room for your TV with a console, and a couch that sits great. The same thing goes for code, in between these two extremes is the livable code. There is some duplicate code in there, some classes are a little big, but their names tell you just what they do and it's pretty easy to find your way in the code. There may be some places where it's still a mess, but slowly but surely we are changing that mess to make it better. This is the code base we should embrace. This is the code base that feels like home. This is the code base we love to work in!


## How to get there
![Travel](https://thepracticaldev.s3.amazonaws.com/i/656n9qpxm5yc4tpqtrle.jpg)
Although most project tend to go more to the hoarder extreme then the showroom extreme, the steps to get the code base to the place you want for them is the same. Follow the following steps to slowly but surely move your code base to a healthy livable place.

#### 1. Don't make it worse!
When you are touching bad code, don't take the easy way out and make it even worse. Don't fix the whole file, but at least make sure it doesn't get worse. This can go both ways, to make the clutter worse, but of you are leaning more against a code base that is too clean, don't just add another layer to it.

#### 2. Improvement over consistency
Five books on a pile and one on the shelf is better then all six in a pile. Every time the code is touched someone can move one of the books to the shelf. If you wait to move all at once, it's not going to happen. This seems hard for a lot of people because a lot of clean coding articles value consistency very much. But remember, the picture that these articles give you, is that of showroom code. While that beautiful code looks like a picture, we need some clutter to feel comfortable. If you look at it practically, having five classes that are a mess and one is like it should be, is better than having six classes that are a mess.

#### 3. Inline everything
Stop putting on stories for refactoring, or taking a week of to fix that one file. It's great that you do this, but it creates other big bangs. You should incorporate this in the way you work every day. Follow the scout rule; Leave the code cleaner then you found it.

#### 4. Be transparent
You need to be able to communicate with everybody what you are doing all the time. So don't hide the stuff that you are doing, like making a file a little better while touching it. Refactoring and cleaning up should be part of everything you do and be open about it. However keep in mind that you should not ask permission to do this! It's part of your job, just but be upfront about what you are doing. And also, don't ask for forgiveness. Again, it's not something you need permission for. You will make mistakes, you will clutter, you will overdo your refactors a lot of the times. It's actually important that you make these mistakes, so you know what to watch out for, you'll learn a lot from them. 

## Is it all in the code base?
![Team](https://thepracticaldev.s3.amazonaws.com/i/os97uxyjc12b9giiu72m.jpeg)
You can probably guess the answer, no it's not. The most important part about software is not the people, it's not the code, it's the system. What I mean with this is that the code base and the team go hand in hand. If the code base is a mess, the team is a mess as well. This would mean that for any problem you have writing software you have two directions you can approach it. You can make changes in your team which will drive changes in your code base, or you can make changes in your code base which will drive changes in your team. For example if your code contains three implementations of "User login", you could consider this just tech debt, but it also represents an issue in communication within your team. Those different implementations should not have been there. So everything you read until now can also be changed by changing the team? Yes it can! Just start by making everybody in the team aware about this principle and start communicating about this topic in reflection to your code base on a regular base and see what happens. 

Another important aspect to look at is what software actually is. It moved on from actually building a product and being done a long time ago. Applications keep evolving, we use continuous deployment, the products are never done. Software development should be seen as an experience, involving developers, managers, product owners and the clients, a group creative effort. More like a group of theater people putting together a play, then a group of workers fabricating something physical. While a lot of developers don't think of what they do as creative, the way we work in software nowadays actually makes a lot more sense in a model of creative people collaborating then it does for a manufacturing model. The more we can think about software as an interconnected part of code and people the closer we will get to a code base we're excited to work in. And you can do this, if you build trust with your team members, if you strengthen your connection, the code base will follow. 

## Architecture and big refactors
![Dreaming of better days](https://thepracticaldev.s3.amazonaws.com/i/742292it3zthz707mpo8.jpg)
So now we know where we want our code to be, what the relation between our code base and the team is and how to get to the code base that we want. One thing I haven't mentioned until now is are solutions a lot of developers yearn for, this big refactors. You see yourself struggling with the awful code day in and day out dreaming of a rewrite. If we could only build it again, we would build it a lot better. Write that jQuery project in Ember, rewrite that Monolith into micro-services. And sometimes it works for a little while, but if you don't change the habits within the team, the clutter will sneak in again. You'll just end up with a tangled network of micro-services just like you had a tangled network of class definitions in your monolith. Or you'll go into the other extreme and over-engineer the whole project and create such a big mess of layers that nobody can't find anything without a full search and rescue crew with them. What is actually more effective is, changing it little by little. And let the people that live there do it. Teams should reach these insights for themselves, there should not be an outside architect role that tells them how to build things. Architects always seemed a great way to keep structure clean, but like I said before, the team that lives in the code base is connected to it, the architect is not. That is like a stylist coming to your house and telling you everything should look. Don't get me wrong, you should really ask help from someone that knows a lot about architecture should you need it, but it should never be the other way around.


## Where did this all come from
I didn't think of the principle of livable code myself and don't want to take credit for it. It just made a lot of things fall into place for me and I really wanted to share it with the world, make people think about this. The first place I came in contact with it was on a blog post from Uncle Bob, called [Too Clean](https://blog.cleancoder.com/uncle-bob/2018/08/13/TooClean.html)? I found it a really interesting read and love his conclusion; 

> We should not be ashamed if our code looks a little bit _lived in_. On the other hand, we need to be diligent about cleaning up after ourselves; and not let the mess spin out of control.

The article from uncle Bob starts off with the mention of a talk by [Sarah Mei](https://twitter.com/sarahmei), called [Livable code](https://www.youtube.com/watch?v=8_UoDmJi7U8), which was my real inspiration. A lot of the things you read above is my vision for software development after hearing her keynote. Should you have 45 minutes to spare, you should really watch it and hopefully, it will inspire you as much as it did me!