---
title: "Testing asynchronous lifecycle methods with Jest"
description: 
date: '2019-03-17'
image: 'img/cover.png'
---
While helping out a colleague recently we wandered into the land of promises, slowly drifting away from the yellow brick asynchronous road and getting stuck in the swap of broken promises, awaiting for our fate to resolve. If you have some experience with writing asynchronous code in javascript you might have gotten the references. If not, don't worry I'll go into them later on, so you too can learn about promises and async / await, but mostly how can you write unit tests when your lifecycle methods use asynchronous code. Because this is the swamp where we ended up and got stuck. However slowly but surely we got out and I'd love to share my learnings of this experience with you.

Before I start with the actual code, this article expects you to have basic knowledge of react, jest and enzyme. I'll explain some basic parts of it but not the whole base, since that would be a pretty big area to cover. I've created a demo locally and placed it on github, you can find it at https://github.com/JHotterbeekx/demo-jest-testing-with-async-lifecycle.

## Promises
What are promises? And I'm not talking about those things you say to your spouse, or the ones you don't need to keep as long as you cross your fingers. I'm talking about javascript promises. They are actually not that different from the promises you make in real life, you make them, they can be fulfilled which we call resolving, or they can be broken which we call rejecting. A promise method is a method that defines an action it's going to perform and how it's going to handle the result and / or failure of that action. The actual actions is not performed yet, but will be. Getting confused yet? Let's look at some code to shed some light on it. Let's bring out the console logs!

```javascript
function add(x, y) {
  return x + y
}
add(12, 13);
```
What does this do? It writes the number 25 to the console. Nothing fancy about this one. Let's turn it into a promise.

```javascript
function add(x, y) {
  return new Promise((resolve) => resolve(x + y));
}
console.log(add(12, 13));
```
What do we see now in the console. If you are fast, very fast, I mean seriously fast like the flash or have the time slowing abilties people in the matrix seem to have you'll see a quick log showing:

``` 
Promise {<pending>}
```
This means we gave a promise that it would do something, in this case add the numbers, but it didn't fulfill that promise yet. Now if you wait microsecond of two the promise will resolve. You'll noticed the log changed. Changed? Yes changed, since it's still the same promise it will all happen in the same console log. Your super hero self will now see what all other humans saw almost instantly:

```
Promise {<resolved>: 25}
```
This means the promise was resolved, and the value it returned is 25. But what if we want to log that value, how can we get to that value? Hold on, we'll get you in the matrix, or let's just handle the result of the promise.

```javascript
function add(x, y) {
  return new Promise((resolve) => resolve(x + y));
}
add(12, 13).then((sum) => console.log(sum));
```
What do you see now? 25? Wow, is that magic? Close, but not really, although it's the next best thing I promise you. You see what we changed here? We added then .then() part after the add(). So that tells the engine what to do with the result of the promise once it resolves, which in this case is logging it to the console. Awesome right?!?
But I feel the question burning on the tip of your tongue, like we have a mental connection across the world wide web, it feels like your asking me; "Can you make it even more awesome? Please?!?". Yes, we can! Watch this:

```javascript
function add(x, y) {
  return new Promise((resolve) => resolve(x + y));
}
add(12, 13)
  .then((sum) => {
    console.log(sum)
    return sum + 10;
  })
  .then((sum) => {
    console.log(sum)
    return sum + 7;
  })
  .then((sum) => {
    console.log(sum)
  })
```
What does your console show you now? Could it be?
```
25
35
42
```
We found the meaning of life! But how is that possible? This is the magic called promise chaining. This means when you return a result form your resolve handler, which is the code inside the then, you spawn another resolve. Which can be handled and spawn another one, and so on and so on. In this case we kept increasing the value of the result, which shows in the logs. 

Is that it for promises? Not by a long shot, but it's enough of a base for this article. Should you want to read more I'd love to recommend you this article: https://codeburst.io/javascript-learn-promises-f1eaa00c5461 or use google since promises has been along for a while, there is a lot of material you can find. For us, we go on to the next level, async / await.

