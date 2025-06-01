# Ruby

Ruby cheatsheet for someone with programming knowledge

## Basics

```rb
# frozen_string_literal: true

# hello world
puts 'Hello World!'
puts('Also supports brackets')

# variables
first_name = 'John'
last_name = 'Doe'
puts "Hello #{first_name} #{last_name}"

# constants
PI = 3.14
puts "The value of #{PI}"

# data type
integer = 44
float = 3.14
string = 'Ruby is fortunately/unfortunately simple to read!'
boolean = true
array = [1, 2, 3, 'is this allowed?']
hash = { name: 'John Doe', age: '30' }
nil_value = nil

puts integer, float, string, boolean, array, hash, nil_value

# control flow
age = 12
if age >= 18
  puts 'you are an adult'
else
  puts 'you are not an adult'
end

# each loop
[1, 2, 3].each { |num| puts "Each number in the loop #{num}" }

# times loop (is indexed based)
3.times { |i| puts "Times loop iteration: #{i}" } # 0, 1 and 2

# switch
day = 'Monday'

case day
when 'Monday'
  puts "It's first workday of the week"
when 'Friday'
  puts "It's the last day of the week"
else
  puts "It's not Monday"
end

def with_block
  puts 'This is before'
  yield if block?
  puts 'After block'
end

with_block { puts 'Inside the block' }
# we get
# This is before
# Inside the block
# After block
#

# creating and reading file

File.write('example.txt', 'Hello there. This is a werid data')
puts File.read('example.txt') # or creating variable

# symbol
symbol = :ruby
puts symbol

# symbol is an immutable, refers to the same item everytime, unlike string which creates a new one each time.
# It's used mostly for Identifiers in hash

gh_user_name = :xaaha
puts gh_user_name

user = { name: 'John Doe', age: 33 }
puts user[:name]

status = :active
if status == :active
  puts 'The user is active!'
else
  puts 'The user is inactive'
end

# ranges
(1..5).each { |num| print "#{num} " }
puts
(1...5).each { |num| print "#{num} " }
puts

# regular expressions
regex = /world/
puts 'Hello world'.match?(regex) # true

# lambdas and procs
my_lambda = ->(x) { x * 2 }
puts my_lambda.call(5)

my_proc = proc { |x| x * 3 }
puts my_proc.call(5)

# method chaining
class StringManipulator
  def initialize(str)
    @str = str
  end

  def upcase_it
    @str = @str.upcase
    self
  end

  def reverse_it
    @str = @str.reverse
    self
  end

  def result
    @str
  end
end

manipulated = StringManipulator.new('ruby').upcase_it.reverse_it.result
puts manipulated
```

## Class

> [!IMPORTANT]
> Ruby is OOP. So, class is important

- Using `attr_accessor` and manually defining getter and setter methods.

### 1. Using `attr_accessor`

```ruby
class Animal
  attr_accessor :name

  def initialize(name)
    @name = name
  end

  def speak
    "#{@name} barks"
  end
end
```

#### What `attr_accessor` does:

- `attr_accessor :name` automatically creates both a getter and setter method\*\* for the instance variable `@name`.
  - **Getter method**: `name` – allows you to read the value of `@name`.
  - **Setter method**: `name=` – allows you to modify the value of `@name`.

By using `attr_accessor`, you get these two methods for free:

```ruby
class Animal
  def name
    @name
  end

  def name=(value)
    @name = value
  end
end
```

So, with `attr_accessor`, you can access and change the value of `@name` outside the class, like so:

```ruby
dog = Animal.new('Dog')
puts dog.name   # => 'Dog'
dog.name = 'Cat'
puts dog.name   # => 'Cat'
```

### 2. Without `attr_accessor` (Manual Getter/Setter)

```ruby
class Animal2
  def initialize(name)
    @name = name
  end

  def speak
    "#{@name} makes a noise. Hau Hau"
  end
end
```

In this case:

- You don't have `attr_accessor`, so Ruby doesn't automatically create getter and setter methods for `@name`.
- The only way to access `@name` outside of the class would be through a manually defined **getter** method, like this:

```ruby
class Animal2
  def initialize(name)
    @name = name
  end

  def speak
    "#{@name} makes a noise. Hau Hau"
  end

  def name
    @name
  end
end
```

If you wanted to allow setting the `@name` attribute from outside the class, you'd need to create a **setter** method too, like this:

```ruby
class Animal2
  def initialize(name)
    @name = name
  end

  def speak
    "#{@name} makes a noise. Hau Hau"
  end

  def name
    @name
  end

  def name=(new_name)
    @name = new_name
  end
end
```

So now you can access and modify `@name` outside the class, like this:

```ruby
dog = Animal2.new('Dog')
puts dog.name     # => 'Dog'
dog.name = 'Cat'  # Changes @name to 'Cat'
puts dog.name     # => 'Cat'
```
