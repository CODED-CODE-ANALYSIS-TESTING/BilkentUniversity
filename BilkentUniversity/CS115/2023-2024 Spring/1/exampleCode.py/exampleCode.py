import random

# Function to generate a list of 'n' random integers between 1 and 100
def generate_random_list(n):
    return [random.randint(1, 100) for _ in range(n)]

# Function to check if a number is prime
def is_prime(number):
    if number <= 1:
        return False
    for i in range(2, int(number**0.5) + 1):
        if number % i == 0:
            return False
    return True

# Generate a list of 20 random integers
random_numbers = generate_random_list(20)

# Filter out even numbers, keep only odd numbers, and calculate their squares
squared_odds = [num**2 for num in random_numbers if num % 2 != 0]

# Calculate the sum of the squared odd numbers
sum_of_squares = sum(squared_odds)

# Check if the sum of the squares is a prime number
prime_check = is_prime(sum_of_squares)

print("Random Numbers:", random_numbers)
print("Squared Odd Numbers:", squared_odds)
print("Sum of Squares:", sum_of_squares)
print("Is the Sum of Squares Prime?", prime_check)
