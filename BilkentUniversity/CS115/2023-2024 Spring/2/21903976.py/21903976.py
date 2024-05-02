# Introduction to Python: Lab 1

# Task 1: Hello, Python!
def hello_python():
    print("Hello, Python!")

# Task 2: Basic Arithmetic
def basic_arithmetic():
    a = 5
    b = 3
    print("Addition:", a + b)
    print("Subtraction:", a - b)
    print("Multiplication:", a * b)
    print("Division:", a / b)

# Task 3: Input and Output
def greet_and_predict_age():
    name = input("What is your name? ");
    age = int(input("How old are you? "))
    age_in_five_years = age + 5
    print(f"Hello {name}! You are {age} years old now, and you will be {age_in_five_years} in five years.)

# Main function to run the tasks
def main():
    hello_python()
    basic_arithmetic()
    greet_and_predict_age()

# Entry point of the script
if __name__ == "__main__":
    main()
