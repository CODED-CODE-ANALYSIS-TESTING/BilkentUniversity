# Lab02_Q1.py

def main():
    initial_balance = float(input("Enter the initial balance: "))
    balance = initial_balance
    deposit_count = 0
    total_deposits = 0

    while True:
        transaction = float(input("Enter the transaction amount (0 to stop): "))
        if transaction == 0:
            break
        if transaction < 0 and (balance + transaction < 0):
            print("Transaction is rejected!")
            continue
        balance += transaction
        if transaction > 0:
            deposit_count += 1
            total_deposits += transaction

    print(f"Balance = {balance:.2f}TL")
    if deposit_count > 0:
        average_deposit = total_deposits / deposit_count
        print(f"Average Deposit Amount = {average_deposit:.2f}TL")
    else:
        print("No Deposit is made!")

if __name__ == "__main__":
    main()
