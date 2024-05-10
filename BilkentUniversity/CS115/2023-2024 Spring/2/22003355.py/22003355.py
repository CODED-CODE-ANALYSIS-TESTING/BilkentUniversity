# Example Python script with issues for SonarCloud detection

def divide_numbers(num1, num2):
    # Possible division by zero
    return num1 / num2

def unused_function():
    # This function is never used
    pass

def main():
    result = divide_numbers(10, 2)  # Should flag the unused variable 'result'

    # Unreachable code after return statement
    return
    print("This will never be printed")

if __name__ == "__main__":
    main()

