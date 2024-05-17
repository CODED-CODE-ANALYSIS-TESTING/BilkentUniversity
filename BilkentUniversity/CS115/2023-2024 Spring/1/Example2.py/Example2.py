import sys

# Global dictionary to store user balances
accounts = {}

def create_account(user_id, initial_balance):
    if user_id in accounts:
        print(f"Error: Account already exists for user {user_id}.")
        return
    if initial_balance < 0:
        print("Error: Initial balance cannot be negative.")
        return
    accounts[user_id] = initial_balance
    print(f"Account created for user {user_id} with balance {initial_balance}.")

def deposit(user_id, amount):
    if user_id not in accounts:
        print(f"Error: No account found for user {user_id}.")
        return
    if amount <= 0:
        print("Error: Deposit amount must be positive.")
        return
    accounts[user_id] += amount
    print(f"Deposited {amount} to user {user_id}. New balance: {accounts[user_id]}.")

def withdraw(user_id, amount):
    if user_id not in accounts:
        print(f"Error: No account found for user {user_id}.")
        return
    if amount <= 0:
        print("Error: Withdrawal amount must be positive.")
        return
    if accounts[user_id] < amount:
        print(f"Error: Insufficient funds for user {user_id}.")
        return
    accounts[user_id] -= amount
    print(f"Withdrew {amount} from user {user_id}. Remaining balance: {accounts[user_id]}.")

def check_balance(user_id):
    if user_id not in accounts:
        print(f"Error: No account found for user {user_id}.")
        return
    print(f"User {user_id} balance: {accounts[user_id]}.")

def main():
    while True:
        print("Banking System Menu:")
        print("1. Create Account")
        print("2. Deposit Money")
        print("3. Withdraw Money")
        print("4. Check Balance")
        print("5. Exit")
        choice = input("Enter your choice: ")
        if choice == '1':
            user_id = input("Enter user ID: ")
            initial_balance = float(input("Enter initial balance: "))  # Unsafe conversion
            create_account(user_id, initial_balance)
        elif choice == '2':
            user_id = input("Enter user ID: ")
            amount = float(input("Enter deposit amount: "))  # Unsafe conversion
            deposit(user_id, amount)
        elif choice == '3':
            user_id = input("Enter user ID: ")
            amount = float(input("Enter withdrawal amount: "))  # Unsafe conversion
            withdraw(user_id, amount)
        elif choice == '4':
            user_id = input("Enter user ID: ")
            check_balance(user_id)
        elif choice == '5':
            print("Thank you for using our system.")
            break
        else:
            print("Invalid option, please try again.")

if __name__ == "__main__":
    main()
