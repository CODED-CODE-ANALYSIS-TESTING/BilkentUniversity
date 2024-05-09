# Example Python script with issues for SonarCloud detection

def divide_numbers(num1, num2):
    # Possible division by zero
    return num1 / num2

def fetch_data_from_db(id):
    # Function without a consistent return statement
    if id <= 0:
        raise ValueError("ID must be greater than 0")
    # Missing else clause that should return some data

def process_list(items=[]):  # Noncompliant: Mutable default argument
    items.append('item')
    print(items)

def unused_function():
    # This function is never used
    pass

def main():
    result = divide_numbers(10, 2)  # Should flag the unused variable 'result'
    fetch_data_from_db(-1)  # Should raise an error about negative ID

    process_list()  # This should flag about the mutable default argument

    # Unreachable code after return statement
    return
    print("This will never be printed")

if __name__ == "__main__":
    main()