## Async / Await
While promises have been around for a while, around two years ago with the release of ES2017, we got a new present from Santa. A lot of complains had been going around about the messiness of the code when using promises, nested promises and promise chaining. Some people are never satisfied, you get awesome asynchronous code possibilities and they abuse it and make it messy again... But they were right, it does get messy pretty quickly, just imagine having to handle two or three promises in a certain order, the horror! That's why we got async / await. Lets look at an example with three promises, where I've written the last example to keep using the same promise:
```javascript
function add(x, y) {
  return new Promise((resolve) => resolve(x + y));
}
add(12, 13)
  .then((sum) => {
    console.log(sum);
    return add(sum, 10);
  })
  .then((sum) => {
    console.log(sum);
    return add(sum, 7);
  })
  .then((sum) => {
    console.log(sum);
  });
```
While the result is amazing, reading the code isn't that easy is it? Let's use await and see what changes.
```javascript
function add(x, y) {
  return new Promise(resolve => resolve(x + y));
}

async function showMeaningOfLife() {
  let sum = 0;
  sum = await add(12, 13);
  sum = await add(sum, 10);
  sum = await add(sum, 7);
  console.log(sum);
}

showMeaningOfLife();
```
This is a lot cleaner, right? We did have to wrap the asynchronous calls in a method to be able to use the await, but all the chaining and nesting is gone, which makes it a lot easier to read. 

Basically there is not a whole not more to async/await, it's a way to make promises easier and more readable. Should you want to read more about the differences and advantages, I'd recommend you read: https://codeburst.io/javascript-es-2017-learn-async-await-by-example-48acc58bad65. We will leave it at this for now, it's time to go look at testing!

## Real use-case
Okay let's assume we have a application that has two components. First of a DataDisplayer, this displays the result that it retrieves from a DataRetriever. However this retriever works asynchronously, so we can't just use the result, we have to handle this correctly. I've added comments to the code to try and explain what we do, let's look at DataDisplayer.

```javascript
import React from "react";
import RetrieveData from "./DataRetriever";

export default class DataDisplayer extends React.Component {
  constructor(props) {
    super(props);

    // We initialize the state with a property that contains a boolean telling us if data is
    // available, which will be set to 'true' once the data is available. And a data
    // property which will be filled with a title.
    this.state = {
      dataAvailable: false,
      data: null
    };
  }

  // We use the componentDidMount to trigger the retrieval of the data once the component is
  // mounted. Which means the component first mounts with its default state and than triggers
  // this method so data is retrieved. We make the method asynchronous so we are able to use
  // await. This gives us a better readable and debuggable way to handle the promise received
  // from RetrieveData().
  async componentDidMount () {
    // We call the retrieve method and wait for the promise to resolve, the result of this resolved
    // promise will be the title, which is placed in the variable title. We validate if we indeed
    // got a title before updating the state and marking the data as available.
    const title = await RetrieveData();
    if(title){
      this.setState({
        dataAvailable: true,
        data: title
      });
    }
  }

  // This render method will initially render the text 'Data not available', because in the 
  // initial state the property dataAvailable is false. Once data is retrieved and the callback
  // async code has resolved the state will update, which triggers a re-render, so the render
  // is executed again. Now the dataAvailable will be true and the content in data will be shown.
  render() {
    if (!this.state.dataAvailable) return <div>Data not available</div>;
    return (
      <div>
        Data value: <strong>{this.state.data}</strong>
      </div>
    );
  }
}
```
Okay, lets look at the basic functionality of the page. It renders the page with 'Data not available', on the mount of the component it triggers a call to the retriever. This is a asynchronous method, so we chose to use await to wait for the result. Because we want to use await, we need to make componentDidMount async as well.

Now instead of await, we could also have processed the promise. To do this the content of componentDidMount would have looked like:

```javascript
RetrieveData().then(title => {
      if(title){
        this.setState({
          dataAvailable: true,
          data: title
        });
      }
    });
```
Almost the same code, only nesting the handling inside of a function inside then then handler.

Let's take a look at the DataRetriever, which retrieves the data asynchronously for us.
```javascript
// This demo method calls an open API, then translates the response to JSON. Once that is done
// it returns the 'title' property from this data. So when the API gives us { title: 'myTitle' },
// the code will return 'myTitle'. Since we want to use await to give us a readable way to handle
// the promises we encounter, we have to make the method itselfs asynchronous. Which results in 
// the actual return value being a promise that resolves to the title.
export default async() => {
  const todoData = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const todoDataJson = await todoData.json();
  return todoDataJson.title;
}
```
This code reads pretty easy right? We do a call to a rest API, wait for the result to come in. We convert the result as JSON, wait for that to be done. The only thing left is to return the title from it. We could have written this as a promise, which would've made it look like this.
```javascript
// This demo method calls an open API, then translates the response to JSON. Once that is done
// it calls the passed in callbackMethod with the title property as parameter. So when the API
// gives us { title: 'myTitle' }, the code will perform callbackMethod('myTitle')
export default () => {
  return fetch("https://jsonplaceholder.typicode.com/todos/1")
    .then(response => {
      return response.json();
    })
    .then(responseJson => responseJson.title);
}
```
Still decently readable, but not as pretty as the await syntax. But you've seen both options now. Time to figure out how to test this.

## Testing asynchronous lifecycle methods
No matter if we use the promise style handling or the async / await, the stuff going on in componentDidMount is asynchronous. While I'd usually do a mount with enzyme to trigger the lifecycle methods, it won't work in this case. Why doesn't that work? Great question! The lifecycle method will be triggered when mounting, but since the code is called asynchronously, the execution will continue and not wait for the promise to resolve. So by the time you'll reach your expect calls, the promise is still resolving and the data will not be processed.

Then how can we wait for the promises to resolve? It's actually not that hard. Let's figure it out. We'll start by building a scaffold for the tests.
```javascript
import React from "react";
import { shallow } from "enzyme";
import DataDisplayer from "./DataDisplayer";

// We want to test DataDisplayer in an isolated state, but DataDisplayer uses DataRetriever.
// To keep the isolation we will need to mock out the DataRetriever. This way we control 
// what this component does and we can predict the outcome. To do this we need to do a manual
// mock, we can do this by importing the component we want to mock, and then defining a mock
// om that import.
import * as DataRetriever from "./DataRetriever";
DataRetriever.default = jest.fn();

describe("DataDisplayer", () => {
  beforeEach(() => {
    // Before each test we want to reset the state of the mocked component, so each test can
    // mock the component in the way it needs to be mocked. Should you have any default mock
    // needed that is required for every test, this is the place to do this.
    DataRetriever.default.mockClear();
  });
});
```
Is this making sense? Let's go over it again. This is the test file for DataDisplayer, which uses the DataRetriever. We import the DataRetriever into the test, just like DataDisplayer does. But after importing it we replace the default export of the component mocked method. And to be sure that all tests run in isolation, so no test is bothered by any mocking stuff another test did, we clear the mock before each test. But can we predict and control what the mock does yet? No, we can't yet, but we have prepared the tools to do so now. Let's write our first test.

