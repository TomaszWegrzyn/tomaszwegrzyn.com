---
title: 5 C# features I wish existed in Java 
date: "2022-08-09T17:10:00.00Z"
description: "Top level statements, reflection and other cool stuff"
---

I am experienced in Java, but recently I have been programming in C# and I found some cool features that I fell in love with.
Lets take a look at some amazing stuff you can do with C#, but not in Java.

### 1. Async/await

There is no way for me to quickly explain C# async/await in a few sentences, but I will try nonetheless.
Basically it gives you a way to write asynchronous code using dedicated language constructs of `Task`, `async` and `await`.
Each time you `await` on a `Task`, you declare that you need a result of asynchronous code(`Task`) before the rest of the method can be executed. To use `await` inside a method it needs to be marked as async `async`

```C#

public async Task SomeMethod()
{
	var networkCall = _httpClient.GetAsync("https://google.com"); // returns Task, may or may not create and run annother thread in the background
	var dbConnectionTask = GetDbHandleAsync(); // returns Task, may or may not create and run annother thread in the background

	var networkResult = await networkCall; // this DOES NOT block the current thread, instead it can release it to the thread pool
	var dbConnection = await dbConnectionTask();
	dbConnection.DoSomethingWith(networkResult);
}

```

### 2. Top-level statements
We all know that you need to write `public static void main(String[] args)` each time you want your Java program to run

```Java
class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello World!"); 
    }
}
```

In C# it used to work the same way:
```C#
using System;

namespace Application
{
    class HelloWorld
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
        }
    }
}
```

But with [C# 9.0 Top-level statements](https://docs.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-9#top-level-statements) we don't need that crap anymore :)


```C#
Console.WriteLine("Hello, World!");
```
I guess that is self-explanatory. Behind the scenes, the "old" code will be generated.

One gotcha in case of ASP.NET Core is [integration testing](https://docs.microsoft.com/en-us/aspnet/core/test/integration-tests?view=aspnetcore-6.0#basic-tests-with-the-default-webapplicationfactory).


