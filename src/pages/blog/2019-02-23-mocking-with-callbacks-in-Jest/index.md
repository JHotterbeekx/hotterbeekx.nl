---
title: "Mocking with callbacks in Jest"
description: 
date: '2019-02-23'
image: 'img/cover.png'
---
Today I was helping one of my colleagues creating unit tests for their components. The application is built with react, running on parcel and the combination of jest and enzyme for testing. Everything was going nice and easy until we reached a component that used a callback method passed through to another component. The result in the first component would change once the callback was called. Up to that point I was able to reach into my own knowledge on how to build the unit tests, what to look for and how to handle mocking, but this situation didn't feel that straight forward. While digging through examples on the internet we figured it out and now I'd like to share the result of it with you. 

Before I start with the actual code, this article expects you to have basic knowledge of react, jest and enzyme. I'll explain some basic parts of it but not the whole base, since that would be a pretty big area to cover. I started building a demo in https://codesandbox.io/, but ran into an issue with jest.mock not being supported yet. So I've created the demo locally and placed it on github, you can find it at https://github.com/JHotterbeekx/jest-mock-with-callback-demo.

## Callbacks
Let's start of with a brief explanation of what callbacks are. I assume you are familiar with methods so let's just take this basic method as an example.

```javascript
function doSomething(argument) {
  console.log(argument);
}
doSomething("I'm awesome")
```
What does this do? It writes the string "I'm awesome" to the console. Assuming that the argument you pass in is a string, it will write this string to the console. In fact you can pass anything into it and it will write it to the console. But what if we pass it a method? Lets try.

```javascript
function doSomething(argument) {
  console.log(argument);
}

function doAnotherThing() {
  console.log("I'm awesome");
}

doSomething(doAnotherThing);
```

What does the console tell you now?

```
function doAnotherThing() {
  console.log("I'm awesome");
}
```
Okay, seems to make sense. You passed a method into the other method, so naturally logging this argument would show you this method. But wait, what if I were to call this method?

```javascript
function doSomething(argument) {
  argument();
}

function doAnotherThing() {
  console.log("I'm awesome");
}

doSomething(doAnotherThing);
```
What does the console tell you now?

```
I'm awesome
```

What? How awesome is that? We passed a method to another method, which in turn calls the method we passed. Can we make it even more awesome? Yes we can, watch this.

```javascript
function doSomething(argument, whatYouAre) {
  argument(whatYouAre);
}

function doAnotherThing(whatIAm) {
  console.log("I'm " + whatIAm);
}

doSomething(doAnotherThing, "even more awesome");
```
What does the console tell you now?

```
I'm even more awesome
```
We made it even more awesome! You see what we did there? We did not only pass the method, but also an extra argument that is later passed on to the method. You've just seen the basic concept of callback methods. I hear you thinking, "But this does not make any sense to me! Why would you do this?!?". Well the example above is setup to keep it easy to read, but it might not seem to make a lot of sense yet. Let my try and give you a more real-life example. Imagine that doSomething does an call to an API for you, when that call is done it parses the result and now calls the callback method with the result. Now the component that passed in the callback method and defined it, will handle it through the content of this method. Are you able to follow? It's always easier when you can see it, let's work it out.

## Real use case
Okay let's assume we have a application that has two components. First of a DataDisplayer, this displays the result that it retrieves from a DataRetriever. However this retriever works asynchronously, so it can't just pass the result back. There are several ways to do this, but in this case we will use  callback method. I've added comments to the code to try and explain what we do, let's look at DataDisplayer.