```javascript
// In this test we will mock the DataRetriever in a way that it will create a promise for us
  // which it will resolve with "fakeTitle" as argument. This simulates that the API has
  // given us a result with { title: "fakeTitle" } in it. We make the test asynchronous, since
  // we want to be able to use await in the code to wait for a promise to resolve.
  it("Should show the data, When retrieved", async () => {
    // We are going to set up the mock value that DataRetriever resolves to, we tell it when the 
    // code uses DataRetiever instead of actually calling it and fetching data from the API. It
    // instantly resolves to a value 'fakeTitle'.
    DataRetriever.default.mockResolvedValue('fakeTitle');
    
    // We shallow mount the component through enzyme. This renders the component with a fake DOM 
    // making us able to see the result that would be rendered. We specifically use the shallow
    // mount in this case. Not only is this the preferred render for unit tests, since it isolates
    // the component completely when rendering, we also use it because we don't want to trigger
    // the lifecycle methods. Since our lifecycle method handles code asynchronously, we want
    // to be able to wait for that code to complete, this requires manually calling this method.
    var wrapper = shallow(<DataDisplayer />);
    // We need to get the actual instance from the virtual DOM, so we can call any method that 
    // is available on it.
    const instance = wrapper.instance();
    // Now we call the componentDidMount event, telling the component that it mounted. But because
    // we called it manually we are able to await for it to resolve. This makes sure the promise
    // for the method is completed before going on with the code.
    await instance.componentDidMount();
    // Since we fake a result coming back from the retriever, we expect the text to actually show
    // the word "fakeTitle" in the component.
    expect(wrapper.text()).toContain("fakeTitle");
  });
```
Looks pretty much like any unit test right? Let's walk through it. First of we mock the resolve value. That means that any call to the DataRetriever method results in a promise, which resolves into the string 'fakeTitle'. Next we shallow mount the component. Why shallow? We need the lifecycle methods right? Yes we do, but we want to call them manually, you'll see why. On the next line we take the instance of the component from enzyme so we can interact with it. Preparing us for the next line, where the magic happens. We manually call the lifecycle method componentDidMount, but we use await so it waits for the promises to resolve. Awesome right? Now we know that state is at the point we want it to be, so we can just look and see if we can find the 'fakeTitle' being rendered in the component.

Now there is another scenario we want to test, what if the API would fail? Or it returns no title? Let's try it.
``` javascript
// In this test we will mock the DataRetriever in a way that it will return a different promise
  // which resolves without value. This simulates the API returning unexpected data.
  // We make the test asynchronous, since we want to be able to use await in the code to wait 
  // for a promise to resolve.
  it("Should show not available, When data has not been retrieved", async () => {
    // We are going to set up the mock value that DataRetriever resolves to, we tell it when the 
    // code uses DataRetiever instead of actually calling it and fetching data from the API. It
    // instantly resolves to an undefined value, so we can handle nothing coming back from the API.
    DataRetriever.default.mockResolvedValue(undefined);

    // We are shallow mounting the component again, using its instance, calling the 
    // componentDidMount and waiting for it to resolve. Only this time it will resolve to a value
    // of undefined.
    var wrapper = shallow(<DataDisplayer />);
    const instance = wrapper.instance();
    await instance.componentDidMount();
    // Since we fake no result coming back from the retriever we don't expect any title appearing
    // on the page, but instead we expect to see the text "not available"
    expect(wrapper.text()).toContain("not available");
```
So we do all the same magic again. We prepare the resolve value of the mock, shallow the component, get the instance and manually trigger the componentDidMount and wait for it to complete. Now we now it returned nothing, so we still expect the text 'not available' to be visible. Not that hard, right?

##Resources
While the material on jest, enzyme, async and unit testing is widely available on the internet. This solution was actually pretty scarce to find. We found a lot of pretty complicated ways to get this working, which all didn't really work out. In the end we stumbled upon a stackoverflow post which got us to this solution. https://stackoverflow.com/questions/51895198/jest-enzyme-mock-async-function-in-lifecycle-method. And of course you can check the demo app with the source from this article, you can find it on https://github.com/JHotterbeekx/demo-jest-testing-with-async-lifecycle. Small tip, the final result is the async / await syntax, but if you check the history you can also find the promise implementation.

##Wrapping up
We do more and more asynchronously, but it does give us some extra challenges. Is this the only way to do it? Nope. Is this the best way to do it? Probably not. Take the things you read, make them your own and when you've done that try teaching your solution to others. Remember, you learn by reading, you learn by doing and you make it stick by sharing.