---
title: Passing arguments by object sharing 
date: "2021-05-03T17:00:00.00Z"
description: "Pass by value or pass by reference? Which one is used by modern languages? Also, what the hell is pass by object sharing?"
---

When you jump between few popular languages like Java, JavaScript or Python, you tend to forget the tiny details like different syntax of writing lambdas. 
That is not a problem, because you can always quickly experiment and figure stuff out as you go, and you can always quickly find an answer on StackOverflow or some random blogpost.

...Unless it's related to passing parameters to functions. I found out that sometimes people tend to confuse "pass by value" and "pass by reference". 

### Technically variables are passed by value 
Most of modern languages are very similar - everything or almost everything(for a sake of simplicity we will ignore primitive types) is an object. All objects are stored on the heap and the variables we operate on are just references to those objects.
When we pass a variable to a function, the variable's value(that is a reference to actual object) will be used to create function argument. 
Therefore newly created function argument points to the same object as the variable that was passed into the function

### Lets take a look at few examples

JavaScript:
```javascript
const func = person => {
    person.name = "Jack"; // using shared reference to "person" we can change its "name" property
    person = {"name": "Elon", "surname": "Musk"}; // changing the value of "person" argument to new object reference
}

const person = {"name": "Tomasz", "surname": "Węgrzyn"};
func(person);
console.log(person); // {name: "Jack", surname: "Węgrzyn"}
```

Python:
```python
def func(person):
  person["name"] = "Jack" # using shared reference to "person" we can change its "name" property
  person = {"name": "Elon", "surname": "Musk"} # changing the value of "person" argument to new object reference
    
person = {"name": "Tomasz", "surname": "Węgrzyn"}
func(person)
print(person) # {name: "Jack", surname: "Węgrzyn"}
```

### What does the documentation say?
Oracle Java tutorial [explicitly says](https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html):
> Reference data type parameters, such as objects, are also passed into methods by value. This means that when the method returns, the passed-in reference still references the same object as before. However, the values of the object's fields can be changed in the method, if they have the proper access level.

Python docs says [something similar](https://docs.python.org/3/tutorial/controlflow.html#defining-functions):
> The actual parameters (arguments) to a function call are introduced in the local symbol table of the called function when it is called; thus, arguments are passed using call by value (where the value is always an object reference, not the value of the object)

For JavaScript docs lets turn to [MDN](hhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions#description):
> The parameters of a function call are the function's arguments. Arguments are passed to functions by value. If the function changes the value of an argument, this change is not reflected globally or in the calling function. However, object references are values, too, and they are special: if the function changes the referred object's properties, that change is visible outside the function

The last sentense from the explaination on MDN is a bit weird for me. I wouldn't call object references "special". In my opinion this is completely reasonable behavior. Changing the property on the referenced object obviously will be visible outside the function. We aren't changing the value of an object reference, we are just changing internal property of referenced object. 

This is however the issue that many people are confused about. We are referencing the same object, isn't this what "passing by reference" means?

## Passing by reference

When using "pass by reference" the function will be able to modify the value of variable that was used as argument.
Two popular languages that support passing by reference are C# and C++

Example with C#:
```C#
using System;

public class Test
{
	public class Person{
	public String name;
	public String surname;
		
	public override string ToString() => name + "  " + surname;
}
	
	public static void func(ref Person person) {
		person.name = "Jack"; // using shared reference to "person" we can change its "name" property
    	person = new Person{
			name = "Elon", 
			surname = "Musk"
		}; // changing the value of "person" argument to new object reference
	}
	
	public static void Main()
	{
		var person = new Person{
			name = "Tomasz", 
			surname = "Węgrzyn"
		};
		func(ref person);
		Console.WriteLine(person); // Elon Musk
	}
}
```
Example with  C++:
```C++
#include <iostream>
using namespace std;

class Person{
	public:
	string name;
	string surname;
	
	Person(string name, string surname) {    
      this->name = name;
      this->surname = surname;
    }
    
    string toString() {
    	return name + "  " + surname;
    }
};

void func(Person* &person) {
		person->name = "Jack"; // using shared reference to "person" we can change its "name" property
    	person = new Person("Elon", "Musk"); // changing the value of "person" argument to new object reference
	}

int main() {
	auto person = new Person("Tomasz", "Węgrzyn"); 
	func(person);
	cout << person->toString(); // Elon Musk
	return 0;
}
```

## Pass by object sharing

In 1974 Barbara Liskov(you might know her name because of [Liskov substitution principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle)) was working on CLU language. When describing argument passing, she called it "call by sharing":

> In particular it is not call by value because mutations of arguments performed by the called routine will be visible to the caller. And it is not call by reference because access is not given to the variables of the caller, but merely to certain objects.

Does it sound familiar?
It describes the way we pass arguments today in Java, JavaScript etc.
It claims that "mutation"(changing internal state of an object) makes it not pass by value. 
Let's accept that - it may confuse some people, especially beginners.

Unfortunately this term is not popular whatsoever. However I think it's really descriptive - we wouldn't need to explain how passing a reference type as an argument doesn't mean that it's "pass by reference" :-)

## Bonus: How to circumvent inability to pass by reference?

You are using Java or other language that pass by value uses passing ~~by value~~ by object sharing. 
How do we work around that? 

~~You can just wrap your object in another "parent" object. Then you can change property on your parent object, which will be visible outside the function.~~

We don't even try. Let me explain.

You should try to write your functions/methods as [pure functions](https://en.wikipedia.org/wiki/Pure_function). They are easy to reason about, easy to test and far less likely to cause a bug in your application. In order to write pure functions, we need to avoid any side effects. Changing the value of a variable declared somewhere else in the code is a side effect. 

Also changing the property of object argument is a side effect - which means that we are not "safe" even if we use call by object sharing(unless we also use immutable objects). 

But enough about that, this is not a post about functional programming principles :)