```javascript
import React from "react";
import DataRetriever from "./DataRetriever";

export default class DataDisplayer extends React.Component {
  constructor(props) {
    super(props);

    // We initialize the state with a property that contains a boolean telling us if data is
    // available, which will be set to 'true' once the callback method is called. And a data
    // property which will be filled on callback containing a string with a title.
    this.state = {
      dataAvailable: false,
      data: null
    };
  }

  // We use the componentDidMount to trigger the retrieval of the data once the component is
  // mounted. Which means the component first mounts with its default state and than triggers
  // this method so data is retrieved.
  componentDidMount() {
    // We create a new instance of data retriever and call the retrieve method. In this
    // retrieve method we pass a so-called callback method as a parameter. This method will
    // be called inside the retrieve method. As you can see the method expects a title parameter
    // which it will set on the data property in the state and also setting the dataAvailable
    // property to true;
    new DataRetriever().Retrieve(title => {
      this.setState({
        dataAvailable: true,
        data: title
      });
    });
  }

  // This render method will initially render the text 'Data not available', because in the 
  // initial state the property dataAvailable is false. Once data is retrieved and the callback
  // method has been called the state will update, which triggers a re-render, so the render
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
Okay lets look at the basic functionality of the page. It renders the page with 'Data not available'. On the mount of the component it triggers a call to the retriever, passing a callback method. When called this callback method gets the result of the retriever, placing it in the state and re-rendering the component showing the retrieved title.

Now let's take a look at the DataRetriever, this is where the callback method is passed into. 

```javascript
export default class DataRetriever {
  
  // This demo method calls an open API, then translates the response to JSON. Once that is done
  // it calls the passed in callbackMethod with the title property as parameter. So when the API
  // gives us { title: 'myTitle' }, the code will perform callbackMethod('myTitle')
  Retrieve(callbackMethod) {
    fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then(response => {
        return response.json();
      })
      .then(responseJson => callbackMethod(responseJson.title));
  }
}

```
So this does an API call to a website call jsonplaceholder. It parses this result as a JSON object and then calls the callback method with the title of the object as argument. Starting to make sense now right? Great, but how are you supposed to test all this? Let's dive deep into that.

## Testing with callback mocking
Why would we even want to mock? We are writing unit tests, and the thing with unit tests is that you want them to test one unit. In this case one component. If you just call DataDisplayer it will also use DataRetriever, but that component is probably already tested on it's own. You actually want to be able to predict what your DataRetriever is going to do, control it from your other component. Another reason you want this isolation is that when you break DataRetriever, you only want the tests of that component to break not every component that might use it in one way or another. Imagine having to change dozens of tests when you change something in the logic of DataRetriever, you don't want that.

I mentioned you want to predict what the other component, in this case DataRetriever, does. We do that through mocking. Mocking allows us to replace the DataRetriever component with a fake (or mocked) component that does exactly what we want. Let's start by building the base scafolding inside the test file.

```javascript
import React from "react";
import { mount } from "enzyme";
import DataDisplayer from "./DataDisplayer";
// We want to test DataDisplayer in an isolated state, but DataDisplayer uses DataRetriever.
// To keep the isolation we will need to mock out the DataRetriever. This way we control 
// what this component does and we can predict the outcome. To do this we need to do a manual
// mock, we can do this by importing the component we want to mock, and then defining a mock
// om that import.
import DataRetriever from "./DataRetriever";
jest.mock("./DataRetriever");


describe("DataDisplayer", () => {
  // Before each test we want to reset the state of the mocked component, so each test can
  // mock the component in the way it needs to be mocked. Should you have any default mock
  // needed that is required for every test, this is the place to do this.
  beforeEach(() => {
    DataRetriever.mockClear();
  });
});

