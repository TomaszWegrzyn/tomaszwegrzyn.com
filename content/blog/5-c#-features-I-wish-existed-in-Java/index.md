---
title: 5 C# features I wish existed in Java 
date: "2022-08-09T17:10:00.00Z"
description: "Top level statements, reflection and other cool stuff"
---

I am experienced in Java, but recently I have been programming in C# and I found some cool features that I fell in love with.
Lets take a look at some amazing stuff you can do with C#, but not in Java.

## 1. Async/await

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

## 2. Top-level statements
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

## 3. Generics/reflection
In Java, generics are imlemented with type erasure, which means at runtime information abount generic type argument does not exist. Instead types are represented as `Object`, and converted to/from actual type when needed. Not only is it slow, but also does not allow us to write reflection code around generics.

In C# generics are implemented all they way down to CLR. This means we can inspect the generic type at runtime:
```C#
var dict = new Dictionary<string, int>();
Type t = dict.GetType();
Type[] typeParameters = t.GetGenericArguments();

foreach( Type tParam in typeParameters )
{
    Console.WriteLine("Type argument: {0}", tParam);
}
// prints
// Type argument: System.String
// Type argument: System.Int32
```
## 4. Nullable reference types
Remember `Optional`? It is nice way to wrap value that may be `null`
In C# there is something similar: `Nullable`. 

But since C#8 has something [even better](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/nullable-reference-types). In short: you can use question mark to mark a type that allows `null`. Otherwise type is assumed to always be not-null. You can use [null-forgiving operator](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/null-forgiving) to change nullable type, to non-nullable one.

The biggest reason I like it is readability. You can clearly state your intentions with regards to nullablility of any variable or property.
```C#
private int GetLength(string? value)
{
    // we can enable static analysis to warn or error if we don't check for null!
    if (value == null)
    {
        return 0;
    }
 
    return value.Length;
}
```
## 5. String interpolation
Take a look how easy it is to do in C#:
```C#
var language = "Java";
var currentYear = DateTime.Now.Year;
Console.WriteLine($"It is {currentYear} and {language} still does not support string interpolation");
```

----

Overall Java is great language to program in. It has amazing community with a lot of great frameworks like spring. But if you want a change, try C#! It is really awesome and has some adventages over Java, while being really similar - you will quickly feel at home.