```
Is this making sense? Let's go over it again. This is the test file for DataDisplayer, which uses the DataRetriever. We import the DataRetriever into the test, just like DataDisplayer does. But after importing it we replace this component by a mocked component. And to be sure that all tests run in isolation, so no test is bothered by any mocking stuff another test did, we clear the mock before each test. But can we predict and control what the mock does yet? No, we can't yet, but we have prepared to tools to do so now. Let's write our first test.

```javascript
// In this test we will mock the DataRetriever in a way that it will call the callback method
// we pass to it, and call it with "fakeTitle" as argument. This simulates that the API has
// given us a result with { title: "fakeTitle" } in it.
it("Should show the data, When retrieved", () => {
  // We are going to set up a mock implementation on the DataRetriever, we tell it when the code
  // uses DataRetiever instead of the original code it will receive a mocked object. This mocked
  // object has one method call "Retrieve".
  DataRetriever.mockImplementation(() => {
    return {
      // The retrieve method is defined as a method with is own logic. It's a method that gets 
      // another method as argument, the so-called callback method. And the only thing it does
      // is call this method with the argument "fakeTitle". This means that when the code will
      // create a new instance of DataRetriever and calls Retrieve(callback) that the method
      // callback is instantly called with the argument "fakeTitle". Simulating the API returning
      // this result.
      Retrieve: (callback) => callback("fakeTitle")
    }
  });

  // We mount the compont through enzyme. This renders the component with a fake DOM making us
  // able to see the result that would be rendered. Usually in unit tests I'd prefer the shallow
  // mount which doesn't execute lifecycle methods, but in this case part of the logic of our
  // component is in the componentDidMount lifecycle method, so we need mount to make sure this
  // lifecycle is triggerd.
  var wrapper = mount(<DataDisplayer />);
  // Since we fake a result coming back from the retriever, we expect the text to actually show
  // the word "fakeTitle" in the component.
  expect(wrapper.text()).toContain("fakeTitle");
});
```

It isn't that hard right? It looks like most tests you'll come across in jest, the only weird part might by the mockImplementation part. That's where the key lays for mocking this callback. See, by implementing the mock we tell the code that when running this test, any instance of DataRetriever won't be the actual component instead we return a defined object, which also has a Retrieve method. So the code can just call this method. But this retrieve method is something we implemented, and we tell it to just call the callback with a string containing "fakeTitle". So as soon as the actual code calls Retrieve(callback) callback is instantly called, like callback("fakeTitle"). It might take some getting used to, but just try it, it does make sense.

Now there is another scenario we want to test, what if the API would fail? Or for whatever reason the callback is not called (yet). Let's write a test for this.

```javascript
// In this test we will mock the DataRetriever in a way that it will not call the callback
// method we pass to it. This simulates tha API not being finished or returning an error.
it("Should show not available, When data has not been retrieved", () => {
  // We are setting up a new mock implementation on the DataRetriever again.
  DataRetriever.mockImplementation(() => {
    return {
      // This is where we made it a little different. Instead of passing a method which does
      // an instant call to the callback we pass an empty method that doesn't do anything. So
      // when the code will create a new instance of DataRetriever and calls Retrieve(callback)
      // nothing is done with this callback. To make it more clear you could also read this line
      // as: Retriever: (callback) => { /* Do Nothing */ }
      Retrieve: () => {}
    }
  });

  //We mount the component again, since we need to use the lifecycle methods.
  var wrapper = mount(<DataDisplayer />);
  // Since we fake no result coming back from the retriever we don't expect any title appearing
  // on the page, but instead we expect to see the text "not available"
  expect(wrapper.text()).toContain("not available");
});
```

The only 'big' change we did was swapping out the implementation of Retrieve(). Instead of calling the callback method directly, we do nothing. So when the code calls Retrieve() from this test, the actual callback is never triggered. Cool right?

## Resources
The internet is full of resources, although on this subject you've got to take care not using the ones that are to out of date. For jest and mocking a great place to start is their documentation on https://jestjs.io/docs/en/getting-started, especially the part on mocking ES6 classes https://jestjs.io/docs/en/es6-class-mocks. Their documentation can be overwhelming, especially the many ways to mock things, but it's a very good documentation so just try it. Besides that, just google what you want, we were able to figure it out this way. You'll come across enough articles and stack overflow questions to help you out, just watch the date of the articles and try and look for more recent ones.

## Promises and async / await
While this example uses a callback method, nowadays these are mostly replaced by using promises or the newer async / await structure. That doesn't mean you can't use callbacks anymore. Just use what makes sense to your code.

## Wrapping up
Your head might be spinning at this moment, don't worry it will stop. Or you might be wondering, is this all? Then I'd say, good for you! As with most concept in developing software you'll have to see them somewhere, and start doing them yourself. Then doing them again, and again, and again. Finally making them stick, improving them and teaching them to other people. So I'm looking forward to that article somebody is going to write on how to do this in his or her way! You learn by reading, you learn by doing and you make it stick by sharing.